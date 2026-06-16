import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter, getChapters, getChapterSlugs } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import ChapterComplete from "@/components/ChapterComplete";

export async function generateStaticParams() {
  const slugs = await getChapterSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapter(slug);
  if (!chapter) return { title: "Capítulo não encontrado" };
  return {
    title: `${chapter.number} ${chapter.title} — Citiesoft Academy`,
    description: chapter.description,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = await getChapter(slug);
  if (!chapter) notFound();

  const [all, trails] = await Promise.all([getChapters(), getTrails()]);
  const idx = all.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;
  const trailTitle =
    trails.find((t) => t.slug === chapter.trailSlug)?.title ?? chapter.trailSlug;

  return (
    <article>
      <div className="chapter-header">
        <span className="chapter-tag">
          {trailTitle} · Cap {chapter.number}
        </span>
        <h1 className="chapter-title">{chapter.title}</h1>
        <p className="chapter-desc">{chapter.description}</p>
        <div className="chapter-meta">
          <span>⏱ {chapter.readTime}</span>
          <span>📌 Atualizado em {chapter.updatedAt}</span>
        </div>
      </div>

      <div
        className="chapter-body"
        dangerouslySetInnerHTML={{ __html: chapter.bodyHtml }}
      />

      <ChapterComplete slug={chapter.slug} />

      <nav className="chapter-nav">
        {prev ? (
          <Link href={`/c/${prev.slug}`}>← {prev.number} {prev.title}</Link>
        ) : (
          <Link href="/">← Início</Link>
        )}
        <span className="spacer" />
        {next ? (
          <Link href={`/c/${next.slug}`}>
            {next.number} {next.title} →
          </Link>
        ) : (
          <Link href="/">Voltar ao início →</Link>
        )}
      </nav>
    </article>
  );
}
