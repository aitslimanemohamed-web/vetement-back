-- CreateTable
CREATE TABLE "app"."sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "last_active_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "app"."sessions"("user_id");

-- AddForeignKey
ALTER TABLE "app"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Verrouillage explicite des accès (US-010), même motif que la migration
-- initiale (20260907224808_init) : "app.users" y était déjà protégée, cette
-- nouvelle table doit l'être tout autant. "REVOKE ALL ON ALL TABLES IN
-- SCHEMA" de la migration initiale ne portait que sur les tables qui
-- existaient à ce moment-là — une table créée ensuite a besoin de son
-- propre révoquage explicite pour rester cohérente avec cette politique.
REVOKE ALL ON "app"."sessions" FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON "app"."sessions" FROM "anon"';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON "app"."sessions" FROM "authenticated"';
  END IF;
END
$$;

-- Droits minimaux pour le rôle applicatif (US-010) : une session doit
-- pouvoir être créée (INSERT), lue pour être validée (SELECT), et voir sa
-- date de dernière activité ou de révocation mise à jour (UPDATE) — jamais
-- DELETE, la révocation se fait par la colonne "revoked_at", jamais par
-- suppression de ligne (voir schema.prisma et session.service.ts).
GRANT SELECT, INSERT, UPDATE ON "app"."sessions" TO "vetement_app";
