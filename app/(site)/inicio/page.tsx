import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
import { PREVIEW_AREA_COOKIE } from "@/lib/session-cookie";

export default async function InicioPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; boot?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const row = await getUserById(user.uid);
  const ownTrack = row?.onboardingTrack ?? "negocios";
  const isPrivileged = user.role === "admin" || user.role === "editor";

  const sp = await searchParams;
  const showWelcome = sp.welcome === "1";
  // ?boot=glitch mostra o boot glitch; padrão (ou ?boot=video) usa o vídeo.
  const bootStyle = sp.boot === "glitch" ? "glitch" : "video";

  // Preview de área via cookie (mesma fonte que o layout/sidebar usa).
  const areas = isPrivileged ? await getAreas() : [];
  const cookieStore = await cookies();
  const previewSlug = isPrivileged
    ? cookieStore.get(PREVIEW_AREA_COOKIE)?.value
    : undefined;
  const viewingArea =
    previewSlug && areas.some((a) => a.slug === previewSlug)
      ? previewSlug
      : ownTrack;

  const [chapters, trails, home, quizzes] = await Promise.all([
    getChapters(viewingArea),
    getTrails(),
    getHomeContent(),
    getReaderQuizzes(viewingArea, user.uid),
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
