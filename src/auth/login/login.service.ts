import { Injectable, type OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HashService } from '../register/hash.service.js';
import { normalizeUsername, usernameKey } from '../register/username-policy.js';
import {
  InvalidCredentialsException,
  LoginServiceUnavailableException,
  LoginValidationFailedException,
  UnexpectedLoginErrorException,
  type LoginFieldErrors,
} from './login.errors.js';

export interface LoggedInAccount {
  id: string;
  username: string;
}

const DATABASE_CONNECTIVITY_ERROR_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017']);

// Mot de passe fixe, jamais celui d'un vrai compte — sert uniquement à
// obtenir une empreinte Argon2id valide contre laquelle comparer un essai
// quand le nom d'utilisateur est inconnu (voir login()).
const DUMMY_PASSWORD = 'dummy-password-never-assigned-to-a-real-account';

@Injectable()
export class LoginService implements OnModuleInit {
  private dummyHash = '';

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.dummyHash = await this.hashService.hash(DUMMY_PASSWORD);
  }

  async login(rawUsername: unknown, rawPassword: unknown): Promise<LoggedInAccount> {
    const fieldErrors: LoginFieldErrors = {};
    if (typeof rawUsername !== 'string' || rawUsername.trim().length === 0) {
      fieldErrors.username = 'USERNAME_REQUIRED';
    }
    if (typeof rawPassword !== 'string' || rawPassword.length === 0) {
      fieldErrors.password = 'PASSWORD_REQUIRED';
    }
    if (fieldErrors.username || fieldErrors.password) {
      throw new LoginValidationFailedException(fieldErrors);
    }

    // Les deux validations ci-dessus n'ont laissé passer que des chaînes.
    const username = rawUsername as string;
    const password = rawPassword as string;

    // À partir d'ici, `password` ne doit plus jamais être journalisé, inclus
    // dans un message d'erreur, ni renvoyé au client (même motif que
    // RegisterService).
    const key = usernameKey(normalizeUsername(username));

    let user: { id: string; username: string; passwordHash: string } | null;
    try {
      user = await this.prisma.user.findUnique({
        where: { usernameKey: key },
        select: { id: true, username: true, passwordHash: true },
      });
    } catch (error) {
      if (this.isConnectivityError(error)) {
        throw new LoginServiceUnavailableException();
      }
      throw new UnexpectedLoginErrorException();
    }

    // Comparaison exécutée MÊME SI le compte n'existe pas (contre une
    // empreinte fixe sans rapport avec un vrai compte) : le temps de
    // réponse ne doit pas laisser deviner qu'un nom d'utilisateur existe ou
    // non (US-011, section 4 : "sans révéler si un nom existe").
    const hashToVerify = user?.passwordHash ?? this.dummyHash;
    let passwordOk: boolean;
    try {
      passwordOk = await this.hashService.verify(hashToVerify, password);
    } catch {
      passwordOk = false;
    }

    if (!user || !passwordOk) {
      throw new InvalidCredentialsException();
    }

    return { id: user.id, username: user.username };
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
