/**
 * Cria a tabela `users` (sistema de acesso interno). Idempotente: usa
 * CREATE TABLE IF NOT EXISTS, não toca em capítulos/trilhas.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-users.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      name text NOT NULL DEFAULT '',
      role text NOT NULL,
      password_hash text,
      invite_token text,
      invite_expires_at text,
      status text NOT NULL,
      created_at text NOT NULL
    )`;

  console.log("  ✓ tabela users pronta.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
