"use client";

import Link from "next/link";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import type { HomeContent } from "@/lib/settings";
import { useCompletion } from "@/components/completion";

export default function HomeView({
  chapters,
  trails,
  home,
  userName,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  home: HomeContent;
  userName: string;
}) {
  const { isDone } = useCompletion();

  // Hub pessoal: orienta quem já está logado em vez de "vender" o manual.
  const firstName = userName.trim().split(/\s+/)[0] ?? "";
  const total = chapters.length;
  const doneCount = chapters.filter((c) => isDone(c.slug)).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  // Próximo capítulo = primeiro não concluído na ordem (continuar de onde parou).
  const next = chapters.find((c) => !isDone(c.slug));
  const allDone = total > 0 && doneCount === total;

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);

  return (
    <>
      <div className="home-hub">
        <h1 className="home-hub-greeting">
          {firstName ? `Olá, ${firstName}` : "Olá"}
        </h1>
        <p className="home-hub-sub">
          {allDone
            ? "Você concluiu todo o manual de onboarding."
            : doneCount === 0
              ? "Comece sua trilha de onboarding."
              : "Continue sua trilha de onboarding."}
        </p>

        {total > 0 && (
          <div className="home-hub-progress">
            <div className="home-hub-bar">
              <div className="home-hub-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="home-hub-count">
              {doneCount} de {total} concluídos
            </span>
          </div>
        )}

        {next ? (
          <Link href={`/c/${next.slug}`} className="home-hub-cta">
            {doneCount === 0 ? "Começar pelo início" : "Continuar de onde parei"}
            <span aria-hidden>&nbsp;→</span>
          </Link>
        ) : (
          total > 0 && (
            <Link
              href={`/c/${chapters[0].slug}`}
              className="home-hub-cta secondary"
            >
              Revisar o manual<span aria-hidden>&nbsp;→</span>
            </Link>
          )
        )}
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
                  className={`chapter-card${isDone(c.slug) ? " completed" : ""}`}
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
