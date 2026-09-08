import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UnauthenticatedException } from './session.errors.js';
import { SessionService, type ValidatedSession } from './session.service.js';

const BEARER_PREFIX = 'Bearer ';

interface RequestWithSession extends Request {
  currentSession?: ValidatedSession;
}

function extractToken(request: Request): string | null {
  const header = request.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

// Protège une route en exigeant une session valide (ni absente, ni mal
// formée, ni inconnue, ni révoquée, ni expirée, ni inactive depuis trop
// longtemps) — toutes ces causes sont volontairement indiscernables de
// l'extérieur (une seule exception, UnauthenticatedException).
//
// Lit uniquement l'en-tête Authorization: Bearer <token>, jamais un cookie —
// ce service ne reçoit jamais directement le cookie du navigateur (posé sur
// le domaine Vercel) : c'est le relais Next.js qui le traduit en en-tête
// pour cet appel serveur-à-serveur (voir CONTEXTE_PROJET.md, US-010).
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const token = extractToken(request);
    if (!token) throw new UnauthenticatedException();

    const session = await this.sessionService.validate(token);
    if (!session) throw new UnauthenticatedException();

    request.currentSession = session;
    return true;
  }
}
