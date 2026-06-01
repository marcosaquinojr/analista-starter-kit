import HomeView from "@/components/HomeView";
import { getChapters } from "@/lib/chapters";

export default async function Home() {
  const chapters = await getChapters();
  return <HomeView chapters={chapters} />;
}
