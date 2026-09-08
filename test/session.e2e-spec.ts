import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const VALID_PASSWORD = 'une phrase de passe suffisamment longue';

// Préfixe court : le nom d'utilisateur est limité à 30 points de code au
// total (username-policy.ts) — préfixe + étiquette + suffixe doivent tenir
// dans cette limite pour chaque test.
function uniqueUsername(label: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `e2e-ses-${label}-${suffix}`;
}

describe('GET /api/auth/me, POST /api/auth/logout (e2e, base réelle locale de test)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL manquant : ces tests ont besoin d’une vraie base Postgres de test ' +
          '(locale, jamais Supabase) — voir CONTEXTE_PROJET.md.',
      );
    }
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function registerAndGetSession(label: string) {
    const username = uniqueUsername(label);
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD })
      .expect(201);
    return {
      username,
      userId: response.body.user.id as string,
      token: response.body.session.token as string,
    };
  }

  describe('GET /api/auth/me', () => {
    it('returns the account behind a valid session, deriving it only from the token', async () => {
      const other = await registerAndGetSession('me-ok-other');
      const session = await registerAndGetSession('me-ok');

      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(200);

      expect(response.body).toEqual({ status: 'OK', user: { id: session.userId, username: session.username } });
      expect(response.headers['cache-control']).toBe('no-store');
      // Confirme que l'identité vient bien du jeton du bon compte, pas d'un autre.
      expect(response.body.user.id).not.toBe(other.userId);
    });

    it('rejects a missing Authorization header', async () => {
      const response = await request(app.getHttpServer()).get('/api/auth/me').expect(401);
      expect(response.body).toEqual({ status: 'UNAUTHENTICATED' });
    });

    it('rejects a malformed token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });

    it('rejects a forged token (unknown session id, arbitrary secret)', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer 00000000-0000-0000-0000-000000000000.forged-secret')
        .expect(401);
    });

    it('rejects the correct session id with a wrong secret', async () => {
      const { token } = await registerAndGetSession('wrong-secret');
      const [id] = token.split('.');

      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${id}.not-the-real-secret`)
        .expect(401);
    });

    it('never lets a client choose which account to see via any request parameter', async () => {
      const other = await registerAndGetSession('victim');
      const { token } = await registerAndGetSession('attacker');

      // Une éventuelle tentative de forcer un autre id (query, corps, en-tête
      // maison) ne doit avoir aucun effet : /me ne lit que la session.
      const response = await request(app.getHttpServer())
        .get(`/api/auth/me?userId=${other.userId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('X-User-Id', other.userId)
        .expect(200);

      expect(response.body.user.id).not.toBe(other.userId);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('revokes the session so a later /me is rejected', async () => {
      const { token } = await registerAndGetSession('logout');

      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it('is idempotent: logging out twice never errors', async () => {
      const { token } = await registerAndGetSession('logout-twice');

      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('accepts a missing or malformed token without error (nothing to revoke)', async () => {
      await request(app.getHttpServer()).post('/api/auth/logout').expect(204);
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(204);
    });

    it('does not revoke another user session when only the session id is known (no secret)', async () => {
      const victim = await registerAndGetSession('logout-victim');
      const [victimId] = victim.token.split('.');

      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${victimId}.guessed-secret`)
        .expect(204);

      // La session de la victime doit rester valide : révoquer exige la
      // preuve du secret, pas seulement l'identifiant.
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${victim.token}`)
        .expect(200);
    });

    it('sets Cache-Control: no-store', async () => {
      const { token } = await registerAndGetSession('logout-cache');

      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      expect(response.headers['cache-control']).toBe('no-store');
    });
  });

  it('rejects a session past its 24h absolute expiry even though it was never revoked', async () => {
    const { token, userId } = await registerAndGetSession('expired');
    const [id] = token.split('.');

    await prisma.session.updateMany({
      where: { userId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${id}.x`).expect(401);
  });

  it('rejects a session idle for more than 2 hours even though it is not absolutely expired', async () => {
    const { token, userId } = await registerAndGetSession('idle');

    await prisma.session.updateMany({
      where: { userId },
      data: { lastActiveAt: new Date(Date.now() - (2 * 60 + 5) * 60 * 1000) },
    });

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
