import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import AreaBoard from "@/app/admin/AreaBoard";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getAreas, getChapterAreaMap, getQuizAreaMap } from "@/lib/areas";
import { getQuizzes } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [chapters, trails, areas, quizzes, chapterAreaMap, quizAreaMap] =
    await Promise.all([
      getChapters(),
      getTrails(),
      getAreas(),
      getQuizzes(),
      getChapterAreaMap(),
      getQuizAreaMap(),
    ]);

  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <AdminChrome>
      <AreaBoard
        area={area}
        initialChapters={chapters}
        trails={trails}
        areas={areas}
        quizzes={quizzes}
        chapterAreaMap={chapterAreaMap}
        quizAreaMap={quizAreaMap}
      />
    </AdminChrome>
  );
}
