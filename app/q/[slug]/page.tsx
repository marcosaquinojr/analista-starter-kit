import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { getQuiz } from "@/lib/quizzes";
import { getUserProgress } from "@/lib/progress";
import QuizPlay from "./QuizPlay";

export const dynamic = "force-dynamic";

export default async function QuizPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { slug } = await params;
  const quiz = await getQuiz(slug);
  if (!quiz || quiz.questions.length === 0) notFound();

  const row = await getUserById(user.uid);
  const area = row?.onboardingTrack ?? "negocios";

  // Acesso: o quiz precisa ser da área da pessoa e ter os pré-requisitos
  // concluídos (defesa; o card já bloqueia). Admin/editor pula as duas
  // travas pra poder testar o quiz de qualquer área.
  const isPrivileged = user.role === "admin" || user.role === "editor";
  if (!isPrivileged) {
    if (quiz.areaSlugs.length > 0 && !quiz.areaSlugs.includes(area)) notFound();
    const done = new Set(await getUserProgress(user.uid));
    if (quiz.prereqSlugs.some((s) => !done.has(s))) notFound();
  }

  return (
    <QuizPlay
      quiz={{
        slug: quiz.slug,
        title: quiz.title,
        description: quiz.description,
        passThreshold: quiz.passThreshold,
        secondsPerQuestion: quiz.secondsPerQuestion,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          text: q.text,
          options: q.options,
        })),
      }}
    />
  );
}
