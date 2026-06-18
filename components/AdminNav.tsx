"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Navegação do /admin. A parte de edição de conteúdo (Capítulos, Trilhas,
 * Página inicial, Mídias) fica agrupada num único item "Conteúdo" com submenu;
 * as ferramentas de gestão (Progresso, Usuários, Log) ficam soltas e só
 * aparecem para admin.
 */
export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const p = pathname ?? "";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha o submenu ao clicar fora ou trocar de rota
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Prefixos das outras seções — usados para decidir o que é "Capítulos"
  // (que cobre /admin e o editor de capítulo /admin/[slug]).
  const nonChapter = [
    "/admin/trilhas",
    "/admin/inicio",
    "/admin/midias",
    "/admin/progresso",
    "/admin/usuarios",
    "/admin/log",
    "/admin/login",
  ];
  const isCapitulos =
    p === "/admin" ||
    (p.startsWith("/admin/") && !nonChapter.some((x) => p.startsWith(x)));

  const content = [
    { href: "/admin", label: "Capítulos", active: isCapitulos },
    {
      href: "/admin/trilhas",
      label: "Trilhas",
      active: p.startsWith("/admin/trilhas"),
    },
    {
      href: "/admin/inicio",
      label: "Página inicial",
      active: p.startsWith("/admin/inicio"),
    },
    {
      href: "/admin/midias",
      label: "Mídias",
      active: p.startsWith("/admin/midias"),
    },
  ];
  const contentActive = content.some((c) => c.active);

  const management = isAdmin
    ? [
        {
          href: "/admin/progresso",
          label: "Progresso",
          active: p.startsWith("/admin/progresso"),
        },
        {
          href: "/admin/usuarios",
          label: "Usuários",
          active: p.startsWith("/admin/usuarios"),
        },
        { href: "/admin/log", label: "Log", active: p.startsWith("/admin/log") },
      ]
    : [];

  return (
    <div className="admin-nav-tabs">
      <div className="admin-nav-dropdown" ref={ref}>
        <button
          type="button"
          className={`admin-nav-tab${contentActive ? " active" : ""}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Conteúdo <span className="caret" aria-hidden>▾</span>
        </button>
        {open && (
          <div className="admin-nav-menu" role="menu">
            {content.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                role="menuitem"
                className={`admin-nav-menu-item${c.active ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {management.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`admin-nav-tab${t.active ? " active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
