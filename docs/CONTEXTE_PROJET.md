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
- Méthode(s) d'authentification (email/mot de passe, réseaux sociaux, téléphone... — à définir).
- Recherche : rayons de recherche géographique et fonctions de filtrage/recherche exactes.
- Règles détaillées de réservation (durée exacte d'expiration, comportement en cas de refus...).
- Options exactes de visibilité de la localisation d'un utilisateur/d'une annonce.
- Hébergement (front-end, back-end, base de données, stockage photos) — **non validé** (voir
  section D et journal TECH-003 : proposition en attente de validation par l'utilisateur,
  notamment côté coût).

**Besoin exprimé, en partie mis en œuvre** : un déploiement automatique doit se déclencher après
un push. Les vérifications automatiques (CI) existent depuis TECH-003 sur les deux dépôts ; le
déploiement effectif dépend du choix d'hébergement, non encore validé — voir section E.

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
| Base de données | Stockage des annonces, utilisateurs, messages... | Non créée (non nécessaire pour le périmètre actuel) |
| Authentification | Vérification d'identité des utilisateurs | Non créée — méthode non choisie |
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

**Prévu (pas commencé) :**
- Conception de la base de données.
- Choix de la méthode d'authentification.
- Choix du stockage des photos.
- Tout développement fonctionnel (annonces, comptes, messagerie...).
- Pages légales/contact et activation du référencement public (hors périmètre de
  l'environnement de test actuel).
- Nom de marque définitif (« Vetement » reste provisoire — voir section G).

**Bloqué :**
- Aucun blocage actif au moment de la rédaction.

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

### Questions ouvertes (aucune solution proposée ici ne vaut décision)

- Quel système d'authentification ?
- Quel hébergement pour la base de données et le stockage des photos (hors périmètre TECH-003) ?
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
