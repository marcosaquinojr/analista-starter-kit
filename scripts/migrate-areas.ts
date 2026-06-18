/**
 * Áreas viram entidade gerenciável (antes: valor fixo em chapters.onboarding_track).
 * Cria `areas` + a ligação muitos-para-muitos `chapter_areas`, semeia as 2 áreas
 * atuais (Negócios, Desenvolvimento) e faz o backfill a partir do campo antigo:
 *   negocios        -> [negocios]
 *   desenvolvimento -> [desenvolvimento]
 *   ambos           -> [negocios, desenvolvimento]
 *
 * Aditiva e idempotente: não altera nem dropa nada existente (o campo
 * onboarding_track continua intacto p/ rollback). Pode rodar mais de uma vez.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-areas.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  console.log("Iniciando migração de áreas…");

  // 1. Tabela de áreas
  await sql`
    CREATE TABLE IF NOT EXISTS areas (
      slug text PRIMARY KEY,
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      sort_order integer NOT NULL
    )`;
  console.log("  ✓ tabela areas pronta.");

  // 2. Ligação capítulo ↔ área
  await sql`
    CREATE TABLE IF NOT EXISTS chapter_areas (
      chapter_slug text NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
      area_slug text NOT NULL REFERENCES areas(slug) ON DELETE CASCADE,
      PRIMARY KEY (chapter_slug, area_slug)
    )`;
  console.log("  ✓ tabela chapter_areas pronta.");

  // 3. Semeia as 2 áreas atuais (idempotente)
  await sql`
    INSERT INTO areas (slug, name, description, sort_order) VALUES
      ('negocios', 'Negócios', 'Trilha do analista de negócios', 1),
      ('desenvolvimento', 'Desenvolvimento', 'Trilha de desenvolvimento', 2)
    ON CONFLICT (slug) DO NOTHING`;
  console.log("  ✓ áreas Negócios e Desenvolvimento semeadas.");

  // 4. Backfill a partir de chapters.onboarding_track
  await sql`
    INSERT INTO chapter_areas (chapter_slug, area_slug)
    SELECT slug, onboarding_track FROM chapters
    WHERE onboarding_track IN ('negocios', 'desenvolvimento')
    ON CONFLICT DO NOTHING`;
  await sql`
    INSERT INTO chapter_areas (chapter_slug, area_slug)
    SELECT slug, 'negocios' FROM chapters WHERE onboarding_track = 'ambos'
    ON CONFLICT DO NOTHING`;
  await sql`
    INSERT INTO chapter_areas (chapter_slug, area_slug)
    SELECT slug, 'desenvolvimento' FROM chapters WHERE onboarding_track = 'ambos'
    ON CONFLICT DO NOTHING`;
  console.log("  ✓ backfill de chapter_areas feito.");

  // Relatório
  const areasCount = await sql`SELECT count(*)::int AS c FROM areas`;
  const linkCount = await sql`SELECT count(*)::int AS c FROM chapter_areas`;
  const orphans = await sql`
    SELECT count(*)::int AS c FROM chapters c
    WHERE NOT EXISTS (SELECT 1 FROM chapter_areas ca WHERE ca.chapter_slug = c.slug)`;
  console.log(
    `Concluído. areas=${areasCount[0].c}, chapter_areas=${linkCount[0].c}, capítulos sem área (rascunho)=${orphans[0].c}`,
  );
}

main().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
