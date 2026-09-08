import { Module } from '@nestjs/common';
import { SessionController } from './session.controller.js';
import { SessionService } from './session.service.js';

// PrismaModule est global (voir src/prisma/prisma.module.ts) : PrismaService
// est disponible ici sans import explicite, comme dans RegisterModule.
@Module({
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
