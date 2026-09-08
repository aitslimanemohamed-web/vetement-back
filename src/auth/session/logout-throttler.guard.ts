import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, type ThrottlerLimitDetail } from '@nestjs/throttler';
import { SessionRateLimitedException } from './session.errors.js';

// Même motif que src/auth/register/register-throttler.guard.ts : corps
// { status: 'RATE_LIMITED' } + en-tête Retry-After, au lieu du
// ThrottlerException générique. Appliqué uniquement sur /auth/logout (pas de
// garde globale, pour ne jamais compter une requête deux fois — voir le bug
// rencontré et corrigé en US-009).
@Injectable()
export class LogoutThrottlerGuard extends ThrottlerGuard {
  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse<{ setHeader(name: string, value: string): void }>();
    const retryAfterSeconds = Math.max(1, Math.ceil(throttlerLimitDetail.timeToExpire));
    response.setHeader('Retry-After', String(retryAfterSeconds));
    throw new SessionRateLimitedException();
  }
}
