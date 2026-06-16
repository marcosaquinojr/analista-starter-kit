"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters, trails } from "@/lib/db/schema";
import { ADMIN_COOKIE, sessionSecret, isAuthed } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type ActionState = { error?: string; ok?: boolean };

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
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Senha incorreta." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
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
  if (!(await isAuthed())) return { error: "Sessão expirada. Faça login de novo." };

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
// Trilhas (seções do menu) — CRUD pelo /admin/trilhas
// ──────────────────────────────────────────────────────────────────────────

export async function createTrail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Sessão expirada. Faça login de novo." };

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
  if (!(await isAuthed())) return { error: "Sessão expirada. Faça login de novo." };

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
  if (!(await isAuthed())) return;
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
  if (!(await isAuthed())) return;

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
  if (!(await isAuthed())) return;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await db.delete(chapters).where(eq(chapters.slug, slug));

  revalidatePath("/");
  revalidatePath(`/c/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/trilhas");
  redirect("/admin");
}

export async function moveTrail(formData: FormData) {
  if (!(await isAuthed())) return;
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
