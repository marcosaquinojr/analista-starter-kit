/**
 * Migração segura: introduz a tabela `trails` e troca `chapters.trail`
 * (texto livre com o título) por `chapters.trail_slug` (FK estável).
 *
 * Por que um script e não `db:push`: o push do drizzle-kit, num banco com
 * dados, dropa a coluna `trail` ANTES de existir o backfill — perderia a
 * informação de qual trilha cada capítulo pertence. Aqui a ordem é segura:
 *
 *   1. cria a tabela `trails` + semeia as 3 trilhas iniciais
 *   2. adiciona `trail_slug` (nullable)
 *   3. backfill: deriva o slug do `trail` antigo (Contexto -> contexto)
 *   4. torna NOT NULL + adiciona a FK
 *   5. dropa a coluna `trail` antiga
 *
 * Idempotente: cada passo checa o estado atual antes de agir. Rodar de novo
 * depois de concluído não faz nada. NÃO toca em bodyHtml nem em edições do /admin.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-trails.ts
 */
import { neon } from "@neondatabase/serverless";
import { seedTrails } from "../lib/seed/trails";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  const hasColumn = async (table: string, column: string): Promise<boolean> => {
    const rows = await sql`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = ${table} AND column_name = ${column} LIMIT 1`;
    return rows.length > 0;
  };

  // 1. Tabela trails
  await sql`
    CREATE TABLE IF NOT EXISTS trails (
      slug text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      sort_order integer NOT NULL
    )`;
  for (const t of seedTrails) {
    await sql`
      INSERT INTO trails (slug, title, description, sort_order)
      VALUES (${t.slug}, ${t.title}, ${t.description}, ${t.sortOrder})
      ON CONFLICT (slug) DO NOTHING`;
  }
  console.log(`  ✓ tabela trails pronta (${seedTrails.length} trilhas).`);

  // 2. Coluna trail_slug (nullable por enquanto)
  if (!(await hasColumn("chapters", "trail_slug"))) {
    await sql`ALTER TABLE chapters ADD COLUMN trail_slug text`;
    console.log("  ✓ coluna chapters.trail_slug adicionada.");
  }

  // 3. Backfill a partir da coluna antiga `trail`, se ela ainda existir
  if (await hasColumn("chapters", "trail")) {
    await sql`
      UPDATE chapters
      SET trail_slug = CASE trail
        WHEN 'Contexto' THEN 'contexto'
        WHEN 'Rotina' THEN 'rotina'
        WHEN 'Crescimento' THEN 'crescimento'
        ELSE lower(trail)
      END
      WHERE trail_slug IS NULL`;
    console.log("  ✓ backfill de trail_slug a partir de trail.");
  }

  // Garante que nenhuma linha ficou sem trilha antes de exigir NOT NULL/FK.
  const orphans = await sql`SELECT slug, trail_slug FROM chapters WHERE trail_slug IS NULL`;
  if (orphans.length > 0) {
    console.error("  ✗ capítulos sem trail_slug — abortando antes do NOT NULL:", orphans);
    throw new Error("Há capítulos sem trilha; ajuste manualmente antes de continuar.");
  }
  // Toda trilha referenciada existe na tabela trails?
  const missing = await sql`
    SELECT DISTINCT c.trail_slug FROM chapters c
    LEFT JOIN trails t ON t.slug = c.trail_slug
    WHERE t.slug IS NULL`;
  if (missing.length > 0) {
    console.error("  ✗ trail_slug sem trilha correspondente em trails:", missing);
    throw new Error("Crie as trilhas faltantes antes de adicionar a FK.");
  }

  // 4. NOT NULL + FK (nome na convenção do drizzle p/ o push futuro não mexer)
  await sql`ALTER TABLE chapters ALTER COLUMN trail_slug SET NOT NULL`;
  const fk = await sql`
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'chapters_trail_slug_trails_slug_fk' LIMIT 1`;
  if (fk.length === 0) {
    await sql`
      ALTER TABLE chapters
      ADD CONSTRAINT chapters_trail_slug_trails_slug_fk
      FOREIGN KEY (trail_slug) REFERENCES trails(slug)`;
    console.log("  ✓ FK chapters.trail_slug -> trails.slug criada.");
  }

  // 5. Dropa a coluna antiga
  if (await hasColumn("chapters", "trail")) {
    await sql`ALTER TABLE chapters DROP COLUMN trail`;
    console.log("  ✓ coluna antiga chapters.trail removida.");
  }

  console.log("\nMigração concluída com sucesso.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
