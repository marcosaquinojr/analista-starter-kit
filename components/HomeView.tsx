"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import type { HomeContent } from "@/lib/settings";
import { useCompletion } from "@/components/completion";

/**
 * Renderiza um texto aplicando destaque nos trechos entre `**asteriscos**`.
 * `accent` pinta de azul (título); `strong` dá peso (subtítulo). Como a entrada
 * é texto puro vinda do /admin, não há risco de HTML injetado.
 */
function withHighlight(
  text: string,
  kind: "accent" | "strong",
): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => {
    if (i % 2 === 0) return part;
    return kind === "accent" ? (
      <span key={i} className="accent">
        {part}
      </span>
    ) : (
      <strong key={i}>{part}</strong>
    );
  });
}

export default function HomeView({
  chapters,
  trails,
  home,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  home: HomeContent;
}) {
  const { isDone, ready } = useCompletion();

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);

  return (
    <>
      <div className="welcome-hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        {home.tag && <span className="welcome-tag">{home.tag}</span>}
        <h1 className="welcome-title">{withHighlight(home.title, "accent")}</h1>
        {home.subtitle && (
          <p className="welcome-sub">
            {withHighlight(home.subtitle, "strong")}
          </p>
        )}
        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="num">{chapters.length}</div>
            <div className="lbl">capítulos</div>
          </div>
          <div className="welcome-stat">
            <div className="num">{trails.length}</div>
            <div className="lbl">trilhas</div>
          </div>
          <div className="welcome-stat">
            <div className="num">{home.readTime}</div>
            <div className="lbl">leitura total</div>
          </div>
          <div className="welcome-stat">
            <div className="num">∞</div>
            <div className="lbl">consultas</div>
          </div>
        </div>
      </div>

      {trails.map((trail) => {
        const items = byTrail(trail.slug);
        if (items.length === 0) return null;
        return (
          <div className="trail" key={trail.slug}>
            <div className="trail-header">
              <span className="trail-title">{trail.title}</span>
              <span className="trail-desc">{trail.description}</span>
            </div>
            <div className="chapter-grid">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/c/${c.slug}`}
                  className={`chapter-card${
                    ready && isDone(c.slug) ? " completed" : ""
                  }`}
                >
                  <span className="chapter-card-num">{c.number}</span>
                  <div className="chapter-card-title">{c.title}</div>
                  <div className="chapter-card-desc">{c.description}</div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div className="callout">
        <div className="callout-label">Alpha</div>
        Conteúdo especulativo enquanto o form de discovery não retorna ≥5
        respostas. Capítulos podem ser fundidos, removidos ou reordenados quando
        os dados chegarem.
      </div>
    </>
  );
}
