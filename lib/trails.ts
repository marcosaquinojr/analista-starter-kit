import "server-only";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters, trails } from "@/lib/db/schema";
import type { TrailMeta } from "@/lib/types";

/**
 * Camada de acesso a trilhas (as seções do menu). Lê do Postgres (Neon).
 * As páginas e o /admin consomem só estas funções.
 */

export interface TrailWithCount extends TrailMeta {
  chapterCount: number;
}

export async function getTrails(): Promise<TrailMeta[]> {
  return db
    .select()
    .from(trails)
    .orderBy(asc(trails.sortOrder), asc(trails.title));
}

export async function getTrail(slug: string): Promise<TrailMeta | null> {
  const [row] = await db
    .select()
    .from(trails)
    .where(eq(trails.slug, slug))
    .limit(1);
  return row ?? null;
}

/**
 * Trilhas com a contagem de capítulos de cada uma. O /admin usa isso para
 * mostrar trilhas vazias (recém-criadas) e bloquear a exclusão das que ainda
 * têm capítulos.
 */
export async function getTrailsWithCounts(): Promise<TrailWithCount[]> {
  const rows = await db
    .select({
      slug: trails.slug,
      title: trails.title,
      description: trails.description,
      sortOrder: trails.sortOrder,
      chapterCount: count(chapters.slug),
    })
    .from(trails)
    .leftJoin(chapters, eq(chapters.trailSlug, trails.slug))
    .groupBy(trails.slug, trails.title, trails.description, trails.sortOrder)
    .orderBy(asc(trails.sortOrder), asc(trails.title));
  return rows.map((r) => ({ ...r, chapterCount: Number(r.chapterCount) }));
}
