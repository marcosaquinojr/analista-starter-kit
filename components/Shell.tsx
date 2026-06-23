"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search } from "lucide-react";
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
  children,
}: {
  chapters: ChapterMeta[];
  trails: TrailMeta[];
  user: { email: string; name: string; role: string; avatarUrl: string; onboardingTrack: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { ready, isDone } = useCompletion();
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

  const roleLabel =
    user.role === "admin"
      ? "Administrador"
      : user.role === "editor"
        ? "Editor"
        : "Leitor";

  const currentSlug = pathname?.startsWith("/c/")
    ? pathname.split("/")[2]
    : null;

  // Rodapé "última atualização" é por página: usa a data do capítulo aberto.
  const currentChapter = currentSlug
    ? chapters.find((c) => c.slug === currentSlug)
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
              <span className="brand-title">Citiesoft Onboard</span>
              <span className="brand-sub">Onboarding para novos membros</span>
            </div>
          </Link>
        </div>
        <div className="header-meta">
          <Link href="/conta" className="header-profile" title="Editar perfil">
            <span className="header-profile-info">
              <span className="header-profile-name">
                {user.name?.trim() || "Defina seu nome"}
              </span>
              <span className="header-profile-role">{roleLabel}</span>
            </span>
            <span className="header-profile-avatar" aria-hidden>
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" />
              ) : (
                initials(user.name, user.email)
              )}
            </span>
          </Link>
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
        <ul className="sidebar-nav sidebar-nav--top">
          <li>
            <Link
              href="/inicio"
              className={pathname === "/inicio" ? "active" : ""}
            >
              <span className="num">
                <Home size={15} />
              </span>
              <span className="label">Início</span>
            </Link>
          </li>
        </ul>

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
          {currentChapter
            ? `Última atualização em ${currentChapter.updatedAt}`
            : "Citiesoft Onboard"}
        </footer>
      </main>
    </div>
  );
}
