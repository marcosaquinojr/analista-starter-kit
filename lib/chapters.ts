import "server-only";
import { asc, desc, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters, trails, chapterVersions } from "@/lib/db/schema";
import type { Chapter, ChapterMeta, ChapterVersion } from "@/lib/types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Camada de acesso a capítulos — agora lê do Postgres (Neon) via Drizzle.
 * As páginas consomem só estas funções; trocamos o seed pelo banco aqui
 * sem tocar em nenhuma página.
 */

const metaColumns = {
  slug: chapters.slug,
  number: chapters.number,
  trailSlug: chapters.trailSlug,
  title: chapters.title,
  description: chapters.description,
  readTime: chapters.readTime,
  updatedAt: chapters.updatedAt,
  updatedBy: chapters.updatedBy,
  onboardingTrack: chapters.onboardingTrack,
};

export async function getChapters(track?: string): Promise<ChapterMeta[]> {
  if (track) {
    return db
      .select(metaColumns)
      .from(chapters)
      .where(
        or(
          eq(chapters.onboardingTrack, track),
          eq(chapters.onboardingTrack, "ambos")
        )
      )
      .orderBy(asc(chapters.sortOrder));
  }
  return db
    .select(metaColumns)
    .from(chapters)
    .orderBy(asc(chapters.sortOrder));
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
    trailSlug: row.trailSlug,
    title: row.title,
    description: row.description,
    readTime: row.readTime,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
    bodyHtml: row.bodyHtml,
    onboardingTrack: row.onboardingTrack,
  };
}

/**
 * Data de atualização mais recente do manual (string de exibição dd/mm/aaaa),
 * usada no rodapé "última atualização em…". Faz parse de dd/mm/aaaa pra comparar.
 */
export async function getLastUpdated(): Promise<string | null> {
  const rows = await db
    .select({ updatedAt: chapters.updatedAt })
    .from(chapters);
  let best: { t: number; s: string } | null = null;
  for (const r of rows) {
    const m = r.updatedAt.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const t = m ? Date.UTC(+m[3], +m[2] - 1, +m[1]) : NaN;
    if (!Number.isNaN(t) && (!best || t > best.t)) best = { t, s: r.updatedAt };
  }
  return best?.s ?? null;
}

export async function getChapterSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: chapters.slug })
    .from(chapters)
    .orderBy(asc(chapters.sortOrder));
  return rows.map((r) => r.slug);
}

export async function getChapterVersions(chapterSlug: string): Promise<ChapterVersion[]> {
  return db
    .select()
    .from(chapterVersions)
    .where(eq(chapterVersions.chapterSlug, chapterSlug))
    .orderBy(desc(chapterVersions.updatedAt));
}
