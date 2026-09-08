import { Module } from '@nestjs/common';
import { HashService } from './hash.service.js';
import { RegisterController } from './register.controller.js';
import { RegisterService } from './register.service.js';

// PrismaModule est global (voir src/prisma/prisma.module.ts) : PrismaService
// est disponible ici sans import explicite.
@Module({
  controllers: [RegisterController],
  providers: [RegisterService, HashService],
})
export class RegisterModule {}
