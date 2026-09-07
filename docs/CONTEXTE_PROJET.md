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
- Technologies retenues pour le front-end et le back-end (aucune choisie à ce jour).
- Hébergement (front-end, back-end, base de données, stockage photos) — non validé.

**Besoin exprimé, non mis en œuvre** : un déploiement automatique doit se déclencher après un
push. Les modalités exactes (plateforme de CI/CD, environnements concernés, cas du mobile) restent
à définir — ce besoin est noté ici comme exigence, pas comme travail réalisé.

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
| Front-end web | Interface navigateur | Non créé |
| Front-end mobile (iOS/Android) | Applications mobiles | Non créé |
| Back-end / API | Règles métier, exposition des données | Non créé |
| Base de données | Stockage des annonces, utilisateurs, messages... | Non créée |
| Authentification | Vérification d'identité des utilisateurs | Non créée — méthode non choisie |
| Stockage des photos | Hébergement des photos d'annonces | Non créé |
| Hébergement / déploiement | Mise en ligne des services | Non créé — aucun fournisseur choisi |

Aucune adresse, aucun fournisseur d'hébergement et aucune configuration ne sont inventés ici :
tant qu'un composant n'a pas été réellement mis en place et vérifié, il reste "Non créé".

## E. État réel du projet

**Terminé et vérifié :**
- **TECH-001** — Espace de travail et dépôts GitHub initialisés. Résultat vérifié : les 2
  dépôts existent sur GitHub, contiennent les fichiers attendus, ont chacun un historique
  Git propre sur `main`, et ont été clonés avec succès de façon indépendante. Commits
  d'initialisation : `e3ef547` (vetement-front), `a9c1f6b` (vetement-back).

**En cours :**
- **TECH-002** — Création de ce fichier de mémoire de référence et de ses règles de mise à
  jour (ce document).

**Prévu (pas commencé) :**
- Choix des technologies front-end et back-end.
- Conception de la base de données.
- Choix de la méthode d'authentification.
- Choix du stockage des photos.
- Mise en place de l'hébergement et du déploiement automatique après push.
- Tout développement fonctionnel (aucun n'est dans le périmètre de TECH-001/TECH-002).

**Bloqué :** aucun blocage en cours au moment de la rédaction. (Historique : l'accès GitHub
n'était pas configuré au début de TECH-001 — résolu le 2026-09-07 via `gh auth login`.)

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

**Aucune commande de lancement ou de test n'existe à ce jour** (aucun code applicatif,
aucun framework installé) — ce point doit être signalé explicitement tant qu'il reste vrai,
plutôt que supposé résolu.

## G. Décisions et questions ouvertes

### Décisions prises (avec date et raison)

| Date | Décision | Raison |
|---|---|---|
| 2026-09-07 | Nom du projet : **vetement** (dossier de travail local initialement nommé "vinted", renommé) | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Noms des dépôts : `vetement-front` / `vetement-back` (forme courte, pas `-frontend`/`-backend`) | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Dépôts hébergés sur le compte GitHub personnel `aitslimanemohamed-web`, en visibilité **publique** | Confirmé explicitement par l'utilisateur. |
| 2026-09-07 | Pas de monorepo, pas de 3e dépôt pour la base de données, pas de sous-module Git | Choix explicite du ticket TECH-001. |
| 2026-09-07 | Mémoire de référence unique, versionnée dans `vetement-back/docs/CONTEXTE_PROJET.md` | Choix explicite du ticket TECH-002, pour éviter une copie dupliquée dans un 3e emplacement. |

### Questions ouvertes (aucune solution proposée ici ne vaut décision)

- Quelles technologies pour le front-end (web + mobile) et le back-end ?
- Quel système d'authentification ?
- Quel hébergement pour le back-end, la base de données, et le stockage des photos ?
- Quel mécanisme de déploiement automatique après push (CI/CD) ? Concerne-t-il aussi le mobile ?
- Quelle durée exacte avant expiration d'une réservation ?
- Quels rayons/filtres de recherche géographique exacts ?
- Quelles options exactes de visibilité de la localisation ?

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
