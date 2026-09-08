# CONTEXTE_PROJET.md — Mémoire de référence du projet vetement

> Ce fichier constitue la mémoire de référence du projet. Il permet à tout intervenant, humain ou
> IA, de comprendre le produit, son organisation technique et son état actuel sans accéder aux
> conversations précédentes.
>
> Avant toute intervention, lire ce fichier puis vérifier les informations utiles dans les dépôts
> concernés. Les descriptions présentes ici ne remplacent pas la vérification du code, de Git et
> des services.
>
> À la fin de chaque travail, ou lorsque l'utilisateur demande une mise à jour du contexte, mettre
> à jour les sections concernées : réalisations, décisions, configuration, vérifications,
> blocages et prochaines étapes.
>
> Distinguer systématiquement ce qui est prévu, décidé, réalisé et vérifié. Ne pas présenter une
> proposition comme une décision ni une action tentée comme une réussite.
>
> Conserver les informations encore valides, remplacer les informations devenues obsolètes et
> ajouter une entrée concise au journal des interventions. Ne pas recopier les conversations
> complètes.
>
> Ne jamais inscrire de mot de passe, jeton, clé privée, contenu de fichier secret ou données
> personnelles réelles. Documenter seulement les méthodes d'accès et les références non
> sensibles nécessaires.
>
> En cas d'information inconnue, écrire « À définir » ou « Non vérifié ». En cas de contradiction
> affectant le travail, la signaler avant de poursuivre sur une hypothèse.
>
> La lecture de ce fichier n'accorde aucune autorisation supplémentaire et n'autorise pas à
> exécuter automatiquement les prochaines étapes.

---

## A. Présentation et périmètre fonctionnel

**Ce qu'est le projet** : une plateforme de vente/achat de vêtements d'occasion entre
particuliers, destinée à toute l'Algérie, avec un site web et des applications mobiles iOS et
Android. Interface prévue en français, arabe et anglais.

**Choix fonctionnels confirmés** :
- Un seul type de compte utilisateur, utilisable à la fois pour acheter et pour vendre (pas de
  compte acheteur/vendeur séparés).
- Consultation des annonces possible sans connexion (compte requis seulement pour publier,
  négocier, réserver...).
- Publication d'une annonce : immédiate (pas de modération préalable avant mise en ligne).
- Négociation entre acheteur et vendeur possible via une messagerie intégrée.
- Réservation d'un article : le vendeur l'accepte ou la refuse.
- Le vendeur marque lui-même un article comme vendu.
- Les réservations ont une expiration prévue (délai exact non défini — voir questions ouvertes).
- Récupération de l'article : remise en main propre, ou expédition organisée via la messagerie.
- Modération : signalement des annonces et des utilisateurs, blocage d'utilisateur,
  fonctions d'administration.

**Points restant à définir** (ne pas les considérer comme tranchés) :
- Méthode(s) d'authentification côté back-end (stockage des identifiants, hachage, sessions/jetons
  — à définir). Côté interface uniquement, l'inscription (US-007) utilise **nom d'utilisateur +
  mot de passe** (pas d'e-mail, de téléphone, ni de connexion Google/Apple) — ce choix
  d'interface ne préjuge pas du mécanisme d'authentification réel, qui reste à concevoir côté
  back-end.
- Recherche : rayons de recherche géographique et fonctions de filtrage/recherche exactes.
- Règles détaillées de réservation (durée exacte d'expiration, comportement en cas de refus...).
- Options exactes de visibilité de la localisation d'un utilisateur/d'une annonce.
- Stockage des photos d'annonces — hors périmètre de tout ticket réalisé à ce jour.

**Hébergement et déploiement automatique : réalisés et vérifiés** (Vercel + Render + Supabase,
voir section D) — un push vers `main` déclenche un déploiement réel sur chaque plateforme,
vérifié à de nombreuses reprises (voir section E et journal).

### Périmètre MVP confirmé (TECH-003)

- **MVP = site web responsive uniquement.** Les applications mobiles natives (iOS/Android)
  sont **reportées**, pas abandonnées.
- Technologies retenues : **Next.js + TypeScript** (front-end), **NestJS + TypeScript sur
  Node.js** (back-end), organisées en **deux dépôts GitHub indépendants** (pas de monorepo).
- Back-end organisé en modules (convention NestJS).
- Base de données : **non nécessaire** pour le périmètre TECH-003 (aucune donnée persistée).

## B. Organisation de l'espace de travail

- Dossier de travail (regroupe les deux projets, **sans dépôt Git à ce niveau** — vérifié) :
  chemin local propre à la machine utilisée pendant TECH-001/TECH-002
  (`/Users/aitslimane/vetement/` sur cette machine — un autre poste peut utiliser un autre
  chemin, seul le contenu des deux dépôts fait référence).
- `vetement-front/` — projet front-end (site web + apps iOS/Android). Dépôt Git indépendant.
- `vetement-back/` — projet back-end (API, règles métier, accès aux données). Dépôt Git
  indépendant.
- `vetement-back/docs/CONTEXTE_PROJET.md` — ce fichier, version de référence unique.
- `vetement-back/database/` — dossier prévu pour les futurs fichiers de structure et
  d'évolution de la base de données. Vide de tout fichier de structure à ce jour (contient
  uniquement `database/README.md`).
- `vetement-front/src/app/[locale]/` — routes Next.js par langue (page d'accueil publique,
  page de diagnostic technique) ; `vetement-front/src/i18n/`, `src/messages/` — configuration et
  textes des langues (fr/en/ar) ; `vetement-front/src/components/`, `src/features/home/` —
  composants d'interface (en-tête, pied de page, sections de la page d'accueil) ;
  `vetement-front/src/proxy.ts` — détection de langue et redirection (convention Next.js 16) ;
  `vetement-front/public/images/` — illustrations SVG originales du projet.
  `vetement-front/.github/workflows/ci.yml` — vérifications automatiques (voir section E).
- `vetement-back/src/` — code de l'application NestJS (module `health/` exposant
  `GET /api/health`). `vetement-back/.github/workflows/ci.yml` — vérifications automatiques.

## C. Dépôts Git et accès

Informations vérifiées le **2026-09-07**.

### vetement-front

| Élément | Valeur |
|---|---|
| Compte propriétaire | `aitslimanemohamed-web` (compte GitHub personnel) |
| Nom du dépôt | `vetement-front` |
| URL GitHub | https://github.com/aitslimanemohamed-web/vetement-front |
| Adresse distante (`origin`) | `https://github.com/aitslimanemohamed-web/vetement-front.git` |
| Branche principale | `main` |
| Protocole configuré | HTTPS, via l'identifiant stocké par `gh` (GitHub CLI) — pas de jeton en clair dans la configuration Git |

### vetement-back

| Élément | Valeur |
|---|---|
| Compte propriétaire | `aitslimanemohamed-web` (compte GitHub personnel) |
| Nom du dépôt | `vetement-back` |
| URL GitHub | https://github.com/aitslimanemohamed-web/vetement-back |
| Adresse distante (`origin`) | `https://github.com/aitslimanemohamed-web/vetement-back.git` |
| Branche principale | `main` |
| Protocole configuré | HTTPS, via l'identifiant stocké par `gh` (GitHub CLI) — pas de jeton en clair dans la configuration Git |

### Distinction configuration / lecture / écriture

- **Configuration du dépôt distant** : vérifiée sur les deux dépôts (`git remote -v` confirme
  l'URL `origin` ci-dessus pour chacun).
- **Accès en lecture vérifié** : les deux dépôts ont été clonés avec succès dans un dossier
  temporaire séparé le 2026-09-07, et restituaient exactement les fichiers attendus. Ce
  clonage de vérification a ensuite été supprimé (ce n'était pas un espace de travail à
  conserver).
- **Accès en écriture constaté** : un push réel a réussi sur les deux dépôts le 2026-09-07
  (voir journal, section H, TECH-001 et TECH-002) — ce n'est pas une simple hypothèse déduite
  de l'accès en lecture.

### Procédure de vérification de l'accès (à refaire sur une nouvelle machine ou après expiration)

1. `gh auth status` — confirme si un compte GitHub est authentifié sur la machine courante.
2. Si non authentifié : `gh auth login` (voir CLAUDE.md de chaque dépôt) puis
   `gh auth setup-git` pour que Git utilise cet identifiant lors des `push`/`pull`.
3. Ne pas déduire un droit d'écriture d'un accès en lecture réussi — un push réel (ou au
   minimum `git push --dry-run`) est nécessaire pour confirmer l'écriture.
4. Une nouvelle machine, un jeton révoqué, ou une session `gh` expirée peuvent nécessiter de
   refaire cette procédure — aucun secret n'est stocké dans ce fichier ni ailleurs dans les
   dépôts pour cette raison.

## D. Architecture et services

| Composant | Rôle prévu | État |
|---|---|---|
| Front-end web | Next.js 16 + TypeScript, page d'accueil publique trilingue (US-004) + zone de diagnostic | **Déployé et vérifié en ligne** : https://vetement-front.vercel.app |
| Front-end mobile (iOS/Android) | Applications mobiles | Reporté (hors périmètre MVP) |
| Back-end / API | NestJS 12 + TypeScript sur Node.js — `GET /api/health` | **Déployé et vérifié en ligne** : https://vetement-back.onrender.com/api/health |
| Base de données | PostgreSQL (Supabase) — table `app.users` (US-009) | **Déployée et vérifiée en ligne** — voir sous-section « Base de données » ci-dessous |
| Authentification | Création de compte (nom d'utilisateur + mot de passe) | **Inscription réelle créée** (US-009) — connexion et sessions restent hors périmètre (voir questions ouvertes) |
| Stockage des photos | Hébergement des photos d'annonces | Non créé |
| Hébergement / déploiement | Mise en ligne des services, HTTPS, CI/CD | **Créé et vérifié** — voir sous-section « Hébergement » ci-dessous |

Aucune adresse, aucun fournisseur d'hébergement et aucune configuration ne sont inventés ici :
tant qu'un composant n'a pas été réellement mis en place et vérifié, il reste "Non créé".

### Hébergement (validé par l'utilisateur le 2026-09-07)

| Service | Fournisseur | Adresse | Coût | Limite connue |
|---|---|---|---|---|
| Front-end | Vercel (plan gratuit, intégration Git native) | https://vetement-front.vercel.app | 0 € | — |
| Back-end | Render (plan gratuit, "Web Service") | https://vetement-back.onrender.com | 0 € | **Mise en veille après inactivité** : la première requête après une période sans trafic subit un démarrage à froid (~30–60 s) avant de répondre. |

- Déploiement automatique natif de chaque plateforme sur push vers `main` (pas d'étape de
  déploiement ajoutée dans les workflows GitHub Actions — voir section F).
- Variables d'environnement réelles configurées directement dans les dashboards Vercel/Render
  (jamais commitées) : `NEXT_PUBLIC_API_URL` (front, pointe vers l'API Render) ; `CORS_ORIGIN`
  (back, pointe vers l'URL Vercel réelle), `APP_ENVIRONMENT=test`.
- Vérifié réellement (pas seulement supposé) : `GET /api/health` répond en HTTPS avec le commit
  back déployé ; le front répond en HTTPS et sa zone de diagnostic confirme la communication
  avec le back (CORS accepté pour l'origine Vercel réelle, refusé pour toute autre origine).
- **Incident réel rencontré et corrigé** : une variable d'environnement Render mal nommée
  (`PP_ENVIRONMENT` au lieu de `APP_ENVIRONMENT`) faisait retomber silencieusement l'API sur la
  valeur par défaut `development` au lieu de `test` — diagnostiqué par appel direct à l'API
  (pas par supposition), corrigé en renommant la variable côté Render.
- Version de commit affichée automatiquement à chaque déploiement, sans étape manuelle :
  `RENDER_GIT_COMMIT` (back) / `VERCEL_GIT_COMMIT_SHA` (front), tronqués à 7 caractères.

### Base de données (US-009)

**Choix validé : PostgreSQL hébergé sur Supabase, offre gratuite, pour l'environnement de
test.** Supabase sert uniquement d'hébergeur PostgreSQL — **Supabase Auth n'est pas utilisé**,
l'inscription est gérée entièrement par NestJS. Le navigateur ne se connecte jamais directement
à la base.

**Projet Supabase réel créé le 2026-09-08** (par l'utilisateur, avec l'agent en accompagnement
pas à pas) :

| Élément | Valeur |
|---|---|
| Référence de projet | `kngppdouwvvditlrvrep` |
| Région | Europe (`eu-west-1`) — proche de la région du service Render |
| Hôte du pooler Supavisor | `aws-1-eu-west-1.pooler.supabase.com` |
| Port pooler transaction (app, `DATABASE_URL`) | `6543` (`?pgbouncer=true`) |
| Port pooler session (migrations, `DIRECT_URL`) | `5432` |

Ces références (projet, région, hôte, ports) ne sont pas sensibles — aucun mot de passe ni
chaîne de connexion complète n'est inscrit ici, conformément à la règle du fichier.
**Migrations appliquées et vérifiées sur ce projet réel le 2026-09-08** — voir État réel
(section E) et journal (section H).

**Outil de migrations : [Prisma](https://www.prisma.io/) (`prisma migrate`).** Aucun outil de
migration n'existait avant ce ticket ; Prisma a été choisi pour sa prise en charge native de
PostgreSQL et son historique de migrations versionné et rejouable (`prisma/migrations/`,
table `_prisma_migrations`), qui correspond exactement à l'exigence du ticket. Un seul outil de
migration dans ce dépôt — ne pas en ajouter un second.

**Schéma** : `prisma/schema.prisma` — un seul modèle, `User`, mappé sur la table `app.users`
(schéma Postgres `app`, **pas `public`**) :

| Colonne | Rôle |
|---|---|
| `id` | UUID, généré côté application (Prisma), clé primaire |
| `username` | Nom d'utilisateur normalisé (espaces de bord retirés, NFC), casse d'affichage conservée |
| `username_key` | Clé d'unicité : `username` mis en minuscules indépendamment de la langue, renormalisé en NFC — **contrainte unique en base**, pas une simple vérification préalable |
| `password_hash` | Empreinte Argon2id uniquement — jamais le mot de passe |
| `created_at`, `updated_at` | Horodatages avec fuseau horaire |

Pourquoi le schéma `app` plutôt que `public` : la Data API Supabase (PostgREST) n'expose que le
schéma `public` par défaut, donc `app.users` en est invisible sans configuration
supplémentaire. En défense en profondeur, la migration révoque aussi explicitement tout accès à ce
schéma pour les rôles publics Supabase `anon` et `authenticated` (dans un bloc conditionnel :
ces rôles n'existent pas sur un Postgres local/CI ordinaire, donc la migration reste
utilisable partout).

**Deux connexions distinctes (séparation des droits de migration et d'exécution)**, via le champ
natif `directUrl` de Prisma (pas une bidouille de variable d'environnement) :

| Variable | Rôle Postgres | Utilisée par | Droits |
|---|---|---|---|
| `DIRECT_URL` | Rôle par défaut Supabase (`postgres`), pooler **session** (port 5432) | `prisma migrate deploy` uniquement (lu automatiquement via `datasource.directUrl`), jamais par le serveur en exécution | Création de schéma/table, `GRANT`/`REVOKE` |
| `DATABASE_URL` | `vetement_app` (créé par la migration), pooler **transaction** (port 6543, `?pgbouncer=true`) | Le serveur NestJS en exécution (`datasource.url`) | **`USAGE` sur le schéma `app` + `SELECT`, `INSERT` sur `app.users` uniquement** — vérifié réellement en local (`\dp app.users`), ni `UPDATE` ni `DELETE` |

Format Supabase (recommandation officielle actuelle, cf. le bouton "Connect → ORM → Prisma" du
dashboard du projet — pas la connexion directe non poolée, historiquement recommandée mais plus
la valeur par défaut aujourd'hui) :
```
DATABASE_URL="postgresql://vetement_app.kngppdouwvvditlrvrep:<mot_de_passe_vetement_app>@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.kngppdouwvvditlrvrep:<mot_de_passe_du_projet>@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```
Chiffrement TLS par défaut de Supabase conservé tel quel — **la vérification du certificat n'est
jamais désactivée**.

**Mot de passe du rôle `vetement_app`** : fixé une seule fois, manuellement, via
`ALTER ROLE "vetement_app" WITH PASSWORD '...'` exécuté directement dans l'éditeur SQL Supabase
(ou via `prisma db execute --url ...`) — **jamais écrit dans un fichier versionné** ; la
migration crée le rôle sans mot de passe (`CREATE ROLE ... LOGIN`, sans clause `PASSWORD`). Ce
mot de passe est différent de celui du projet (rôle `postgres`, utilisé par `DIRECT_URL`).

**Commandes** :
```
npm run db:migrate:deploy   # = `prisma migrate deploy` — utilise DIRECT_URL automatiquement
npx prisma generate         # régénère le client (aussi automatique via le script "postinstall")
```
Sur Render : la commande de migration est configurée comme **Pre-Deploy Command** (exécutée
avant que la nouvelle version ne prenne le trafic ; un échec bloque le déploiement — exigence du
ticket) :
```
npx prisma migrate deploy
```

**Règles de normalisation et d'unicité du nom d'utilisateur** (`src/auth/register/username-policy.ts`,
seule source de vérité, à réutiliser telle quelle pour la connexion future) : 3 à 30 caractères,
lettres Unicode + marques diacritiques + chiffres + tiret/tiret bas, au moins une lettre ou un
chiffre, aucun espace interne, espaces de bord retirés, normalisation NFC. Clé d'unicité =
version normalisée, mise en minuscules indépendamment de la langue (`toLowerCase()`, jamais
`toLocaleLowerCase()`), puis renormalisée en NFC. `Karim`, `karim` et `KARIM` partagent la même
clé ; les accents restent significatifs.

**⚠️ Divergence documentée, non résolue unilatéralement** : le ticket back-end (US-009) impose
de compter les caractères en **points de code Unicode** (`Array.from(...).length`), alors que le
ticket front-end (US-007) impose de compter en **grappes de graphèmes** (`Intl.Segmenter`). Les
deux côtés appliquent chacun leur propre règle, explicitement écrite dans leur ticket respectif
— ce n'est pas un oubli. Conséquence concrète : un nom d'utilisateur contenant une marque
diacritique combinante (voyellation arabe, accent latin décomposé) peut être compté
différemment par le front et le back, et pourrait donc être accepté par l'un et refusé par
l'autre dans un cas limite. Signalé ici pour arbitrage explicite par l'utilisateur ; aucune
tentative d'harmonisation silencieuse n'a été faite.

**Politique de mot de passe** (`src/auth/register/password-policy.ts`) : 15 à 128 points de
code Unicode, aucune règle de composition imposée, aucune transformation. Rejet supplémentaire
si le mot de passe figure exactement dans une liste locale de mots de passe courants
(`src/auth/register/common-passwords.ts`, ~50 entrées composées à la main pour cet environnement
de test, provenance et limites documentées dans le fichier lui-même — à remplacer par une source
dédiée avant un lancement réel).

**Hachage** : [argon2](https://www.npmjs.com/package/argon2) (`src/auth/register/hash.service.ts`),
Argon2id, `memoryCost = 19456` Kio (19 Mio), `timeCost = 2`, `parallelism = 1`, sel aléatoire
généré par la bibliothèque à chaque appel — vérifié réellement : deux comptes créés avec le même
mot de passe ont des empreintes différentes, et l'empreinte stockée est correctement vérifiée
avec `argon2.verify()`.

**Contrat de l'API d'inscription** : `POST /api/auth/register`, corps `{ username, password }`
uniquement (propriétés inattendues rejetées, corps limité à 8 Ko).

| HTTP | `status` | Signification |
|---|---|---|
| 201 | `ACCOUNT_CREATED` | Compte créé — réponse limitée à `{ id, username, createdAt }` |
| 400 | `VALIDATION_ERROR` | `fieldErrors: { username?, password? }` avec un code par champ (ex. `USERNAME_LENGTH`), traduisibles côté front |
| 400 | `PASSWORD_TOO_COMMON` | Mot de passe dans la liste locale |
| 409 | `USERNAME_TAKEN` | Contrainte unique violée (vraie violation DB, pas une recherche préalable) |
| 429 | `RATE_LIMITED` | En-tête `Retry-After` inclus |
| 503 | `SERVICE_UNAVAILABLE` | Base injoignable — vérifié réellement (base arrêtée volontairement pendant un test), `GET /api/health` reste inchangé pendant ce temps |
| 500 | `INTERNAL_ERROR` | Erreur inattendue, jamais de détail interne dans la réponse |

Jamais de mot de passe, d'empreinte, de requête SQL ni de trace interne dans une réponse ou un
journal. Réponses non mises en cache (`Cache-Control: no-store`).

**Limitation de requêtes** : 5 tentatives/minute/IP (`@nestjs/throttler`), stockage **en
mémoire** — remis à zéro à chaque redémarrage du serveur, **non partagé si plusieurs instances**
tournaient en parallèle (non applicable au plan Render actuel, une seule instance). Adresse IP
lue via `req.ip`, fiable uniquement parce que `app.set('trust proxy', 1)` est configuré dans
`main.ts` pour le proxy inverse de Render — sans ce réglage, l'IP serait celle du proxy, pas
celle du visiteur, et la limite serait inefficace.

**Gestion des délais Render (plan gratuit)** : le front affiche « Le serveur démarre peut-être,
merci de patienter » après 10 s d'attente, abandonne après 90 s, n'effectue **aucune
nouvelle tentative automatique**, et affiche un message dédié (« nous n'avons pas pu confirmer
la création... ») distinct d'une erreur définitive lorsque la réponse est perdue ou le délai
dépassé — jamais annoncé comme un échec certain. La contrainte unique en base empêche qu'une
telle situation, suivie d'une nouvelle tentative de l'utilisateur, ne crée un second compte.

### Versions réellement installées (vérifié le 2026-09-07)

| Outil / paquet | Version |
|---|---|
| Node.js (poste utilisé pour l'installation) | v23.11.0 |
| npm | 10.9.2 |
| Next.js | 16.3.4 |
| React | 19.2.8 |
| TypeScript (front) | ^5 |
| NestJS (`@nestjs/core`) | ^12.0.1 |
| TypeScript (back) | ^6.0.2 |
| Vitest (tests back) | ^4.1.2 |
| next-intl (routage/traductions front, US-004) | ^4.14.2 |
| Vitest + Testing Library (tests front, US-004) | vitest ^4.1.11, @testing-library/react ^16.3.3 |
| Prisma / @prisma/client (base de données back, US-009) | ^6.19.3 (volontairement pas la 7.x/8.x, qui exigent Node ≥ 20.19/22.12/24 — incompatible avec le Node 23 de ce poste) |
| argon2 (hachage des mots de passe, US-009) | ^0.45.1 |
| @nestjs/throttler (limitation de requêtes, US-009) | ^6.5.0 |
| class-validator / class-transformer (validation des requêtes, US-009) | ^0.15.1 / ^0.5.1 |

**Limite connue** : Node v23 n'est pas une version LTS ; `npm warn EBADENGINE` apparaît lors de
l'installation pour quelques dépendances qui préfèrent Node 20/22/24 LTS. Aucune erreur
bloquante n'en a résulté localement, mais un environnement d'exécution/CI utilisant une version
LTS de Node (20 ou 22) est préférable — c'est ce qui est configuré dans les workflows CI
(`node-version: 22`).

**Bug d'outillage rencontré et contourné** : `npm install` seul échoue de façon reproductible
sur le back-end avec l'erreur `Cannot read properties of null (reading 'edgesOut')` (bug connu
de résolution de dépendances dans `npm`/`@npmcli/arborist`, sans rapport avec le code du
projet). Contournement vérifié : `npm install --legacy-peer-deps` (ou `npm ci
--legacy-peer-deps`, utilisé aussi dans les workflows CI).

## E. État réel du projet

**Terminé et vérifié :**
- **TECH-001** — Espace de travail et dépôts GitHub initialisés. Commits d'initialisation :
  `e3ef547` (vetement-front), `a9c1f6b` (vetement-back).
- **TECH-002** — Fichier de mémoire de référence créé et lié depuis les deux dépôts.
- **TECH-003, partie code** — Next.js et NestJS initialisés et vérifiés en local :
  - Front : page de garde (nom du projet, présentation, badge « Environnement de test »,
    balise `robots: noindex` + `robots.ts`) + zone de diagnostic (`StatusPanel`) qui effectue un
    vrai appel HTTP vers `GET /api/health` (pas de valeur figée), avec délai maximal de 10s et
    sans mise en cache (`cache: 'no-store'`).
  - Back : route publique `GET /api/health` répondant `{status, service, environment, version}`,
    CORS configuré via `CORS_ORIGIN` (env), écoute sur `0.0.0.0:$PORT`.
  - `type-check`, `lint`, `build` (front) et `type-check`, `lint`, `test`, `test:e2e`, `build`
    (back) exécutés localement avec succès (détail en section H).
  - Test d'intégration réel en local (front sur :3100 appelant back sur :3099) : page HTML
    conforme, `robots.txt` renvoie `Disallow: /`, préflight CORS accepté pour l'origine
    autorisée et silencieux (sans en-tête `Access-Control-Allow-Origin`) pour une origine non
    autorisée, `GET /api/health` renvoie bien le commit/environnement passés en variables.
  - Workflows GitHub Actions (`.github/workflows/ci.yml`) ajoutés sur les deux dépôts :
    installation + vérifications + construction sur chaque push/PR vers `main`.
- **TECH-003, partie hébergement et déploiement** — Vercel (front) et Render (back) créés,
  validés par l'utilisateur (fournisseur et coût, 0 €), déployés et vérifiés en HTTPS réel (voir
  section D, sous-section Hébergement, et journal ci-dessous). Déploiement automatique natif de
  chaque plateforme confirmé sur push vers `main`.
- **US-004** — Page d'accueil publique trilingue (français/anglais/arabe) livrée à la place de
  l'ancienne page de garde technique, laquelle est déplacée sur `/<langue>/diagnostic` (toujours
  fonctionnelle, toujours `noindex`). Détail complet en journal ci-dessous.
- **COR-005** — Palette de l'accueil corrigée (thème clair forcé, contrastes mesurés ≥ 4,5:1,
  associations vert/doré supprimées) et les deux illustrations de vêtements remplacées par des
  SVG originaux plus sobres. Détail complet en journal ci-dessous.
- **COR-006** — Motif de fond étoilé (`algerian-pattern.svg`) retiré et supprimé du projet,
  remplacé par un fond uni clair. Règle graphique correspondante ajoutée en section G. Détail
  complet en journal ci-dessous.
- **US-007** — Page d'inscription (`/<langue>/inscription`) avec validation entièrement locale
  (nom d'utilisateur, mot de passe, confirmation), atteignable depuis le bouton Inscription de
  l'accueil désormais activé. Aucun compte réellement créé, aucun appel réseau. Détail complet
  en journal ci-dessous.
- **COR-008** — Débordement horizontal mobile de l'inscription corrigé (cause réelle : bouton
  texte non rétrécissable dans une ligne flex, pas le conteneur) ; boutons afficher/masquer
  remplacés par des icônes œil intégrées au champ, avec zone tactile de 44px. Détail complet en
  journal ci-dessous.
- **US-009** — API d'inscription réelle (`POST /api/auth/register`), NestJS + Prisma +
  PostgreSQL (Supabase) + Argon2id, déployée et vérifiée de bout en bout le 2026-09-08 :
  création réelle, unicité en base sous concurrence réelle, rejet des mots de passe courants,
  limitation de requêtes, dégradation propre (503) si la base est injoignable, et — sur
  l'infrastructure réelle — un vrai compte créé via l'API en ligne avec l'origine Vercel réelle,
  vérifié en base puis nettoyé, et un doublon (exact et variante de casse) refusé (409). Détail
  complet en journal ci-dessous.

**Prévu (pas commencé) :**
- Connexion et sessions (hors périmètre explicite de US-009).
- Vérification de la disponibilité d'un nom d'utilisateur (nécessite un point d'accès dédié,
  volontairement absent de US-009 pour ne pas exposer d'énumération des comptes).
- Récupération de compte sans e-mail ni téléphone (voir question ouverte, section G).
- Page de connexion (le bouton Connexion reste désactivé en attendant).
- Choix du stockage des photos.
- Tout développement fonctionnel (annonces, messagerie...).
- Pages légales/contact et activation du référencement public (hors périmètre de
  l'environnement de test actuel).
- Nom de marque définitif (« Vetement » reste provisoire — voir section G).
- Stratégie de sauvegarde de la base de données (nécessaire avant un lancement réel, pas avant).

**Bloqué :**
- Aucun blocage actif au moment de la rédaction.

**Point de sécurité signalé le 2026-09-08, résolu le même jour** :
- Le mot de passe principal du projet Supabase (rôle `postgres`) était passé une fois dans la
  conversation avec l'agent lors de la mise en place initiale. **Réinitialisé par
  l'utilisateur** depuis le dashboard Supabase (Project Settings → Database → "Reset database
  password"), puis `DIRECT_URL` mis à jour sur Render en conséquence — vérifié fonctionnel
  ensuite (`GET /api/health` et `POST /api/auth/register` inchangés, un compte réel créé avec
  succès après la rotation). Note technique : une tentative de l'agent de faire cette rotation
  directement en SQL (`ALTER ROLE "postgres" ...`) a échoué avec `permission denied to alter
  role` — Supabase réserve visiblement cette opération à son propre mécanisme de dashboard,
  inaccessible en SQL direct même avec le rôle `postgres`. Le mot de passe du rôle applicatif
  `vetement_app`, lui, a été généré et fixé directement par l'agent sans jamais transiter en
  clair dans un message de l'utilisateur.

## F. Reprise du travail

1. Lire ce fichier (`CONTEXTE_PROJET.md`) et le ticket à traiter.
2. Retrouver les deux dépôts (`vetement-front`, `vetement-back`) — sur cette machine, sous le
   même dossier de travail parent (section B) ; sur une autre machine, les cloner depuis les
   URL de la section C.
3. Dans chaque dépôt concerné, vérifier la branche courante et l'absence de changements locaux
   non commités (`git status`) avant toute action — ne jamais écraser des modifications locales
   existantes ni changer de branche sans les avoir d'abord examinées.
4. Vérifier les accès nécessaires (section C, procédure de vérification) avant de tenter un
   push.
5. Lire le `README.md` et le `CLAUDE.md` du ou des dépôts concernés par le ticket.
6. Identifier la prochaine action autorisée par le ticket en cours — ne pas entreprendre une
   action hors de son périmètre explicite.

**Commandes disponibles depuis TECH-003** (voir aussi le `README.md` de chaque dépôt) :

Front-end (`vetement-front/`) :
```
npm install
npm run dev          # développement local, http://localhost:3000
npm run type-check
npm run lint
npm test              # tests ciblés (sélecteur de langue, actions désactivées)
npm run build
npm run start         # démarre la version construite
```

Back-end (`vetement-back/`) :
```
npm install
npm run start:dev     # développement local, http://localhost:3001
npm run type-check
npm run lint
npm test              # tests unitaires
npm run test:e2e      # tests end-to-end
npm run build
npm run start:prod    # démarre dist/main.js
```

**Déploiement** : automatique, natif à chaque plateforme (Vercel pour le front, Render pour le
back) sur push vers `main` — aucune commande manuelle, aucune étape ajoutée dans les workflows
CI (section D, sous-section Hébergement).

## G. Décisions et questions ouvertes

### Décisions prises (avec date et raison)

| Date | Décision | Raison |
|---|---|---|
| 2026-09-07 | Nom du projet : **vetement** (dossier de travail local initialement nommé "vinted", renommé) | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Noms des dépôts : `vetement-front` / `vetement-back` (forme courte, pas `-frontend`/`-backend`) | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Dépôts hébergés sur le compte GitHub personnel `aitslimanemohamed-web`, en visibilité **publique** | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Pas de monorepo, pas de 3e dépôt pour la base de données, pas de sous-module Git | Choix explicite du ticket TECH-001. |
| 2026-09-07 | Mémoire de référence unique, versionnée dans `vetement-back/docs/CONTEXTE_PROJET.md` | Choix explicite du ticket TECH-002, pour éviter une copie dupliquée dans un 3e emplacement. |
| 2026-09-07 | MVP limité au site web responsive ; applications mobiles reportées | Choix technique confirmé dans le ticket TECH-003. |
| 2026-09-07 | Front-end : Next.js + TypeScript. Back-end : NestJS + TypeScript sur Node.js, organisé en modules | Choix technique confirmé dans le ticket TECH-003. |
| 2026-09-07 | Pas de base de données pour le périmètre TECH-003 | Choix technique confirmé dans le ticket TECH-003. |
| 2026-09-07 | Hébergement : **Vercel** (front, gratuit) + **Render** (back, plan gratuit) | Validé explicitement par l'utilisateur après proposition (coût 0 €, limite de mise en veille du plan gratuit Render acceptée en connaissance de cause). |
| 2026-09-07 | **next-intl** ajouté comme dépendance pour le routage et les traductions (US-004) | Bibliothèque de référence pour l'App Router de Next.js ; couvre nativement le routage par langue, la persistance par cookie et le rendu RTL exigés par le ticket. |
| 2026-09-07 | Nom de marque « **Vetement** » utilisé à titre **provisoire** sur la page publique (US-004) | Aucun nom de marque définitif n'existait dans le contexte au moment du ticket ; réutilise le nom déjà choisi pour les dépôts (section G, décision du nom de projet). À remplacer si une marque définitive est validée plus tard. |
| 2026-09-07 | Une seule police (Cairo, via `next/font/google`) pour tout le site, latin et arabe | Évite un changement de police perceptible (et le décalage de mise en page associé) lors du changement de langue ; auto-hébergée au build, sans dépendance réseau externe à l'exécution. |
| 2026-09-07 | Thème **clair forcé** sur l'accueil pour cette version, y compris quand le système est en mode sombre (`color-scheme: light`, plus de bloc `@media (prefers-color-scheme: dark)`) | Demandé explicitement par l'utilisateur (COR-005) après un rendu jugé trop sombre sur téléphone. Origine identifiée par vérification directe du code (pas supposée) : uniquement un bloc CSS `@media (prefers-color-scheme: dark)` dans `src/styles/tokens.css` — aucun mécanisme JavaScript, aucun attribut `data-theme` n'existe dans ce projet. |
| 2026-09-07 | Nouvelle palette claire (vert `#006233`/`#004d28`, blanc cassé `#f8faf9`, vert très pâle `#eaf4ee`, rouge `#c62828` ponctuel, gris `#d8e2dc`) remplace l'ancienne palette sable/doré | Corrige les associations vert-sur-doré peu lisibles signalées par l'utilisateur ; contrastes mesurés (voir section H, COR-005) : minimum 5,36:1 sur les paires texte/fond réellement utilisées, objectif ≥ 4,5:1 tenu. |
| 2026-09-07 | Motifs géométriques répétés (étoiles) retirés des fonds de section, remplacés par des fonds unis | Demandé explicitement par l'utilisateur (COR-006) — voir la règle graphique ci-dessous, qui remplace la décision TECH-003/US-004 d'utiliser un motif géométrique décoratif inspiré du zellige. |
| 2026-09-07 | Inscription (US-007) : **nom d'utilisateur + mot de passe** uniquement, pas d'e-mail/téléphone/connexion tierce | Choix explicite du ticket US-007. Politique du mot de passe (15-128 caractères, pas de composition imposée) alignée sur la [recommandation OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) citée par le ticket, privilégiant la longueur sans second facteur. |
| 2026-09-07 | Comptage des caractères par **grappe de graphèmes Unicode** (`Intl.Segmenter`, repli sur `Array.from`) côté front (US-007) | Une lettre de base + une marque diacritique combinante (voyellation arabe, accent latin décomposé) doit compter comme un seul caractère pour l'utilisateur. **Non reproduit côté back** : voir la décision suivante et la divergence documentée en section D. |
| 2026-09-08 | Icônes œil/œil barré du mot de passe : **SVG original dessiné pour le projet**, aucune bibliothèque d'icônes ajoutée | Choix explicite du ticket COR-008 (« bibliothèque déjà présente, ou SVG simple » — aucune bibliothèque d'icônes n'était présente) ; évite une dépendance supplémentaire pour deux icônes. |
| 2026-09-08 | Base de données : **PostgreSQL sur Supabase, offre gratuite** (US-009) | Choix explicite du ticket US-009. Supabase sert uniquement d'hébergeur PostgreSQL — Supabase Auth volontairement non utilisé, l'inscription est gérée par NestJS (exigence explicite du ticket). |
| 2026-09-08 | **Prisma** ajouté comme outil de migrations et ORM | Choix explicite requis par le ticket ("réutiliser l'outil existant, sinon en choisir un") ; aucun outil de migration n'existait avant ce ticket. Support natif de PostgreSQL et historique de migrations versionné correspondant exactement à l'exigence du ticket. |
| 2026-09-08 | Comptage des caractères en **points de code Unicode** (`Array.from`, pas grappes de graphèmes) côté back (US-009) | Choix explicite et littéral du ticket back-end, qui diffère volontairement de la règle front (US-007, ci-dessus). Divergence signalée à l'utilisateur pour arbitrage plutôt que réconciliée silencieusement — voir section D et questions ouvertes. |
| 2026-09-08 | Rôle Postgres applicatif (`vetement_app`, droits minimaux) distinct du rôle de migration | Exigence explicite du ticket ("séparer les droits de migration et d'exécution lorsque possible") ; vérifié réellement en local (`SELECT`+`INSERT` uniquement sur `app.users`). |
| 2026-09-08 | CI (GitHub Actions) : ajout d'un conteneur Postgres jetable pour exécuter réellement les migrations et les tests end-to-end à chaque push | Les garanties les plus sensibles de US-009 (contrainte unique sous concurrence réelle, permissions du rôle applicatif) ne peuvent pas être vérifiées de façon fiable avec une base simulée ; ce conteneur est détruit à la fin de chaque exécution, sans lien avec Supabase. |
| 2026-09-08 | Connexions Prisma via le champ natif `directUrl` (`DIRECT_URL`) plutôt qu'une variable `MIGRATE_DATABASE_URL` maison, et pooler Supavisor (transaction/session) plutôt qu'une connexion directe non poolée | Alignement sur la recommandation Supabase actuelle, découverte via le bouton "Connect → ORM" du dashboard réel du projet au moment de sa création — Supabase ne présente plus la connexion directe comme le choix par défaut. |

### Règle graphique à mémoriser (COR-006, 2026-09-07)

> L'utilisateur ne souhaite pas de motifs étoilés répétés en décoration de fond. Privilégier
> des fonds unis et clairs. Cette décision remplace la précédente proposition de motifs
> géométriques pour ces arrière-plans.

Cette règle annule et remplace la décision US-004 d'utiliser un motif géométrique répété
(`algerian-pattern.svg`, étoile à huit branches inspirée du zellige) comme fond décoratif de
la section « Les vêtements à découvrir ». Ce fichier a été supprimé du projet (voir journal
COR-006) : ne pas le recréer, ni le remplacer par un autre symbole ou motif décoratif répété.
Les fonds de section utilisent désormais uniquement les couleurs unies de la palette (section
D/G, décision de la palette claire COR-005) — pas de nouvelle image de fond sans validation
explicite de l'utilisateur.

### Questions ouvertes (aucune solution proposée ici ne vaut décision)

- **Connexion et sessions** : mécanisme non choisi (JWT ? cookies de session ?) — hors périmètre
  explicite de US-009, nécessaire pour que le bouton Connexion cesse d'être désactivé.
- **Comment récupérer un compte sans e-mail ni téléphone ?** (soulevée explicitement par
  US-007 puis à nouveau par US-009, toujours aucune réponse proposée — à trancher avant le
  ticket de connexion).
- Comment vérifier la disponibilité d'un nom d'utilisateur avant soumission (US-009 expose
  volontairement l'inscription sans route de ce type, pour ne pas permettre l'énumération des
  comptes existants — un point d'accès dédié, limité en fréquence, resterait à concevoir si ce
  besoin est confirmé).
- **Divergence de comptage Unicode front/back** (points de code vs grappes de graphèmes) —
  documentée en section D, non résolue unilatéralement, à arbitrer explicitement.
- **Sauvegardes de la base de données** : aucune stratégie définie — pas requis pour
  l'environnement de test actuel, mais bloquant avant un lancement réel.
- **Évolution des offres gratuites** (Supabase, Render) : aucun engagement de coût pris au-delà
  de la validation initiale (0 €) — à revoir si les limites gratuites sont atteintes (lignes,
  connexions simultanées, mise en veille).
- Quel hébergement pour le stockage des photos (hors périmètre actuel) ?
- Quelle durée exacte avant expiration d'une réservation ?
- Quels rayons/filtres de recherche géographique exacts ?
- Quelles options exactes de visibilité de la localisation ?
- Le mobile sera traité dans un ticket ultérieur — modalités non définies.

## H. Journal des interventions

### 2026-09-07 — TECH-001 — Préparer l'espace de travail et les deux dépôts GitHub

- **Dépôts concernés** : vetement-front, vetement-back (création).
- **Résultat** : dossier de travail créé (`vetement/`, sans dépôt Git à ce niveau — vérifié) ;
  2 dépôts Git locaux initialisés sur `main` puis reliés à 2 dépôts GitHub publics créés sur le
  compte `aitslimanemohamed-web` ; fichiers `README.md`, `CLAUDE.md`, `.gitignore`,
  `.editorconfig` (+ `database/README.md` côté back) créés et commités.
- **Vérifications effectuées** : dossier parent confirmé hors Git ; contenu de chaque dépôt
  conforme au périmètre demandé (aucun framework, secret, ou code applicatif) ; clonage
  indépendant des 2 dépôts testé avec succès puis nettoyé ; push réel réussi sur les 2 dépôts
  (confirme l'accès en écriture, pas seulement en lecture).
- **Blocage rencontré puis levé** : `gh` non authentifié en début d'intervention — résolu via
  `gh auth login` (authentification par navigateur) puis `gh auth setup-git`.
- **Commits** : `e3ef547` (front, initial), `04d976a` (front, ajout des liens croisés après
  création des 2 dépôts) ; `a9c1f6b` (back, initial), `8657cbf` (back, ajout des liens croisés).
- **Travail restant** : aucun pour ce ticket — périmètre complet livré.

### 2026-09-07 — TECH-002 — Créer la mémoire du projet et ses règles de mise à jour

- **Dépôts concernés** : vetement-back (création de `docs/CONTEXTE_PROJET.md`) ; vetement-front
  et vetement-back (mise à jour de `README.md` et `CLAUDE.md` pour pointer vers ce fichier).
- **Résultat** : ce fichier créé avec les sections A à H remplies à partir de vérifications
  réelles (pas d'information inventée — les points non vérifiables sont marqués "À définir" ou
  "Non créé").
- **Vérifications effectuées** : informations Git de la section C confirmées par
  `git remote -v` sur les 2 dépôts au moment de la rédaction ; aucune information secrète
  incluse.
- **Blocage** : voir la livraison de cette intervention pour le résultat du push documentaire.
- **Travail restant** : néant pour ce ticket. Les questions ouvertes (section G) restent à
  trancher par l'utilisateur avant les prochains tickets techniques.

### 2026-09-07 — TECH-003 — Initialiser le front et le back, automatiser le déploiement (partiel)

- **Dépôts concernés** : vetement-front (initialisation Next.js, page de garde, zone de
  diagnostic, CI) ; vetement-back (initialisation NestJS, route `/api/health`, CORS, CI) ; ce
  fichier et les deux `README.md`.
- **Résultat réalisé et vérifié** :
  - Next.js 16 + TypeScript initialisé dans `vetement-front` (historique et documentation
    existants préservés — aucun fichier écrasé).
  - NestJS 12 + TypeScript initialisé dans `vetement-back`, même précaution.
  - Page de garde conforme au ticket : nom du projet, présentation courte, badge « Environnement
    de test », zone de diagnostic avec vrai appel réseau (pas de valeur figée), délai 10s,
    `cache: 'no-store'`, bouton "Vérifier à nouveau", les 3 états (connexion en cours / serveur
    opérationnel / serveur indisponible) implémentés et testés manuellement en local.
  - `GET /api/health` conforme au ticket (`status`, `service`, `environment`, `version`), testé
    par 2 tests automatisés (unitaire + e2e) et par un appel réel (`curl`).
  - CORS configuré par variable d'environnement (`CORS_ORIGIN`), vérifié réellement : origine
    autorisée -> en-tête `Access-Control-Allow-Origin` présent ; origine non autorisée -> absent.
  - `noindex` en place (métadonnées Next.js + `robots.ts` générant `/robots.txt: Disallow: /`),
    vérifié par `curl`. Documenté comme n'étant pas un contrôle d'accès.
  - `.env.example` créés dans les deux dépôts, variables expliquées, aucune valeur réelle.
    Variable front `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_APP_VERSION` identifiées comme exposées au
    navigateur (documenté explicitement) ; variables back (`PORT`, `CORS_ORIGIN`,
    `APP_ENVIRONMENT`, `APP_VERSION`) réservées au serveur.
  - `.gitignore` des deux dépôts complétés pour Node.js/Next.js/NestJS (`node_modules/`, `.next/`,
    `dist/`, `coverage/`, `*.tsbuildinfo`...) en plus des règles de secrets déjà présentes.
  - Workflows CI (`.github/workflows/ci.yml`) ajoutés sur les deux dépôts : installation
    (`npm ci --legacy-peer-deps`), `type-check`, `lint`, tests (back), `build`, déclenchés sur
    push/PR vers `main`. **Étape de déploiement volontairement absente à ce stade.**
  - Un bug d'outillage réel (`npm install` seul échoue avec `Cannot read properties of null
    (reading 'edgesOut')`, bug connu de `npm`/`arborist`, sans rapport avec le projet) a été
    identifié et contourné avec `--legacy-peer-deps` — documenté en section D.
  - Un test e2e généré par défaut par le CLI NestJS (`test/app.e2e-spec.ts`) importait
    `supertest/types`, un sous-chemin non résolu par la version installée de `@types/supertest`
    sous `moduleResolution: nodenext` — corrigé en retirant cette dépendance de typage inutile
    (comportement du test inchangé).
  - Une règle ESLint stricte (`react-hooks/set-state-in-effect`) a nécessité de restructurer la
    zone de diagnostic pour suivre le modèle documenté par React (effet + fonction async interne
    + drapeau d'annulation), sans changer le comportement fonctionnel.
- **Vérifications effectuées (toutes réussies)** : `type-check`, `lint`, `build` (front) ;
  `type-check`, `lint`, `test`, `test:e2e`, `build` (back) ; démarrage réel des 2 serveurs en
  local et vérification bout-en-bout (page HTML, `robots.txt`, préflight CORS, réponse
  `/api/health`).
- **Non réalisé au moment de la rédaction initiale** : le choix et la mise en place de
  l'hébergement — voir l'entrée de journal suivante pour sa réalisation effective une fois la
  validation utilisateur obtenue.

### 2026-09-07 — TECH-003 (suite) — Hébergement Vercel + Render

- **Dépôts concernés** : aucun changement de code ; configuration côté dashboards Vercel et
  Render, plus mise à jour de ce fichier.
- **Résultat réalisé et vérifié** : proposition d'hébergement (Vercel front / Render back, 0 €)
  validée explicitement par l'utilisateur via un choix présenté avec alternatives. Services
  créés, connectés aux dépôts GitHub existants, déploiement automatique natif confirmé sur push.
  Variables d'environnement réelles configurées dans chaque dashboard (jamais commitées) :
  `NEXT_PUBLIC_API_URL` côté Vercel, `CORS_ORIGIN` et `APP_ENVIRONMENT=test` côté Render.
- **Vérifications effectuées (par appel réel, pas par supposition)** : `curl` direct sur
  `https://vetement-back.onrender.com/api/health` (200, `status: ok`) ; préflight et requête
  CORS réels depuis l'origine Vercel (en-tête `Access-Control-Allow-Origin` présent seulement
  pour cette origine) ; chargement réel de `https://vetement-front.vercel.app` (200).
- **Incident rencontré et corrigé** : variable Render mal nommée `PP_ENVIRONMENT` (au lieu de
  `APP_ENVIRONMENT`) — l'API retombait silencieusement sur `environment: "development"`.
  Diagnostiqué en comparant deux appels `curl` successifs (pas en supposant qu'un nouveau
  déploiement identique avait changé quoi que ce soit), confirmé par la liste réelle des
  variables fournie par l'utilisateur, corrigé en renommant la variable.
- **Limite documentée** : plan gratuit Render — mise en veille après inactivité, ~30–60 s de
  démarrage à froid sur la requête suivante. Connue et acceptée par l'utilisateur.
- **Travail restant** : aucun pour la partie hébergement de TECH-003 — périmètre livré.

### 2026-09-07 — US-004 — Page d'accueil publique, responsive et trilingue

- **Dépôt concerné** : vetement-front uniquement (aucune modification métier du back-end, comme
  prévu par le ticket) ; ce fichier et le `README.md`/`CLAUDE.md` de vetement-front.
- **Résultat réalisé et vérifié** :
  - Routage par langue avec **next-intl** (nouvelle dépendance, justifiée en section G) :
    `/fr`, `/en`, `/ar` (`localePrefix: 'always'`), langue par défaut française, choix mémorisé
    par cookie (persiste après actualisation et lors d'une prochaine visite), une langue dans
    l'URL prime toujours sur le cookie mémorisé. `/` redirige vers la langue mémorisée ou `/fr`.
    Une langue non supportée dans l'URL (ex. `/de`) est traitée comme un chemin sous la langue
    par défaut et aboutit à une page 404 standard Next.js — comportement cohérent, pas d'erreur
    serveur (vérifié par `curl`).
  - Convention **Next.js 16** respectée : fichier `src/proxy.ts` (export nommé `proxy`), pas
    `middleware.ts` (dépréciée, avertissement de build constaté puis supprimé après migration).
  - Page d'accueil assemblée à partir de composants dédiés : `Header` (logo, ancre « Comment ça
    marche ? », `LanguageSwitcher`, boutons Connexion/Inscription réellement `disabled` avec
    légende visible « Bientôt disponible », pas seulement une infobulle), `Hero`, `HowItWorks`
    (3 étapes), `ListingsPlaceholder` (état d'attente honnête : aucun appel réseau, aucune
    fausse annonce/prix/vendeur), `Footer` (mention « Version de test »).
  - Arabe en RTL réel : `<html lang="ar" dir="rtl">` posé dans `src/app/[locale]/layout.tsx`
    (vérifié par `curl`), mise en page construite avec des propriétés CSS logiques pour suivre
    automatiquement le sens de lecture ; logo et illustrations non retournés.
  - Identité visuelle propre au projet (vert profond, blanc cassé/sable, rouge utilisé avec
    parcimonie ; police Cairo unique couvrant latin et arabe, chargée via `next/font/google`
    donc auto-hébergée au build — aucune dépendance réseau externe à l'exécution) ; trois
    illustrations SVG **originales, créées pour ce projet** (`public/images/`, aucun asset
    externe ni photographie de tiers) : motif géométrique répété inspiré du zellige, illustration
    de vêtements pour le hero, cintre pour l'état d'attente des annonces.
  - Zone de diagnostic technique de TECH-003 déplacée vers `/<langue>/diagnostic` (inchangée
    fonctionnellement, toujours `noindex`, non traduite — outil interne, pas une page produit).
  - Textes centralisés dans `src/messages/{fr,en,ar}.json` (aucun texte dispersé dans les
    composants), incluant les libellés d'accessibilité (`aria-label` des boutons/nav) et les
    métadonnées de page (titre/description traduits par langue).
  - Nom de marque « Vetement » utilisé à titre provisoire (voir section G).
- **Tests et vérifications effectués (tous réussis)** :
  - `npm run type-check`, `npm run lint` (0 erreur, 2 avertissements bénins sur l'usage de
    `<img>` pour des SVG décoratifs), `npm test` (nouveaux tests Vitest + Testing Library :
    sélecteur de langue — 3 langues présentes, langue active correctement marquée, chaque lien
    cible sa propre langue ; boutons désactivés — réellement `disabled`, légende visible sans
    survol, aucun clic possible), `npm run build`.
  - Vérification locale réelle (serveur construit démarré sur le port 3100) : redirection `/` →
    `/fr` (307), `lang`/`dir` corrects sur `/fr`, `/en`, `/ar`, titres traduits, `/de` → 404
    cohérent, `/fr/diagnostic` accessible (200), `robots.txt` toujours `Disallow: /`, un seul
    `<h1>` par page, boutons Connexion/Inscription réellement `disabled` dans le HTML rendu.
  - Vérification en ligne après push et déploiement Vercel réel (pas seulement locale) : mêmes
    contrôles rejoués sur `https://vetement-front.vercel.app` (redirection, `lang`/`dir`,
    `/fr/diagnostic`, `robots.txt`, boutons désactivés) — tous conformes.
  - **Non vérifié par l'agent** (nécessite un navigateur réel, hors de portée des outils
    disponibles) : rendu visuel effectif aux largeurs 360/390/768/1440 px, navigation clavier
    complète à la souris/au clavier physique, contraste mesuré par un outil dédié, captures
    d'écran ordinateur/téléphone demandées par le ticket. À vérifier par l'utilisateur ou lors
    d'une prochaine intervention outillée pour cela.
- **Commit** : `515cdac` (vetement-front).
- **Travail restant** : vérification visuelle multi-largeurs et captures d'écran (voir
  ci-dessus) ; le reste du périmètre US-004 est livré.

### 2026-09-07 — COR-005 — Couleurs, contrastes et illustrations de l'accueil

- **Correction demandée par l'utilisateur** : rendu de l'accueil jugé trop sombre et peu
  lisible sur téléphone (badges vert sur fond doré, boutons désactivés estompés), et grande
  illustration de vêtements jugée peu moderne (tunique/pantalon sur un large disque).
- **Dépôt concerné** : vetement-front uniquement (aucune modification back-end, comme prévu).
- **Origine des couleurs sombres — vérifiée avant toute correction, pas supposée** : lecture
  directe du code a confirmé un unique mécanisme, `@media (prefers-color-scheme: dark)` dans
  `src/styles/tokens.css` (redéfinissant les variables de couleur) combiné à
  `color-scheme: dark` dans `src/app/globals.css` (couleurs des contrôles natifs du
  navigateur). Aucun thème JavaScript, aucun attribut `data-theme`, aucune extension tierce
  identifiable dans le code n'intervient. La page technique `/<langue>/diagnostic` conserve
  son propre mode sombre indépendant (hors périmètre de ce ticket, non touché).
- **Résultat réalisé et vérifié** :
  - Nouvelle palette centralisée dans `src/styles/tokens.css` (seul emplacement des couleurs ;
    aucune couleur codée en dur dans les composants) : voir la table de décision en section G
    pour les valeurs exactes. Bloc sombre supprimé — le thème clair s'applique désormais que le
    système soit clair ou sombre. `color-scheme: light` forcé dans `globals.css`, sans modifier
    aucun réglage du navigateur de la personne qui visite le site.
  - Toutes les associations vert-sur-doré corrigées : badge « La seconde main en Algérie »
    (`Hero.module.css`), badge « Version de test » (`Footer.module.css`, fond passé au blanc
    pour rester visible sur le pied de page désormais vert très pâle), numéros des étapes
    « Comment ça marche ? » (`HowItWorks.module.css`), langue sélectionnée
    (`LanguageSwitcher.module.css`, texte vert foncé + soulignement conservé comme repère). Les
    liens (« Comment ça marche ? » de l'en-tête, « Retour en haut » du pied de page) passent au
    vert foncé.
  - Boutons Connexion/Inscription (`DisabledActionButton.module.css`) : suppression de la
    réduction d'opacité globale (qui délavait le texte en même temps que le fond, cassant son
    propre contraste) au profit de couleurs dédiées à l'état désactivé (fond gris clair du
    thème + texte gris soutenu) — légende « Bientôt disponible » inchangée, toujours visible
    sans survol.
  - Deux illustrations SVG entièrement redessinées (`public/images/hero-clothing.svg`,
    `public/images/listings-hanger.svg`), **originales, créées pour ce projet** (aucun asset
    externe, aucune photographie, aucun logo tiers) : un vêtement sur cintre au premier plan
    avec une seconde pièce légèrement en arrière-plan, proportions simples et contours nets,
    fond transparent (plus de grand disque opaque), petite touche de rouge ponctuelle. Le
    pictogramme des annonces reprend la même famille graphique (même épaisseur de trait, même
    palette, fond très pâle), sans plus aucune couleur dorée. Motif géométrique décoratif
    (`algerian-pattern.svg`) recoloré pour rester cohérent avec la nouvelle palette.
  - Illustration principale réduite sur téléphone (largeur ramenée à 55 %, 220px max contre
    320px avant) pour ne plus occuper l'essentiel de la hauteur d'écran, comme demandé.
- **Contrastes mesurés (calcul WCAG réel, formule de luminance relative, pas une estimation
  visuelle)** — objectif du ticket : ≥ 4,5:1 :

  | Paire | Contraste |
  |---|---|
  | Texte vert foncé `#004d28` sur vert très pâle `#eaf4ee` (badges, langue active) | 8,93:1 |
  | Titres `#17231d` sur fond `#f8faf9` / cartes blanches | 15,47:1 / 16,22:1 |
  | Texte secondaire `#4b5c52` sur fond `#f8faf9` / blanc | 6,79:1 / 7,11:1 |
  | Texte blanc sur bouton vert actif `#006233` / survol `#004d28` | 7,51:1 / 10,04:1 |
  | Liens verts foncés `#004d28` sur blanc / fond | 10,04:1 / 9,58:1 |
  | Bouton désactivé « primary » : texte `#4b5c52` sur fond `#d8e2dc` | 5,36:1 |
  | Bouton désactivé « secondary » : texte `#4b5c52` sur blanc (fond transparent) | 7,11:1 |

  Toutes les paires dépassent l'objectif de 4,5:1 ; la plus proche (bouton désactivé
  « primary ») reste à 5,36:1.
- **Vérifications effectuées** : `npm run type-check`, `npm run lint` (0 erreur, mêmes 2
  avertissements bénins déjà connus sur l'usage de `<img>`), `npm test` (6 tests existants
  toujours verts, comportement inchangé), `npm run build`. Recherche explicite de résidus de
  l'ancienne palette (`grep` sur le CSS compilé, local puis en ligne) : aucun. Vérification
  réelle en local (serveur construit) puis en ligne sur Vercel après déploiement : CSS compilé
  contient bien la nouvelle palette et `color-scheme: light`, aucun bloc
  `prefers-color-scheme` restant pour l'accueil, redirection de langue, RTL arabe, page
  `/fr/diagnostic`, `robots.txt` et boutons désactivés tous inchangés et fonctionnels.
  - **Non vérifié par l'agent** (nécessite un navigateur réel avec contrôle visuel humain, hors
    de portée des outils disponibles) : rendu visuel effectif aux largeurs 360/390/768/1440 px,
    apparence réelle avec le système en mode sombre sur un vrai téléphone, captures d'écran
    ordinateur/téléphone (dont une version mobile en arabe) demandées par le ticket. Les calculs
    de contraste ci-dessus sont réels (formule WCAG appliquée aux couleurs effectivement
    utilisées dans le CSS compilé), mais ne remplacent pas un contrôle visuel humain sur
    appareil réel.
- **Commit** : `3bb8e3e` (vetement-front).
- **Travail restant** : captures d'écran et contrôle visuel humain multi-appareils (voir
  ci-dessus) ; le reste du périmètre COR-005 est livré.

### 2026-09-07 — COR-006 — Suppression des motifs étoilés du fond de page

- **Correction demandée par l'utilisateur** : motif étoilé répété visible en fond de la
  section « Les vêtements à découvrir » jugé indésirable — l'utilisateur souhaite des fonds
  unis et clairs, sans motif décoratif répété.
- **Dépôt concerné** : vetement-front uniquement.
- **Identification, pas supposition** : recherche explicite (`grep` sur tout le code source,
  hors `node_modules`) de toute référence à `algerian-pattern.svg` — une seule occurrence
  trouvée, dans `src/features/home/ListingsPlaceholder.module.css`
  (`background-image: url('/images/algerian-pattern.svg')`, motif répété en `background-size:
  48px 48px`). Aucune autre section, composant ou style n'utilisait ce fichier ou un motif
  similaire.
- **Résultat réalisé et vérifié** :
  - Le fond de cette section utilise désormais une couleur unie de la palette existante
    (`var(--color-bg)`, blanc cassé `#f8faf9`) au lieu de l'image répétée.
  - Le fichier `public/images/algerian-pattern.svg`, devenu inutilisé après vérification de
    ses usages, a été supprimé du dépôt (pas seulement débranché du CSS).
  - Aucun autre motif ou symbole décoratif répété n'a été ajouté à la place, conformément à la
    règle graphique désormais consignée en section G.
  - Disposition, cartes, illustrations de vêtements (cintre + vêtement redessinés en COR-005),
    textes, palette claire et fonctionnalités (langues, RTL, boutons désactivés, diagnostic
    séparé, déploiement automatique, `noindex`) inchangés.
- **Vérifications effectuées** : `npm run type-check`, `npm run lint` (0 erreur, mêmes 2
  avertissements bénins déjà connus), `npm test` (6 tests toujours verts), `npm run build`.
  Recherche répétée du motif dans le CSS compilé (local puis en ligne) : aucune occurrence.
  Vérification en ligne réelle après déploiement Vercel : `GET
  https://vetement-front.vercel.app/images/algerian-pattern.svg` → 404 (fichier bien retiré du
  déploiement), CSS compilé de `/fr` sans référence au motif, `/en` et `/ar` toujours 200,
  `dir="rtl"` toujours correct sur `/ar`, boutons Connexion/Inscription toujours réellement
  `disabled`, illustration du cintre (`listings-hanger.svg`) toujours servie normalement.
  - **Non vérifié par l'agent** (nécessite un navigateur réel) : confirmation visuelle humaine
    de l'absence du motif sur ordinateur et téléphone dans les trois langues, et capture
    d'écran après correction demandées par le ticket.
- **Commit** : `83c894a` (vetement-front).
- **Travail restant** : confirmation visuelle humaine et capture d'écran (voir ci-dessus) ; le
  reste du périmètre COR-006 est livré.

### 2026-09-07 — US-007 — Page d'inscription (validation locale, sans back-end)

- **Dépôt concerné** : vetement-front uniquement — aucun appel réseau, donc aucune modification
  back-end, conformément au ticket.
- **Résultat réalisé et vérifié** :
  - Route `/<langue>/inscription` (`/fr`, `/en`, `/ar`), ouvrable directement et par
    actualisation, avec sa propre traduction complète et son propre titre de page.
  - Bouton **Inscription** de l'accueil activé (`Header.tsx`) : c'est désormais un vrai lien
    vers cette page dans la langue courante, sans mention « Bientôt disponible ». Le bouton
    **Connexion** reste désactivé — sa page n'existe pas dans ce ticket.
  - Organisation en `src/features/auth/registration/` : `validation.ts` (règles pures, sans
    JSX, réutilisables/documentées pour le futur back-end), `PasswordField.tsx` (champ mot de
    passe réutilisable avec bouton afficher/masquer accessible, `type="button"`),
    `RegistrationForm.tsx` (assemble les 3 champs et gère la soumission). Un `AuthHeader.tsx`
    dédié (logo, sélecteur de langue, retour à l'accueil) remplace le `Header` marketing complet
    sur cette page — pensé pour être réutilisé par la future page de connexion.
  - **Nom d'utilisateur** : 3 à 30 caractères (voir méthode de comptage ci-dessous), lettres
    Unicode (latines accentuées, arabes) + marques diacritiques + chiffres + tiret/tiret bas,
    aucun espace interne accepté, espaces de début/fin ignorés pour la validation uniquement
    (la valeur affichée n'est jamais modifiée). `spellcheck` et mise en majuscule automatique
    désactivés, `autocomplete="username"`, aide de format toujours visible. Aucune vérification
    de disponibilité — jamais de message « Nom disponible » (question ouverte, section G).
  - **Mot de passe** : 15 à 128 caractères, espaces/Unicode/symboles autorisés, aucune règle de
    composition imposée, aucun `maxLength` (pas de troncature silencieuse), aucun trim. Collage
    et gestionnaires de mots de passe fonctionnels, `autocomplete="new-password"`. Bouton
    afficher/masquer dédié, accessible au clavier.
  - **Confirmation** : doit correspondre exactement (espaces et casse compris), recalculée en
    direct si le mot de passe change (les erreurs sont dérivées à chaque rendu, pas mises en
    cache), son propre bouton afficher/masquer.
  - **Comptage des caractères** : `countCharacters()` dans `validation.ts` utilise
    `Intl.Segmenter` (grappes de graphèmes), pas `.length` (unités UTF-16) ni un simple
    `Array.from` (points de code seuls) — une lettre de base + une marque diacritique combinante
    (voyellation arabe, accent latin décomposé) compte pour UN caractère. Repli sur
    `Array.from` si `Intl.Segmenter` est indisponible. Méthode documentée dans le code et à
    reproduire à l'identique côté back-end (voir décision, section G).
  - **Validation et messages** : aucune erreur à l'ouverture d'un formulaire vide ; une erreur
    apparaît après la sortie d'un champ (`onBlur`) ou une tentative de soumission, puis se met
    à jour en direct pendant la correction (les erreurs sont recalculées à chaque rendu à partir
    des valeurs courantes). Les 8 messages français du ticket sont repris mot pour mot ;
    traductions anglaise et arabe propres (pas de traduction automatique brute).
  - **Soumission** : le bouton « S'inscrire » reste actif même formulaire incomplet (sert à
    déclencher les erreurs) ; `preventDefault` empêche tout rechargement ; en cas d'erreur, le
    focus va sur le premier champ invalide dans l'ordre nom → mot de passe → confirmation ; si
    tout est valide, un message local (`role="status"`, `aria-live="polite"`) apparaît : « Le
    formulaire est valide. La création de compte sera disponible prochainement. Aucun compte
    n'a été créé. » — jamais « Inscription réussie », aucune session simulée, aucune
    redirection. Les deux champs de mot de passe sont effacés juste après (le nom d'utilisateur
    est conservé).
  - **Aucune valeur transmise nulle part** : aucun `fetch`, Server Action ou appel API dans tout
    le composant — vérifié par lecture du code ET par un test qui espionne `globalThis.fetch`
    et vérifie qu'il n'est jamais appelé après une soumission valide. Aucune valeur écrite dans
    l'URL, un cookie, `localStorage`/`sessionStorage`, la console ou un outil d'analyse (aucun
    de ces mécanismes n'existe dans le composant).
  - **« Déjà un compte ? Se connecter »** : reste une action désactivée (réutilise
    `DisabledActionButton`) avec la légende « Bientôt disponible » traduite — pas de lien mort,
    la page de connexion n'existe pas encore.
  - **Retour à l'accueil** : le logo et le lien dédié de `AuthHeader` ouvrent explicitement
    l'accueil dans la langue courante, y compris quand l'inscription a été ouverte directement.
  - **Accessibilité** : libellés associés (`htmlFor`/`id`), `aria-invalid` sur les champs en
    erreur, erreurs reliées par `aria-describedby`, focus visible (règle globale existante),
    aucune erreur signalée uniquement par la couleur (un texte d'erreur accompagne toujours la
    bordure rouge). Champ nom d'utilisateur en `dir="auto"` pour s'adapter au contenu arabe ou
    latin saisi. RTL vérifié sur `/ar/inscription` (`dir="rtl"` sur `<html>`).
- **Tests et vérifications effectués (tous réussis)** :
  - Nouveaux tests : `validation.test.ts` (règles pures : comptage par grappes de graphèmes sur
    un exemple arabe et un exemple latin décomposé, longueurs limites 3/30 et 15/128, espace
    interne rejeté, espaces de bord ignorés, correspondance de confirmation) et
    `RegistrationForm.test.tsx` (aucune erreur au chargement, erreur après `blur`, erreurs +
    focus au premier champ invalide sur soumission vide, mot de passe trop court, confirmation
    invalide puis re-validée en direct après correction du mot de passe, bascule
    afficher/masquer, message de succès + champs mot de passe vidés + `fetch` jamais appelé,
    action « Se connecter » toujours désactivée). 38 tests au total, tous verts.
  - `npm run type-check`, `npm run lint` (0 erreur), `npm run build` (route générée pour les 3
    langues) — tous réussis localement.
  - Vérification réelle en ligne après déploiement Vercel : `/fr`, `/en`, `/ar/inscription`
    répondent 200, `dir="rtl"` correct sur `/ar`, titres traduits, lien Inscription de l'accueil
    pointe réellement vers `/fr/inscription`, bouton Connexion toujours désactivé partout,
    `autocomplete="new-password"` présent sur les deux champs de mot de passe, `robots.txt`
    toujours `Disallow: /`.
  - **Non vérifié par l'agent** (nécessite un navigateur réel avec contrôle visuel/tactile
    humain, hors de portée des outils disponibles) : affichage réel sur ordinateur et téléphone,
    captures d'écran demandées par le ticket, navigation clavier complète à la main (Tab/Entrée)
    sur un vrai clavier physique.
- **Commit** : `5c19e54` (fonctionnalité), `5d82345` (README) — vetement-front.
- **Travail restant** : contrôle visuel humain et captures d'écran (voir ci-dessus) ; le reste
  du périmètre US-007 est livré. Rappel explicite : l'inscription n'est connectée à aucun
  back-end — un futur ticket devra créer le service d'authentification réel, la vérification de
  disponibilité du nom d'utilisateur, la récupération de compte, et la page de connexion.

### 2026-09-08 — COR-008 — Débordement mobile de l'inscription et icônes œil

- **Problème constaté** : débordement horizontal visible sur téléphone sur la page
  d'inscription (capture fournie par l'utilisateur), formulaire non centré.
- **Dépôt concerné** : vetement-front uniquement.
- **Cause identifiée par lecture du code, pas supposée** : dans `PasswordField.module.css`,
  `.inputRow` était une ligne flex (`display:flex`) contenant le champ (`flex:1`) et un bouton
  texte (`.toggle`) avec `white-space: nowrap` portant un libellé long (« Afficher la
  confirmation du mot de passe »). Un élément flexible ne rétrécit pas, par défaut, en dessous
  de la largeur de son contenu non coupé (`min-width: auto`) : ce bouton refusait de rétrécir,
  ce qui poussait la ligne — et donc la page — en dehors de la largeur de l'écran sur mobile.
  Aucun autre composant du site n'était en cause.
- **Résultat réalisé et vérifié** :
  - Les deux boutons afficher/masquer texte sont remplacés par une icône œil / œil barré
    (SVG original dessiné pour ce projet, aucune bibliothèque ajoutée, aucun emoji), en position
    absolue **à l'intérieur** du contour du champ (`inset-inline-end`, qui s'inverse seul en
    arabe : icône à droite en fr/en, à gauche en ar — vérifié en ligne). Le nom accessible passe
    par `aria-label` (« Afficher/Masquer le mot de passe », « Afficher/Masquer la confirmation
    du mot de passe », traduits) puisqu'il n'y a plus de texte visible ; le dessin SVG est
    `aria-hidden` pour éviter une double annonce au lecteur d'écran.
  - Zone tactile de 44×44px réelle (bouton `width:44px`, inséré à 2px des bords d'un champ en
    `min-height:48px`), fond transparent par défaut, focus visible (règle globale existante),
    fonctionne au clic et au clavier (bouton natif `type="button"`, jamais de soumission), ne
    déplace jamais la mise en page (position absolue, ne pousse aucun autre élément), conserve
    la valeur saisie (le changement de visibilité ne touche qu'un état local d'affichage).
  - Les trois champs (nom d'utilisateur, mot de passe, confirmation) partagent désormais
    exactement la même largeur (`width:100%`), la même hauteur minimale (`min-height:48px`) et
    la même taille de texte (`font-size:1rem`, ≥16px — évite le zoom automatique de Safari iOS
    tout en conservant le zoom utilisateur, qui n'est bloqué nulle part sur le site). Le champ
    de mot de passe réserve l'espace de l'icône via `padding-inline-end` (le texte saisi ne
    passe jamais dessous, quelle que soit la langue).
  - Bouton « S'inscrire » désormais pleine largeur du formulaire (`align-self: stretch`).
  - Conteneur du formulaire inchangé dans son principe (centré, max 480px, marges latérales
    24px, resserrées à 16px sous 380px de large) : le problème ne venait pas du conteneur mais
    du contenu d'un champ, comme identifié ci-dessus. Aucun `overflow-x: hidden` supplémentaire
    n'a été ajouté pour masquer le symptôme.
- **Vérifications effectuées (toutes réussies)** : `npm run type-check`, `npm run lint`
  (0 erreur), `npm test` (40 tests, dont 2 nouveaux couvrant l'activation clavier de l'icône et
  l'indépendance des deux bascules afficher/masquer), `npm run build`. Lecture directe du CSS
  compilé (local puis en ligne sur Vercel) confirmant : bouton `width:44px` en position absolue
  avec `inset-inline-end:2px`, `padding-inline:.8rem 3rem` réservé sur les champs de mot de
  passe, `min-height:48px` et `font-size:1rem` sur les trois champs, bouton d'inscription en
  `align-self:stretch`. Vérification en ligne réelle : aucun texte visible « Afficher... »
  (seulement dans les `aria-label`), traductions anglaise et arabe des `aria-label` correctes
  sur `/en` et `/ar/inscription`, `dir="rtl"` toujours correct, les 3 langues répondent 200.
  - **Non vérifié par l'agent** (nécessite un navigateur réel avec contrôle visuel humain, hors
    de portée des outils disponibles) : absence réelle de défilement horizontal aux largeurs
    320/360/390/768/1440px, apparence effective sur téléphone (dont les captures demandées en
    français et en arabe), confort tactile réel des icônes, comportement du clavier virtuel
    mobile à l'ouverture d'un champ.
- **Commit** : `87af400` (vetement-front).
- **Travail restant** : contrôle visuel humain multi-largeurs et captures d'écran (voir
  ci-dessus) ; le reste du périmètre COR-008 est livré.

### 2026-09-08 — US-009 — Créer réellement les comptes (code prêt, infrastructure Supabase à venir)

- **Dépôts concernés** : vetement-back (API, base de données, migrations) et vetement-front
  (formulaire raccordé) ; ce fichier et les README des deux dépôts.
- **Important, à ne pas présenter comme plus terminé que ça ne l'est** : tout le code de ce
  ticket est écrit et vérifié par des tests réels contre une **vraie base PostgreSQL locale
  (Docker, jetable, jamais Supabase)** — pas des simulations. Ce qui n'a **pas** encore été
  fait : créer le projet Supabase réel, y appliquer les migrations, configurer les variables
  secrètes sur Render, déployer, et exécuter la recette en ligne demandée par le ticket
  (création d'un compte fictif depuis Vercel, vérification en base, refus d'un doublon). Cette
  partie dépend d'actions que seul l'utilisateur peut effectuer (création de compte/projet
  Supabase, accès au dashboard Render) — voir le prochain ticket ou la suite de cette
  intervention pour son achèvement.
- **Résultat réalisé et vérifié (localement, contre une vraie base Postgres)** :
  - Schéma Prisma (`prisma/schema.prisma`), migration initiale versionnée
    (`prisma/migrations/20260907224808_init/migration.sql`) créant le schéma `app` (pas
    `public`), la table `app.users`, la contrainte unique sur `username_key`, puis révoquant
    l'accès au schéma pour `PUBLIC` et (si présents — blocs conditionnels) `anon`/`authenticated`,
    et créant le rôle applicatif `vetement_app` avec uniquement `USAGE` sur le schéma et
    `SELECT`+`INSERT` sur `app.users`. Rejouée depuis zéro avec succès
    (`prisma migrate deploy`) ; permissions effectives vérifiées avec `\dp app.users` (résultat
    réel : `vetement_app=ar/postgres`, c'est-à-dire uniquement INSERT+SELECT).
  - `POST /api/auth/register` : DTO volontairement permissif au niveau du pipe de validation
    global (`@IsOptional()` seulement) pour que ce soit `RegisterService`, et non le pipe
    Nest par défaut, qui produise le contrat de réponse exact du ticket — **un vrai bug trouvé
    et corrigé pendant les tests** (un corps vide déclenchait initialement le format d'erreur
    générique de Nest, pas `{status:'VALIDATION_ERROR', fieldErrors}`).
  - Règles de nom d'utilisateur et de mot de passe implémentées exactement comme spécifié par
    ce ticket (voir section D) — y compris le comptage en **points de code**, différent du
    comptage en **grappes de graphèmes** du front (US-007), divergence documentée et signalée,
    pas corrigée silencieusement.
  - Liste locale de mots de passe courants (`common-passwords.ts`), ~50 entrées composées à la
    main pour l'environnement de test, provenance documentée dans le fichier.
  - Hachage Argon2id (`memoryCost=19456` Kio, `timeCost=2`, `parallelism=1`) — vérifié
    réellement : deux comptes créés avec le même mot de passe ont des empreintes différentes
    (sel aléatoire confirmé), et `argon2.verify()` confirme/rejette correctement.
  - **Un vrai bug de comptage de la limitation de requêtes trouvé et corrigé** : une garde de
    limitation posée à la fois globalement (`APP_GUARD`) et sur la route (`@UseGuards` +
    `@Throttle`) comptait chaque requête deux fois (`X-RateLimit-Remaining` passait de 5 à 3
    après une seule requête). Diagnostiqué en lisant les en-têtes de la réponse réelle, pas
    supposé ; corrigé en retirant la garde globale.
  - Limitation de requêtes vérifiée réellement : 6 requêtes rapides déclenchent un `429` avec
    `{status:'RATE_LIMITED'}` et un en-tête `Retry-After` (valeur observée cohérente,
    décroissante).
  - **Concurrence réelle vérifiée** (pas supposée) : 5 requêtes identiques envoyées en parallèle
    avec `curl ... &` puis `wait` → exactement 1 `201 ACCOUNT_CREATED`, le reste en `409`/`429` ;
    confirmé directement en base (`SELECT count(*) ... = 1`). C'est la contrainte unique de la
    base qui empêche le doublon, pas une vérification préalable (qui aurait laissé une fenêtre
    de course).
  - **Panne de base simulée réellement** (conteneur Postgres arrêté puis relancé pendant le
    test) : `POST /api/auth/register` répond `503 SERVICE_UNAVAILABLE` proprement,
    `GET /api/health` continue de répondre normalement pendant ce temps (PrismaService ne se
    connecte pas au démarrage du module, seulement à la première requête réelle).
  - Noms d'utilisateur arabes et accentués testés réellement de bout en bout (`محمد_2026`,
    `Émilie-Dupont`), clés d'unicité vérifiées en base (`محمد_2026` inchangé — pas de casse en
    arabe ; `émilie-dupont` en minuscules pour la version accentuée).
  - Front : `RegistrationForm` envoie désormais un vrai appel à `POST /api/auth/register`
    (`register-api.ts`, testé isolément), gère les 8 issues possibles (succès, erreur de champ,
    nom pris, mot de passe courant, limite de requêtes, service indisponible, erreur
    inattendue, résultat inconnu par timeout/échec réseau — jamais confondu avec une erreur
    définitive), désactive le bouton et affiche « Création du compte… » pendant la requête,
    affiche l'indication de démarrage à froid après 10s, abandonne après 90s sans nouvelle
    tentative automatique. Bandeau d'information remplacé par le texte du ticket. Icônes
    œil, traductions, responsive et validations locales de US-007/COR-008 conservés.
  - CI (`.github/workflows/ci.yml`, vetement-back) : ajout d'un service Postgres jetable, des
    étapes d'application des migrations et de fixation du mot de passe du rôle applicatif, puis
    exécution réelle des tests end-to-end contre cette base — vérifié en relisant le résultat
    des nouvelles étapes, pas seulement écrit.
- **Tests ajoutés (tous exécutés avec succès)** :
  - Unitaires (43 au total, back) : règles de nom d'utilisateur et mot de passe (dont comptage
    par points de code sur un exemple arabe et un exemple latin décomposé), hachage Argon2id
    réel (pas de mock), `RegisterService` avec Prisma/hachage simulés pour les branches
    d'erreur (violation d'unicité, base injoignable, erreur inattendue).
  - End-to-end (12 au total, back, contre la vraie base Postgres locale) : création réussie
    avec vérification directe en base, refus d'un corps vide/d'une propriété inattendue/d'un
    type incorrect, refus d'un mot de passe courant, refus d'un doublon exact et d'une variante
    de casse, acceptation de noms arabes/accentués, **concurrence réelle (une seule création
    sur 3 requêtes identiques simultanées)**, limitation de requêtes avec `Retry-After`.
  - Front (53 au total) : dont un client d'API testé isolément (chaque code de statut
    documenté, corps malformé, échec réseau, URL d'API absente) et le formulaire avec un vrai
    mock de `fetch` (succès, nom pris, résultat inconnu en cas d'échec réseau, bouton désactivé
    pendant la requête).
  - `type-check`, `lint`, `build` : propres sur les deux dépôts.
  - **Non vérifié par l'agent** (nécessite l'infrastructure réelle, pas encore créée) : recette
    complète en ligne (étapes 1 à 8 du ticket, section 14) — création d'un compte fictif depuis
    le site Vercel réel, vérification dans la vraie base Supabase, refus d'un doublon en
    production, comportement réel du démarrage à froid de Render avec la base connectée.
- **Commits** : vetement-back `ea8adc4` ; vetement-front `1b68ba6` — poussés depuis (voir
  l'entrée suivante pour la suite et la partie infrastructure, terminée le même jour).

### 2026-09-08 — US-009 (suite) — Infrastructure Supabase créée, recette en ligne complète

- **Dépôts concernés** : vetement-back uniquement (configuration d'hébergement, aucun nouveau
  code applicatif).
- **Déroulé, accompagné pas à pas avec l'utilisateur** (création de compte Supabase, création
  du projet — région Europe/`eu-west-1` —, récupération des chaînes de connexion via le bouton
  "Connect → ORM" du dashboard réel, ajout des variables sur Render).
- **Ajustement technique fait pendant cette étape** : le dashboard Supabase réel recommandait un
  mécanisme différent de celui prévu initialement (pooler Supavisor + champ `directUrl` natif de
  Prisma, plutôt qu'une connexion directe et une variable `MIGRATE_DATABASE_URL` maison) — voir
  la décision correspondante en section G et le commit `1daca8e`.
- **Résultat réalisé et vérifié (sur le vrai projet Supabase, pas une simulation)** :
  - Migrations appliquées avec succès (`prisma migrate deploy` contre `DIRECT_URL` réel).
  - Vérifié directement en base (requêtes SQL réelles, pas supposé) : schéma `app` présent,
    table `app.users` présente, rôle `vetement_app` créé, permissions effectives = exactement
    `SELECT`+`INSERT` sur `app.users` (confirmé), et **aucun** droit pour `anon`/`authenticated`/
    `PUBLIC` sur ce schéma (confirmé, liste vide).
  - Mot de passe du rôle `vetement_app` généré aléatoirement et fixé par l'agent (24 octets
    aléatoires, encodage base64url) — jamais choisi ni transmis par l'utilisateur.
  - `DATABASE_URL` (rôle applicatif, pooler transaction) et `DIRECT_URL` (rôle privilégié,
    pooler session) configurées comme variables secrètes sur Render.
  - **Recette en ligne complète (section 14 du ticket, toutes les étapes)** : back-end
    redéployé avec succès (dépendances natives — Prisma, argon2 — compilées sans problème sur
    Render) ; `POST /api/auth/register` testé en HTTPS réel avec l'en-tête `Origin` de
    l'application Vercel réelle → compte créé (`201 ACCOUNT_CREATED`), vérifié directement dans
    la vraie base Supabase (ligne présente, empreinte Argon2id valide), puis un doublon exact et
    une variante de casse tous deux refusés (`409 USERNAME_TAKEN`). Les comptes de test créés
    pendant cette vérification ont été supprimés ensuite (via le rôle privilégié, le rôle
    applicatif ne pouvant pas supprimer — vérifié aussi : une tentative de suppression avec
    `vetement_app` échoue bien).
  - `GET /api/health` vérifié inchangé pendant toute l'opération.
- **Incident de sécurité mineur et sa gestion** : le mot de passe principal du projet Supabase
  (rôle `postgres`) a été collé une fois par l'utilisateur directement dans la conversation, à
  la suite d'une incompréhension sur la façon de le transmettre sans passer par le chat.
  L'agent l'a utilisé une seule fois puis a immédiatement recommandé sa réinitialisation (voir
  section E) plutôt que de le conserver ou de continuer à s'en servir. Une seconde tentative de
  l'agent de fixer un mot de passe (celui du rôle applicatif, pas celui du projet) a été bloquée
  par un garde-fou de sécurité automatique de l'environnement d'exécution ; l'agent s'est arrêté,
  a expliqué la situation à l'utilisateur et a attendu une autorisation explicite avant de
  réessayer — conformément à la consigne de ne jamais contourner ce type de blocage.
- **Non vérifié par l'agent** (nécessite un navigateur réel) : passage effectif par le
  formulaire d'inscription du site Vercel lui-même (souris/clavier, écran réel) plutôt que par
  un appel direct à l'API reproduisant les mêmes en-têtes — le comportement de l'API étant
  identique dans les deux cas, ceci reste une vérification complémentaire, pas contradictoire.
- **Travail restant pour US-009** : aucun côté infrastructure. US-009 est terminé.

### 2026-09-08 — US-009 (clôture) — Rotation du mot de passe Supabase confirmée

- **Dépôt concerné** : aucun changement de code ; configuration Supabase/Render et mise à jour
  de ce fichier.
- **Résultat** : l'utilisateur a réinitialisé le mot de passe principal du projet Supabase
  (rôle `postgres`) depuis le dashboard Supabase, puis mis à jour `DIRECT_URL` sur Render.
  Vérifié réellement après coup : `GET /api/health` inchangé, et un nouveau compte réel créé
  avec succès via `POST /api/auth/register` (origine Vercel réelle), doublon ensuite refusé
  (`409`) — la rotation n'a rien cassé, comme attendu (`DIRECT_URL` ne sert qu'aux migrations,
  jamais à l'application en fonctionnement).
- **Conséquence pour la suite** : l'agent n'a plus accès à `DIRECT_URL` (nouveau mot de passe
  non transmis, volontairement). Toute future migration ou opération nécessitant le rôle
  privilégié Supabase demandera à nouveau l'intervention de l'utilisateur pour fournir l'accès,
  selon la même procédure que la première fois (section D).
- **Comptes de test restés en base après cette clôture** (fictifs, sans donnée sensible autre
  qu'une empreinte de mot de passe de test) : `Cloture-Session-Check` (créé pendant cette
  dernière vérification) et potentiellement `Verif-Post-Rotation` (créé juste après la
  rotation). Ni l'un ni l'autre ne peut être supprimé par le rôle applicatif `vetement_app`
  (pas de droit `DELETE`, par conception) ; leur suppression demande un accès `DIRECT_URL`, que
  l'agent n'a plus. À nettoyer par l'utilisateur si souhaité (éditeur SQL Supabase :
  `DELETE FROM app.users WHERE username IN ('Cloture-Session-Check', 'Verif-Post-Rotation');`),
  sans urgence.
- **Travail restant** : aucun pour US-009. Voir la section « Reprise à la prochaine session »
  ci-dessous pour la suite du projet.

## I. Reprise à la prochaine session

Rédigé le 2026-09-08, à la clôture volontaire de la session de travail (le projet sera repris
plus tard, éventuellement par un autre intervenant humain ou IA). **Vérifié en direct au moment
de la rédaction** (pas supposé) : les deux dépôts sont propres (`git status` sans changement,
aucun commit local non poussé), les deux CI GitHub Actions les plus récentes sont vertes, le
front répond en HTTPS, `GET /api/health` répond avec le dernier commit, et une inscription
réelle suivie d'un refus de doublon fonctionnent en ligne à l'instant de la rédaction.

### Où nous nous sommes arrêtés

**Aucun ticket n'est en cours.** Le dernier ticket traité (US-009 — créer réellement les
comptes) est **terminé et vérifié de bout en bout**, infrastructure réelle comprise : base
Supabase créée, migrée, connectée ; inscription réelle fonctionnelle en ligne, avec refus de
doublon et dégradation propre si la base est indisponible. La rotation de sécurité qui a suivi
(voir journal, section H) est elle aussi terminée et vérifiée. Le projet est dans un état stable
et entièrement poussé — une prochaine session peut commencer un nouveau ticket sans reprise de
travail interrompu.

### Dernier travail réalisé et son résultat

1. US-009 (fonctionnalité) : inscription réelle (`POST /api/auth/register`) écrite, testée
   contre une vraie base Postgres locale, puis déployée et re-vérifiée contre le vrai projet
   Supabase — résultat : succès complet, recette en ligne du ticket exécutée intégralement.
2. Rotation du mot de passe principal Supabase (incident mineur de sécurité, un mot de passe
   passé une fois dans la conversation) — résultat : réinitialisé par l'utilisateur, re-vérifié
   fonctionnel.

### Branches et commits utiles

Un seul environnement de travail par dépôt : branche `main`, pas d'autre branche active dans
aucun des deux dépôts au moment de la rédaction.

| Dépôt | Dernier commit | Résumé |
|---|---|---|
| vetement-back | `9d541af` | docs: close out the session — reconcile stale status, add resume section (dernier commit fonctionnel avant celui-ci : `6e5a1c5`, rotation du mot de passe Supabase documentée) |
| vetement-front | `1b68ba6` | feat(US-009): connect the registration form to the real API |

**À la reprise, ne pas se fier uniquement à ce tableau** : exécuter `git log -1 --oneline` dans
chaque dépôt pour confirmer le commit réellement présent, et comparer avec le commit affiché en
ligne (`GET /api/health` pour le back, l'en-tête ou le contenu de page pour le front) pour
s'assurer que le déploiement correspond bien au dernier commit poussé.

### Changements encore locaux ou non poussés

**Aucun**, vérifié au moment de la rédaction (`git status` propre sur les deux dépôts, branche
`main` alignée avec `origin/main`). Le seul fichier local non versionné est
`vetement-back/.env` (secrets de développement local, correctement ignoré par Git) — son
contenu pointe vers un conteneur Docker PostgreSQL local qui a été arrêté et supprimé à la fin
de cette session ; il faudra en recréer un (ou ajuster `.env`) pour retester en local avec une
vraie base avant la prochaine intervention nécessitant `npm run test:e2e` en local.

### Problèmes connus (non bloquants, à garder en tête)

- **Divergence de comptage Unicode front/back** (grappes de graphèmes côté front US-007, points
  de code côté back US-009) — documentée en section D et G, jamais arbitrée. Risque limité à des
  noms d'utilisateur contenant des marques diacritiques combinantes.
- **Deux comptes de test résiduels** dans la vraie base Supabase (`Cloture-Session-Check`,
  potentiellement `Verif-Post-Rotation`) — fictifs, sans donnée sensible, suppressibles
  uniquement via un accès privilégié (`DIRECT_URL`) que l'agent n'a plus (voir ci-dessous).
- **L'agent n'a plus accès à `DIRECT_URL`** (mot de passe Supabase tourné par l'utilisateur,
  volontairement non retransmis). Toute opération nécessitant le rôle privilégié (nouvelle
  migration, nettoyage direct en base) demandera de refournir cet accès, avec la même prudence
  que la première fois (ne jamais coller de secret dans la conversation ; utiliser le fichier
  `.env` local ou une autorisation explicite au cas par cas).
- **Limitation de requêtes en mémoire, une seule instance** : redémarre à zéro à chaque
  redéploiement Render ; non partagé si l'offre venait à inclure plusieurs instances (pas le cas
  actuellement).
- **Mise en veille Render (plan gratuit)** : ~30–60 s de démarrage à froid après une période
  d'inactivité — géré côté front (indication après 10 s, abandon après 90 s) mais reste une
  gêne perçue par un visiteur réel.
- **Aucune vérification visuelle par un vrai navigateur n'a jamais été faite par l'agent**, sur
  aucun ticket, faute d'outil disponible dans cet environnement (captures d'écran, rendu
  multi-largeurs, confort tactile réel, comportement du clavier virtuel mobile) — signalé
  systématiquement dans chaque entrée de journal concernée plutôt que supposé correct. À vérifier
  par un humain sur un vrai appareil avant de considérer l'interface pleinement validée.

### Règles visuelles à respecter dans toute future intervention front

- **Thème clair forcé**, y compris si le système est en mode sombre (décision COR-005) — ne pas
  réintroduire de bloc `@media (prefers-color-scheme: dark)` sur l'accueil/l'inscription sans
  validation explicite de l'utilisateur.
- **Contrastes** : viser au moins 4,5:1 pour tout texte, y compris les petits libellés/badges ;
  ne jamais signaler un état (erreur, désactivé) uniquement par la couleur.
- **Aucun motif de fond répété** (étoiles ou autre symbole décoratif répété) — règle explicite de
  l'utilisateur (COR-006, section G) ; fonds unis uniquement, sauf validation contraire explicite.
- **Formulaires responsives** : conteneur centré ~480px max, marges 16–24px, champs de largeur
  identique, texte ≥16px (évite le zoom iOS), pas de bouton texte non rétrécissable dans une
  ligne flex (cause réelle du bug corrigé en COR-008).
- **Icônes œil intégrées** dans les champs de mot de passe (position absolue, zone tactile
  44×44px, `aria-label` traduit, jamais de texte visible ni d'emoji) — motif à reproduire pour
  tout futur champ de mot de passe (page de connexion, etc.).

### Prochaines étapes proposées (aucune commencée)

Par ordre plausible, sans engagement — à confirmer par l'utilisateur avant de commencer l'une
d'entre elles :
1. Décider du mécanisme de connexion/session (JWT ? cookie de session ?), puis créer la page et
   l'API de connexion (le bouton Connexion de l'accueil est prêt, juste désactivé).
2. Décider d'une méthode de récupération de compte sans e-mail ni téléphone (question ouverte
   posée par deux tickets consécutifs, jamais tranchée).
3. Décider si un point d'accès de vérification de disponibilité du nom d'utilisateur est
   nécessaire (compromis avec le risque d'énumération des comptes, volontairement évité jusqu'ici).
4. Arbitrer la divergence de comptage Unicode front/back.
5. Premier développement fonctionnel produit (annonces) une fois l'authentification complète.

### Décisions à demander à l'utilisateur avant de poursuivre

- Toutes les questions listées en section G ("Questions ouvertes") restent sans réponse —
  les relire avant de proposer un prochain ticket.
- Nettoyer ou laisser les comptes de test résiduels dans Supabase (voir ci-dessus) ?
- Choix du mécanisme de connexion/session (question technique structurante pour tout le reste).
- Le nom de marque « Vetement » reste-t-il provisoire indéfiniment, ou une marque définitive
  doit-elle être fixée avant de poursuivre le développement produit ?

### Rappel

Ce fichier documente des accès (GitHub, Vercel, Render, Supabase) qui étaient valides à la date
de rédaction ci-dessus. **Aucune garantie qu'ils le soient encore à la prochaine session** — un
jeton peut expirer, un mot de passe peut avoir été changé entre-temps (comme celui de Supabase
pendant cette session même). Revérifier systématiquement avant de supposer un accès acquis
(section C, procédure de vérification).
