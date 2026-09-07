# database/

## Rôle de ce dossier

Ce dossier accueillera les futurs fichiers décrivant la **structure** de la base de données
(schémas, migrations) et son **évolution** dans le temps.

## Ce qui n'est PAS dans ce ticket

Aucune base de données réelle n'est créée dans le cadre de ce ticket. Ce dossier ne contient
pour l'instant que ce fichier de documentation.

## Ce qui ne doit jamais être versionné ici

- Les données réelles (exports, dumps).
- Les sauvegardes de base de données.
- Les identifiants de connexion (utilisateur, mot de passe, chaîne de connexion complète).
- Les photos des annonces : elles ne seront jamais enregistrées dans Git, quel que soit
  l'endroit du dépôt.
