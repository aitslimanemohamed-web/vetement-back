import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
