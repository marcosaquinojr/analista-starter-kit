/**
 * Cria a tabela `webauthn_credentials` (passkeys / login por desbloqueio do
 * dispositivo). Idempotente.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-webauthn.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url)
    throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS webauthn_credentials (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      public_key text NOT NULL,
      counter integer NOT NULL DEFAULT 0,
      transports text NOT NULL DEFAULT '',
      device_name text NOT NULL DEFAULT '',
      created_at text NOT NULL
    )`;

  await sql`
    CREATE INDEX IF NOT EXISTS webauthn_credentials_user_id_idx
      ON webauthn_credentials (user_id)`;

  console.log("  ✓ webauthn_credentials pronto.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
