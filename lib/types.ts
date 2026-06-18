export interface TrailMeta {
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface AreaMeta {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface ChapterMeta {
  slug: string;
  number: string; // "01".."10"
  trailSlug: string; // referencia TrailMeta.slug
  title: string;
  description: string;
  readTime: string;
  updatedAt: string; // string de exibição: dd/mm/aaaa às HH:mm
  updatedBy?: string; // nome de quem fez a última atualização (vazio em dados seed)
  onboardingTrack?: string;
}

export interface Chapter extends ChapterMeta {
  bodyHtml: string;
}

export interface ChapterVersion {
  id: string;
  chapterSlug: string;
  title: string;
  description: string;
  bodyHtml: string;
  updatedAt: string;
  updatedBy: string;
  revisionNote: string;
}
