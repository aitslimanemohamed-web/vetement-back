import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HashService } from './hash.service.js';
import { isPasswordTooCommon, validatePasswordLength } from './password-policy.js';
import {
  PasswordTooCommonException,
  RegisterServiceUnavailableException,
  UnexpectedRegisterErrorException,
  UsernameTakenException,
  ValidationFailedException,
  type RegisterFieldErrors,
} from './register.errors.js';
import { normalizeUsername, usernameKey, validateUsername } from './username-policy.js';

export interface RegisteredAccount {
  id: string;
  username: string;
  createdAt: string;
}

interface PreparedAccount {
  normalizedUsername: string;
  usernameKey: string;
  passwordHash: string;
}

// Client Prisma "utilisable pour une requête" : soit le client de premier
// niveau (PrismaService), soit un client de transaction — voir
// SessionService pour le même motif, utilisé pour créer le compte et sa
// session dans la même transaction (US-010).
type QueryClient = Pick<PrismaService, 'user'> | Prisma.TransactionClient;

// Codes Prisma signalant que la base est temporairement injoignable (et non
// une erreur de logique applicative) : voir
// https://www.prisma.io/docs/orm/reference/error-reference
const DATABASE_CONNECTIVITY_ERROR_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017']);

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async register(rawUsername: unknown, rawPassword: unknown): Promise<RegisteredAccount> {
    const prepared = await this.prepareAccount(rawUsername, rawPassword);
    return this.insertAccount(this.prisma, prepared);
  }

  // Validation, vérification du mot de passe courant et hachage — aucune
  // écriture en base ici. Volontairement séparé de l'insertion (voir
  // insertAccount) pour que l'appelant (RegisterController, US-010) puisse
  // ouvrir une transaction UNIQUEMENT pour les écritures réelles (compte +
  // session), jamais pour un simple rejet de validation.
  async prepareAccount(rawUsername: unknown, rawPassword: unknown): Promise<PreparedAccount> {
    const fieldErrors: RegisterFieldErrors = {};

    const usernameError = validateUsername(rawUsername);
    if (usernameError) fieldErrors.username = usernameError;

    const passwordError = validatePasswordLength(rawPassword);
    if (passwordError) fieldErrors.password = passwordError;

    if (fieldErrors.username || fieldErrors.password) {
      throw new ValidationFailedException(fieldErrors);
    }

    // Les deux validations ci-dessus n'ont laissé passer que des chaînes.
    const username = rawUsername as string;
    const password = rawPassword as string;

    // À partir d'ici, `password` ne doit plus jamais être journalisé, inclus
    // dans un message d'erreur, ni renvoyé au client.
    if (isPasswordTooCommon(password)) {
      throw new PasswordTooCommonException();
    }

    const normalizedUsername = normalizeUsername(username);
    const key = usernameKey(normalizedUsername);

    let passwordHash: string;
    try {
      passwordHash = await this.hashService.hash(password);
    } catch {
      throw new UnexpectedRegisterErrorException();
    }

    return { normalizedUsername, usernameKey: key, passwordHash };
  }

  // Écriture seule, à partir d'un compte déjà validé/haché — `client` peut
  // être un client de transaction pour rester cohérent avec une autre
  // écriture (la session, voir RegisterController).
  async insertAccount(client: QueryClient, prepared: PreparedAccount): Promise<RegisteredAccount> {
    try {
      const user = await client.user.create({
        data: {
          username: prepared.normalizedUsername,
          usernameKey: prepared.usernameKey,
          passwordHash: prepared.passwordHash,
        },
        select: { id: true, username: true, createdAt: true },
      });

      return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
      };
    } catch (error) {
      // Violation de la contrainte unique sur username_key : c'est elle, pas
      // une simple recherche préalable, qui empêche deux créations
      // simultanées pour le même nom (US-009, section 6).
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new UsernameTakenException();
      }

      if (this.isConnectivityError(error)) {
        throw new RegisterServiceUnavailableException();
      }

      throw new UnexpectedRegisterErrorException();
    }
  }

  private isConnectivityError(error: unknown): boolean {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return true;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return DATABASE_CONNECTIVITY_ERROR_CODES.has(error.code);
    }
    return false;
  }
}
