import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import EditForm from "./EditForm";
import { getChapter } from "@/lib/chapters";

export const dynamic = "force-dynamic";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = await getChapter(slug);
  if (!chapter) notFound();

  return (
    <AdminChrome>
      <EditForm chapter={chapter} />
    </AdminChrome>
  );
}
