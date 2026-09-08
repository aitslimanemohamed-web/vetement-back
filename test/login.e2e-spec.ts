import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';

const VALID_PASSWORD = 'une phrase de passe suffisamment longue';

function uniqueUsername(label: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `e2e-log-${label}-${suffix}`;
}

describe('POST /api/auth/login (e2e, base réelle locale de test)', () => {
  let app: INestApplication;

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
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function registerAccount(label: string) {
    const username = uniqueUsername(label);
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD })
      .expect(201);
    return username;
  }

  it('logs in with the correct credentials and returns a usable session', async () => {
    const username = await registerAccount('ok');

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password: VALID_PASSWORD })
      .expect(200);

    expect(response.body).toEqual({
      status: 'LOGGED_IN',
      user: { id: expect.any(String), username },
      session: {
        token: expect.stringMatching(/^[0-9a-f-]{36}\.[A-Za-z0-9_-]+$/),
        expiresAt: expect.any(String),
      },
    });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(JSON.stringify(response.body)).not.toContain(VALID_PASSWORD);

    // La session délivrée par le login doit réellement fonctionner sur /me.
    const meResponse = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${response.body.session.token}`)
      .expect(200);
    expect(meResponse.body.user.username).toBe(username);
  });

  it('rejects an unknown username and a wrong password with the exact same status and body', async () => {
    const username = await registerAccount('wrongpw');

    const unknownUser = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: uniqueUsername('nobody'), password: VALID_PASSWORD })
      .expect(401);

    const wrongPassword = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password: 'not the right password' })
      .expect(401);

    expect(unknownUser.body).toEqual({ status: 'INVALID_CREDENTIALS' });
    expect(wrongPassword.body).toEqual({ status: 'INVALID_CREDENTIALS' });
  });

  it('rejects empty fields with field-specific validation errors', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/login').send({}).expect(400);
    expect(response.body).toEqual({
      status: 'VALIDATION_ERROR',
      fieldErrors: { username: 'USERNAME_REQUIRED', password: 'PASSWORD_REQUIRED' },
    });
  });

  it('is case-and-normalization insensitive, same as registration', async () => {
    const username = await registerAccount('case');

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: username.toLowerCase(), password: VALID_PASSWORD })
      .expect(200);
  });

  it('creates a genuinely new session on each successful login (not reusing one)', async () => {
    const username = await registerAccount('multi');

    const first = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password: VALID_PASSWORD })
      .expect(200);
    const second = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password: VALID_PASSWORD })
      .expect(200);

    expect(first.body.session.token).not.toBe(second.body.session.token);

    // Les deux sessions restent valides indépendamment l'une de l'autre.
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${first.body.session.token}`)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${second.body.session.token}`)
      .expect(200);
  });

  it('rate-limits repeated attempts and includes a Retry-After header', async () => {
    const username = await registerAccount('rl');

    const attempts = await Promise.all(
      Array.from({ length: 6 }, () =>
        request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ username, password: 'wrong-on-purpose' }),
      ),
    );

    const limited = attempts.filter((response) => response.status === 429);
    expect(limited.length).toBeGreaterThan(0);
    expect(limited[0]!.body).toEqual({ status: 'RATE_LIMITED' });
    expect(limited[0]!.headers['retry-after']).toBeDefined();
  });
});
