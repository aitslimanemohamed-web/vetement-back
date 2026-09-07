import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  let controller: HealthController;
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns status ok with the expected shape', () => {
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('vetement-back');
    expect(typeof result.environment).toBe('string');
    expect(typeof result.version).toBe('string');
  });

  it('falls back to safe defaults when no env var is set', () => {
    delete process.env.APP_ENVIRONMENT;
    delete process.env.APP_VERSION;
    delete process.env.RENDER_GIT_COMMIT;

    const result = controller.getHealth();

    expect(result.environment).toBe('development');
    expect(result.version).toBe('dev');
  });

  it('reflects APP_ENVIRONMENT and APP_VERSION when set', () => {
    delete process.env.RENDER_GIT_COMMIT;
    process.env.APP_ENVIRONMENT = 'test';
    process.env.APP_VERSION = 'abc1234';

    const result = controller.getHealth();

    expect(result.environment).toBe('test');
    expect(result.version).toBe('abc1234');
  });

  it('prefers RENDER_GIT_COMMIT over APP_VERSION, truncated to a short SHA', () => {
    process.env.APP_VERSION = 'manual-override';
    process.env.RENDER_GIT_COMMIT = 'abcdef0123456789';

    const result = controller.getHealth();

    expect(result.version).toBe('abcdef0');
  });
});
