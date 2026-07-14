/**
 * Publica o capítulo "IA no dia a dia: publicando PBI e Bug" (área Negócios,
 * trilha Rotina, posição 09) — a skill azure-backlog do Claude Code.
 *
 * Comportamento SEGURO e idempotente (mesmo espírito do db:seed):
 *   - só insere o capítulo e o vínculo capítulo↔área; nunca sobrescreve.
 *   - pode rodar quantas vezes quiser.
 *
 * NÃO renumera FAQ/Erros/Próximos (hoje 09/10/11 no seed, mas o banco de
 * produção já está com numeração diferente — ver REVISAO_PROJETO_2026-07-02.md,
 * REV-01). Depois de rodar, confira no /admin se a ordem/numeração final
 * bate com o que você quer e ajuste manualmente se precisar.
 *
 *   npm run db:seed:cap-azure
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chapters, chapterAreas } from "../lib/db/schema";
import { seedChapterAzureSkill } from "../lib/seed/chapter-azure-skill";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const db = drizzle(neon(url));

  const c = seedChapterAzureSkill;
  const row = {
    slug: c.slug,
    sortOrder: c.sortOrder,
    number: c.number,
    trailSlug: c.trailSlug,
    title: c.title,
    description: c.description,
    readTime: c.readTime,
    bodyHtml: c.bodyHtml,
    updatedAt: c.updatedAt,
    onboardingTrack: "negocios",
  };

  console.log("\nModo seguro: só insere se o capítulo ainda não existir.\n");

  const res = await db
    .insert(chapters)
    .values(row)
    .onConflictDoNothing({ target: chapters.slug })
    .returning({ slug: chapters.slug });

  if (res.length > 0) {
    console.log(`  ✓ (inserido) ${row.number} ${row.title}`);
  } else {
    console.log(`  – (já existe, mantido) ${row.number} ${row.title}`);
  }

  await db
    .insert(chapterAreas)
    .values({ chapterSlug: c.slug, areaSlug: "negocios" })
    .onConflictDoNothing();

  console.log(
    "\nConcluído. Confira no /admin (área Negócios, trilha Rotina) e ajuste " +
      "número/ordem em relação a FAQ/Erros/Próximos se necessário — este " +
      "script não mexe neles.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
