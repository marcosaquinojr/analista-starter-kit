import AdminChrome from "@/components/AdminChrome";
import AdminChaptersList from "./AdminChaptersList";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";
import { getAreas, getChapterAreaMap, getQuizAreaMap } from "@/lib/areas";
import { getQuizzes } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [chapters, trails, areas, quizzes, chapterAreaMap, quizAreaMap] =
    await Promise.all([
      getChapters(),
      getTrails(),
      getAreas(),
      getQuizzes(),
      getChapterAreaMap(),
      getQuizAreaMap(),
    ]);

  return (
    <AdminChrome>
      <div className="admin-intro">
        <h1>Conteúdo por área</h1>
        <p>
          O manual organizado pelas áreas de onboarding. Dentro de cada área, os
          capítulos seguem agrupados por trilha. Um mesmo capítulo pode servir a
          mais de uma área. Arraste para reordenar ou mover entre trilhas dentro
          da área.
        </p>
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

      <AdminChaptersList
        initialChapters={chapters}
        trails={trails}
        areas={areas}
        quizzes={quizzes}
        chapterAreaMap={chapterAreaMap}
        quizAreaMap={quizAreaMap}
      />
    </AdminChrome>
  );
}
