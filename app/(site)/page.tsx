import HomeView from "@/components/HomeView";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export default async function Home() {
  const [chapters, trails] = await Promise.all([getChapters(), getTrails()]);
  return <HomeView chapters={chapters} trails={trails} />;
}
