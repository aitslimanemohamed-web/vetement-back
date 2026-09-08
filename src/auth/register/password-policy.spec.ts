import { describe, expect, it } from 'vitest';
import { isPasswordTooCommon, validatePasswordLength } from './password-policy.js';

describe('validatePasswordLength', () => {
  it('rejects an empty value', () => {
    expect(validatePasswordLength('')).toBe('PASSWORD_REQUIRED');
  });

  it('rejects a password shorter than 15 code points', () => {
    expect(validatePasswordLength('a'.repeat(14))).toBe('PASSWORD_TOO_SHORT');
  });

  it('rejects a password longer than 128 code points', () => {
    expect(validatePasswordLength('a'.repeat(129))).toBe('PASSWORD_TOO_LONG');
  });

  it('accepts exactly 15 and exactly 128 code points', () => {
    expect(validatePasswordLength('a'.repeat(15))).toBeUndefined();
    expect(validatePasswordLength('a'.repeat(128))).toBeUndefined();
  });

  it('accepts spaces inside the password (a passphrase)', () => {
    expect(validatePasswordLength('correct horse battery')).toBeUndefined();
  });

  it('does not require a mix of uppercase, digits and symbols', () => {
    expect(validatePasswordLength('lowercaseonlypassphrase')).toBeUndefined();
  });
});

describe('isPasswordTooCommon', () => {
  it('rejects an exact match from the local list', () => {
    expect(isPasswordTooCommon('correcthorsebatterystaple')).toBe(true);
  });

  it('accepts a password that is not in the list, even if similar', () => {
    expect(isPasswordTooCommon('correcthorsebatterystaplex')).toBe(false);
  });

  it('is an exact, case-sensitive comparison', () => {
    expect(isPasswordTooCommon('CorrectHorseBatteryStaple')).toBe(false);
  });
});
