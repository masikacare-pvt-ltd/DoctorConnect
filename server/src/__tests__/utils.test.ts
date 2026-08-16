/**
 * Unit tests for server utility functions.
 */
import { describe, it, expect } from 'vitest';
import { getDefaultAvatar } from '../utils/avatar';

describe('getDefaultAvatar', () => {
  it('returns a data URI string', () => {
    const avatar = getDefaultAvatar('male');
    expect(avatar).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('returns different avatars for male vs female', () => {
    const male = getDefaultAvatar('male');
    const female = getDefaultAvatar('female');
    expect(male).not.toBe(female);
  });

  it('defaults to male avatar for unknown gender', () => {
    const male = getDefaultAvatar('male');
    const unknown = getDefaultAvatar('unknown');
    expect(unknown).toBe(male);
  });

  it('defaults to male avatar when no gender provided', () => {
    const male = getDefaultAvatar('male');
    const noGender = getDefaultAvatar();
    expect(noGender).toBe(male);
  });
});

describe('logger', () => {
  it('exports info, warn, error, debug, request methods', async () => {
    const { logger } = await import('../utils/logger');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.request).toBe('function');
  });

  it('does not throw when logging', async () => {
    const { logger } = await import('../utils/logger');
    expect(() => logger.info('test message')).not.toThrow();
    expect(() => logger.warn('test warning', { key: 'value' })).not.toThrow();
    expect(() => logger.error('test error')).not.toThrow();
    expect(() => logger.request('GET', '/api/test', 200, 50)).not.toThrow();
  });
});
