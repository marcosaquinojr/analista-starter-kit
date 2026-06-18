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

      {/* Cards de Estatísticas por Trilha */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/* Card Geral */}
        <div className="progress-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text3)",
            }}
          >
            Visão Geral
          </span>
          <div style={{ display: "flex", gap: "24px", marginTop: "4px" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--ink)" }}>
                {allStats.activeCount} <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text3)" }}>/ {allStats.totalCount}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Ativos</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--blue)" }}>
                {allStats.avgPct}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Conclusão Média</div>
            </div>
          </div>
        </div>

        {/* Card Negócios / Analista */}
        <div className="progress-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text3)",
            }}
          >
            Negócios / Analista
          </span>
          <div style={{ display: "flex", gap: "24px", marginTop: "4px" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--ink)" }}>
                {negociosStats.activeCount} <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text3)" }}>/ {negociosStats.totalCount}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Ativos</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--blue)" }}>
                {negociosStats.avgPct}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Conclusão Média</div>
            </div>
          </div>
        </div>

        {/* Card Desenvolvimento / Dev */}
        <div className="progress-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text3)",
            }}
          >
            Desenvolvimento / Dev
          </span>
          <div style={{ display: "flex", gap: "24px", marginTop: "4px" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--ink)" }}>
                {devStats.activeCount} <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text3)" }}>/ {devStats.totalCount}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Ativos</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--blue)" }}>
                {devStats.avgPct}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>Conclusão Média</div>
            </div>
          </div>
        </div>
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
                <div style={{ display: "flex", gap: "8px", alignItems: "center", minWidth: "160px" }}>
                  <span className={`user-role-badge role-${u.role}`}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                  <span
                    className="user-role-badge"
                    style={{
                      backgroundColor: "var(--blue-faint)",
                      color: "var(--blue)",
                      border: "1px solid rgba(20, 107, 250, 0.15)",
                      textTransform: "uppercase",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 8px"
                    }}
                  >
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
