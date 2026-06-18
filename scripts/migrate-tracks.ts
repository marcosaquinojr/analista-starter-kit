/**
 * Adiciona a coluna `onboarding_track` em `users` e `chapters`. Idempotente.
 * Garante que os dados existentes de produção sejam preservados.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-tracks.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  console.log("Iniciando migração de trilhas de onboarding...");

  // 1. Adiciona a coluna onboarding_track na tabela users se não existir
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_track text NOT NULL DEFAULT 'negocios'`;
  console.log("  ✓ users.onboarding_track pronto.");

  // 2. Adiciona a coluna onboarding_track na tabela chapters se não existir
  await sql`
    ALTER TABLE chapters ADD COLUMN IF NOT EXISTS onboarding_track text NOT NULL DEFAULT 'negocios'`;
  console.log("  ✓ chapters.onboarding_track pronto.");

  console.log("Migração concluída com sucesso.");
}

main().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
