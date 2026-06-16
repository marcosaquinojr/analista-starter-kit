import type { TrailMeta } from "@/lib/types";

/**
 * Trilhas iniciais (as 3 seções do menu que existiam hardcoded).
 * Servem de seed da tabela `trails`. A partir daqui, novas seções são
 * criadas pelo /admin — esta lista é só o ponto de partida.
 */
export const seedTrails: TrailMeta[] = [
  { slug: "contexto", title: "Contexto", description: "Antes de produzir, entenda o terreno", sortOrder: 1 },
  { slug: "rotina", title: "Rotina", description: "Como o trabalho do analista flui", sortOrder: 2 },
  { slug: "crescimento", title: "Crescimento", description: "Quando precisar de mais", sortOrder: 3 },
];
