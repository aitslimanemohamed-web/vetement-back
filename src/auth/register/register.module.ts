import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module.js';
import { HashService } from './hash.service.js';
import { RegisterController } from './register.controller.js';
import { RegisterService } from './register.service.js';

// PrismaModule est global (voir src/prisma/prisma.module.ts) : PrismaService
// est disponible ici sans import explicite. SessionModule est importé pour
// que RegisterController puisse créer la session initiale (US-010).
@Module({
  imports: [SessionModule],
  controllers: [RegisterController],
  providers: [RegisterService, HashService],
})
export class RegisterModule {}
