"use client";

import Link from "next/link";
import { useState } from "react";
import type { UserProgress } from "@/lib/progress";
import type { ChapterMeta } from "@/lib/types";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  leitor: "Leitor",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(iso));
}

interface ProgressDashboardProps {
  overview: UserProgress[];
  chapters: ChapterMeta[];
}

export default function ProgressDashboard({ overview, chapters }: ProgressDashboardProps) {
  const [trackFilter, setTrackFilter] = useState<"all" | "negocios" | "desenvolvimento">("all");

  // Calculate totals for each track
  const negociosTotal = chapters.filter(
    (c) => c.onboardingTrack === "negocios" || c.onboardingTrack === "ambos"
  ).length;

  const devTotal = chapters.filter(
    (c) => c.onboardingTrack === "desenvolvimento" || c.onboardingTrack === "ambos"
  ).length;

  const generalTotal = chapters.length;

  // Filter and compute active user statistics
  const getStats = (track: "all" | "negocios" | "desenvolvimento") => {
    const trackUsers = overview.filter((u) => {
      if (track === "all") return true;
      return u.onboardingTrack === track;
    });

    const activeUsers = trackUsers.filter((u) => u.status === "active");

    const totalChaptersForTrack =
      track === "negocios"
        ? negociosTotal
        : track === "desenvolvimento"
        ? devTotal
        : generalTotal;

    const avgPct =
      activeUsers.length && totalChaptersForTrack
        ? Math.round(
            (activeUsers.reduce((s, r) => s + Math.min(r.doneCount, totalChaptersForTrack), 0) /
              (activeUsers.length * totalChaptersForTrack)) *
              100
          )
        : 0;

    return {
      totalCount: trackUsers.length,
      activeCount: activeUsers.length,
      avgPct,
    };
  };

  const allStats = getStats("all");
  const negociosStats = getStats("negocios");
  const devStats = getStats("desenvolvimento");

  // Filter users based on selected track
  const filteredUsers = [...overview]
    .filter((u) => {
      if (trackFilter === "all") return true;
      return u.onboardingTrack === trackFilter;
    })
    .sort((a, b) => b.doneCount - a.doneCount || a.email.localeCompare(b.email));

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Progresso</h1>
        <p>
          Quanto cada pessoa já concluiu do manual.
        </p>
      </div>

      {/* Cards de estatísticas por trilha */}
      <div className="stat-card-grid">
        {[
          { label: "Visão geral", s: allStats },
          { label: "Negócios / Analista", s: negociosStats },
          { label: "Desenvolvimento / Dev", s: devStats },
        ].map((c) => (
          <div className="stat-card" key={c.label}>
            <span className="stat-card-label">{c.label}</span>
            <div className="stat-card-duo">
              <div>
                <div className="stat-card-metric">
                  {c.s.activeCount} <small>/ {c.s.totalCount}</small>
                </div>
                <div className="stat-card-sublabel">Ativos</div>
              </div>
              <div className="divider" />
              <div>
                <div className="stat-card-metric accent">{c.s.avgPct}%</div>
                <div className="stat-card-sublabel">Conclusão média</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros de Trilha */}
      <div className="admin-nav-tabs" style={{ marginBottom: "20px", width: "fit-content" }}>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "all" ? " active" : ""}`}
          onClick={() => setTrackFilter("all")}
        >
          Todos ({overview.length})
        </button>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "negocios" ? " active" : ""}`}
          onClick={() => setTrackFilter("negocios")}
        >
          Negócios / Analista ({overview.filter(u => u.onboardingTrack === "negocios").length})
        </button>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "desenvolvimento" ? " active" : ""}`}
          onClick={() => setTrackFilter("desenvolvimento")}
        >
          Desenvolvimento / Dev ({overview.filter(u => u.onboardingTrack === "desenvolvimento").length})
        </button>
      </div>

      {/* Lista de progresso */}
      {filteredUsers.length === 0 ? (
        <p className="admin-trail-empty">Nenhum usuário nesta trilha.</p>
      ) : (
        <div className="progress-list">
          {filteredUsers.map((u) => {
            const userTrackTotal =
              u.onboardingTrack === "negocios"
                ? negociosTotal
                : u.onboardingTrack === "desenvolvimento"
                ? devTotal
                : generalTotal;

            const pct = userTrackTotal ? Math.round((Math.min(u.doneCount, userTrackTotal) / userTrackTotal) * 100) : 0;
            return (
              <div className="progress-row" key={u.id}>
                <div className="progress-row-id">
                  <span className="admin-row-title">{u.name || u.email}</span>
                  <span className="admin-row-desc">{u.email}</span>
                </div>
                <div className="progress-row-badges">
                  <span className={`user-role-badge role-${u.role}`}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                  <span className="track-badge">
                    {u.onboardingTrack === "negocios" ? "Negócios" : "Dev"}
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="progress-count">
                    {Math.min(u.doneCount, userTrackTotal)}/{userTrackTotal}
                  </span>
                </div>
                <span className="progress-last">
                  {u.status === "invited" ? (
                    <em>convite pendente</em>
                  ) : (
                    `últ. ${formatDate(u.lastCompletedAt)}`
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
