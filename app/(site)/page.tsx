import HomeView from "@/components/HomeView";
import LandingPage from "@/components/LandingPage";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getHomeContent } from "@/lib/settings";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export default async function Home() {
  const user = await getSessionUser();
  if (!user) {
    return <LandingPage />;
  }

  const row = await getUserById(user.uid);
  const track = row?.onboardingTrack ?? "negocios";

  const [chapters, trails, home] = await Promise.all([
    getChapters(track),
    getTrails(),
    getHomeContent(),
  ]);
  return <HomeView chapters={chapters} trails={trails} home={home} />;
}
