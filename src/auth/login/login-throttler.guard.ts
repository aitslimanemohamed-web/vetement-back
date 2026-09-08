import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, type ThrottlerLimitDetail } from '@nestjs/throttler';
import { LoginRateLimitedException } from './login.errors.js';

// Même motif que register-throttler.guard.ts : 5 tentatives/minute/IP (même
// seuil que l'inscription, US-011 section 3 — "documenter le seuil
// retenu"), corps { status: 'RATE_LIMITED' } + en-tête Retry-After.
@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse<{ setHeader(name: string, value: string): void }>();
    const retryAfterSeconds = Math.max(1, Math.ceil(throttlerLimitDetail.timeToExpire));
    response.setHeader('Retry-After', String(retryAfterSeconds));
    throw new LoginRateLimitedException();
  }
}
