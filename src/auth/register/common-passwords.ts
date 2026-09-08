/**
 * Liste locale de mots de passe/phrases de passe à refuser (US-009).
 *
 * Provenance : liste courte, composée à la main pour cet environnement de
 * test, en s'inspirant de motifs connus des listes publiques de mots de
 * passe les plus courants (ex. les classements annuels NCSC/SplashData et le
 * corpus "RockYou") — mais adaptés pour respecter la longueur minimale de 15
 * caractères de ce projet, que la plupart des mots de passe de ces listes
 * publiques n'atteignent pas. Ce n'est PAS une copie d'un corpus de fuites
 * réel et ce n'est PAS exhaustif : c'est un filtre illustratif pour
 * l'environnement de test, à remplacer avant un lancement réel par une
 * source dédiée (ex. un export hors-ligne de "Have I Been Pwned" /
 * "Pwned Passwords" — jamais interrogée en direct, pour ne jamais envoyer un
 * mot de passe à un service tiers, conformément au ticket).
 *
 * Comparaison exacte, sensible à la casse (pas de normalisation, pas de
 * variantes) : voir isCommonPassword().
 */
export const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  'password12345678',
  'password123456789',
  'passwordpassword123',
  'letmein123456789',
  'letmeinletmein123',
  'iloveyou123456789',
  'iloveyouiloveyou1',
  'welcome123456789',
  'welcometoourteam1',
  'qwertyuiopqwerty1',
  'qwertyuiopasdfghj',
  'azertyuiopazerty1',
  'trustno1trustno1',
  '123456789012345',
  '1234567890123456',
  '12345678901234567',
  'aaaaaaaaaaaaaaa',
  'aaaaaaaaaaaaaaaa',
  'administrator1234',
  'administrator12345',
  'changeme123456789',
  'changeme12345678',
  'superadmin123456',
  'superuser1234567',
  'correcthorsebatterystaple',
  'p@ssw0rd12345678',
  'p@ssword123456789',
  'passw0rd12345678',
  'monmotdepasse123',
  'monmotdepasse1234',
  'motdepasse123456',
  'bonjourbonjour123',
  'soleilsoleil12345',
  'marseillemarseille',
  'football123456789',
  'baseballbaseball1',
  'basketball1234567',
  'dragonball1234567',
  'starwars123456789',
  'testtesttesttest',
  'testing123456789',
  'sample1234567890',
  'defaultpassword12',
  'defaultpassword123',
  'temporary12345678',
  'temporarypassword1',
  'unepetitephrase12',
  'ilovemycat1234567',
  'ilovemydog1234567',
]);

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password);
}
