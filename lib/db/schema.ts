import { pgTable, text, integer } from "drizzle-orm/pg-core";

/**
 * Tabela de capítulos do manual. `bodyHtml` guarda o conteúdo rico
 * (HTML com as classes do design system). `updatedAt` é uma string de
 * exibição (dd/mm/aaaa) atualizada quando um editor salva.
 */
export const chapters = pgTable("chapters", {
  slug: text("slug").primaryKey(),
  sortOrder: integer("sort_order").notNull(),
  number: text("number").notNull(),
  trail: text("trail").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  readTime: text("read_time").notNull(),
  bodyHtml: text("body_html").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type ChapterRow = typeof chapters.$inferSelect;
export type NewChapterRow = typeof chapters.$inferInsert;
