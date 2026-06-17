import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { initials } from "@/lib/initials";
import { CtMark } from "@/components/Logo";
import AdminNav from "@/components/AdminNav";

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

  const row = await getUserById(user.uid);
  const name = row?.name?.trim() ?? "";
  const avatarUrl = row?.avatarUrl ?? "";

  return (
    <>
      <header className="admin-header">
        <Link href="/admin" className="brand">
          <span className="brand-mark">
            <CtMark size={30} />
          </span>
          <div className="brand-text">
            <span className="brand-title">Edição · Citiesoft Academy</span>
            <span className="brand-sub">Área interna</span>
          </div>
        </Link>
        <div className="admin-header-actions">
          <AdminNav isAdmin={user.role === "admin"} />
          <Link href="/" className="header-link" target="_blank">
            Ver site ↗
          </Link>
          <Link href="/conta" className="admin-user" title="Editar perfil">
            <span className="admin-user-avatar" aria-hidden>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" />
              ) : (
                initials(name, user.email)
              )}
            </span>
            <span className="admin-user-id">
              <span className="admin-user-name">{name || user.email}</span>
              <span className="admin-user-role">{ROLE_LABEL[user.role]}</span>
            </span>
          </Link>
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
