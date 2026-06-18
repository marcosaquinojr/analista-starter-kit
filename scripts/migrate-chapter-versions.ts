/**
 * Cria a tabela `chapter_versions` se não existir.
 * Garante que os dados existentes de produção sejam preservados.
 *
 * Executar com:
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-chapter-versions.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  console.log("Iniciando migração do histórico de versões dos capítulos...");

  await sql`
    CREATE TABLE IF NOT EXISTS chapter_versions (
      id text PRIMARY KEY,
      chapter_slug text NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
      title text NOT NULL,
      description text NOT NULL,
      body_html text NOT NULL,
      updated_at text NOT NULL,
      updated_by text NOT NULL,
      revision_note text NOT NULL DEFAULT ''
    )
  `;
  console.log("  ✓ Tabela chapter_versions criada/verificada com sucesso.");
  console.log("Migração concluída.");
}

main().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
