import { Controller, Get } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  service: string;
  environment: string;
  version: string;
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
      version: process.env.APP_VERSION ?? 'dev',
    };
  }
}
