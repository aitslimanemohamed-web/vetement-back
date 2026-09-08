import { Body, Controller, Header, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SessionService } from '../session/session.service.js';
import { RegisterRequestDto } from './dto/register-request.dto.js';
import { RegisterThrottlerGuard } from './register-throttler.guard.js';
import { RegisterService } from './register.service.js';

interface RegisterSuccessResponse {
  status: 'ACCOUNT_CREATED';
  user: { id: string; username: string; createdAt: string };
  // Consommé uniquement par le relais Next.js (appel serveur-à-serveur) —
  // jamais transmis tel quel au navigateur, qui ne reçoit que le cookie
  // HttpOnly posé par ce relais (US-010). Ce contrôleur NestJS n'a aucune
  // notion de "qui l'appelle" : c'est la responsabilité de la couche
  // au-dessus (le relais) de ne jamais réexposer ce champ.
  session: { token: string; expiresAt: string };
}

@Controller('auth')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly sessionService: SessionService,
    private readonly prisma: PrismaService,
  ) {}

  // 5 tentatives par minute et par adresse IP (US-009, section 9) — voir
  // main.ts pour la configuration "trust proxy" dont dépend l'identification
  // réelle de l'IP derrière le proxy inverse de Render. Compteur en mémoire :
  // remis à zéro à chaque redémarrage, non partagé entre plusieurs instances
  // (documenté aussi dans CONTEXTE_PROJET.md).
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  @UseGuards(RegisterThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() body: RegisterRequestDto): Promise<RegisterSuccessResponse> {
    // Validation/hachage d'abord, hors transaction (US-010) : un mot de
    // passe invalide ou trop courant ne doit jamais ouvrir de transaction.
    const prepared = await this.registerService.prepareAccount(body.username, body.password);

    // Compte + session créés de manière cohérente (US-010, section 7) :
    // l'échec de l'un ne laisse jamais subsister l'autre.
    const { user, session } = await this.prisma.$transaction(async (tx) => {
      const createdUser = await this.registerService.insertAccount(tx, prepared);
      const createdSession = await this.sessionService.create(createdUser.id, tx);
      return { user: createdUser, session: createdSession };
    });

    return {
      status: 'ACCOUNT_CREATED',
      user,
      session: { token: session.token, expiresAt: session.expiresAt.toISOString() },
    };
  }
}
