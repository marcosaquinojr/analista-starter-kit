import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { progress, users } from "@/lib/db/schema";

/**
 * Progresso de leitura por pessoa, persistido no Postgres (Neon). Substitui o
 * localStorage: durável, por usuário, e visível no dashboard do admin.
 */

/** Slugs dos capítulos que o usuário concluiu. */
export async function getUserProgress(userId: string): Promise<string[]> {
  const rows = await db
    .select({ slug: progress.chapterSlug })
    .from(progress)
    .where(eq(progress.userId, userId));
  return rows.map((r) => r.slug);
}

/** Alterna a conclusão de um capítulo; devolve o novo estado (true = concluído). */
export async function toggleProgress(
  userId: string,
  slug: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ slug: progress.chapterSlug })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.chapterSlug, slug)))
    .limit(1);

  if (existing) {
    await db
      .delete(progress)
      .where(and(eq(progress.userId, userId), eq(progress.chapterSlug, slug)));
    return false;
  }

  await db
    .insert(progress)
    .values({
      userId,
      chapterSlug: slug,
      completedAt: new Date().toISOString(),
    })
    .onConflictDoNothing();
  return true;
}

export interface UserProgress {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  doneCount: number;
  lastCompletedAt: string | null;
}

/**
 * Visão consolidada para o dashboard do admin: cada usuário com quantos
 * capítulos concluiu e quando foi a última conclusão.
 */
export async function getProgressOverview(): Promise<UserProgress[]> {
  const [us, ps] = await Promise.all([
    db.select().from(users).orderBy(asc(users.createdAt)),
    db.select().from(progress),
  ]);

  const byUser = new Map<string, { count: number; last: string | null }>();
  for (const p of ps) {
    const agg = byUser.get(p.userId) ?? { count: 0, last: null };
    agg.count += 1;
    if (!agg.last || p.completedAt > agg.last) agg.last = p.completedAt;
    byUser.set(p.userId, agg);
  }

  return us.map((u) => {
    const agg = byUser.get(u.id);
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
      doneCount: agg?.count ?? 0,
      lastCompletedAt: agg?.last ?? null,
    };
  });
}
