import { Body, Controller, Header, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegisterRequestDto } from './dto/register-request.dto.js';
import { RegisterThrottlerGuard } from './register-throttler.guard.js';
import { RegisterService } from './register.service.js';

interface RegisterSuccessResponse {
  status: 'ACCOUNT_CREATED';
  user: { id: string; username: string; createdAt: string };
}

@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

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
    const user = await this.registerService.register(body.username, body.password);
    return { status: 'ACCOUNT_CREATED', user };
  }
}
