import {
  pgTable,
  text,
  integer,
  primaryKey,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

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
 * Áreas de onboarding (ex.: Negócios, Desenvolvimento). Antes eram um valor
 * fixo no campo `chapters.onboardingTrack`; agora são entidade gerenciável
 * pelo /admin (como as trilhas). Um usuário pertence a uma área; um capítulo
 * pode pertencer a várias (tabela de ligação `chapter_areas`).
 */
export const areas = pgTable("areas", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull(),
});

/**
 * Ligação muitos-para-muitos entre capítulos e áreas. Presença da linha =
 * o capítulo pertence àquela área. Reaproveitar um capítulo em outra área =
 * mais uma linha aqui. Capítulo sem nenhuma linha = rascunho (oculto no leitor).
 */
export const chapterAreas = pgTable(
  "chapter_areas",
  {
    chapterSlug: text("chapter_slug")
      .notNull()
      .references(() => chapters.slug, { onDelete: "cascade" }),
    areaSlug: text("area_slug")
      .notNull()
      .references(() => areas.slug, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.chapterSlug, t.areaSlug] })],
);

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

/**
 * Quizzes — "capítulos especiais" gamificados. Aparecem numa trilha como um
 * card, pertencem a área(s) (como capítulos) e podem exigir capítulos
 * concluídos (pré-requisitos) pra desbloquear.
 */
export const quizzes = pgTable("quizzes", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  trailSlug: text("trail_slug")
    .notNull()
    .references(() => trails.slug),
  passThreshold: integer("pass_threshold").notNull().default(70), // % p/ passar
  secondsPerQuestion: integer("seconds_per_question").notNull().default(20),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: text("updated_at").notNull().default(""),
  updatedBy: text("updated_by").notNull().default(""),
});

/** Perguntas de um quiz. `options` = JSON [{text, correct}] (V/F = 2 opções). */
export const quizQuestions = pgTable("quiz_questions", {
  id: text("id").primaryKey(),
  quizSlug: text("quiz_slug")
    .notNull()
    .references(() => quizzes.slug, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'mc' | 'tf'
  text: text("text").notNull(),
  options: jsonb("options")
    .$type<{ text: string; correct: boolean }[]>()
    .notNull(),
  points: integer("points").notNull().default(1000), // base de pontos da pergunta
  sortOrder: integer("sort_order").notNull(),
});

/** Capítulos exigidos pra desbloquear o quiz (todos precisam estar concluídos). */
export const quizPrereqs = pgTable(
  "quiz_prereqs",
  {
    quizSlug: text("quiz_slug")
      .notNull()
      .references(() => quizzes.slug, { onDelete: "cascade" }),
    chapterSlug: text("chapter_slug")
      .notNull()
      .references(() => chapters.slug, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.quizSlug, t.chapterSlug] })],
);

/** Áreas a que o quiz pertence (como chapter_areas). */
export const quizAreas = pgTable(
  "quiz_areas",
  {
    quizSlug: text("quiz_slug")
      .notNull()
      .references(() => quizzes.slug, { onDelete: "cascade" }),
    areaSlug: text("area_slug")
      .notNull()
      .references(() => areas.slug, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.quizSlug, t.areaSlug] })],
);

/**
 * Tentativas de quiz. Guarda todas; o XP/nível e as medalhas são derivados da
 * MELHOR tentativa por (usuário, quiz). `passed` = nota ≥ nota mínima.
 */
export const quizResults = pgTable("quiz_results", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quizSlug: text("quiz_slug")
    .notNull()
    .references(() => quizzes.slug, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  passed: boolean("passed").notNull(),
  takenAt: text("taken_at").notNull(), // ISO
});

export type TrailRow = typeof trails.$inferSelect;
export type NewTrailRow = typeof trails.$inferInsert;
export type AreaRow = typeof areas.$inferSelect;
export type NewAreaRow = typeof areas.$inferInsert;
export type ChapterAreaRow = typeof chapterAreas.$inferSelect;
export type QuizRow = typeof quizzes.$inferSelect;
export type NewQuizRow = typeof quizzes.$inferInsert;
export type QuizQuestionRow = typeof quizQuestions.$inferSelect;
export type NewQuizQuestionRow = typeof quizQuestions.$inferInsert;
export type QuizResultRow = typeof quizResults.$inferSelect;
export type NewQuizResultRow = typeof quizResults.$inferInsert;
export type ChapterRow = typeof chapters.$inferSelect;
export type NewChapterRow = typeof chapters.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SettingRow = typeof settings.$inferSelect;
export type AuditRow = typeof auditLog.$inferSelect;
export type ChapterVersionRow = typeof chapterVersions.$inferSelect;
export type NewChapterVersionRow = typeof chapterVersions.$inferInsert;
