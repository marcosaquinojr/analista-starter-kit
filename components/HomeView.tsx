"use client";

import Link from "next/link";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import { useCompletion } from "@/components/completion";

export default function HomeView({
  chapters,
  trails,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
}) {
  const { isDone, ready } = useCompletion();

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);

  return (
    <>
      <div className="welcome-hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <span className="welcome-tag">Bem-vindo à Citiesoft</span>
        <h1 className="welcome-title">
          Você não vai precisar <span className="accent">adivinhar</span> como
          as coisas funcionam aqui.
        </h1>
        <p className="welcome-sub">
          Este manual reúne o que os analistas mais experientes do time
          aprenderam na marra — para você chegar produzindo com qualidade{" "}
          <strong>desde o primeiro mês</strong>.
        </p>
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
            <div className="num">~45 min</div>
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
