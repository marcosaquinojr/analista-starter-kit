import { redirect } from "next/navigation";
import { CompletionProvider } from "@/components/completion";
import Shell from "@/components/Shell";
import Toaster from "@/components/Toaster";
import { getSessionUser } from "@/lib/auth";
import { getChapters, getLastUpdated } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getUserProgress } from "@/lib/progress";
import { getUserById } from "@/lib/users";

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

  const [chapters, trails, completed, lastUpdated] = await Promise.all([
    getChapters(track),
    getTrails(),
    getUserProgress(user.uid),
    getLastUpdated(),
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
        lastUpdated={lastUpdated}
      >
        {children}
      </Shell>
      <Toaster />
    </CompletionProvider>
  );
}
