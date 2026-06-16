/**
 * Gera um slug estável a partir de um texto livre (título de trilha ou
 * capítulo). Remove acentos, baixa pra minúsculas e troca o resto por hífen.
 * Usado pela criação de trilhas (Fase 2) e de capítulos (Fase 3).
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
