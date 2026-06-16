import { pgTable, text, integer } from "drizzle-orm/pg-core";

/**
 * Tabela de trilhas (as seções do menu: Contexto, Rotina, Crescimento...).
 * Agora são dados editáveis pelo /admin, não mais uma lista hardcoded.
 * `slug` é o id estável referenciado pelos capítulos — renomear o `title`
 * no admin não quebra os capítulos.
 */
export const trails = pgTable("trails", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

/**
 * Tabela de capítulos do manual. `bodyHtml` guarda o conteúdo rico
 * (HTML com as classes do design system). `updatedAt` é uma string de
 * exibição (dd/mm/aaaa) atualizada quando um editor salva. `trailSlug`
 * referencia a trilha (seção) a que o capítulo pertence.
 */
export const chapters = pgTable("chapters", {
  slug: text("slug").primaryKey(),
  sortOrder: integer("sort_order").notNull(),
  number: text("number").notNull(),
  trailSlug: text("trail_slug")
    .notNull()
    .references(() => trails.slug),
  title: text("title").notNull(),
  description: text("description").notNull(),
  readTime: text("read_time").notNull(),
  bodyHtml: text("body_html").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/**
 * Usuários da área interna. Sistema de acesso próprio (substitui a senha
 * compartilhada). `passwordHash` fica nulo enquanto o convite não foi aceito;
 * `inviteToken` destrava a página onde a pessoa define a própria senha.
 * Papéis: 'admin' (gerencia usuários + edita), 'editor' (edita), 'leitor'.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  role: text("role").notNull(),
  passwordHash: text("password_hash"),
  inviteToken: text("invite_token"),
  inviteExpiresAt: text("invite_expires_at"),
  status: text("status").notNull(), // 'invited' | 'active'
  createdAt: text("created_at").notNull(),
});

export type TrailRow = typeof trails.$inferSelect;
export type NewTrailRow = typeof trails.$inferInsert;
export type ChapterRow = typeof chapters.$inferSelect;
export type NewChapterRow = typeof chapters.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
