"use client";

import Link from "next/link";
import { useState } from "react";
import type { UserProgress } from "@/lib/progress";
import type { AreaWithCount } from "@/lib/areas";

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
  areas: AreaWithCount[];
}

export default function ProgressDashboard({
  overview,
  areas,
}: ProgressDashboardProps) {
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const areaName = (slug: string) =>
    areas.find((a) => a.slug === slug)?.name ?? slug;
  const areaTotal = (slug: string) =>
    areas.find((a) => a.slug === slug)?.chapterCount ?? 0;

  // Estatísticas de um escopo (uma área, ou "all"). A conclusão média é por
  // usuário, relativa ao total de capítulos da ÁREA dele.
  const statsFor = (scope: string) => {
    const inScope = overview.filter((u) =>
      scope === "all" ? true : u.onboardingTrack === scope,
    );
    const active = inScope.filter((u) => u.status === "active");
    const pcts = active.map((u) => {
      const total = areaTotal(u.onboardingTrack);
      return total ? Math.min(u.doneCount, total) / total : 0;
    });
    const avgPct = pcts.length
      ? Math.round((pcts.reduce((s, p) => s + p, 0) / pcts.length) * 100)
      : 0;
    return { totalCount: inScope.length, activeCount: active.length, avgPct };
  };

  const cards = [
    { key: "all", label: "Visão geral", s: statsFor("all") },
    ...areas.map((a) => ({ key: a.slug, label: a.name, s: statsFor(a.slug) })),
  ];

  const filtered = [...overview]
    .filter((u) => (areaFilter === "all" ? true : u.onboardingTrack === areaFilter))
    .sort((a, b) => b.doneCount - a.doneCount || a.email.localeCompare(b.email));

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Progresso</h1>
        <p>Quanto cada pessoa já concluiu do manual, por área.</p>
      </div>

      {/* Cards de estatísticas por área */}
      <div className="stat-card-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.key}>
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

      {/* Filtros de área */}
      <div
        className="admin-nav-tabs"
        style={{ marginBottom: "20px", width: "fit-content" }}
      >
        <button
          type="button"
          className={`admin-nav-tab${areaFilter === "all" ? " active" : ""}`}
          onClick={() => setAreaFilter("all")}
        >
          Todos ({overview.length})
        </button>
        {areas.map((a) => (
          <button
            key={a.slug}
            type="button"
            className={`admin-nav-tab${areaFilter === a.slug ? " active" : ""}`}
            onClick={() => setAreaFilter(a.slug)}
          >
            {a.name} (
            {overview.filter((u) => u.onboardingTrack === a.slug).length})
          </button>
        ))}
      </div>

      {/* Lista de progresso */}
      {filtered.length === 0 ? (
        <p className="admin-trail-empty">Nenhum usuário nesta área.</p>
      ) : (
        <div className="progress-list">
          {filtered.map((u) => {
            const total = areaTotal(u.onboardingTrack);
            const pct = total
              ? Math.round((Math.min(u.doneCount, total) / total) * 100)
              : 0;
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
                    {areaName(u.onboardingTrack)}
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="progress-count">
                    {Math.min(u.doneCount, total)}/{total}
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
