import { HttpException, HttpStatus } from '@nestjs/common';
import type { PasswordErrorCode } from '../register/password-policy.js';
import type { UsernameErrorCode } from '../register/username-policy.js';

export interface LoginFieldErrors {
  username?: UsernameErrorCode;
  password?: PasswordErrorCode;
}

export class LoginValidationFailedException extends HttpException {
  constructor(fieldErrors: LoginFieldErrors) {
    super({ status: 'VALIDATION_ERROR', fieldErrors }, HttpStatus.BAD_REQUEST);
  }
}

// Un seul et même message pour "nom inconnu" et "mot de passe incorrect"
// (US-011, section 4) — ne jamais indiquer laquelle des deux causes est en
// jeu, pour ne pas laisser deviner qu'un nom d'utilisateur existe.
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super({ status: 'INVALID_CREDENTIALS' }, HttpStatus.UNAUTHORIZED);
  }
}

export class LoginRateLimitedException extends HttpException {
  constructor() {
    super({ status: 'RATE_LIMITED' }, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class LoginServiceUnavailableException extends HttpException {
  constructor() {
    super({ status: 'SERVICE_UNAVAILABLE' }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class UnexpectedLoginErrorException extends HttpException {
  constructor() {
    super({ status: 'INTERNAL_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
