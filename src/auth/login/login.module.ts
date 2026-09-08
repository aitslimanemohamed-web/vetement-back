import { Module } from '@nestjs/common';
import { HashService } from '../register/hash.service.js';
import { SessionModule } from '../session/session.module.js';
import { LoginController } from './login.controller.js';
import { LoginService } from './login.service.js';

// PrismaModule est global : PrismaService est disponible sans import
// explicite. SessionModule est importé pour créer la session après une
// connexion réussie (US-011). HashService est réinstancié ici (comme dans
// RegisterModule) plutôt que ré-exporté depuis RegisterModule, pour ne pas
// créer de dépendance entre les deux modules d'authentification.
@Module({
  imports: [SessionModule],
  controllers: [LoginController],
  providers: [LoginService, HashService],
})
export class LoginModule {}
