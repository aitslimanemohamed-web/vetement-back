import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RegisterModule } from './auth/register/register.module.js';
import { SessionModule } from './auth/session/session.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Fournit le stockage et la configuration par défaut du throttler. Pas
    // de garde globale ici : seules les routes d'inscription et de
    // déconnexion appliquent leur propre garde (register.controller.ts,
    // session.controller.ts) — une garde globale en plus aurait compté
    // chaque requête deux fois sur ces routes.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    HealthModule,
    RegisterModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
