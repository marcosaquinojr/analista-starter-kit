import Link from "next/link";
import AdminChrome from "@/components/AdminChrome";
import { getChapters } from "@/lib/chapters";
import { TRAILS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const chapters = await getChapters();

  return (
    <AdminChrome>
      <div className="admin-intro">
        <h1>Capítulos</h1>
        <p>
          Edite o conteúdo do manual. As mudanças vão pro ar na hora, sem
          publicar de novo.
        </p>
      </div>

      {TRAILS.map((trail) => {
        const items = chapters.filter((c) => c.trail === trail.title);
        if (items.length === 0) return null;
        return (
          <section className="admin-trail" key={trail.title}>
            <div className="sidebar-label">{trail.title}</div>
            <div className="admin-list">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/admin/${c.slug}`}
                  className="admin-row"
                >
                  <span className="admin-row-num">{c.number}</span>
                  <span className="admin-row-body">
                    <span className="admin-row-title">{c.title}</span>
                    <span className="admin-row-desc">{c.description}</span>
                  </span>
                  <span className="admin-row-meta">
                    Atualizado {c.updatedAt} →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </AdminChrome>
  );
}
