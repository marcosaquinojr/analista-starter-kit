import { redirect } from "next/navigation";
import HomeView from "@/components/HomeView";
import InicioOverlay from "@/components/InicioOverlay";
import InicioOverlayVideo from "@/components/InicioOverlayVideo";
import AreaSwitcher from "@/components/AreaSwitcher";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getHomeContent } from "@/lib/settings";
import { getReaderQuizzes } from "@/lib/quizzes";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { getAreas } from "@/lib/areas";

export default async function InicioPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; welcome?: string; boot?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const row = await getUserById(user.uid);
  const ownTrack = row?.onboardingTrack ?? "negocios";
  const isPrivileged = user.role === "admin" || user.role === "editor";

  const sp = await searchParams;
  const viewingArea = isPrivileged && sp.area ? sp.area : ownTrack;
  const showWelcome = sp.welcome === "1";
  // ?boot=glitch mostra o boot glitch; padrão (ou ?boot=video) usa o vídeo.
  const bootStyle = sp.boot === "glitch" ? "glitch" : "video";

  const [chapters, trails, home, quizzes, areas] = await Promise.all([
    getChapters(viewingArea),
    getTrails(),
    getHomeContent(),
    getReaderQuizzes(viewingArea, user.uid),
    isPrivileged ? getAreas() : Promise.resolve([]),
  ]);

  const userName = row?.name ?? "";

  return (
    <>
      {showWelcome &&
        (bootStyle === "glitch" ? (
          <InicioOverlay userName={userName} />
        ) : (
          <InicioOverlayVideo userName={userName} />
        ))}
      {isPrivileged && areas.length > 1 && (
        <AreaSwitcher areas={areas} currentArea={viewingArea} />
      )}
      <HomeView
        chapters={chapters}
        trails={trails}
        home={home}
        userName={userName}
        quizzes={quizzes}
      />
    </>
  );
}
