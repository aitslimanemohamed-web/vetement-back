import { describe, expect, it } from 'vitest';
import { countCodePoints, normalizeUsername, usernameKey, validateUsername } from './username-policy.js';

describe('countCodePoints', () => {
  it('counts a combining diacritic as a separate code point (unlike grapheme counting)', () => {
    // "e" + U+0301 COMBINING ACUTE ACCENT — 2 code points, 1 grapheme.
    // Deliberately different from the front-end's grapheme-based count.
    expect(countCodePoints('é')).toBe(2);
  });

  it('counts plain ASCII normally', () => {
    expect(countCodePoints('abc')).toBe(3);
  });
});

describe('normalizeUsername', () => {
  it('trims leading and trailing spaces', () => {
    expect(normalizeUsername('  bob  ')).toBe('bob');
  });

  it('does not touch internal characters or casing', () => {
    expect(normalizeUsername('  Karim-Test_92  ')).toBe('Karim-Test_92');
  });
});

describe('usernameKey', () => {
  it('is locale-independent lowercase, NFC-normalized', () => {
    expect(usernameKey('Karim')).toBe('karim');
    expect(usernameKey('KARIM')).toBe('karim');
    expect(usernameKey('karim')).toBe('karim');
  });

  it('keeps accents significant (different key from the unaccented form)', () => {
    expect(usernameKey('Karîm')).not.toBe(usernameKey('Karim'));
  });

  it('treats an Arabic name consistently regardless of case concept (no case in Arabic)', () => {
    expect(usernameKey('محمد')).toBe('محمد');
  });
});

describe('validateUsername', () => {
  it('rejects an empty value', () => {
    expect(validateUsername('')).toBe('USERNAME_REQUIRED');
  });

  it('rejects a value that is only whitespace', () => {
    expect(validateUsername('   ')).toBe('USERNAME_REQUIRED');
  });

  it('rejects a username shorter than 3 code points', () => {
    expect(validateUsername('ab')).toBe('USERNAME_LENGTH');
  });

  it('rejects a username longer than 30 code points', () => {
    expect(validateUsername('a'.repeat(31))).toBe('USERNAME_LENGTH');
  });

  it('accepts exactly 3 and exactly 30 code points', () => {
    expect(validateUsername('abc')).toBeUndefined();
    expect(validateUsername('a'.repeat(30))).toBeUndefined();
  });

  it('rejects an internal space', () => {
    expect(validateUsername('jean dupont')).toBe('USERNAME_FORMAT');
  });

  it('rejects a purely symbolic username with no letter or digit', () => {
    expect(validateUsername('---___---')).toBe('USERNAME_FORMAT');
  });

  it('accepts letters, digits, hyphen and underscore', () => {
    expect(validateUsername('jean-dupont_92')).toBeUndefined();
  });

  it('accepts accented Latin letters', () => {
    expect(validateUsername('Émilie-Dupont')).toBeUndefined();
  });

  it('accepts Arabic letters', () => {
    expect(validateUsername('محمد_2026')).toBeUndefined();
  });

  it('ignores leading/trailing spaces for length and format', () => {
    expect(validateUsername('  bob  ')).toBeUndefined();
  });
});
