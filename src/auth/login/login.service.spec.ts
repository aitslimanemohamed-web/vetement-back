import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../prisma/prisma.service.js';
import type { HashService } from '../register/hash.service.js';
import {
  InvalidCredentialsException,
  LoginServiceUnavailableException,
  LoginValidationFailedException,
} from './login.errors.js';
import { LoginService } from './login.service.js';

function buildService() {
  const findUnique = vi.fn();
  const prisma = { user: { findUnique } } as unknown as PrismaService;
  const verify = vi.fn();
  const hash = vi.fn().mockResolvedValue('$argon2id$fake-dummy-hash');
  const hashService = { hash, verify } as unknown as HashService;

  return { service: new LoginService(prisma, hashService), findUnique, verify, hash };
}

const VALID_USERNAME = 'Karim-Test_92';
const VALID_PASSWORD = 'une phrase de passe suffisamment longue';

describe('LoginService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty fields with field-specific codes, without touching the database', async () => {
    const { service, findUnique } = buildService();

    try {
      await service.login('', '');
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(LoginValidationFailedException);
      const response = (error as LoginValidationFailedException).getResponse() as {
        fieldErrors: Record<string, string>;
      };
      expect(response.fieldErrors).toEqual({ username: 'USERNAME_REQUIRED', password: 'PASSWORD_REQUIRED' });
    }
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('rejects a wrong-typed field the same way as an empty one', async () => {
    const { service } = buildService();
    await expect(service.login(123, VALID_PASSWORD)).rejects.toBeInstanceOf(LoginValidationFailedException);
  });

  it('computes onModuleInit dummy hash once, and verifies against it for an unknown username', async () => {
    const { service, findUnique, verify } = buildService();
    findUnique.mockResolvedValue(null);
    verify.mockResolvedValue(false);

    await service.onModuleInit();
    await expect(service.login(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(InvalidCredentialsException);

    expect(verify).toHaveBeenCalledTimes(1);
    const [hashArg] = verify.mock.calls[0]!;
    expect(hashArg).toBe('$argon2id$fake-dummy-hash'); // le hash factice, pas celui d'un vrai compte
  });

  it('rejects a known username with the wrong password using the same generic error', async () => {
    const { service, findUnique, verify } = buildService();
    findUnique.mockResolvedValue({ id: 'user-id', username: VALID_USERNAME, passwordHash: '$argon2id$real-hash' });
    verify.mockResolvedValue(false);

    await expect(service.login(VALID_USERNAME, 'wrong-password')).rejects.toBeInstanceOf(InvalidCredentialsException);
    expect(verify).toHaveBeenCalledWith('$argon2id$real-hash', 'wrong-password');
  });

  it('logs in successfully with correct credentials, never returning the password hash', async () => {
    const { service, findUnique, verify } = buildService();
    findUnique.mockResolvedValue({ id: 'user-id', username: VALID_USERNAME, passwordHash: '$argon2id$real-hash' });
    verify.mockResolvedValue(true);

    const result = await service.login(VALID_USERNAME, VALID_PASSWORD);

    expect(result).toEqual({ id: 'user-id', username: VALID_USERNAME });
    expect(Object.keys(result)).not.toContain('passwordHash');
  });

  it('looks up the user by the normalized username key, not the raw input', async () => {
    const { service, findUnique } = buildService();
    findUnique.mockResolvedValue(null);

    await expect(service.login(`  ${VALID_USERNAME}  `, VALID_PASSWORD)).rejects.toBeInstanceOf(
      InvalidCredentialsException,
    );

    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { usernameKey: 'karim-test_92' } }),
    );
  });

  it('translates a database connectivity error into SERVICE_UNAVAILABLE', async () => {
    const { service, findUnique } = buildService();
    const { Prisma } = await import('@prisma/client');
    findUnique.mockRejectedValue(new Prisma.PrismaClientInitializationError('Cannot reach database', '6.19.3'));

    await expect(service.login(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(
      LoginServiceUnavailableException,
    );
  });

  it('never throws on a verify() failure — treats it as a wrong password', async () => {
    const { service, findUnique, verify } = buildService();
    findUnique.mockResolvedValue({ id: 'user-id', username: VALID_USERNAME, passwordHash: 'not-a-real-hash' });
    verify.mockRejectedValue(new Error('malformed hash'));

    await expect(service.login(VALID_USERNAME, VALID_PASSWORD)).rejects.toBeInstanceOf(InvalidCredentialsException);
  });
});
