import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../prisma/prisma.service.js';
import type { HashService } from './hash.service.js';
import {
  PasswordTooCommonException,
  RegisterServiceUnavailableException,
  UnexpectedRegisterErrorException,
  UsernameTakenException,
  ValidationFailedException,
} from './register.errors.js';
import { RegisterService } from './register.service.js';

function buildService() {
  const create = vi.fn();
  const prisma = { user: { create } } as unknown as PrismaService;
  const hash = vi.fn().mockResolvedValue('$argon2id$fake-hash-for-tests');
  const hashService = { hash, verify: vi.fn() } as unknown as HashService;

  return { service: new RegisterService(prisma, hashService), create, hash };
}

const VALID_USERNAME = 'Karim-Test_92';
const VALID_PASSWORD = 'une phrase de passe suffisamment longue';

describe('RegisterService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects an invalid username before ever hashing the password or touching the database', async () => {
    const { service, create, hash } = buildService();

    await expect(service.register('ab', VALID_PASSWORD)).rejects.toBeInstanceOf(ValidationFailedException);
    expect(hash).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('reports both field errors at once when both are invalid', async () => {
    const { service } = buildService();

    try {
      await service.register('ab', 'trop court');
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedException);
      const response = (error as ValidationFailedException).getResponse() as {
        fieldErrors: Record<string, string>;
      };
      expect(response.fieldErrors).toEqual({
        username: 'USERNAME_LENGTH',
        password: 'PASSWORD_TOO_SHORT',
      });
    }
  });

  it('rejects a common password without ever calling the database', async () => {
    const { service, create } = buildService();

    await expect(service.register(VALID_USERNAME, 'correcthorsebatterystaple')).rejects.toBeInstanceOf(
      PasswordTooCommonException,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('normalizes the username and derives the key before inserting', async () => {
    const { service, create } = buildService();
    create.mockResolvedValue({
      id: 'fake-id',
      username: 'Karim-Test_92',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.register(`  ${VALID_USERNAME}  `, VALID_PASSWORD);

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          username: VALID_USERNAME,
          usernameKey: 'karim-test_92',
        }),
      }),
    );
  });

  it('never selects or returns the password hash', async () => {
    const { service, create } = buildService();
    create.mockResolvedValue({
      id: 'fake-id',
      username: VALID_USERNAME,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const result = await service.register(VALID_USERNAME, VALID_PASSWORD);

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ select: { id: true, username: true, createdAt: true } }),
    );
    expect(result).toEqual({ id: 'fake-id', username: VALID_USERNAME, createdAt: '2026-01-01T00:00:00.000Z' });
    expect(Object.keys(result)).not.toContain('passwordHash');
  });

  it('translates a unique constraint violation into USERNAME_TAKEN', async () => {
    const { service, create } = buildService();
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.register(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(UsernameTakenException);
  });

  it('translates a database connectivity error into SERVICE_UNAVAILABLE', async () => {
    const { service, create } = buildService();
    create.mockRejectedValue(new Prisma.PrismaClientInitializationError('Cannot reach database', '6.19.3'));

    await expect(service.register(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(
      RegisterServiceUnavailableException,
    );
  });

  it('translates any other database error into INTERNAL_ERROR, never leaking it', async () => {
    const { service, create } = buildService();
    create.mockRejectedValue(new Error('some internal driver detail'));

    await expect(service.register(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(
      UnexpectedRegisterErrorException,
    );
  });
});
