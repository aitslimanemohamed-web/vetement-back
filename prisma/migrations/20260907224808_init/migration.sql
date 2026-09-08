-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateTable
CREATE TABLE "app"."users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "username_key" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key_key" ON "app"."users"("username_key");

-- Verrouillage explicite des accès (US-009). Le schéma "app" n'est déjà pas
-- exposé par la Data API Supabase (PostgREST ne sert que "public" par
-- défaut) ; ces révocations sont une protection supplémentaire, en
-- profondeur, au cas où l'exposition de schémas changerait un jour.
-- Écrites en blocs conditionnels : "anon"/"authenticated" n'existent que sur
-- une vraie base Supabase, pas sur un Postgres local/CI ordinaire, donc un
-- REVOKE littéral échouerait ailleurs qu'en production.
REVOKE ALL ON SCHEMA "app" FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA "app" FROM "anon"';
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM "anon"';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA "app" FROM "authenticated"';
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM "authenticated"';
  END IF;
END
$$;

-- Rôle applicatif dédié pour le back-end en exécution : droits minimaux
-- (USAGE + SELECT/INSERT sur "users" seulement — jamais UPDATE/DELETE, non
-- nécessaires à l'inscription), distinct du rôle privilégié utilisé pour
-- appliquer les migrations (séparation des droits, voir CONTEXTE_PROJET.md).
-- Son mot de passe n'est JAMAIS fixé ici : voir la commande manuelle
-- documentée séparément (ALTER ROLE ... WITH PASSWORD, exécutée une seule
-- fois hors de tout fichier versionné).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'vetement_app') THEN
    CREATE ROLE "vetement_app" LOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA "app" TO "vetement_app";
GRANT SELECT, INSERT ON "app"."users" TO "vetement_app";
