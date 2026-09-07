import { Controller, Get } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  service: string;
  environment: string;
  version: string;
}

const SHORT_SHA_LENGTH = 7;

/**
 * Resolve the deployed commit's short SHA automatically, with no manual step
 * needed at each release:
 * - Render web services expose RENDER_GIT_COMMIT (full SHA) automatically.
 * - APP_VERSION lets a developer override this explicitly (e.g. local testing).
 * - Falls back to 'dev' when neither is set (plain local run).
 */
function resolveVersion(): string {
  const renderCommit = process.env.RENDER_GIT_COMMIT;
  if (renderCommit) {
    return renderCommit.slice(0, SHORT_SHA_LENGTH);
  }
  return process.env.APP_VERSION ?? 'dev';
}

/**
 * Public route confirming only that the API process itself is up and responding.
 * Does not check any database or storage — none exist yet (see TECH-003 scope).
 */
@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'vetement-back',
      environment: process.env.APP_ENVIRONMENT ?? 'development',
      version: resolveVersion(),
    };
  }
}
