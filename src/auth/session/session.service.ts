import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

// Durées de vie (US-010, section 5) : valeurs initiales, ajustables —
// documentées telles quelles dans CONTEXTE_PROJET.md, appliquées uniquement
// côté serveur (jamais déduites d'une valeur envoyée par le client).
const ABSOLUTE_TTL_MS = 24 * 60 * 60 * 1000; // 24 heures depuis la création
const IDLE_TTL_MS = 2 * 60 * 60 * 1000; // 2 heures depuis la dernière activité
const SECRET_BYTES = 32; // 256 bits, généré par un CSPRNG (node:crypto)

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export interface ValidatedSession {
  userId: string;
  sessionId: string;
}

// Client Prisma "utilisable pour une requête" : soit le client de premier
// niveau (PrismaService), soit un client de transaction
// (`prisma.$transaction(async (tx) => ...)`) — les deux exposent la même API
// pour `.session.create()` / `.session.update()` / `.session.findUnique()`.
type QueryClient = PrismaService | Prisma.TransactionClient;

function hashSecret(secret: string): Buffer {
  return createHash('sha256').update(secret).digest();
}

// Jeton opaque "<id>.<secret>" : l'id permet une recherche directe en base
// (clé primaire indexée), le secret n'est jamais stocké en clair — seul son
// empreinte (SHA-256, voir schema.prisma pour la justification de ce choix
// plutôt qu'Argon2id) est comparée, en temps constant.
function parseToken(token: string): { id: string; secret: string } | null {
  const separatorIndex = token.indexOf('.');
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) return null;
  return {
    id: token.slice(0, separatorIndex),
    secret: token.slice(separatorIndex + 1),
  };
}

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  // À appeler idéalement à l'intérieur de la même transaction que la
  // création du compte (voir RegisterController) — accepte un client de
  // transaction explicite, sinon utilise la connexion par défaut.
  async create(userId: string, client: QueryClient = this.prisma): Promise<CreatedSession> {
    const secret = randomBytes(SECRET_BYTES).toString('base64url');
    const secretHash = hashSecret(secret).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ABSOLUTE_TTL_MS);

    const session = await client.session.create({
      data: {
        userId,
        secretHash,
        expiresAt,
        lastActiveAt: now,
      },
      select: { id: true },
    });

    return { token: `${session.id}.${secret}`, expiresAt };
  }

  // Ne journalise jamais `token` ni `secret` en cas d'échec — seule la
  // classification (valide / invalide) doit être observable à l'extérieur.
  async validate(token: string): Promise<ValidatedSession | null> {
    const parsed = parseToken(token);
    if (!parsed) return null;

    const session = await this.prisma.session.findUnique({
      where: { id: parsed.id },
      select: { id: true, userId: true, secretHash: true, expiresAt: true, lastActiveAt: true, revokedAt: true },
    });
    if (!session) return null;
    if (session.revokedAt !== null) return null;

    const now = Date.now();
    if (session.expiresAt.getTime() <= now) return null;
    if (session.lastActiveAt.getTime() + IDLE_TTL_MS <= now) return null;

    if (!this.secretMatches(parsed.secret, session.secretHash)) return null;

    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return { userId: session.userId, sessionId: session.id };
  }

  // Déconnexion (US-010, section 7) : idempotente et jamais en erreur pour
  // l'appelant, quel que soit l'état du jeton (absent, mal formé, inconnu,
  // déjà révoqué, expiré). Exige tout de même la preuve du secret avant de
  // révoquer une session encore active — connaître seulement l'identifiant
  // (par ex. vu passer dans un journal) ne doit jamais suffire à déconnecter
  // quelqu'un d'autre de force.
  async revokeByToken(token: string): Promise<void> {
    const parsed = parseToken(token);
    if (!parsed) return;

    const session = await this.prisma.session.findUnique({
      where: { id: parsed.id },
      select: { id: true, secretHash: true, revokedAt: true },
    });
    if (!session || session.revokedAt !== null) return;
    if (!this.secretMatches(parsed.secret, session.secretHash)) return;

    // `updateMany` (pas `update`) : reste silencieux si la session a été
    // révoquée entre-temps par une requête concurrente, plutôt que de lever
    // une erreur sur une ligne qui n'est plus dans l'état attendu.
    await this.prisma.session.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private secretMatches(providedSecret: string, storedHashHex: string): boolean {
    const providedHash = hashSecret(providedSecret);
    const storedHash = Buffer.from(storedHashHex, 'hex');
    return providedHash.length === storedHash.length && timingSafeEqual(providedHash, storedHash);
  }
}
