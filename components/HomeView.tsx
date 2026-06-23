"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import type { HomeContent } from "@/lib/settings";
import type { ReaderQuiz } from "@/lib/quizzes";
import { useCompletion } from "@/components/completion";
import CitieMascot from "@/components/CitieMascot";

export default function HomeView({
  chapters,
  trails,
  home,
  userName,
  quizzes,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  home: HomeContent;
  userName: string;
  quizzes: ReaderQuiz[];
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

  const citieBubble = (() => {
    if (total === 0) return "Ainda não há capítulos por aqui. Em breve! 👀";
    if (allDone) return `Uau, ${firstName}! Você concluiu tudo. Você é um(a) verdadeiro(a) Citier! 🎉`;
    if (doneCount === 0) return `Oi, ${firstName}! Pronto(a) para começar? Vamos nessa! 🚀`;
    if (pct >= 75) return `Quase lá, ${firstName}! Faltam só ${total - doneCount} capítulo(s). Não para agora! 💪`;
    if (pct >= 50) return `Você já passou da metade, ${firstName}! Continue assim 🔥`;
    if (pct >= 25) return `Bom ritmo, ${firstName}! ${doneCount} de ${total} concluídos. Tá indo bem 📚`;
    return `Continue de onde parou, ${firstName}! Cada capítulo conta 😉`;
  })();

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);
  const quizzesByTrail = (trailSlug: string) =>
    quizzes.filter((q) => q.trailSlug === trailSlug);

  return (
    <>
      {/* Citiezinho — mascote interativo */}
      <CitieMascot introMessage={citieBubble} />

      <div className="home-hub">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="home-hub-main">
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
      </div>

      {trails.map((trail) => {
        const items = byTrail(trail.slug);
        const qs = quizzesByTrail(trail.slug);
        if (items.length === 0 && qs.length === 0) return null;
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

              {qs.map((qz) => {
                const unlocked = qz.prereqSlugs.every((s) => isDone(s));
                if (!unlocked) {
                  return (
                    <div
                      key={qz.slug}
                      className="chapter-card quiz-card locked"
                      title="Conclua os capítulos pré-requisito para liberar"
                    >
                      <span className="quiz-card-badge">
                        QUIZ <Lock size={12} />
                      </span>
                      <div className="chapter-card-title">{qz.title}</div>
                      <div className="chapter-card-desc">
                        Conclua os pré-requisitos para liberar.
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={qz.slug}
                    href={`/q/${qz.slug}`}
                    className={`chapter-card quiz-card${qz.passed ? " completed" : ""}`}
                  >
                    <span className="quiz-card-badge">
                      QUIZ{" "}
                      {qz.passed ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <Play size={12} fill="currentColor" strokeWidth={0} />
                      )}
                    </span>
                    <div className="chapter-card-title">{qz.title}</div>
                    <div className="chapter-card-desc">
                      {qz.questionCount}{" "}
                      {qz.questionCount === 1 ? "pergunta" : "perguntas"}
                      {qz.passed ? " · concluído" : ""}
                    </div>
                  </Link>
                );
              })}
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
