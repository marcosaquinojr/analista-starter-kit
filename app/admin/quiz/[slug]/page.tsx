import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import QuizEditor from "./QuizEditor";
import { getQuiz } from "@/lib/quizzes";
import { getTrails } from "@/lib/trails";
import { getAreas } from "@/lib/areas";
import { getChapters } from "@/lib/chapters";

export const dynamic = "force-dynamic";

export default async function QuizEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [quiz, trails, allAreas, allChapters] = await Promise.all([
    getQuiz(slug),
    getTrails(),
    getAreas(),
    getChapters(),
  ]);
  if (!quiz) notFound();

  return (
    <AdminChrome>
      <QuizEditor
        quiz={quiz}
        trails={trails}
        allAreas={allAreas}
        allChapters={allChapters}
      />
    </AdminChrome>
  );
}
