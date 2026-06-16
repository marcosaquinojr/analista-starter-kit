import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import EditForm from "./EditForm";
import { getChapter } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export const dynamic = "force-dynamic";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [chapter, trails] = await Promise.all([getChapter(slug), getTrails()]);
  if (!chapter) notFound();

  return (
    <AdminChrome>
      <EditForm chapter={chapter} trails={trails} />
    </AdminChrome>
  );
}
