import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { ValidatedSession } from './session.service.js';

interface RequestWithSession {
  currentSession?: ValidatedSession;
}

// Lit la session déjà validée et attachée à la requête par SessionGuard.
// Ne lit jamais un identifiant fourni par le client : c'est structurellement
// impossible d'obtenir autre chose ici que ce que le jeton de session a
// prouvé (US-010, section 7 : "ne doit pas accepter un identifiant fourni
// par le navigateur pour choisir le compte à afficher").
export const CurrentSession = createParamDecorator((_data: unknown, ctx: ExecutionContext): ValidatedSession => {
  const request = ctx.switchToHttp().getRequest<RequestWithSession>();
  // SessionGuard doit toujours avoir tourné avant ce décorateur ; si ce
  // n'est pas le cas, c'est une erreur de câblage du contrôleur, pas un cas
  // d'exécution normal à masquer silencieusement.
  if (!request.currentSession) {
    throw new Error('CurrentSession() used without SessionGuard on the same route');
  }
  return request.currentSession;
});
