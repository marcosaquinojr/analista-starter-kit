/**
 * Adiciona a coluna `avatar_url` em `users` (foto de perfil). Idempotente.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-avatar.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text NOT NULL DEFAULT ''`;

  console.log("  ✓ users.avatar_url pronto.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
