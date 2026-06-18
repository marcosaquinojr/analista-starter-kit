"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import { useCompletion } from "@/components/completion";
import { logout } from "@/app/admin/actions";
import { CtMark } from "@/components/Logo";
import { initials } from "@/lib/initials";

const SIDEBAR_KEY = "analista-kit-sidebar-collapsed";

function CheckCircle() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function Shell({
  chapters,
  trails,
  user,
  lastUpdated,
  children,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  user: { email: string; name: string; role: string; avatarUrl: string; onboardingTrack: string };
  lastUpdated: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { completed, ready, isDone } = useCompletion();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (
      window.innerWidth > 900 &&
      localStorage.getItem(SIDEBAR_KEY) === "true"
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(true);
    }
  }, []);

  // fecha o menu mobile ao navegar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen((v) => !v);
      return;
    }
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {
        // ignora
      }
      return next;
    });
  };

  const total = chapters.length;
  const doneCount = ready ? completed.size : 0;
  const pct = total ? (doneCount / total) * 100 : 0;

  const currentSlug = pathname?.startsWith("/c/")
    ? pathname.split("/")[2]
    : null;

  const shellClass = [
    "app-shell",
    collapsed ? "sidebar-collapsed" : "",
    mobileOpen ? "mobile-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const [search, setSearch] = useState("");

  const byTrail = (trailSlug: string) => {
    const raw = chapters.filter((c) => c.trailSlug === trailSlug);
    if (!search.trim()) return raw;
    const q = search.toLowerCase();
    return raw.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.number.includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  };

  return (
    <div className={shellClass}>
      <header className="site-header">
        <div className="brand-wrapper">
          <button
            className={`hamburger${mobileOpen ? " open" : ""}`}
            onClick={toggleSidebar}
            aria-label="Alternar menu"
          >
            <span />
            <span />
            <span />
          </button>
          <Link href="/" className="brand">
            <span className="brand-mark">
              <CtMark size={30} />
            </span>
            <div className="brand-text">
              <span className="brand-title">Citiesoft Academy</span>
              <span className="brand-sub">Onboarding de analistas</span>
            </div>
          </Link>
        </div>
        <div className="header-meta">
          <div className="header-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-text">
              {doneCount} / {total} capítulos
            </span>
          </div>
          <span className="tag-alpha">Alpha v0.1</span>
        </div>
      </header>

      <div
        className="sidebar-backdrop"
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      <aside className="sidebar">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", marginBottom: "12px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: "11px", color: "#94a3b8", pointerEvents: "none" }}
            />
            <input
              type="text"
              placeholder="Buscar capítulo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "0.875rem",
                outline: "none",
                backgroundColor: "#f8fafc",
                color: "#0f172a"
              }}
            />
          </div>
        </div>
        {trails.map((trail) => {
          const items = byTrail(trail.slug);
          if (items.length === 0) return null;
          return (
            <div key={trail.slug}>
              <div className="sidebar-label">{trail.title}</div>
              <ul className="sidebar-nav">
                {items.map((c) => {
                  const active = currentSlug === c.slug;
                  const done = ready && isDone(c.slug);
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/c/${c.slug}`}
                        className={[
                          active ? "active" : "",
                          done ? "completed" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span className="num">{c.number}</span>
                        <span className="label">{c.title}</span>
                        <span className="check">
                          <CheckCircle />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div className="sidebar-footer">
          <Link href="/conta" className="sidebar-user" title="Editar perfil">
            <span className="sidebar-avatar" aria-hidden>
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" />
              ) : (
                initials(user.name, user.email)
              )}
            </span>
            <span className="sidebar-user-id">
              <span className="sidebar-user-name">
                {user.name?.trim() || "Defina seu nome"}
              </span>
              <span className="sidebar-user-email">{user.email}</span>
            </span>
          </Link>
          <div className="sidebar-user-actions">
            {(user.role === "admin" || user.role === "editor") && (
              <Link href="/admin" className="sidebar-admin-link">
                Área de edição →
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="sidebar-reset">
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="site-main">
        {children}
        <footer className="site-footer">
          {lastUpdated
            ? `Última atualização em ${lastUpdated}`
            : "Citiesoft Academy"}
        </footer>
      </main>
    </div>
  );
}
