import Link from "next/link";
import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import { getSessionUser } from "@/lib/auth";
import { getChapters } from "@/lib/chapters";
import { getProgressOverview } from "@/lib/progress";

export const dynamic = "force-dynamic";

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

export default async function ProgressDashboardPage() {
  const session = await getSessionUser();
  if (session && session.role !== "admin") redirect("/admin");

  const [overview, chapters] = await Promise.all([
    getProgressOverview(),
    getChapters(),
  ]);
  const total = chapters.length;

  // ativos primeiro, depois por mais progresso
  const rows = [...overview].sort(
    (a, b) => b.doneCount - a.doneCount || a.email.localeCompare(b.email),
  );
  const active = rows.filter((r) => r.status === "active");
  const avgPct =
    active.length && total
      ? Math.round(
          (active.reduce((s, r) => s + r.doneCount, 0) /
            (active.length * total)) *
            100,
        )
      : 0;

  return (
    <AdminChrome>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Progresso</h1>
        <p>
          Quanto cada pessoa já concluiu do manual. {active.length}{" "}
          {active.length === 1 ? "pessoa ativa" : "pessoas ativas"} ·{" "}
          {avgPct}% de conclusão média.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="admin-trail-empty">Nenhum usuário ainda.</p>
      ) : (
        <div className="progress-list">
          {rows.map((u) => {
            const pct = total ? Math.round((u.doneCount / total) * 100) : 0;
            return (
              <div className="progress-row" key={u.id}>
                <div className="progress-row-id">
                  <span className="admin-row-title">{u.name || u.email}</span>
                  <span className="admin-row-desc">{u.email}</span>
                </div>
                <span className={`user-role-badge role-${u.role}`}>
                  {ROLE_LABEL[u.role] ?? u.role}
                </span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="progress-count">
                    {u.doneCount}/{total}
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
    </AdminChrome>
  );
}
