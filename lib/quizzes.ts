import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { quizzes, quizQuestions, quizPrereqs, quizAreas } from "@/lib/db/schema";

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

export async function quizExists(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ slug: quizzes.slug })
    .from(quizzes)
    .where(eq(quizzes.slug, slug))
    .limit(1);
  return Boolean(row);
}
