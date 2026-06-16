/**
 * Cria a tabela `progress` (progresso de leitura por usuário). Idempotente.
 * Cascade: some junto com o usuário ou o capítulo.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-progress.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS progress (
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      chapter_slug text NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
      completed_at text NOT NULL,
      PRIMARY KEY (user_id, chapter_slug)
    )`;

  console.log("  ✓ tabela progress pronta.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
