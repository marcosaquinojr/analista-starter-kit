import HomeView from "@/components/HomeView";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getHomeContent } from "@/lib/settings";

export default async function Home() {
  const [chapters, trails, home] = await Promise.all([
    getChapters(),
    getTrails(),
    getHomeContent(),
  ]);
  return <HomeView chapters={chapters} trails={trails} home={home} />;
}
