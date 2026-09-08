import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const VALID_PASSWORD = 'une phrase de passe suffisamment longue';

// Courts (le nom d'utilisateur est limité à 30 points de code, et certains
// tests ajoutent un suffixe accentué/arabe) mais uniques par test, pour ne
// jamais dépendre de l'ordre d'exécution ni entrer en collision.
//
// Pas de nettoyage après coup : ce fichier ne s'exécute que contre une base
// Postgres locale/CI jetable (jamais Supabase, voir la vérification
// ci-dessous), détruite à la fin de chaque exécution — voir
// CONTEXTE_PROJET.md. Le rôle applicatif restreint utilisé ici n'a d'ailleurs
// pas le droit de suppression (voir la migration), par conception.
function uniqueUsername(label: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `e2e-${label}-${suffix}`;
}

describe('POST /api/auth/register (e2e, base réelle locale de test)', () => {
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

  it('creates exactly one account and never returns the password or its hash', async () => {
    const username = uniqueUsername('valid');

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD })
      .expect(201);

    expect(response.body).toEqual({
      status: 'ACCOUNT_CREATED',
      user: {
        id: expect.any(String),
        username,
        createdAt: expect.any(String),
      },
      // US-010 : une session est créée en même temps que le compte. Ce
      // champ n'est consommé que par le relais Next.js (appel serveur-à-
      // serveur) — jamais réexposé tel quel au navigateur, voir
      // CONTEXTE_PROJET.md.
      session: {
        token: expect.stringMatching(/^[0-9a-f-]{36}\.[A-Za-z0-9_-]+$/),
        expiresAt: expect.any(String),
      },
    });
    expect(JSON.stringify(response.body)).not.toContain(VALID_PASSWORD);
    expect(response.headers['cache-control']).toBe('no-store');

    const rows = await prisma.user.findMany({ where: { username } });
    expect(rows).toHaveLength(1);
    expect(rows[0]!.passwordHash.startsWith('$argon2id$')).toBe(true);

    const sessions = await prisma.session.findMany({ where: { userId: rows[0]!.id } });
    expect(sessions).toHaveLength(1);
    expect(JSON.stringify(response.body)).not.toContain(sessions[0]!.secretHash);
  });

  it('rejects an empty body with field-level codes', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/register').send({}).expect(400);

    expect(response.body.status).toBe('VALIDATION_ERROR');
  });

  it('rejects an unexpected property (strict whitelist)', async () => {
    const username = uniqueUsername('strict');

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD, email: 'nope@example.com' })
      .expect(400);
  });

  it('rejects a wrong type for username', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username: 12345, password: VALID_PASSWORD })
      .expect(400);
  });

  it('rejects a common password', async () => {
    const username = uniqueUsername('common');

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: 'correcthorsebatterystaple' })
      .expect(400);

    expect(response.body).toEqual({ status: 'PASSWORD_TOO_COMMON' });
  });

  it('rejects an exact duplicate username', async () => {
    const username = uniqueUsername('dup');

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD })
      .expect(201);

    const second = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username, password: 'une autre phrase de passe longue' })
      .expect(409);

    expect(second.body).toEqual({ status: 'USERNAME_TAKEN' });
  });

  it('rejects a case-and-normalization variant of an existing username', async () => {
    const base = uniqueUsername('case');

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username: base, password: VALID_PASSWORD })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username: base.toLowerCase(), password: 'une autre phrase de passe longue' })
      .expect(409);
  });

  it('accepts Arabic and accented usernames end to end', async () => {
    const arabicUsername = `${uniqueUsername('ar')}_محمد`;
    const accentedUsername = `${uniqueUsername('accent')}-Émilie`;

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username: arabicUsername, password: VALID_PASSWORD })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ username: accentedUsername, password: 'une autre phrase de passe longue' })
      .expect(201);
  });

  it('allows exactly one success when the same username is submitted concurrently', async () => {
    const username = uniqueUsername('race');

    const results = await Promise.all(
      Array.from({ length: 3 }, () =>
        request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ username, password: VALID_PASSWORD }),
      ),
    );

    const successes = results.filter((response) => response.status === 201);
    const conflicts = results.filter((response) => response.status === 409);

    expect(successes).toHaveLength(1);
    expect(conflicts).toHaveLength(2);

    const rows = await prisma.user.findMany({ where: { username } });
    expect(rows).toHaveLength(1);
  });

  it('rate-limits repeated attempts and includes a Retry-After header', async () => {
    const attempts = await Promise.all(
      Array.from({ length: 6 }, (_, index) =>
        request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ username: uniqueUsername(`rl${index}`), password: VALID_PASSWORD }),
      ),
    );

    const limited = attempts.filter((response) => response.status === 429);
    expect(limited.length).toBeGreaterThan(0);
    expect(limited[0]!.body).toEqual({ status: 'RATE_LIMITED' });
    expect(limited[0]!.headers['retry-after']).toBeDefined();
  });
});
