import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { AppModule } from './app.module.js';

const MAX_REQUEST_BODY_SIZE = '8kb';

async function bootstrap() {
  // bodyParser: false — on applique nous-mêmes express.json() avec une
  // limite de taille explicite (8 Ko, US-009) au lieu de la limite par
  // défaut de Nest (beaucoup plus permissive).
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.use(json({ limit: MAX_REQUEST_BODY_SIZE }));

  // Render (comme la plupart des hébergeurs) place l'application derrière un
  // proxy inverse : sans ce réglage, req.ip renverrait l'adresse du proxy,
  // pas celle du visiteur, et la limitation de requêtes par IP
  // (register.controller.ts) serait inefficace. "1" = on ne fait confiance
  // qu'au premier proxy en amont (celui de Render), jamais à une en-tête
  // arbitrairement fournie par le visiteur lui-même.
  app.set('trust proxy', 1);

  // Valide et normalise toutes les entrées : rejette les propriétés
  // inattendues (forbidNonWhitelisted) et les types incorrects.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // All routes are exposed under /api — matches the documented GET /api/health.
  app.setGlobalPrefix('api');

  // CORS origins allowed to call this API, configured per environment.
  // Defaults to the local Next.js dev server so `npm run start:dev` works out of the box.
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.enableCors({ origin: allowedOrigins });

  const port = Number(process.env.PORT ?? 3001);

  // Bind to all interfaces (0.0.0.0), not just localhost — required by most hosting
  // providers to route external traffic to the process.
  await app.listen(port, '0.0.0.0');
}
await bootstrap();
