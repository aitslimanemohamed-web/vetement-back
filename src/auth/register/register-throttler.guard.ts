import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, type ThrottlerLimitDetail } from '@nestjs/throttler';
import { RegisterRateLimitedException } from './register.errors.js';

// Personnalise la réponse 429 pour respecter le contrat API (US-009) :
// corps { status: 'RATE_LIMITED' } et en-tête Retry-After, au lieu du
// ThrottlerException générique par défaut.
@Injectable()
export class RegisterThrottlerGuard extends ThrottlerGuard {
  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse<{ setHeader(name: string, value: string): void }>();
    const retryAfterSeconds = Math.max(1, Math.ceil(throttlerLimitDetail.timeToExpire));
    response.setHeader('Retry-After', String(retryAfterSeconds));
    throw new RegisterRateLimitedException();
  }
}
