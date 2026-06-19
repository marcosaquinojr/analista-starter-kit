"use client";

import Link from "next/link";
import { useState } from "react";
import { GripVertical, Plus, X } from "lucide-react";
import type { ChapterMeta, TrailMeta, AreaMeta } from "@/lib/types";
import type { QuizMeta } from "@/lib/quizzes";
import {
  saveChaptersOrder,
  createChapter,
  createQuiz,
  assignChapterArea,
  removeChapterArea,
} from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

export default function AdminChaptersList({
  initialChapters,
  trails,
  areas,
  quizzes = [],
  chapterAreaMap,
  quizAreaMap,
}: {
  initialChapters: ChapterMeta[];
  trails: TrailMeta[];
  areas: AreaMeta[];
  quizzes?: QuizMeta[];
  chapterAreaMap: Record<string, string[]>;
  quizAreaMap: Record<string, string[]>;
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);

  const firstTrail = trails[0]?.slug ?? "";
  const areaName = (slug: string) =>
    areas.find((a) => a.slug === slug)?.name ?? slug;
  const areasOf = (slug: string) => chapterAreaMap[slug] ?? [];
  const quizAreasOf = (slug: string) => quizAreaMap[slug] ?? [];

  const chaptersIn = (areaSlug: string, trailSlug: string) =>
    chapters.filter(
      (c) => c.trailSlug === trailSlug && areasOf(c.slug).includes(areaSlug),
    );
  const quizzesIn = (areaSlug: string, trailSlug: string) =>
    quizzes.filter(
      (q) => q.trailSlug === trailSlug && quizAreasOf(q.slug).includes(areaSlug),
    );
  const areaHasContent = (areaSlug: string) =>
    chapters.some((c) => areasOf(c.slug).includes(areaSlug)) ||
    quizzes.some((q) => quizAreasOf(q.slug).includes(areaSlug));

  const draftChapters = chapters.filter((c) => areasOf(c.slug).length === 0);

  // ── Drag-drop: opera sobre a ordem GLOBAL única; só permite reordenar dentro
  //    da mesma área que está sendo arrastada (área se gerencia pelos controles).
  const handleDragStart = (e: React.DragEvent, slug: string) => {
    setDraggedSlug(slug);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent,
    targetSlug: string,
    targetTrailSlug: string,
    areaSlug: string,
  ) => {
    e.preventDefault();
    if (!draggedSlug || draggedSlug === targetSlug) return;
    if (!areasOf(draggedSlug).includes(areaSlug)) return; // só dentro da área

    const draggedIdx = chapters.findIndex((c) => c.slug === draggedSlug);
    const targetIdx = chapters.findIndex((c) => c.slug === targetSlug);
    if (draggedIdx < 0 || targetIdx < 0) return;

    const reordered = [...chapters];
    const [item] = reordered.splice(draggedIdx, 1);
    item.trailSlug = targetTrailSlug;
    reordered.splice(targetIdx, 0, item);
    setChapters(reordered);
  };

  const handleDragEnd = async () => {
    setDraggedSlug(null);
    try {
      await saveChaptersOrder(
        chapters.map((c) => ({ slug: c.slug, trailSlug: c.trailSlug })),
      );
      toast.success("Ordem dos capítulos salva.");
    } catch {
      toast.error("Falha ao salvar a nova ordem.");
    }
  };

  const chapterCard = (c: ChapterMeta, areaSlug: string) => {
    const isDragging = c.slug === draggedSlug;
    const otherAreas = areasOf(c.slug).filter((a) => a !== areaSlug);
    return (
      <div
        key={c.slug}
        draggable
        onDragStart={(e) => handleDragStart(e, c.slug)}
        onDragOver={(e) => handleDragOver(e, c.slug, c.trailSlug, areaSlug)}
        onDragEnd={handleDragEnd}
        className="admin-chapter-card"
        style={{ opacity: isDragging ? 0.4 : 1 }}
      >
        <div className="admin-chapter-grip" aria-hidden>
          <GripVertical size={16} />
        </div>
        <Link
          href={`/admin/${c.slug}`}
          className="admin-row"
          style={{ pointerEvents: draggedSlug ? "none" : "auto" }}
        >
          <span className="admin-row-num">{c.number}</span>
          <span className="admin-row-body">
            <span className="admin-row-title">{c.title}</span>
            <span className="admin-row-desc">{c.description}</span>
          </span>
        </Link>
        <div className="admin-card-actions">
          {otherAreas.length > 0 && (
            <span
              className="admin-reuse-chip"
              title={`Também em: ${otherAreas.map(areaName).join(", ")}`}
            >
              também em {otherAreas.map(areaName).join(", ")}
            </span>
          )}
          <form action={removeChapterArea}>
            <input type="hidden" name="slug" value={c.slug} />
            <input type="hidden" name="area" value={areaSlug} />
            <button
              type="submit"
              className="admin-area-remove"
              title="Remover desta área"
              aria-label="Remover desta área"
            >
              <X size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {areas.map((area) => (
        <section className="admin-area" key={area.slug}>
          <div className="admin-area-head">
            <div className="admin-area-title">{area.name}</div>
            <div className="admin-area-add">
              <form action={createChapter}>
                <input type="hidden" name="area" value={area.slug} />
                <select name="trail" defaultValue={firstTrail} className="admin-area-trail-select">
                  {trails.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <button type="submit" className="trail-btn">
                  <Plus size={14} /> Novo capítulo
                </button>
              </form>
              <form action={createQuiz}>
                <input type="hidden" name="area" value={area.slug} />
                <input type="hidden" name="trail" value={firstTrail} />
                <button type="submit" className="trail-btn">
                  <Plus size={14} /> Novo quiz
                </button>
              </form>
            </div>
          </div>

          {!areaHasContent(area.slug) ? (
            <p className="admin-area-empty">
              Nenhum capítulo nesta área ainda. Use “Novo capítulo” acima ou
              adicione um capítulo existente lá embaixo, em “Sem área”.
            </p>
          ) : (
            trails.map((trail) => {
              const items = chaptersIn(area.slug, trail.slug);
              const qs = quizzesIn(area.slug, trail.slug);
              if (items.length === 0 && qs.length === 0) return null;
              return (
                <div className="admin-area-trail" key={trail.slug}>
                  <div className="admin-area-trail-label">{trail.title}</div>
                  <div className="admin-list">
                    {items.map((c) => chapterCard(c, area.slug))}
                  </div>
                  {qs.length > 0 && (
                    <div className="admin-quiz-list">
                      {qs.map((q) => (
                        <Link
                          key={q.slug}
                          href={`/admin/quiz/${q.slug}`}
                          className="admin-quiz-row"
                        >
                          <span className="admin-quiz-badge">QUIZ</span>
                          <span className="admin-quiz-title">{q.title}</span>
                          <span className="admin-quiz-edit">Editar →</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      ))}

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
                  <select name="area" defaultValue={areas[0]?.slug ?? ""} className="admin-area-trail-select">
                    {areas.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="trail-btn">
                    <Plus size={14} /> Adicionar à área
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
