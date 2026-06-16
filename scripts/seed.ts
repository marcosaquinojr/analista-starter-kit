/**
 * Popula a tabela `chapters` a partir de `lib/seed/chapters.ts`.
 *
 * IMPORTANTE — o banco é a fonte da verdade quando há editores no /admin.
 * Por isso o comportamento padrão é SEGURO:
 *
 *   npm run db:seed          → só INSERE capítulos que ainda não existem.
 *                              Nunca sobrescreve o que foi editado no /admin.
 *
 *   npm run db:seed:force    → SOBRESCREVE todos os capítulos com o conteúdo
 *                              do código. Apaga edições feitas no /admin.
 *                              Use só num banco novo ou quando souber o que faz.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chapters, trails } from "../lib/db/schema";
import { seedChapters } from "../lib/seed/chapters";
import { seedTrails } from "../lib/seed/trails";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");

  const force = process.argv.includes("--force");
  const db = drizzle(neon(url));

  // Trilhas primeiro: capítulos referenciam trail_slug via FK.
  for (const t of seedTrails) {
    if (force) {
      await db.insert(trails).values(t).onConflictDoUpdate({ target: trails.slug, set: t });
    } else {
      await db.insert(trails).values(t).onConflictDoNothing({ target: trails.slug });
    }
  }
  console.log(`\n  ✓ ${seedTrails.length} trilhas semeadas.`);

  if (force) {
    console.log(
      "\n⚠️  MODO --force: sobrescreve TODOS os capítulos, incluindo edições feitas no /admin.\n",
    );
  } else {
    console.log(
      "\nModo seguro: só insere capítulos ausentes; não toca nos existentes.\n",
    );
  }

  let inserted = 0;
  let skipped = 0;

  for (const c of seedChapters) {
    const row = {
      slug: c.slug,
      sortOrder: Number.parseInt(c.number, 10),
      number: c.number,
      trailSlug: c.trailSlug,
      title: c.title,
      description: c.description,
      readTime: c.readTime,
      bodyHtml: c.bodyHtml,
      updatedAt: c.updatedAt,
    };

    if (force) {
      await db
        .insert(chapters)
        .values(row)
        .onConflictDoUpdate({ target: chapters.slug, set: row });
      console.log(`  ✓ (sobrescrito) ${row.number} ${row.title}`);
      continue;
    }

    const res = await db
      .insert(chapters)
      .values(row)
      .onConflictDoNothing({ target: chapters.slug })
      .returning({ slug: chapters.slug });

    if (res.length > 0) {
      inserted += 1;
      console.log(`  ✓ (inserido) ${row.number} ${row.title}`);
    } else {
      skipped += 1;
      console.log(`  – (já existe, mantido) ${row.number} ${row.title}`);
    }
  }

  if (force) {
    console.log(`\nSeed (force) concluído: ${seedChapters.length} capítulos sobrescritos.`);
  } else {
    console.log(`\nSeed concluído: ${inserted} inseridos, ${skipped} preservados.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
