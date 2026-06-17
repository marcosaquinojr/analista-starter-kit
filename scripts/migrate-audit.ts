/**
 * Cria a tabela `audit_log` (log de ações dos usuários) e adiciona a coluna
 * `updated_by` em `chapters` (quem fez a última atualização). Idempotente.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-audit.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS audit_log (
      id text PRIMARY KEY,
      at text NOT NULL,
      user_id text,
      user_name text NOT NULL DEFAULT '',
      user_email text NOT NULL DEFAULT '',
      action text NOT NULL,
      target text NOT NULL DEFAULT '',
      details text NOT NULL DEFAULT ''
    )`;

  await sql`
    ALTER TABLE chapters ADD COLUMN IF NOT EXISTS updated_by text NOT NULL DEFAULT ''`;

  console.log("  ✓ audit_log e chapters.updated_by prontos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
