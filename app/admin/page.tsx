import Link from "next/link";
import AdminChrome from "@/components/AdminChrome";
import { createChapter } from "@/app/admin/actions";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [chapters, trails] = await Promise.all([getChapters(), getTrails()]);

  return (
    <AdminChrome>
      <div className="admin-intro">
        <div className="admin-intro-head">
          <h1>Capítulos</h1>
          <Link href="/admin/trilhas" className="trail-btn">
            Gerenciar trilhas →
          </Link>
        </div>
        <p>
          Edite o conteúdo do manual. As mudanças vão pro ar na hora, sem
          publicar de novo.
        </p>
      </div>

      {trails.map((trail) => {
        const items = chapters.filter((c) => c.trailSlug === trail.slug);
        return (
          <section className="admin-trail" key={trail.slug}>
            <div className="admin-trail-head">
              <div className="sidebar-label">{trail.title}</div>
              <form action={createChapter}>
                <input type="hidden" name="trail" value={trail.slug} />
                <button type="submit" className="trail-btn">
                  + Novo capítulo
                </button>
              </form>
            </div>
            {items.length === 0 ? (
              <p className="admin-trail-empty">
                Trilha sem capítulos ainda.
              </p>
            ) : (
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
            )}
          </section>
        );
      })}
    </AdminChrome>
  );
}
