/**
 * Popula a tabela `chapters` com o conteúdo migrado do protótipo.
 * Idempotente: re-rodar atualiza os capítulos existentes (upsert por slug).
 *
 * Rodar: npm run db:seed  (carrega .env.local via --env-file)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chapters } from "../lib/db/schema";
import { seedChapters } from "../lib/seed/chapters";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");

  const db = drizzle(neon(url));

  for (const c of seedChapters) {
    const row = {
      slug: c.slug,
      sortOrder: Number.parseInt(c.number, 10),
      number: c.number,
      trail: c.trail,
      title: c.title,
      description: c.description,
      readTime: c.readTime,
      bodyHtml: c.bodyHtml,
      updatedAt: c.updatedAt,
    };
    await db
      .insert(chapters)
      .values(row)
      .onConflictDoUpdate({ target: chapters.slug, set: row });
    console.log(`  ✓ ${row.number} ${row.title}`);
  }

  console.log(`\nSeed concluído: ${seedChapters.length} capítulos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
