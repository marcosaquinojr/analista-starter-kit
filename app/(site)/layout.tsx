import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CompletionProvider } from "@/components/completion";
import Shell from "@/components/Shell";
import Toaster from "@/components/Toaster";
import { getSessionUser } from "@/lib/auth";
import { getAreas } from "@/lib/areas";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getUserProgress } from "@/lib/progress";
import { getUserById } from "@/lib/users";
import { PREVIEW_AREA_COOKIE } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  const row = await getUserById(user.uid);
  const track = row?.onboardingTrack ?? "negocios";
  const isPrivileged = user.role === "admin" || user.role === "editor";

  // Preview "Visualizando como" (admin/editor): a área vem de um cookie —
  // layouts não leem searchParams, e é o layout que monta a sidebar.
  const cookieStore = await cookies();
  const previewSlug = isPrivileged
    ? cookieStore.get(PREVIEW_AREA_COOKIE)?.value
    : undefined;

  let viewingArea = track;
  let previewAreaName: string | null = null;
  if (previewSlug && previewSlug !== track) {
    const areas = await getAreas();
    const match = areas.find((a) => a.slug === previewSlug);
    if (match) {
      viewingArea = match.slug;
      previewAreaName = match.name;
    }
  }

  const [chapters, trails, completed] = await Promise.all([
    getChapters(viewingArea),
    getTrails(),
    getUserProgress(user.uid),
  ]);

  return (
    <CompletionProvider initialCompleted={completed}>
      <Shell
        chapters={chapters}
        trails={trails}
        user={{
          email: user.email,
          name: row?.name ?? "",
          role: user.role,
          avatarUrl: row?.avatarUrl ?? "",
          onboardingTrack: track,
        }}
        previewArea={previewAreaName}
      >
        {children}
      </Shell>
      <Toaster />
    </CompletionProvider>
  );
}
