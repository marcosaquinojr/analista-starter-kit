import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";

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
  // nome de quem fez a última atualização (snapshot p/ exibição)
  updatedBy: text("updated_by").notNull().default(""),
  onboardingTrack: text("onboarding_track").notNull().default("negocios"),
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
  avatarUrl: text("avatar_url").notNull().default(""),
  role: text("role").notNull(),
  passwordHash: text("password_hash"),
  inviteToken: text("invite_token"),
  inviteExpiresAt: text("invite_expires_at"),
  status: text("status").notNull(), // 'invited' | 'active'
  createdAt: text("created_at").notNull(),
  onboardingTrack: text("onboarding_track").notNull().default("negocios"),
});

/**
 * Progresso de leitura por pessoa. Uma linha = um capítulo concluído por um
 * usuário (presença da linha = concluído). Cascade: some junto com o usuário
 * ou com o capítulo. Substitui o antigo localStorage por dado durável no banco.
 */
export const progress = pgTable(
  "progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chapterSlug: text("chapter_slug")
      .notNull()
      .references(() => chapters.slug, { onDelete: "cascade" }),
    completedAt: text("completed_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.chapterSlug] })],
);

/**
 * Configurações editáveis de chave/valor. Hoje guarda o conteúdo da página
 * inicial (tag, título, subtítulo e tempo de leitura do hero), antes hardcoded
 * no componente. Cada linha é um campo; defaults ficam em lib/settings.ts.
 */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

/**
 * Log de ações dos usuários na área interna (auditoria). Cada linha é uma ação
 * (criar/editar/excluir capítulo, trilha, usuário, etc.). Os dados de quem fez
 * são gravados como snapshot (nome/e-mail) para o log sobreviver à exclusão do
 * usuário. Distinto do log de versões do código (esse fica em lib/changelog.ts).
 */
export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  at: text("at").notNull(), // ISO timestamp
  userId: text("user_id"),
  userName: text("user_name").notNull().default(""),
  userEmail: text("user_email").notNull().default(""),
  action: text("action").notNull(), // ex.: "chapter.update"
  target: text("target").notNull().default(""), // ex.: título/slug afetado
  details: text("details").notNull().default(""),
});

export const chapterVersions = pgTable("chapter_versions", {
  id: text("id").primaryKey(),
  chapterSlug: text("chapter_slug")
    .notNull()
    .references(() => chapters.slug, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bodyHtml: text("body_html").notNull(),
  updatedAt: text("updated_at").notNull(),
  updatedBy: text("updated_by").notNull(),
  revisionNote: text("revision_note").notNull().default(""),
});

export type TrailRow = typeof trails.$inferSelect;
export type NewTrailRow = typeof trails.$inferInsert;
export type ChapterRow = typeof chapters.$inferSelect;
export type NewChapterRow = typeof chapters.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SettingRow = typeof settings.$inferSelect;
export type AuditRow = typeof auditLog.$inferSelect;
export type ChapterVersionRow = typeof chapterVersions.$inferSelect;
export type NewChapterVersionRow = typeof chapterVersions.$inferInsert;
