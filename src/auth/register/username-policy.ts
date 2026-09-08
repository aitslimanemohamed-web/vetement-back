export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export type UsernameErrorCode = 'USERNAME_REQUIRED' | 'USERNAME_LENGTH' | 'USERNAME_FORMAT';

// Lettres Unicode, marques diacritiques associées, chiffres, tiret et tiret
// bas. N'autorise aucun espace ni caractère de contrôle : les deux sont
// simplement absents de cette liste.
const USERNAME_PATTERN = /^[\p{L}\p{M}\p{Nd}_-]+$/u;
const HAS_LETTER_OR_DIGIT = /[\p{L}\p{Nd}]/u;

/**
 * Compte les caractères en POINTS DE CODE Unicode (`Array.from`), pas en
 * unités UTF-16 (`.length`). C'est une règle explicite du ticket back-end
 * (US-009) — à noter : elle diffère volontairement de la méthode utilisée
 * côté front (US-007), qui compte par GRAPPES DE GRAPHÈMES via
 * `Intl.Segmenter`. Un nom d'utilisateur contenant une marque diacritique
 * combinante (voyellation arabe, accent latin décomposé) peut donc être
 * compté différemment par les deux côtés — voir CONTEXTE_PROJET.md pour
 * cette divergence documentée, signalée mais non résolue unilatéralement par
 * cette implémentation (chaque ticket a fixé sa propre règle explicitement).
 */
export function countCodePoints(value: string): number {
  return Array.from(value).length;
}

/** Retire les espaces de bord et normalise en NFC — ne change jamais la casse. */
export function normalizeUsername(rawUsername: string): string {
  return rawUsername.trim().normalize('NFC');
}

/**
 * Clé d'unicité dérivée du nom normalisé : mise en minuscules indépendante
 * de la langue (`toLowerCase()`, jamais `toLocaleLowerCase()`, pour éviter
 * des résultats différents selon la locale du serveur — ex. le "i" turc),
 * puis renormalisée en NFC (la mise en minuscules peut, pour de rares
 * caractères comme "İ", changer le nombre de points de code). "Karim",
 * "karim" et "KARIM" partagent ainsi la même clé ; les accents restent
 * significatifs ("Karîm" a une clé différente de "Karim").
 */
export function usernameKey(normalizedUsername: string): string {
  return normalizedUsername.toLowerCase().normalize('NFC');
}

export function validateUsername(rawUsername: unknown): UsernameErrorCode | undefined {
  // Un type incorrect (nombre, tableau, absent...) est traité comme un champ
  // manquant : le corps de réponse reste { status: 'VALIDATION_ERROR',
  // fieldErrors } quel que soit ce qui a été envoyé (voir dto/register-request.dto.ts).
  if (typeof rawUsername !== 'string') {
    return 'USERNAME_REQUIRED';
  }

  const normalized = normalizeUsername(rawUsername);

  if (normalized.length === 0) {
    return 'USERNAME_REQUIRED';
  }

  const length = countCodePoints(normalized);
  if (length < USERNAME_MIN_LENGTH || length > USERNAME_MAX_LENGTH) {
    return 'USERNAME_LENGTH';
  }

  if (!USERNAME_PATTERN.test(normalized) || !HAS_LETTER_OR_DIGIT.test(normalized)) {
    return 'USERNAME_FORMAT';
  }

  return undefined;
}
