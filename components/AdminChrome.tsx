import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { CtMark } from "@/components/Logo";

export default function AdminChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="admin-header">
        <Link href="/admin" className="brand">
          <span className="brand-mark">
            <CtMark size={36} />
          </span>
          <div className="brand-text">
            <span className="brand-title">Edição · Analista Starter Kit</span>
            <span className="brand-sub">Área interna</span>
          </div>
        </Link>
        <div className="admin-header-actions">
          <Link href="/" className="header-link" target="_blank">
            Ver site ↗
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
