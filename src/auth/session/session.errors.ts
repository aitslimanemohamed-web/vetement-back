import { HttpException, HttpStatus } from '@nestjs/common';

// Même motif que src/auth/register/register.errors.ts : une exception par
// cas, portant exactement le corps JSON attendu — jamais de détail sur la
// RAISON précise d'un rejet (jeton absent, mal formé, expiré, révoqué...
// sont tous indiscernables de l'extérieur, volontairement).

export class UnauthenticatedException extends HttpException {
  constructor() {
    super({ status: 'UNAUTHENTICATED' }, HttpStatus.UNAUTHORIZED);
  }
}

export class SessionRateLimitedException extends HttpException {
  constructor() {
    super({ status: 'RATE_LIMITED' }, HttpStatus.TOO_MANY_REQUESTS);
  }
}
