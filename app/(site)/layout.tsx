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
  // Leitura agora exige login: identifica a pessoa pra salvar o progresso.
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [chapters, trails, completed, lastUpdated, row] = await Promise.all([
    getChapters(),
    getTrails(),
    getUserProgress(user.uid),
    getLastUpdated(),
    getUserById(user.uid),
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
        }}
        lastUpdated={lastUpdated}
      >
        {children}
      </Shell>
      <Toaster />
    </CompletionProvider>
  );
}
