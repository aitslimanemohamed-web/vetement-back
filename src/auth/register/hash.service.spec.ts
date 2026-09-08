import { describe, expect, it } from 'vitest';
import { HashService } from './hash.service.js';

describe('HashService', () => {
  it('produces an Argon2id hash with the required minimum parameters', async () => {
    const service = new HashService();
    const hash = await service.hash('une phrase de passe suffisamment longue');

    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(hash).toContain('m=19456'); // 19 Mio, exprimés en Kio
    expect(hash).toContain('t=2');
    expect(hash).toContain('p=1');
  });

  it('uses a random salt: the same password hashed twice never matches byte-for-byte', async () => {
    const service = new HashService();
    const [first, second] = await Promise.all([
      service.hash('meme-mot-de-passe-1234567890'),
      service.hash('meme-mot-de-passe-1234567890'),
    ]);

    expect(first).not.toBe(second);
  });

  it('verifies the correct password and rejects an incorrect one', async () => {
    const service = new HashService();
    const hash = await service.hash('le-bon-mot-de-passe-1234567890');

    await expect(service.verify(hash, 'le-bon-mot-de-passe-1234567890')).resolves.toBe(true);
    await expect(service.verify(hash, 'un-mauvais-mot-de-passe-12345')).resolves.toBe(false);
  });
});
