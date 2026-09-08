import { HttpException, HttpStatus } from '@nestjs/common';
import type { PasswordErrorCode } from './password-policy.js';
import type { UsernameErrorCode } from './username-policy.js';

export interface RegisterFieldErrors {
  username?: UsernameErrorCode;
  password?: PasswordErrorCode;
}

// Chaque exception porte exactement le corps JSON attendu par le contrat API
// (US-009, section 8) — jamais de mot de passe, d'empreinte, de requête SQL
// ni de trace interne dans ces corps de réponse.

export class ValidationFailedException extends HttpException {
  constructor(fieldErrors: RegisterFieldErrors) {
    super({ status: 'VALIDATION_ERROR', fieldErrors }, HttpStatus.BAD_REQUEST);
  }
}

export class PasswordTooCommonException extends HttpException {
  constructor() {
    super({ status: 'PASSWORD_TOO_COMMON' }, HttpStatus.BAD_REQUEST);
  }
}

export class UsernameTakenException extends HttpException {
  constructor() {
    super({ status: 'USERNAME_TAKEN' }, HttpStatus.CONFLICT);
  }
}

export class RegisterServiceUnavailableException extends HttpException {
  constructor() {
    super({ status: 'SERVICE_UNAVAILABLE' }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class RegisterRateLimitedException extends HttpException {
  constructor() {
    super({ status: 'RATE_LIMITED' }, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class UnexpectedRegisterErrorException extends HttpException {
  constructor() {
    super({ status: 'INTERNAL_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
