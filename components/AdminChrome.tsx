import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { getSessionUser } from "@/lib/auth";
import { CtMark } from "@/components/Logo";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  leitor: "Leitor",
};

/**
 * Chrome (cabeçalho) de toda página protegida do /admin. Faz a guarda real de
 * sessão no servidor: cookie inválido/expirado → login; leitor → site público.
 */
export default async function AdminChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role === "leitor") redirect("/");

  return (
    <>
      <header className="admin-header">
        <Link href="/admin" className="brand">
          <span className="brand-mark">
            <CtMark size={30} />
          </span>
          <div className="brand-text">
            <span className="brand-title">Edição · Analista Starter Kit</span>
            <span className="brand-sub">Área interna</span>
          </div>
        </Link>
        <div className="admin-header-actions">
          {user.role === "admin" && (
            <Link href="/admin/usuarios" className="header-link">
              Usuários
            </Link>
          )}
          <Link href="/" className="header-link" target="_blank">
            Ver site ↗
          </Link>
          <span className="admin-user">
            {user.email}
            <span className="admin-user-role">{ROLE_LABEL[user.role]}</span>
          </span>
          <form action={logout}>
            <button type="submit" className="admin-logout">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </>
  );
}
