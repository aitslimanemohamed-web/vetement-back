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
- `vetement-front/src/app/` — code de l'application Next.js (page de garde, composants,
  configuration `robots.ts`). `vetement-front/.github/workflows/ci.yml` — vérifications
  automatiques (voir section E).
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
| Front-end web | Next.js 16 + TypeScript — page de garde + zone de diagnostic | **Créé, fonctionne en local** ; pas encore déployé en ligne |
| Front-end mobile (iOS/Android) | Applications mobiles | Reporté (hors périmètre MVP) |
| Back-end / API | NestJS 12 + TypeScript sur Node.js — `GET /api/health` | **Créé, fonctionne en local** ; pas encore déployé en ligne |
| Base de données | Stockage des annonces, utilisateurs, messages... | Non créée (non nécessaire pour TECH-003) |
| Authentification | Vérification d'identité des utilisateurs | Non créée — méthode non choisie |
| Stockage des photos | Hébergement des photos d'annonces | Non créé |
| Hébergement / déploiement | Mise en ligne des services, HTTPS, CI/CD | **Non créé — fournisseur non validé** (voir journal TECH-003 : proposition présentée, en attente de décision utilisateur, notamment sur le coût) |

Aucune adresse, aucun fournisseur d'hébergement et aucune configuration ne sont inventés ici :
tant qu'un composant n'a pas été réellement mis en place et vérifié, il reste "Non créé".

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
    installation + vérifications + construction sur chaque push/PR vers `main`. **Ne contiennent
    pas encore d'étape de déploiement.**

**En cours / en attente de décision utilisateur :**
- **TECH-003, partie hébergement et déploiement** — **non réalisée.** Le ticket exige une
  validation explicite du fournisseur d'hébergement et de tout engagement financier avant
  création de services externes ; cette validation n'a pas encore été obtenue au moment de la
  rédaction. Tant que ce point n'est pas tranché : pas d'adresse HTTPS publique, pas de
  déploiement automatique réel, pas de démonstration "depuis un téléphone" possible.

**Prévu (pas commencé) :**
- Conception de la base de données.
- Choix de la méthode d'authentification.
- Choix du stockage des photos.
- Étape de déploiement des workflows CI (dépend du choix d'hébergement).
- Tout développement fonctionnel (annonces, comptes, messagerie...).

**Bloqué :**
- Hébergement/déploiement de TECH-003 — en attente de validation utilisateur (fournisseur +
  coût). Voir livraison de l'intervention TECH-003 pour la proposition soumise.

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

**Aucune commande de déploiement n'existe à ce jour** — l'hébergement n'est pas encore
choisi/validé (section D, E).

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

### Questions ouvertes (aucune solution proposée ici ne vaut décision)

- **Quel hébergement pour le front-end et le back-end de l'environnement de test ?** (bloquant
  pour terminer TECH-003 — proposition soumise, en attente de validation, voir journal H)
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
- **Non réalisé / bloqué** : le choix et la mise en place de l'hébergement (site + API en HTTPS,
  déploiement automatique réel, journaux consultables en ligne) — le ticket exige une validation
  explicite du fournisseur et de tout engagement financier avant de créer des services externes ;
  cette validation était encore en attente au moment de la rédaction. En conséquence : pas
  d'adresse HTTPS publique à ce jour, pas de démonstration accessible depuis un autre appareil,
  étape de déploiement des workflows CI non ajoutée, procédure de retour arrière non écrite
  (rien n'est encore déployé).
- **Travail restant** : dès validation du fournisseur d'hébergement — créer les services,
  compléter les workflows CI avec l'étape de déploiement, documenter les URL/journaux/procédure
  de retour arrière, puis exécuter les vérifications de bout en bout demandées par le ticket
  (push réel front et back, constat de la mise à jour en ligne).
