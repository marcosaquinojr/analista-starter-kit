"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { ADMIN_COOKIE, sessionSecret, isAuthed } from "@/lib/auth";
import type { Trail } from "@/lib/types";

const TRAILS: Trail[] = ["Contexto", "Rotina", "Crescimento"];

export type ActionState = { error?: string; ok?: boolean };

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
  const trail = String(formData.get("trail") ?? "") as Trail;
  const number = String(formData.get("number") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "");

  if (!slug) return { error: "Capítulo inválido." };
  if (!title) return { error: "O título é obrigatório." };
  if (!TRAILS.includes(trail)) return { error: "Trilha inválida." };

  await db
    .update(chapters)
    .set({
      title,
      description,
      readTime,
      trail,
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
