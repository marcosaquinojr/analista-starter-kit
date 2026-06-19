"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  chapters,
  trails,
  chapterVersions,
  areas,
  chapterAreas,
  quizzes,
  quizQuestions,
  quizPrereqs,
  quizAreas,
  quizResults,
} from "@/lib/db/schema";
import { quizExists } from "@/lib/quizzes";
import {
  verifyPassword,
  setSession,
  clearSession,
  getSessionUser,
  type Role,
} from "@/lib/auth";
import {
  requireRole,
  getUserByEmail,
  getUserById,
  createInvite,
  resetInvite,
  acceptInvite,
  deleteUser,
  setUserRole,
  setUserProfile,
  countAdmins,
  setUserTrack,
} from "@/lib/users";
import { saveHomeContent } from "@/lib/settings";
import { logAction } from "@/lib/audit";
import { toggleProgress } from "@/lib/progress";
import { put, list, del } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/slug";

export type ActionState = { error?: string; ok?: boolean; inviteUrl?: string };

const ROLES: Role[] = ["admin", "editor", "leitor"];

/** Quem pode editar conteúdo (capítulos e trilhas). */
const canEdit = () => requireRole("admin", "editor");

async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${proto}://${host}`;
}

async function trailExists(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ slug: trails.slug })
    .from(trails)
    .where(eq(trails.slug, slug))
    .limit(1);
  return Boolean(row);
}

async function chapterExists(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ slug: chapters.slug })
    .from(chapters)
    .where(eq(chapters.slug, slug))
    .limit(1);
  return Boolean(row);
}

/** Revalida tudo que depende da lista de trilhas. */
function revalidateTrails() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
}

const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

function isRateLimited(email: string): boolean {
  const attempt = loginAttempts.get(email);
  if (!attempt) return false;
  if (Date.now() < attempt.lockUntil) return true;
  return false;
}

function recordFailure(email: string) {
  const attempt = loginAttempts.get(email) ?? { count: 0, lockUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockUntil = Date.now() + 60 * 1000 * 15; // 15 minutos
  }
  loginAttempts.set(email, attempt);
}

function recordSuccess(email: string) {
  loginAttempts.delete(email);
}

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  if (isRateLimited(email)) {
    return { error: "Muitas tentativas falhas. Conta bloqueada temporariamente por 15 minutos." };
  }

  const user = await getUserByEmail(email);
  // Mensagem genérica de propósito (não revela se o e-mail existe).
  if (!user || user.status !== "active" || !verifyPassword(password, user.passwordHash)) {
    recordFailure(email);
    return { error: "E-mail ou senha incorretos." };
  }

  recordSuccess(email);

  await setSession({
    uid: user.id,
    email: user.email,
    role: user.role as Role,
  });
  redirect(user.role === "leitor" ? "/" : "/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

/**
 * Marca/desmarca um capítulo como concluído para a pessoa logada. Qualquer
 * papel (leitor/editor/admin) registra o próprio progresso. Devolve o novo
 * estado pro cliente atualizar a UI.
 */
export async function toggleChapterDone(
  slug: string,
): Promise<{ done: boolean } | null> {
  const session = await getSessionUser();
  if (!session || !slug) return null;
  const done = await toggleProgress(session.uid, slug);
  revalidatePath("/");
  revalidatePath(`/c/${slug}`);
  revalidatePath("/admin/progresso");
  return { done };
}

// Servidor (Vercel) roda em UTC; fixamos o fuso de Brasília na exibição.
const TZ = "America/Sao_Paulo";

function today(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

/** Carimbo de exibição com data e hora: "dd/mm/aaaa às HH:mm". */
function now(): string {
  const d = new Date();
  const date = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date} às ${time}`;
}

export async function saveChapter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await canEdit();
  if (!me) return { error: "Sem permissão. Faça login de novo." };

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const readTime = String(formData.get("readTime") ?? "").trim();
  const trailSlug = String(formData.get("trail") ?? "").trim();
  const number = String(formData.get("number") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "");
  const areaSlugs = formData.getAll("areas").map(String).filter(Boolean);
  const revisionNote = String(formData.get("revisionNote") ?? "").trim();

  if (!slug) return { error: "Capítulo inválido." };
  if (!title) return { error: "O título é obrigatório." };
  if (!(await trailExists(trailSlug))) return { error: "Trilha inválida." };

  const author = me.name || me.email;
  const updateTime = now();

  await db
    .update(chapters)
    .set({
      title,
      description,
      readTime,
      trailSlug,
      number,
      sortOrder: Number.parseInt(number, 10) || 0,
      bodyHtml,
      updatedAt: updateTime,
      updatedBy: author,
    })
    .where(eq(chapters.slug, slug));

  // Áreas do capítulo (muitos-para-muitos): substitui o conjunto. Filtra
  // contra as áreas existentes (defesa; os checkboxes já vêm das válidas).
  const validAreas = areaSlugs.length
    ? (
        await db
          .select({ slug: areas.slug })
          .from(areas)
          .where(inArray(areas.slug, areaSlugs))
      ).map((r) => r.slug)
    : [];
  await db.delete(chapterAreas).where(eq(chapterAreas.chapterSlug, slug));
  if (validAreas.length) {
    await db
      .insert(chapterAreas)
      .values(validAreas.map((a) => ({ chapterSlug: slug, areaSlug: a })));
  }

  // Salva no histórico de versões
  await db.insert(chapterVersions).values({
    id: randomUUID(),
    chapterSlug: slug,
    title,
    description,
    bodyHtml,
    updatedAt: updateTime,
    updatedBy: author,
    revisionNote: revisionNote || "Edição sem notas de revisão",
  });

  await logAction("chapter.update", title, `/c/${slug}`);

  // atualiza as páginas públicas e a lista do admin
  revalidatePath("/");
  revalidatePath(`/c/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/${slug}`);

  return { ok: true };
}

// ──────────────────────────────────────────────────────────────────────────
// Página inicial — conteúdo do hero de boas-vindas (/admin/inicio).
// ──────────────────────────────────────────────────────────────────────────

export async function saveHome(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const tag = String(formData.get("tag") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const readTime = String(formData.get("readTime") ?? "").trim();
  const noteLabel = String(formData.get("noteLabel") ?? "").trim();
  const noteText = String(formData.get("noteText") ?? "").trim();

  if (!title) return { error: "O título é obrigatório." };

  await saveHomeContent({
    tag,
    title,
    subtitle,
    readTime,
    noteLabel,
    noteText,
  });
  await logAction("home.update", "Página inicial");
  revalidatePath("/");
  revalidatePath("/admin/inicio");
  return { ok: true };
}

// ──────────────────────────────────────────────────────────────────────────
// Perfil — a própria pessoa edita seu nome de exibição (/conta). Qualquer papel.
// ──────────────────────────────────────────────────────────────────────────

export async function updateOwnProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSessionUser();
  if (!session) return { error: "Sessão expirada. Faça login de novo." };

  const name = String(formData.get("name") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!name) return { error: "Informe seu nome." };
  if (name.length > 60) return { error: "Nome muito longo (máx. 60)." };

  await setUserProfile(session.uid, name, avatarUrl);
  await logAction("profile.update", name);
  revalidatePath("/");
  revalidatePath("/conta");
  return { ok: true };
}

// ──────────────────────────────────────────────────────────────────────────
// Upload de ícone de ferramenta (Vercel Blob). Usado pelo bloco "Ferramentas".
// ──────────────────────────────────────────────────────────────────────────

const ICON_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "image/gif",
];
const ICON_MAX = 512 * 1024; // 512 KB

export async function uploadToolIcon(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  if (!(await canEdit())) return { error: "Sem permissão." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "Selecione uma imagem." };
  if (!ICON_TYPES.includes(file.type))
    return { error: "Formato inválido (use PNG, SVG, JPG, WEBP ou GIF)." };
  if (file.size > ICON_MAX) return { error: "Imagem muito grande (máx. 512 KB)." };

  const ext = (file.name.split(".").pop() || "png").toLowerCase().slice(0, 5);
  try {
    const blob = await put(`tool-icons/${randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });
    return { url: blob.url };
  } catch {
    return { error: "Falha no upload. Tente de novo." };
  }
}

/** Upload da foto de perfil (qualquer usuário logado envia a própria). */
export async function uploadAvatar(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const session = await getSessionUser();
  if (!session) return { error: "Sessão expirada. Faça login de novo." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "Selecione uma imagem." };
  if (!ICON_TYPES.includes(file.type))
    return { error: "Formato inválido (use PNG, JPG, WEBP ou GIF)." };
  if (file.size > ICON_MAX) return { error: "Imagem muito grande (máx. 512 KB)." };

  const ext = (file.name.split(".").pop() || "png").toLowerCase().slice(0, 5);
  try {
    const blob = await put(`avatars/${randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });
    return { url: blob.url };
  } catch {
    return { error: "Falha no upload. Tente de novo." };
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Trilhas (seções do menu) — CRUD pelo /admin/trilhas
// ──────────────────────────────────────────────────────────────────────────

export async function createTrail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title) return { error: "O título é obrigatório." };

  const base = slugify(title);
  if (!base) return { error: "Esse título não gera um identificador válido." };

  // slug único: base, base-2, base-3, ...
  let slug = base;
  let n = 2;
  while (await trailExists(slug)) slug = `${base}-${n++}`;

  // nova trilha vai pro fim da ordem
  const existing = await db.select({ sortOrder: trails.sortOrder }).from(trails);
  const sortOrder = existing.reduce((m, r) => Math.max(m, r.sortOrder), 0) + 1;

  await db.insert(trails).values({ slug, title, description, sortOrder });
  await logAction("trail.create", title);
  revalidateTrails();
  return { ok: true };
}

export async function updateTrail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!slug || !(await trailExists(slug))) return { error: "Trilha inválida." };
  if (!title) return { error: "O título é obrigatório." };

  await db
    .update(trails)
    .set({ title, description })
    .where(eq(trails.slug, slug));
  await logAction("trail.update", title);
  revalidateTrails();
  return { ok: true };
}

export async function deleteTrail(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  // bloqueio: não exclui trilha que ainda tem capítulos
  const inUse = await db
    .select({ slug: chapters.slug })
    .from(chapters)
    .where(eq(chapters.trailSlug, slug))
    .limit(1);
  if (inUse.length > 0) return;

  const [row] = await db
    .select({ title: trails.title })
    .from(trails)
    .where(eq(trails.slug, slug))
    .limit(1);

  await db.delete(trails).where(eq(trails.slug, slug));
  await logAction("trail.delete", row?.title ?? slug);
  revalidateTrails();
}

// ──────────────────────────────────────────────────────────────────────────
// Áreas (Negócios, Desenvolvimento, …) — CRUD pelo /admin/areas
// ──────────────────────────────────────────────────────────────────────────

async function areaExists(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ slug: areas.slug })
    .from(areas)
    .where(eq(areas.slug, slug))
    .limit(1);
  return Boolean(row);
}

/** Revalida o que depende das áreas (leitor + telas de admin que as listam). */
function revalidateAreas() {
  revalidatePath("/");
  revalidatePath("/admin/areas");
  revalidatePath("/admin/usuarios");
}

export async function createArea(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "O nome é obrigatório." };

  const base = slugify(name);
  if (!base) return { error: "Esse nome não gera um identificador válido." };

  let slug = base;
  let n = 2;
  while (await areaExists(slug)) slug = `${base}-${n++}`;

  const existing = await db.select({ sortOrder: areas.sortOrder }).from(areas);
  const sortOrder = existing.reduce((m, r) => Math.max(m, r.sortOrder), 0) + 1;

  await db.insert(areas).values({ slug, name, description, sortOrder });
  await logAction("area.create", name);
  revalidateAreas();
  return { ok: true };
}

export async function updateArea(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!slug || !(await areaExists(slug))) return { error: "Área inválida." };
  if (!name) return { error: "O nome é obrigatório." };

  await db.update(areas).set({ name, description }).where(eq(areas.slug, slug));
  await logAction("area.update", name);
  revalidateAreas();
  return { ok: true };
}

export async function deleteArea(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  // bloqueio: não exclui área com capítulos vinculados
  const inUse = await db
    .select({ chapterSlug: chapterAreas.chapterSlug })
    .from(chapterAreas)
    .where(eq(chapterAreas.areaSlug, slug))
    .limit(1);
  if (inUse.length > 0) return;

  const [row] = await db
    .select({ name: areas.name })
    .from(areas)
    .where(eq(areas.slug, slug))
    .limit(1);

  await db.delete(areas).where(eq(areas.slug, slug));
  await logAction("area.delete", row?.name ?? slug);
  revalidateAreas();
}

export async function moveArea(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  const dir = String(formData.get("dir") ?? "");

  const all = await db
    .select()
    .from(areas)
    .orderBy(asc(areas.sortOrder), asc(areas.name));
  const i = all.findIndex((a) => a.slug === slug);
  if (i < 0) return;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= all.length) return;

  const reordered = [...all];
  [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
  for (let k = 0; k < reordered.length; k++) {
    if (reordered[k].sortOrder !== k + 1) {
      await db
        .update(areas)
        .set({ sortOrder: k + 1 })
        .where(eq(areas.slug, reordered[k].slug));
    }
  }
  revalidateAreas();
}

// ──────────────────────────────────────────────────────────────────────────
// Quizzes — criar/salvar/excluir (/admin/quiz/[slug])
// ──────────────────────────────────────────────────────────────────────────

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(String(v ?? ""), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Cria um quiz vazio numa trilha e leva direto pro editor. */
export async function createQuiz(formData: FormData) {
  const me = await canEdit();
  if (!me) return;
  const trailSlug = String(formData.get("trail") ?? "").trim();
  if (!(await trailExists(trailSlug))) return;
  const areaSlug = String(formData.get("area") ?? "").trim();

  const base = "novo-quiz";
  let slug = base;
  let n = 2;
  while (await quizExists(slug)) slug = `${base}-${n++}`;

  const all = await db.select({ sortOrder: quizzes.sortOrder }).from(quizzes);
  const maxSort = all.reduce((m, r) => Math.max(m, r.sortOrder), 0);

  await db.insert(quizzes).values({
    slug,
    title: "Novo quiz",
    description: "",
    trailSlug,
    passThreshold: 70,
    secondsPerQuestion: 20,
    sortOrder: maxSort + 1,
    updatedAt: now(),
    updatedBy: me.name || me.email,
  });
  if (areaSlug && (await areaExists(areaSlug))) {
    await db
      .insert(quizAreas)
      .values({ quizSlug: slug, areaSlug })
      .onConflictDoNothing();
  }
  await logAction("quiz.create", "Novo quiz", `/admin/quiz/${slug}`);
  revalidatePath("/admin");
  redirect(`/admin/quiz/${slug}`);
}

interface IncomingQuestion {
  type?: string;
  text?: string;
  options?: { text?: string; correct?: boolean }[];
}

/** Salva o quiz inteiro: meta + áreas + pré-requisitos + perguntas (substitui). */
export async function saveQuiz(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await canEdit();
  if (!me) return { error: "Sem permissão. Faça login de novo." };

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const trailSlug = String(formData.get("trail") ?? "").trim();
  const passThreshold = clampInt(formData.get("passThreshold"), 0, 100, 70);
  const secondsPerQuestion = clampInt(formData.get("secondsPerQuestion"), 5, 120, 20);
  const areaSlugs = formData.getAll("areas").map(String).filter(Boolean);
  const prereqSlugs = formData.getAll("prereqs").map(String).filter(Boolean);

  if (!slug || !(await quizExists(slug))) return { error: "Quiz inválido." };
  if (!title) return { error: "O título é obrigatório." };
  if (!(await trailExists(trailSlug))) return { error: "Trilha inválida." };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("questions") ?? "[]"));
  } catch {
    raw = [];
  }
  const cleanQuestions: { type: string; text: string; options: { text: string; correct: boolean }[] }[] = [];
  for (const q of Array.isArray(raw) ? (raw as IncomingQuestion[]) : []) {
    const text = String(q.text ?? "").trim();
    const type = q.type === "tf" ? "tf" : "mc";
    const options = Array.isArray(q.options)
      ? q.options
          .map((o) => ({ text: String(o.text ?? "").trim(), correct: Boolean(o.correct) }))
          .filter((o) => o.text)
      : [];
    if (!text || options.length < 2 || !options.some((o) => o.correct)) continue;
    cleanQuestions.push({ type, text, options });
  }
  if (cleanQuestions.length === 0) {
    return { error: "Adicione ao menos uma pergunta válida (enunciado, 2+ opções e uma correta)." };
  }

  await db
    .update(quizzes)
    .set({
      title,
      description,
      trailSlug,
      passThreshold,
      secondsPerQuestion,
      updatedAt: now(),
      updatedBy: me.name || me.email,
    })
    .where(eq(quizzes.slug, slug));

  // áreas (substitui, validando)
  const validAreas = areaSlugs.length
    ? (await db.select({ slug: areas.slug }).from(areas).where(inArray(areas.slug, areaSlugs))).map((r) => r.slug)
    : [];
  await db.delete(quizAreas).where(eq(quizAreas.quizSlug, slug));
  if (validAreas.length) {
    await db.insert(quizAreas).values(validAreas.map((a) => ({ quizSlug: slug, areaSlug: a })));
  }

  // pré-requisitos (substitui, validando contra capítulos existentes)
  const validPrereqs = prereqSlugs.length
    ? (await db.select({ slug: chapters.slug }).from(chapters).where(inArray(chapters.slug, prereqSlugs))).map((r) => r.slug)
    : [];
  await db.delete(quizPrereqs).where(eq(quizPrereqs.quizSlug, slug));
  if (validPrereqs.length) {
    await db.insert(quizPrereqs).values(validPrereqs.map((c) => ({ quizSlug: slug, chapterSlug: c })));
  }

  // perguntas (substitui o conjunto)
  await db.delete(quizQuestions).where(eq(quizQuestions.quizSlug, slug));
  await db.insert(quizQuestions).values(
    cleanQuestions.map((q, i) => ({
      id: randomUUID(),
      quizSlug: slug,
      type: q.type,
      text: q.text,
      options: q.options,
      points: 1000,
      sortOrder: i + 1,
    })),
  );

  await logAction("quiz.update", title, `/admin/quiz/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/quiz/${slug}`);
  return { ok: true };
}

export async function deleteQuiz(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  const [row] = await db
    .select({ title: quizzes.title })
    .from(quizzes)
    .where(eq(quizzes.slug, slug))
    .limit(1);
  // cascade remove perguntas/pré-requisitos/áreas/resultados
  await db.delete(quizzes).where(eq(quizzes.slug, slug));
  await logAction("quiz.delete", row?.title ?? slug);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

/**
 * Registra uma tentativa de quiz. O servidor RECOMPUTA acertos e pontos a
 * partir do banco (o cliente manda só a opção escolhida e o tempo) — assim o
 * XP gravado é confiável. Qualquer pessoa logada registra a própria tentativa.
 */
export async function submitQuizResult(input: {
  quizSlug: string;
  answers: { questionId: string; chosenIndex: number; msTaken: number }[];
}): Promise<
  | { ok: true; score: number; correctCount: number; total: number; passed: boolean; passThreshold: number }
  | { ok: false; error: string }
> {
  const session = await getSessionUser();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const { quizSlug, answers } = input;
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.slug, quizSlug))
    .limit(1);
  if (!quiz) return { ok: false, error: "Quiz não encontrado." };

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizSlug, quizSlug))
    .orderBy(asc(quizQuestions.sortOrder));
  const total = questions.length;
  if (total === 0) return { ok: false, error: "Quiz sem perguntas." };

  const maxMs = quiz.secondsPerQuestion * 1000;
  const byQ = new Map(answers.map((a) => [a.questionId, a]));
  let score = 0;
  let correctCount = 0;
  for (const q of questions) {
    const a = byQ.get(q.id);
    if (!a) continue;
    const opt = q.options[a.chosenIndex];
    if (opt && opt.correct) {
      correctCount += 1;
      const used = Math.min(Math.max(0, a.msTaken), maxMs);
      const left = maxMs - used;
      score += Math.round(500 + 500 * (left / maxMs)); // 500–1000 por acerto
    }
  }
  const pct = Math.round((correctCount / total) * 100);
  const passed = pct >= quiz.passThreshold;

  await db.insert(quizResults).values({
    id: randomUUID(),
    userId: session.uid,
    quizSlug,
    score,
    correctCount,
    totalQuestions: total,
    passed,
    takenAt: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/admin/progresso");
  return { ok: true, score, correctCount, total, passed, passThreshold: quiz.passThreshold };
}

// ──────────────────────────────────────────────────────────────────────────
// Capítulos — criar e excluir (Fase 3). saveChapter (acima) só faz UPDATE.
// ──────────────────────────────────────────────────────────────────────────

/**
 * Cria um capítulo vazio na trilha escolhida e leva o editor direto pra ele.
 * Slug, número e ordem são gerados aqui; o conteúdo fica como rascunho.
 */
export async function createChapter(formData: FormData) {
  const me = await canEdit();
  if (!me) return;

  const trailSlug = String(formData.get("trail") ?? "").trim();
  if (!(await trailExists(trailSlug))) return;

  // área opcional: se vier (e existir), o capítulo já nasce vinculado a ela;
  // sem área, mantém o comportamento antigo (nasce rascunho).
  const areaSlug = String(formData.get("area") ?? "").trim();

  // slug único: novo-capitulo, novo-capitulo-2, ...
  const base = "novo-capitulo";
  let slug = base;
  let n = 2;
  while (await chapterExists(slug)) slug = `${base}-${n++}`;

  // número e ordem vão pro fim da lista global (hoje a numeração é global)
  const all = await db
    .select({ number: chapters.number, sortOrder: chapters.sortOrder })
    .from(chapters);
  const maxSort = all.reduce((m, r) => Math.max(m, r.sortOrder), 0);
  const maxNum = all.reduce(
    (m, r) => Math.max(m, Number.parseInt(r.number, 10) || 0),
    0,
  );
  const number = String(maxNum + 1).padStart(2, "0");

  await db.insert(chapters).values({
    slug,
    sortOrder: maxSort + 1,
    number,
    trailSlug,
    title: "Novo capítulo",
    description: "",
    readTime: "5 min",
    bodyHtml: "<p>Escreva o conteúdo do capítulo aqui.</p>",
    updatedAt: now(),
    updatedBy: me.name || me.email,
    onboardingTrack: "negocios",
  });

  if (areaSlug && (await areaExists(areaSlug))) {
    await db
      .insert(chapterAreas)
      .values({ chapterSlug: slug, areaSlug })
      .onConflictDoNothing();
  }

  await logAction("chapter.create", "Novo capítulo", `/c/${slug}`);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
  redirect(`/admin/${slug}`);
}

/**
 * Vincula um capítulo a uma área (chapter_areas). Usado no /admin organizado
 * por área: "Adicionar à área" num rascunho ou reúso do mesmo capítulo.
 */
export async function assignChapterArea(formData: FormData) {
  if (!(await canEdit())) return;
  const chapterSlug = String(formData.get("slug") ?? "").trim();
  const areaSlug = String(formData.get("area") ?? "").trim();
  if (!chapterSlug || !areaSlug) return;
  if (!(await chapterExists(chapterSlug)) || !(await areaExists(areaSlug))) return;

  await db
    .insert(chapterAreas)
    .values({ chapterSlug, areaSlug })
    .onConflictDoNothing();

  revalidatePath("/");
  revalidatePath("/admin");
}

/** Desvincula um capítulo de uma área (remove só a ligação, não o capítulo). */
export async function removeChapterArea(formData: FormData) {
  if (!(await canEdit())) return;
  const chapterSlug = String(formData.get("slug") ?? "").trim();
  const areaSlug = String(formData.get("area") ?? "").trim();
  if (!chapterSlug || !areaSlug) return;

  await db
    .delete(chapterAreas)
    .where(
      and(
        eq(chapterAreas.chapterSlug, chapterSlug),
        eq(chapterAreas.areaSlug, areaSlug),
      ),
    );

  revalidatePath("/");
  revalidatePath("/admin");
}

/** Exclui um capítulo de vez e volta pra lista. */
export async function deleteChapter(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  const [row] = await db
    .select({ title: chapters.title })
    .from(chapters)
    .where(eq(chapters.slug, slug))
    .limit(1);

  await db.delete(chapters).where(eq(chapters.slug, slug));
  await logAction("chapter.delete", row?.title ?? slug, `/c/${slug}`);

  revalidatePath("/");
  revalidatePath(`/c/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
  redirect("/admin");
}

// ──────────────────────────────────────────────────────────────────────────
// Usuários — sistema de acesso interno (/admin/usuarios). Só Admin gerencia.
// ──────────────────────────────────────────────────────────────────────────

/** Cria um convite e devolve o link pra você enviar à pessoa. */
export async function createUserInvite(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireRole("admin")))
    return { error: "Só administradores criam acessos." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;
  const onboardingTrack = String(formData.get("onboardingTrack") ?? "negocios").trim();

  if (!email || !email.includes("@")) return { error: "E-mail inválido." };
  if (!ROLES.includes(role)) return { error: "Papel inválido." };
  if (await getUserByEmail(email))
    return { error: "Já existe um acesso com esse e-mail." };

  const token = await createInvite({ email, name, role, onboardingTrack });
  await logAction("user.invite", name || email, `papel: ${role}`);
  revalidatePath("/admin/usuarios");
  return { ok: true, inviteUrl: `${await origin()}/convite/${token}` };
}

/** Gera um novo link de convite (caso o anterior tenha vencido/sumido). */
export async function regenerateInvite(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireRole("admin")))
    return { error: "Só administradores criam acessos." };
  const id = String(formData.get("id") ?? "");
  const token = await resetInvite(id);
  if (!token) return { error: "Esse acesso já foi ativado ou não existe." };
  revalidatePath("/admin/usuarios");
  return { ok: true, inviteUrl: `${await origin()}/convite/${token}` };
}

export async function changeUserRole(formData: FormData) {
  if (!(await requireRole("admin"))) return;
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  if (!id || !ROLES.includes(role)) return;

  const session = await getSessionUser();
  if (session?.uid === id) return; // não muda o próprio papel (evita lockout)

  const target = await getUserById(id);
  if (!target || target.role === role) return;

  // não rebaixar o último admin
  if (target.role === "admin" && role !== "admin" && (await countAdmins()) <= 1)
    return;

  await setUserRole(id, role);
  await logAction(
    "user.role",
    target.name || target.email,
    `${target.role} → ${role}`,
  );
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/progresso");
}

export async function changeUserTrack(formData: FormData) {
  if (!(await requireRole("admin"))) return;
  const id = String(formData.get("id") ?? "");
  const track = String(formData.get("onboardingTrack") ?? "").trim();
  if (!id || !track) return;

  const target = await getUserById(id);
  if (!target || target.onboardingTrack === track) return;

  await setUserTrack(id, track);
  await logAction(
    "user.track",
    target.name || target.email,
    `${target.onboardingTrack} → ${track}`,
  );
  revalidatePath("/admin/usuarios");
}

export async function deleteUserAction(formData: FormData) {
  if (!(await requireRole("admin"))) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const session = await getSessionUser();
  if (session?.uid === id) return; // não se auto-remove (evita lockout)

  const target = await getUserById(id);
  if (target?.role === "admin" && (await countAdmins()) <= 1) return; // mantém ao menos 1 admin

  await deleteUser(id);
  await logAction("user.delete", target?.name || target?.email || id);
  revalidatePath("/admin/usuarios");
}

/** A pessoa convidada define a própria senha e já entra logada. */
export async function acceptInviteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8)
    return { error: "A senha precisa ter ao menos 8 caracteres." };
  if (password !== confirm) return { error: "As senhas não conferem." };

  const user = await acceptInvite(token, password);
  if (!user) return { error: "Convite inválido ou expirado." };

  await setSession({ uid: user.id, email: user.email, role: user.role as Role });
  redirect(user.role === "leitor" ? "/" : "/admin");
}

export async function moveTrail(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  const dir = String(formData.get("dir") ?? "");

  const all = await db
    .select()
    .from(trails)
    .orderBy(asc(trails.sortOrder), asc(trails.title));
  const i = all.findIndex((t) => t.slug === slug);
  if (i < 0) return;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= all.length) return;

  // troca a posição com o vizinho. Reatribui ordens 1..N pra evitar empates.
  const reordered = [...all];
  [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
  for (let k = 0; k < reordered.length; k++) {
    if (reordered[k].sortOrder !== k + 1) {
      await db
        .update(trails)
        .set({ sortOrder: k + 1 })
        .where(eq(trails.slug, reordered[k].slug));
    }
  }
  revalidateTrails();
}

export async function saveChaptersOrder(
  data: { slug: string; trailSlug: string }[],
) {
  if (!(await canEdit())) return;

  for (let i = 0; i < data.length; i++) {
    await db
      .update(chapters)
      .set({
        trailSlug: data[i].trailSlug,
        sortOrder: i + 1,
        number: String(i + 1).padStart(2, "0"),
      })
      .where(eq(chapters.slug, data[i].slug));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
}

export async function generateAIContent(
  promptType: string,
  text: string,
): Promise<{ text?: string; error?: string }> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };
  if (!text) return { error: "Nenhum texto selecionado." };

  // Chave e provedor vêm de variáveis de ambiente (Vercel) — sem segredo em
  // texto puro no banco. O provedor é inferido pela chave presente (Claude tem
  // prioridade).
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY;
  const provider = process.env.ANTHROPIC_API_KEY
    ? "claude"
    : process.env.GEMINI_API_KEY
      ? "gemini"
      : "openai";

  if (!apiKey) {
    return {
      error:
        "Nenhuma chave de API configurada. Defina ANTHROPIC_API_KEY (recomendado), OPENAI_API_KEY ou GEMINI_API_KEY nas variáveis de ambiente do projeto.",
    };
  }

  const systemPrompt = "Você é um assistente de IA especialista em redação técnica para analistas de sistemas.";
  let userPrompt = "";

  if (promptType === "acceptance_criteria") {
    userPrompt = `Gere critérios de aceite no formato estruturado BDD (Dado/Quando/Então) para o seguinte requisito ou descrição:\n\n${text}`;
  } else if (promptType === "simplify") {
    userPrompt = `Simplifique o jargão técnico do seguinte texto, tornando-o claro e compreensível para stakeholders de negócios, sem perder a precisão do conteúdo original:\n\n${text}`;
  } else if (promptType === "summarize") {
    userPrompt = `Escreva um resumo conciso (máximo de 2 a 3 frases) do seguinte texto, ideal para ser usado como descrição curta de um capítulo:\n\n${text}`;
  } else {
    userPrompt = `Expanda e melhore a redação do seguinte texto técnico, mantendo o tom profissional e instrutivo:\n\n${text}`;
  }

  try {
    if (provider === "claude" || apiKey.startsWith("sk-ant")) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            { role: "user", content: userPrompt }
          ],
        }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error.message || "Erro na API do Claude." };
      return { text: data.content[0]?.text || "" };
    } else if (provider === "gemini" || apiKey.includes("AIzaSy")) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
        }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error.message || "Erro na API do Gemini." };
      return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error.message || "Erro na API do OpenAI." };
      return { text: data.choices?.[0]?.message?.content || "" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Falha na comunicação com a API: ${msg}` };
  }
}

const MEDIA_TYPES = [...ICON_TYPES, "application/pdf"];
const MEDIA_MAX = 5 * 1024 * 1024; // 5 MB

/** Upload direto pela Biblioteca de mídias (/admin/midias). */
export async function uploadMedia(formData: FormData): Promise<{
  blob?: { url: string; pathname: string; size: number; uploadedAt: string };
  error?: string;
}> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "Selecione um arquivo." };
  if (!MEDIA_TYPES.includes(file.type))
    return { error: "Formato inválido (use PNG, JPG, SVG, WEBP, GIF ou PDF)." };
  if (file.size > MEDIA_MAX)
    return { error: "Arquivo muito grande (máx. 5 MB)." };

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 5);
  // nome legível: slug do nome original + sufixo curto único
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "midia";

  try {
    const blob = await put(`media/${base}-${randomUUID().slice(0, 8)}.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });
    await logAction("media.upload", file.name);
    revalidatePath("/admin/midias");
    return {
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    };
  } catch {
    return { error: "Falha no upload. Tente de novo." };
  }
}

export async function listMediaFiles() {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };
  try {
    const response = await list();
    return { blobs: response.blobs };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Erro ao listar mídias: ${msg}` };
  }
}

export async function deleteMediaFile(url: string) {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };
  try {
    await del(url);
    revalidatePath("/admin/midias");
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Erro ao deletar mídia: ${msg}` };
  }
}

export async function checkIsAiEnabled(): Promise<boolean> {
  return !!(
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY
  );
}
