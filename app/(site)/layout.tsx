import { CompletionProvider } from "@/components/completion";
import Shell from "@/components/Shell";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chapters, trails] = await Promise.all([getChapters(), getTrails()]);
  return (
    <CompletionProvider>
      <Shell chapters={chapters} trails={trails}>
        {children}
      </Shell>
    </CompletionProvider>
  );
}
