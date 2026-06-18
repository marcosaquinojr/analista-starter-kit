import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  quizzes,
  quizQuestions,
  quizPrereqs,
  quizAreas,
  quizResults,
} from "@/lib/db/schema";

/**
 * Camada de acesso a quizzes. Um quiz é um "capítulo especial" gamificado:
 * pertence a uma trilha e a área(s), pode exigir capítulos (pré-requisitos) e
 * tem perguntas (múltipla escolha / V-F).
 */

export interface QuizMeta {
  slug: string;
  title: string;
  description: string;
  trailSlug: string;
  passThreshold: number;
  secondsPerQuestion: number;
  sortOrder: number;
}

export interface QuizQuestion {
  id: string;
  type: string; // 'mc' | 'tf'
  text: string;
  options: { text: string; correct: boolean }[];
  points: number;
  sortOrder: number;
}

export interface QuizFull extends QuizMeta {
  questions: QuizQuestion[];
  prereqSlugs: string[];
  areaSlugs: string[];
  updatedAt: string;
  updatedBy: string;
}

const metaCols = {
  slug: quizzes.slug,
  title: quizzes.title,
  description: quizzes.description,
  trailSlug: quizzes.trailSlug,
  passThreshold: quizzes.passThreshold,
  secondsPerQuestion: quizzes.secondsPerQuestion,
  sortOrder: quizzes.sortOrder,
};

export async function getQuizzes(): Promise<QuizMeta[]> {
  return db.select(metaCols).from(quizzes).orderBy(asc(quizzes.sortOrder));
}

/** Quizzes de uma área (via quiz_areas) — usado no leitor. */
export async function getQuizzesByArea(area: string): Promise<QuizMeta[]> {
  return db
    .select(metaCols)
    .from(quizzes)
    .innerJoin(quizAreas, eq(quizAreas.quizSlug, quizzes.slug))
    .where(eq(quizAreas.areaSlug, area))
    .orderBy(asc(quizzes.sortOrder));
}

export async function getQuiz(slug: string): Promise<QuizFull | null> {
  const [q] = await db.select().from(quizzes).where(eq(quizzes.slug, slug)).limit(1);
  if (!q) return null;
  const [questions, prereqs, areas] = await Promise.all([
    db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizSlug, slug))
      .orderBy(asc(quizQuestions.sortOrder)),
    db
      .select({ chapterSlug: quizPrereqs.chapterSlug })
      .from(quizPrereqs)
      .where(eq(quizPrereqs.quizSlug, slug)),
    db
      .select({ areaSlug: quizAreas.areaSlug })
      .from(quizAreas)
      .where(eq(quizAreas.quizSlug, slug)),
  ]);
  return {
    slug: q.slug,
    title: q.title,
    description: q.description,
    trailSlug: q.trailSlug,
    passThreshold: q.passThreshold,
    secondsPerQuestion: q.secondsPerQuestion,
    sortOrder: q.sortOrder,
    updatedAt: q.updatedAt,
    updatedBy: q.updatedBy,
    questions: questions.map((qq) => ({
      id: qq.id,
      type: qq.type,
      text: qq.text,
      options: qq.options,
      points: qq.points,
      sortOrder: qq.sortOrder,
    })),
    prereqSlugs: prereqs.map((p) => p.chapterSlug),
    areaSlugs: areas.map((a) => a.areaSlug),
  };
}

export interface ReaderQuiz {
  slug: string;
  title: string;
  description: string;
  trailSlug: string;
  questionCount: number;
  prereqSlugs: string[];
  passed: boolean;
}

/**
 * Quizzes que o leitor de uma área vê, com pré-requisitos (pra cadeado) e se a
 * pessoa já passou. O desbloqueio em si é checado no cliente contra o progresso.
 */
export async function getReaderQuizzes(
  area: string,
  userId: string,
): Promise<ReaderQuiz[]> {
  const qs = await getQuizzesByArea(area);
  if (qs.length === 0) return [];
  const slugs = qs.map((q) => q.slug);

  const [prereqs, results, counts] = await Promise.all([
    db
      .select()
      .from(quizPrereqs)
      .where(inArray(quizPrereqs.quizSlug, slugs)),
    db
      .select({ quizSlug: quizResults.quizSlug })
      .from(quizResults)
      .where(
        and(
          eq(quizResults.userId, userId),
          eq(quizResults.passed, true),
          inArray(quizResults.quizSlug, slugs),
        ),
      ),
    db
      .select({ quizSlug: quizQuestions.quizSlug })
      .from(quizQuestions)
      .where(inArray(quizQuestions.quizSlug, slugs)),
  ]);

  const prMap = new Map<string, string[]>();
  for (const p of prereqs) {
    const arr = prMap.get(p.quizSlug) ?? [];
    arr.push(p.chapterSlug);
    prMap.set(p.quizSlug, arr);
  }
  const passedSet = new Set(results.map((r) => r.quizSlug));
  const countMap = new Map<string, number>();
  for (const c of counts)
    countMap.set(c.quizSlug, (countMap.get(c.quizSlug) ?? 0) + 1);

  return qs
    .map((q) => ({
      slug: q.slug,
      title: q.title,
      description: q.description,
      trailSlug: q.trailSlug,
      questionCount: countMap.get(q.slug) ?? 0,
      prereqSlugs: prMap.get(q.slug) ?? [],
      passed: passedSet.has(q.slug),
    }))
    .filter((q) => q.questionCount > 0); // quiz sem pergunta não aparece
}

export async function quizExists(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ slug: quizzes.slug })
    .from(quizzes)
    .where(eq(quizzes.slug, slug))
    .limit(1);
  return Boolean(row);
}
