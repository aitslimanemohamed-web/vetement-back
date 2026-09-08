import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../prisma/prisma.service.js';
import { SessionService } from './session.service.js';

function buildService() {
  const create = vi.fn();
  const findUnique = vi.fn();
  const update = vi.fn();
  const updateMany = vi.fn();
  const prisma = {
    session: { create, findUnique, update, updateMany },
  } as unknown as PrismaService;

  return { service: new SessionService(prisma), create, findUnique, update, updateMany };
}

function fakeStoredSession(overrides: Partial<Record<string, unknown>> = {}) {
  const now = new Date();
  return {
    id: 'session-id',
    userId: 'user-id',
    secretHash: '',
    expiresAt: new Date(now.getTime() + 60_000),
    lastActiveAt: now,
    revokedAt: null,
    ...overrides,
  };
}

describe('SessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('returns an opaque token shaped "<id>.<secret>" and never stores the raw secret', async () => {
      const { service, create } = buildService();
      create.mockResolvedValue({ id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' });

      const result = await service.create('user-id');

      expect(result.token).toMatch(/^aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\.[A-Za-z0-9_-]+$/);
      const [, secret] = result.token.split('.');
      const insertedArgs = create.mock.calls[0]![0] as { data: { secretHash: string; userId: string } };
      expect(insertedArgs.data.userId).toBe('user-id');
      expect(insertedArgs.data.secretHash).not.toBe(secret);
      expect(insertedArgs.data.secretHash).toMatch(/^[0-9a-f]{64}$/); // SHA-256 hex
    });

    it('sets an absolute expiry 24 hours in the future', async () => {
      const { service, create } = buildService();
      create.mockResolvedValue({ id: 'session-id' });

      const before = Date.now();
      const result = await service.create('user-id');
      const after = Date.now();

      const deltaMs = result.expiresAt.getTime() - before;
      expect(deltaMs).toBeGreaterThanOrEqual(24 * 60 * 60 * 1000);
      expect(result.expiresAt.getTime()).toBeLessThanOrEqual(after + 24 * 60 * 60 * 1000);
    });

    it('accepts an explicit transaction client instead of the default one', async () => {
      const { service } = buildService();
      const txCreate = vi.fn().mockResolvedValue({ id: 'tx-session-id' });
      const tx = { session: { create: txCreate } } as any;

      await service.create('user-id', tx);

      expect(txCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('validate', () => {
    it('rejects a malformed token without querying the database', async () => {
      const { service, findUnique } = buildService();

      expect(await service.validate('not-a-valid-token')).toBeNull();
      expect(await service.validate('.missing-id')).toBeNull();
      expect(await service.validate('missing-secret.')).toBeNull();
      expect(findUnique).not.toHaveBeenCalled();
    });

    it('rejects an unknown session id', async () => {
      const { service, findUnique } = buildService();
      findUnique.mockResolvedValue(null);

      expect(await service.validate('unknown-id.some-secret')).toBeNull();
    });

    it('rejects a revoked session', async () => {
      const { service, findUnique } = buildService();
      findUnique.mockResolvedValue(fakeStoredSession({ revokedAt: new Date() }));

      expect(await service.validate('session-id.some-secret')).toBeNull();
    });

    it('rejects a session past its absolute 24h expiry', async () => {
      const { service, findUnique } = buildService();
      findUnique.mockResolvedValue(fakeStoredSession({ expiresAt: new Date(Date.now() - 1000) }));

      expect(await service.validate('session-id.some-secret')).toBeNull();
    });

    it('rejects a session idle for more than 2 hours, even if not absolutely expired', async () => {
      const { service, findUnique } = buildService();
      const twoHoursAndOneMinuteAgo = new Date(Date.now() - (2 * 60 + 1) * 60 * 1000);
      findUnique.mockResolvedValue(fakeStoredSession({ lastActiveAt: twoHoursAndOneMinuteAgo }));

      expect(await service.validate('session-id.some-secret')).toBeNull();
    });

    it('rejects a wrong secret for an otherwise valid session', async () => {
      const { service, create, findUnique } = buildService();
      create.mockResolvedValue({ id: 'session-id' });
      const { token } = await service.create('user-id');
      const [id] = token.split('.');
      const insertedHash = (create.mock.calls[0]![0] as { data: { secretHash: string } }).data.secretHash;
      findUnique.mockResolvedValue(fakeStoredSession({ secretHash: insertedHash }));

      expect(await service.validate(`${id}.wrong-secret`)).toBeNull();
    });

    it('accepts a correct, active session and slides its idle window', async () => {
      const { service, create, findUnique, update } = buildService();
      create.mockResolvedValue({ id: 'session-id' });
      const { token } = await service.create('user-id');
      const insertedHash = (create.mock.calls[0]![0] as { data: { secretHash: string } }).data.secretHash;
      findUnique.mockResolvedValue(fakeStoredSession({ secretHash: insertedHash, userId: 'user-id' }));

      const result = await service.validate(token);

      expect(result).toEqual({ userId: 'user-id', sessionId: 'session-id' });
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'session-id' }, data: { lastActiveAt: expect.any(Date) } }),
      );
    });
  });

  describe('revokeByToken', () => {
    it('does nothing for a malformed token', async () => {
      const { service, findUnique, updateMany } = buildService();

      await service.revokeByToken('not-a-valid-token');

      expect(findUnique).not.toHaveBeenCalled();
      expect(updateMany).not.toHaveBeenCalled();
    });

    it('does nothing for an unknown session id (never throws)', async () => {
      const { service, findUnique, updateMany } = buildService();
      findUnique.mockResolvedValue(null);

      await expect(service.revokeByToken('unknown-id.secret')).resolves.toBeUndefined();
      expect(updateMany).not.toHaveBeenCalled();
    });

    it('does nothing for an already-revoked session (idempotent)', async () => {
      const { service, findUnique, updateMany } = buildService();
      findUnique.mockResolvedValue(fakeStoredSession({ revokedAt: new Date() }));

      await service.revokeByToken('session-id.secret');

      expect(updateMany).not.toHaveBeenCalled();
    });

    it('does NOT revoke an active session when the secret does not match (id alone is not proof)', async () => {
      const { service, create, findUnique, updateMany } = buildService();
      create.mockResolvedValue({ id: 'session-id' });
      const { token } = await service.create('user-id');
      const [id] = token.split('.');
      const insertedHash = (create.mock.calls[0]![0] as { data: { secretHash: string } }).data.secretHash;
      findUnique.mockResolvedValue(fakeStoredSession({ secretHash: insertedHash }));

      await service.revokeByToken(`${id}.wrong-secret`);

      expect(updateMany).not.toHaveBeenCalled();
    });

    it('revokes an active session given the correct secret', async () => {
      const { service, create, findUnique, updateMany } = buildService();
      create.mockResolvedValue({ id: 'session-id' });
      const { token } = await service.create('user-id');
      const insertedHash = (create.mock.calls[0]![0] as { data: { secretHash: string } }).data.secretHash;
      findUnique.mockResolvedValue(fakeStoredSession({ secretHash: insertedHash }));

      await service.revokeByToken(token);

      expect(updateMany).toHaveBeenCalledWith({
        where: { id: 'session-id', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
