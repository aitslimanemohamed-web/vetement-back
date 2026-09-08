import { isCommonPassword } from './common-passwords.js';

export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordErrorCode = 'PASSWORD_REQUIRED' | 'PASSWORD_TOO_SHORT' | 'PASSWORD_TOO_LONG';

/** Points de code Unicode (voir la note dans username-policy.ts). */
function countCodePoints(value: string): number {
  return Array.from(value).length;
}

/**
 * Valide uniquement la longueur — jamais de règle de composition imposée
 * (majuscule/chiffre/symbole obligatoire), conformément au ticket et à la
 * recommandation OWASP citée : la longueur prime sur la complexité forcée en
 * l'absence de second facteur. Aucune transformation de `password` n'a lieu
 * ici (pas de trim, pas de troncature) : la valeur est jugée telle quelle.
 */
export function validatePasswordLength(password: unknown): PasswordErrorCode | undefined {
  // Un type incorrect est traité comme un champ manquant (voir la même note
  // dans username-policy.ts).
  if (typeof password !== 'string' || password.length === 0) {
    return 'PASSWORD_REQUIRED';
  }

  const length = countCodePoints(password);
  if (length < PASSWORD_MIN_LENGTH) {
    return 'PASSWORD_TOO_SHORT';
  }
  if (length > PASSWORD_MAX_LENGTH) {
    return 'PASSWORD_TOO_LONG';
  }

  return undefined;
}

export function isPasswordTooCommon(password: string): boolean {
  return isCommonPassword(password);
}
