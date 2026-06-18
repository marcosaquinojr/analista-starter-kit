import "server-only";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { areas, chapterAreas } from "@/lib/db/schema";
import type { AreaMeta } from "@/lib/types";

/**
 * Camada de acesso a áreas (Negócios, Desenvolvimento, …) e à ligação
 * capítulo↔área. Áreas são entidade gerenciável pelo /admin; um capítulo
 * pode pertencer a várias (reuso).
 */

export interface AreaWithCount extends AreaMeta {
  chapterCount: number;
}

export async function getAreas(): Promise<AreaMeta[]> {
  return db.select().from(areas).orderBy(asc(areas.sortOrder), asc(areas.name));
}

/**
 * Áreas com a contagem de capítulos de cada uma (via chapter_areas). O /admin
 * usa pra mostrar áreas vazias e bloquear a exclusão das que têm capítulos.
 */
export async function getAreasWithCounts(): Promise<AreaWithCount[]> {
  const rows = await db
    .select({
      slug: areas.slug,
      name: areas.name,
      description: areas.description,
      sortOrder: areas.sortOrder,
      chapterCount: count(chapterAreas.chapterSlug),
    })
    .from(areas)
    .leftJoin(chapterAreas, eq(chapterAreas.areaSlug, areas.slug))
    .groupBy(areas.slug, areas.name, areas.description, areas.sortOrder)
    .orderBy(asc(areas.sortOrder), asc(areas.name));
  return rows.map((r) => ({ ...r, chapterCount: Number(r.chapterCount) }));
}

/** Slugs das áreas a que um capítulo pertence. */
export async function getChapterAreaSlugs(chapterSlug: string): Promise<string[]> {
  const rows = await db
    .select({ areaSlug: chapterAreas.areaSlug })
    .from(chapterAreas)
    .where(eq(chapterAreas.chapterSlug, chapterSlug));
  return rows.map((r) => r.areaSlug);
}
