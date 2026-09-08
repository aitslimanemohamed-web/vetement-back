import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CurrentSession } from './current-session.decorator.js';
import { LogoutThrottlerGuard } from './logout-throttler.guard.js';
import { SessionGuard } from './session.guard.js';
import { SessionService, type ValidatedSession } from './session.service.js';

interface CurrentUserResponse {
  status: 'OK';
  user: { id: string; username: string };
}

const BEARER_PREFIX = 'Bearer ';

function extractToken(request: Request): string | null {
  const header = request.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

@Controller('auth')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly prisma: PrismaService,
  ) {}

  // Dérive systématiquement l'utilisateur de la session validée par
  // SessionGuard (@CurrentSession()) — jamais d'un identifiant fourni par le
  // client (US-010, section 7).
  @Get('me')
  @Header('Cache-Control', 'no-store')
  @UseGuards(SessionGuard)
  async me(@CurrentSession() session: ValidatedSession): Promise<CurrentUserResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
      select: { id: true, username: true },
    });
    return { status: 'OK', user };
  }

  // Volontairement PAS derrière SessionGuard : une session déjà absente,
  // expirée ou révoquée doit tout de même répondre 204 (US-010, section 7),
  // pas 401 — la déconnexion est par nature idempotente.
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Cache-Control', 'no-store')
  @UseGuards(LogoutThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async logout(@Req() request: Request): Promise<void> {
    const token = extractToken(request);
    if (token) {
      await this.sessionService.revokeByToken(token);
    }
  }
}
