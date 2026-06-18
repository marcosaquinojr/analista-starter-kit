import Link from "next/link";
import AdminChrome from "@/components/AdminChrome";
import AdminChaptersList from "./AdminChaptersList";
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
          <div className="admin-intro-actions">
            <Link href="/admin/inicio" className="trail-btn">
              Editar página inicial →
            </Link>
            <Link href="/admin/trilhas" className="trail-btn">
              Gerenciar trilhas →
            </Link>
          </div>
        </div>
        <p>
          Edite o conteúdo do manual. As mudanças vão pro ar na hora, sem
          publicar de novo. Arraste e solte os capítulos para reordená-los ou
          movê-los entre as trilhas.
        </p>
      </div>

      <div className="stat-card-grid">
        <div className="stat-card">
          <span className="stat-card-label">Total de capítulos</span>
          <div className="stat-card-value">{chapters.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Trilhas organizadoras</span>
          <div className="stat-card-value">{trails.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Status do portal</span>
          <div className="stat-card-status">
            <span className="stat-card-dot" aria-hidden />
            Pronto para leitura
          </div>
        </div>
      </div>

      <AdminChaptersList initialChapters={chapters} trails={trails} />
    </AdminChrome>
  );
}
