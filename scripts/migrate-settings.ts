/**
 * Cria a tabela `settings` (configurações chave/valor — hoje guarda o conteúdo
 * editável da página inicial). Idempotente. Não insere defaults: a leitura cai
 * nos valores padrão de lib/settings.ts enquanto não houver linha salva.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-settings.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key text PRIMARY KEY,
      value text NOT NULL
    )`;

  console.log("  ✓ tabela settings pronta.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
