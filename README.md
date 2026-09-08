# vetement-back

## Rôle

Ce dépôt contient le **back-end** du projet vetement : les API, les règles métier, et l'accès
aux données.

## Dépôt lié

Le front-end (site web, applications iOS et Android) vit dans un dépôt séparé et indépendant :
[**vetement-front**](https://github.com/aitslimanemohamed-web/vetement-front).

## Récupérer ce dépôt

```
git clone https://github.com/aitslimanemohamed-web/vetement-back.git
```

## Technologies

- [NestJS](https://nestjs.com/) avec TypeScript, exécuté sur Node.js.
- [Prisma](https://www.prisma.io/) (ORM + migrations) sur PostgreSQL (Supabase, plan gratuit).
- [argon2](https://www.npmjs.com/package/argon2) (Argon2id) pour le hachage des mots de passe.
- [@nestjs/throttler](https://github.com/nestjs/throttler) pour la limitation de requêtes.

## Développement local

```
npm install                  # exécute aussi `prisma generate` (postinstall)
cp .env.example .env         # puis ajuster CORS_ORIGIN, DATABASE_URL si besoin
npm run start:dev            # démarre le serveur en local (http://localhost:3001)
npm run type-check           # vérifie les types TypeScript
npm run lint                 # vérifie le code
npm test                     # exécute les tests unitaires
npm run test:e2e             # exécute les tests end-to-end (nécessite une vraie base Postgres
                              # de test — jamais Supabase — voir docs/CONTEXTE_PROJET.md)
npm run build                # construit le serveur
npm run start:prod           # démarre la version construite (dist/main.js)
npm run db:migrate:deploy    # applique les migrations versionnées (prisma/migrations/)
```

## Routes publiques

- `GET /api/health` — confirme que le processus API répond :

  ```json
  { "status": "ok", "service": "vetement-back", "environment": "test", "version": "<commit>" }
  ```

- `POST /api/auth/register` — crée réellement un compte (nom d'utilisateur + mot de passe
  uniquement), limité à 5 tentatives/minute/IP. Voir `docs/CONTEXTE_PROJET.md` pour le contrat
  complet (codes de réponse, règles de validation, hachage).

## État actuel

Le serveur démarre, expose `GET /api/health` et `POST /api/auth/register`, et autorise les
appels du front-end via CORS (origine configurable). Déployé et vérifié en ligne (Render, plan
gratuit) : https://vetement-back.onrender.com/api/health — voir `docs/CONTEXTE_PROJET.md` pour
le détail et les limites connues (mise en veille après inactivité). L'inscription crée un vrai
compte dans PostgreSQL (Supabase, plan gratuit) ; aucune autre fonctionnalité métier (connexion,
annonces, messagerie...) n'existe encore — voir le fichier de référence pour le détail exact de
ce qui est réalisé, prévu ou bloqué.

## Dossier `database/`

Voir [`database/README.md`](database/README.md) pour le rôle de ce dossier.

## Mémoire de référence du projet

L'ensemble du projet (les deux dépôts) est documenté dans
[`docs/CONTEXTE_PROJET.md`](docs/CONTEXTE_PROJET.md) — c'est la version de référence unique,
versionnée dans ce dépôt.

**Lire ce fichier avant de commencer une intervention**, et **le mettre à jour à la fin du
travail** si l'intervention en modifie le contenu.
