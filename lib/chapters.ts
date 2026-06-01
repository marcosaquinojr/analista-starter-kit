import "server-only";
import type { Chapter, ChapterMeta } from "@/lib/types";
import { seedChapters } from "@/lib/seed/chapters";

/**
 * Camada de acesso a capítulos.
 *
 * Hoje lê de `seedChapters` (conteúdo migrado do protótipo). Quando o
 * Postgres entrar (Fase 2), só estas funções mudam — as páginas que as
 * consomem continuam iguais. Por isso são `async`: a assinatura já é a
 * de um data source remoto.
 */

const byNumber = (a: { number: string }, b: { number: string }) =>
  a.number.localeCompare(b.number);

export async function getChapters(): Promise<ChapterMeta[]> {
  return seedChapters
    .map(({ bodyHtml: _bodyHtml, ...meta }) => meta)
    .sort(byNumber);
}

export async function getChapter(slug: string): Promise<Chapter | null> {
  return seedChapters.find((c) => c.slug === slug) ?? null;
}

export async function getChapterSlugs(): Promise<string[]> {
  return seedChapters.sort(byNumber).map((c) => c.slug);
}
