import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import EditForm from "./EditForm";
import { getChapter, getChapterVersions } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getAreas, getChapterAreaSlugs } from "@/lib/areas";
import { checkIsAiEnabled } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [chapter, trails, allAreas, chapterAreas, versions, isAiEnabled] =
    await Promise.all([
      getChapter(slug),
      getTrails(),
      getAreas(),
      getChapterAreaSlugs(slug),
      getChapterVersions(slug),
      checkIsAiEnabled(),
    ]);
  if (!chapter) notFound();

  return (
    <AdminChrome>
      <EditForm
        chapter={chapter}
        trails={trails}
        allAreas={allAreas}
        chapterAreas={chapterAreas}
        versions={versions}
        isAiEnabled={isAiEnabled}
      />
    </AdminChrome>
  );
}
