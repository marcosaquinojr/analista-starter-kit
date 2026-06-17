import AdminChrome from "@/components/AdminChrome";
import HomeEditor from "./HomeEditor";
import { getHomeContent } from "@/lib/settings";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [home, chapters, trails] = await Promise.all([
    getHomeContent(),
    getChapters(),
    getTrails(),
  ]);
  return (
    <AdminChrome>
      <HomeEditor
        home={home}
        chaptersCount={chapters.length}
        trailsCount={trails.length}
      />
    </AdminChrome>
  );
}
