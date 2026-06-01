export type Trail = "Contexto" | "Rotina" | "Crescimento";

export interface ChapterMeta {
  slug: string;
  number: string; // "01".."10"
  trail: Trail;
  title: string;
  description: string;
  readTime: string;
  updatedAt: string; // ISO date or display string
}

export interface Chapter extends ChapterMeta {
  bodyHtml: string;
}

export const TRAILS: { title: Trail; desc: string }[] = [
  { title: "Contexto", desc: "Antes de produzir, entenda o terreno" },
  { title: "Rotina", desc: "Como o trabalho do analista flui" },
  { title: "Crescimento", desc: "Quando precisar de mais" },
];
