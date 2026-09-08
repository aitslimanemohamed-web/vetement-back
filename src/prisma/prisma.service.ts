import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Enveloppe fine autour de PrismaClient pour suivre le cycle de vie NestJS.
// Volontairement PAS de $connect() explicite au démarrage du module : Prisma
// se connecte tout seul, en différé, à la première requête réelle. Ainsi, si
// DATABASE_URL est absent ou que la base est temporairement inaccessible, le
// reste de l'application (santé, diagnostic) continue de fonctionner ; seule
// une tentative d'inscription échoue, et de façon explicite (voir
// register.service.ts, qui traduit cette erreur en 503 SERVICE_UNAVAILABLE).
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
