import { CompletionProvider } from "@/components/completion";
import Shell from "@/components/Shell";
import { getChapters } from "@/lib/chapters";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getChapters();
  return (
    <CompletionProvider>
      <Shell chapters={chapters}>{children}</Shell>
    </CompletionProvider>
  );
}
