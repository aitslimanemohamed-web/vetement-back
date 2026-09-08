import { Body, Controller, Header, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SessionService } from '../session/session.service.js';
import { LoginRequestDto } from './dto/login-request.dto.js';
import { LoginThrottlerGuard } from './login-throttler.guard.js';
import { LoginService } from './login.service.js';

interface LoginSuccessResponse {
  status: 'LOGGED_IN';
  user: { id: string; username: string };
  // Consommé uniquement par le relais Next.js (appel serveur-à-serveur) —
  // jamais transmis tel quel au navigateur, même motif que
  // RegisterController (US-010/US-011).
  session: { token: string; expiresAt: string };
}

@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessionService: SessionService,
  ) {}

  // 5 tentatives par minute et par adresse IP — même seuil que l'inscription
  // (US-009), documenté ici comme valeur initiale ajustable.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @UseGuards(LoginThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(@Body() body: LoginRequestDto): Promise<LoginSuccessResponse> {
    const user = await this.loginService.login(body.username, body.password);
    // Pas de transaction nécessaire ici (contrairement à l'inscription) :
    // une seule écriture, la création de la session — le compte lui-même
    // n'est jamais modifié par une connexion.
    const session = await this.sessionService.create(user.id);

    return {
      status: 'LOGGED_IN',
      user,
      session: { token: session.token, expiresAt: session.expiresAt.toISOString() },
    };
  }
}
