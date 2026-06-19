import Link from "next/link";
import { ChevronRight, Settings2 } from "lucide-react";
import AdminChrome from "@/components/AdminChrome";
import { getChapters } from "@/lib/chapters";
import {
  getAreasWithCounts,
  getChapterAreaMap,
} from "@/lib/areas";
import { assignChapterArea } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [areas, chapters, chapterAreaMap] = await Promise.all([
    getAreasWithCounts(),
    getChapters(),
    getChapterAreaMap(),
  ]);

  const draftChapters = chapters.filter(
    (c) => (chapterAreaMap[c.slug]?.length ?? 0) === 0,
  );

  return (
    <AdminChrome>
      <div className="admin-intro admin-area-detail-head">
        <div>
          <h1>Conteúdo por área</h1>
          <p>
            Escolha uma área pra ver e organizar o conteúdo dela. Cada área
            agrupa seus capítulos por trilha; um capítulo pode servir a mais de
            uma área.
          </p>
        </div>
        <Link href="/admin/areas" className="trail-btn">
          <Settings2 size={14} /> Gerenciar áreas
        </Link>
      </div>

      <div className="stat-card-grid">
        <div className="stat-card">
          <span className="stat-card-label">Total de capítulos</span>
          <div className="stat-card-value">{chapters.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Áreas</span>
          <div className="stat-card-value">{areas.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Status do portal</span>
          <div className="stat-card-status">
            <span className="stat-card-dot" aria-hidden />
            Pronto para leitura
          </div>
        </div>
      </div>

      <div className="admin-area-cards">
        {areas.map((a) => (
          <Link
            key={a.slug}
            href={`/admin/area/${a.slug}`}
            className="admin-area-card"
          >
            <div className="admin-area-card-body">
              <span className="admin-area-card-title">{a.name}</span>
              {a.description && (
                <span className="admin-area-card-desc">{a.description}</span>
              )}
              <span className="admin-area-card-count">
                {a.chapterCount}{" "}
                {a.chapterCount === 1 ? "capítulo" : "capítulos"}
              </span>
            </div>
            <ChevronRight size={20} className="admin-area-card-arrow" />
          </Link>
        ))}
      </div>

      {draftChapters.length > 0 && (
        <section className="admin-area admin-area-drafts">
          <div className="admin-area-head">
            <div className="admin-area-title">Sem área — rascunhos</div>
            <span className="admin-area-hint">
              Capítulos sem área não aparecem pro leitor. Atribua um a uma área.
            </span>
          </div>
          <div className="admin-list">
            {draftChapters.map((c) => (
              <div key={c.slug} className="admin-chapter-card">
                <Link href={`/admin/${c.slug}`} className="admin-row">
                  <span className="admin-row-num">{c.number}</span>
                  <span className="admin-row-body">
                    <span className="admin-row-title">{c.title}</span>
                    <span className="admin-row-desc">{c.description}</span>
                  </span>
                </Link>
                <form action={assignChapterArea} className="admin-draft-assign">
                  <input type="hidden" name="slug" value={c.slug} />
                  <select
                    name="area"
                    defaultValue={areas[0]?.slug ?? ""}
                    className="admin-area-trail-select"
                  >
                    {areas.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="trail-btn">
                    Adicionar à área
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </AdminChrome>
  );
}
