"use client";

import Link from "next/link";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import type { HomeContent } from "@/lib/settings";
import { heroHtml } from "@/lib/hero";
import { useCompletion } from "@/components/completion";

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
        <h1
          className="welcome-title"
          dangerouslySetInnerHTML={{ __html: heroHtml(home.title, "accent") }}
        />
        {home.subtitle && (
          <p
            className="welcome-sub"
            dangerouslySetInnerHTML={{
              __html: heroHtml(home.subtitle, "strong"),
            }}
          />
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

      {home.noteText && (
        <div className="callout">
          {home.noteLabel && (
            <div className="callout-label">{home.noteLabel}</div>
          )}
          {home.noteText}
        </div>
      )}
    </>
  );
}
