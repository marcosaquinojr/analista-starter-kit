export interface TrailMeta {
  slug: string;
  title: string;
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
  updatedAt: string; // ISO date or display string
}

export interface Chapter extends ChapterMeta {
  bodyHtml: string;
}
