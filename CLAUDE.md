# Instructions pour Claude Code — vetement-back

## Rôle de ce dépôt

Ce dépôt est le **back-end** du projet vetement (API, règles métier, accès aux données). Il est
indépendant du dépôt **vetement-front** (interface web/mobile) : les deux dépôts ont chacun leur
propre historique Git et leur propre dépôt GitHub. Ne jamais supposer un accès direct au code du
front-end depuis ce dépôt.

## Mémoire de référence du projet

Le contexte complet du projet (les deux dépôts) est documenté dans
[`docs/CONTEXTE_PROJET.md`](docs/CONTEXTE_PROJET.md) — la version de référence unique.

**Lire ce fichier avant toute intervention.** À la fin du travail, mettre à jour les sections
concernées (réalisations, décisions, configuration, vérifications, blocages, prochaines
étapes, journal des interventions) si l'intervention en modifie le contenu.

## Avant de travailler

Toujours lire le ticket concerné avant de commencer un travail dans ce dépôt. Ne pas déduire le
périmètre d'une tâche à partir du code existant seul.

## Ce qu'il ne faut pas faire sans validation explicite

- Ne pas ajouter de fonctionnalité qui ne figure pas dans le ticket en cours.
- Ne pas choisir un framework, une librairie, une base de données ou une technologie qui n'a pas
  été validée par l'utilisateur au préalable.
- Ne pas créer de configuration de déploiement ou d'outillage non demandé.
- Ne pas créer de base de données réelle sans instruction explicite.

## Préservation du travail existant

Avant de modifier ou remplacer un fichier, vérifier s'il contient déjà du travail — ne rien
écraser ni supprimer sans certitude que ce n'est plus nécessaire.

## Secrets

Ne jamais committer de secret (mot de passe, clé d'API, jeton, certificat, chaîne de connexion
à une base réelle...). Un fichier `.env.example` sans valeur réelle peut être versionné ; un
`.env` réel ne doit jamais l'être. Le dossier `database/` ne doit jamais contenir de données
réelles, de sauvegardes, d'identifiants, ni de photos d'annonces (voir `database/README.md`).

## Documentation

Mettre à jour le `README.md` de ce dépôt (et `database/README.md` si besoin) dès qu'un
changement rend une information existante obsolète (nouvelles technologies choisies, nouvel
hébergement, etc.).

## Avant chaque commit

- Exécuter `npm run type-check`, `npm run lint`, `npm test`, `npm run test:e2e` et
  `npm run build` — tous doivent réussir (c'est aussi ce que vérifie automatiquement la CI sur
  push).
- Vérifier qu'aucun secret n'est inclus dans les fichiers ajoutés.
- Vérifier que les fichiers ajoutés correspondent bien au périmètre du ticket en cours.
- Vérifier que la documentation reflète l'état réel du projet.

## Commits et push

Les commits et les push de ce dépôt se font uniquement dans **vetement-back**. Si un ticket
futur modifie à la fois le front-end et le back-end, les changements de chaque dépôt doivent
être vérifiés et publiés séparément, chacun dans son propre dépôt.
