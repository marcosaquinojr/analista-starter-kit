import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import type { Chapter, ChapterMeta, Trail } from "@/lib/types";

/**
 * Camada de acesso a capítulos — agora lê do Postgres (Neon) via Drizzle.
 * As páginas consomem só estas funções; trocamos o seed pelo banco aqui
 * sem tocar em nenhuma página.
 */

const metaColumns = {
  slug: chapters.slug,
  number: chapters.number,
  trail: chapters.trail,
  title: chapters.title,
  description: chapters.description,
  readTime: chapters.readTime,
  updatedAt: chapters.updatedAt,
};

function toMeta(r: {
  slug: string;
  number: string;
  trail: string;
  title: string;
  description: string;
  readTime: string;
  updatedAt: string;
}): ChapterMeta {
  return { ...r, trail: r.trail as Trail };
}

export async function getChapters(): Promise<ChapterMeta[]> {
  const rows = await db
    .select(metaColumns)
    .from(chapters)
    .orderBy(asc(chapters.sortOrder));
  return rows.map(toMeta);
}

export async function getChapter(slug: string): Promise<Chapter | null> {
  const [row] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.slug, slug))
    .limit(1);
  if (!row) return null;
  return {
    slug: row.slug,
    number: row.number,
    trail: row.trail as Trail,
    title: row.title,
    description: row.description,
    readTime: row.readTime,
    updatedAt: row.updatedAt,
    bodyHtml: row.bodyHtml,
  };
}

export async function getChapterSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: chapters.slug })
    .from(chapters)
    .orderBy(asc(chapters.sortOrder));
  return rows.map((r) => r.slug);
}
