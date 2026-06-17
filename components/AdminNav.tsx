"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Abas de navegação do cabeçalho do /admin. Ficam sempre visíveis para que,
 * de qualquer página (Usuários, Progresso…), dê pra voltar a editar conteúdo.
 * "Capítulos" e "Página inicial" aparecem para quem edita (admin/editor);
 * "Progresso" e "Usuários" só para admin.
 */
export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const tabs: { href: string; label: string; match: (p: string) => boolean }[] =
    [
      {
        href: "/admin",
        label: "Capítulos",
        // ativo em /admin, /admin/[slug] e /admin/trilhas (edição de conteúdo),
        // mas não nas abas próprias abaixo
        match: (p) =>
          p === "/admin" ||
          p.startsWith("/admin/trilhas") ||
          (p.startsWith("/admin/") &&
            !p.startsWith("/admin/inicio") &&
            !p.startsWith("/admin/progresso") &&
            !p.startsWith("/admin/usuarios") &&
            !p.startsWith("/admin/login")),
      },
      {
        href: "/admin/inicio",
        label: "Página inicial",
        match: (p) => p.startsWith("/admin/inicio"),
      },
      ...(isAdmin
        ? [
            {
              href: "/admin/progresso",
              label: "Progresso",
              match: (p: string) => p.startsWith("/admin/progresso"),
            },
            {
              href: "/admin/usuarios",
              label: "Usuários",
              match: (p: string) => p.startsWith("/admin/usuarios"),
            },
          ]
        : []),
    ];

  return (
    <>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`header-link${t.match(pathname ?? "") ? " active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </>
  );
}
