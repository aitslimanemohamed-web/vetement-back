import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

// Paramètres Argon2id minimaux recommandés par l'OWASP pour ce cas d'usage
// (authentification par mot de passe, sans second facteur) :
// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
// memoryCost est exprimé en Kio par la bibliothèque `argon2` : 19 Mio = 19*1024 Kio.
const MEMORY_COST_KIB = 19 * 1024;
const TIME_COST = 2;
const PARALLELISM = 1;

@Injectable()
export class HashService {
  // Sel aléatoire propre à chaque appel : géré automatiquement par la
  // bibliothèque (jamais réutilisé, jamais fourni par l'appelant).
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: MEMORY_COST_KIB,
      timeCost: TIME_COST,
      parallelism: PARALLELISM,
    });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
