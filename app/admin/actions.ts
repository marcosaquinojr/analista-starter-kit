"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters, trails } from "@/lib/db/schema";
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
  setUserName,
  countAdmins,
} from "@/lib/users";
import { saveHomeContent } from "@/lib/settings";
import { toggleProgress } from "@/lib/progress";
import { put } from "@vercel/blob";
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

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const user = await getUserByEmail(email);
  // Mensagem genérica de propósito (não revela se o e-mail existe).
  if (!user || user.status !== "active" || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha incorretos." };
  }

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

function today(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

export async function saveChapter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await canEdit())) return { error: "Sem permissão. Faça login de novo." };

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const readTime = String(formData.get("readTime") ?? "").trim();
  const trailSlug = String(formData.get("trail") ?? "").trim();
  const number = String(formData.get("number") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "");

  if (!slug) return { error: "Capítulo inválido." };
  if (!title) return { error: "O título é obrigatório." };
  if (!(await trailExists(trailSlug))) return { error: "Trilha inválida." };

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
      updatedAt: today(),
    })
    .where(eq(chapters.slug, slug));

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

  if (!title) return { error: "O título é obrigatório." };

  await saveHomeContent({ tag, title, subtitle, readTime });
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
  if (!name) return { error: "Informe seu nome." };
  if (name.length > 60) return { error: "Nome muito longo (máx. 60)." };

  await setUserName(session.uid, name);
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

  await db.delete(trails).where(eq(trails.slug, slug));
  revalidateTrails();
}

// ──────────────────────────────────────────────────────────────────────────
// Capítulos — criar e excluir (Fase 3). saveChapter (acima) só faz UPDATE.
// ──────────────────────────────────────────────────────────────────────────

/**
 * Cria um capítulo vazio na trilha escolhida e leva o editor direto pra ele.
 * Slug, número e ordem são gerados aqui; o conteúdo fica como rascunho.
 */
export async function createChapter(formData: FormData) {
  if (!(await canEdit())) return;

  const trailSlug = String(formData.get("trail") ?? "").trim();
  if (!(await trailExists(trailSlug))) return;

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
    updatedAt: today(),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
  redirect(`/admin/${slug}`);
}

/** Exclui um capítulo de vez e volta pra lista. */
export async function deleteChapter(formData: FormData) {
  if (!(await canEdit())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await db.delete(chapters).where(eq(chapters.slug, slug));

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

  if (!email || !email.includes("@")) return { error: "E-mail inválido." };
  if (!ROLES.includes(role)) return { error: "Papel inválido." };
  if (await getUserByEmail(email))
    return { error: "Já existe um acesso com esse e-mail." };

  const token = await createInvite({ email, name, role });
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
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/progresso");
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
