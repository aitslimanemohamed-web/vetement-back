import { IsOptional } from 'class-validator';

// Volontairement permissif au niveau du pipe de validation global : on ne
// veut PAS que class-validator court-circuite la requête avec son propre
// format d'erreur générique avant d'atteindre RegisterService, qui est seul
// responsable de produire le contrat exact { status: 'VALIDATION_ERROR',
// fieldErrors } attendu par le front (US-009, section 8). @IsOptional()
// suffit à préserver ces propriétés sous `whitelist: true` (sans décorateur,
// une propriété serait retirée comme "inattendue") sans jamais échouer elle-
// même — le type et la présence réels sont vérifiés dans
// username-policy.ts / password-policy.ts, qui acceptent une valeur
// `unknown` et traitent tout ce qui n'est pas une chaîne comme "absent".
// La propriété inattendue (whitelist) et la taille du corps (8 Ko) restent,
// elles, filtrées avant ce point.
export class RegisterRequestDto {
  @IsOptional()
  username?: unknown;

  @IsOptional()
  password?: unknown;
}
