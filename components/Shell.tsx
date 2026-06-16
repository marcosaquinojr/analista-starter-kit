"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import { useCompletion } from "@/components/completion";
import { logout } from "@/app/admin/actions";
import { CtMark } from "@/components/Logo";

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
  children,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  user: { email: string; role: string };
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
      setCollapsed(true);
    }
  }, []);

  // fecha o menu mobile ao navegar
  useEffect(() => {
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

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);

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
              <span className="brand-title">Analista Starter Kit</span>
              <span className="brand-sub">Onboarding · Citiesoft</span>
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
          <div className="sidebar-user">
            <span className="sidebar-user-email">{user.email}</span>
            <span className="sidebar-user-note">
              Seu progresso fica salvo na sua conta.
            </span>
          </div>
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

      <main className="site-main">{children}</main>
    </div>
  );
}
