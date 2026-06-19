"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { GripVertical, Plus, X } from "lucide-react";
import type { ChapterMeta, TrailMeta, AreaMeta } from "@/lib/types";
import type { QuizMeta } from "@/lib/quizzes";
import {
  saveChaptersOrder,
  createChapter,
  createQuiz,
  removeChapterArea,
} from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";
import ConfirmModal from "@/components/ConfirmModal";

export default function AreaBoard({
  area,
  initialChapters,
  trails,
  areas,
  quizzes = [],
  chapterAreaMap,
  quizAreaMap,
}: {
  area: AreaMeta;
  initialChapters: ChapterMeta[];
  trails: TrailMeta[];
  areas: AreaMeta[];
  quizzes?: QuizMeta[];
  chapterAreaMap: Record<string, string[]>;
  quizAreaMap: Record<string, string[]>;
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<ChapterMeta | null>(null);
  const [, startTransition] = useTransition();
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (addRef.current && !addRef.current.contains(e.target as Node))
        setAddOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const areaName = (slug: string) =>
    areas.find((a) => a.slug === slug)?.name ?? slug;
  const areasOf = (slug: string) => chapterAreaMap[slug] ?? [];
  const quizAreasOf = (slug: string) => quizAreaMap[slug] ?? [];

  const chaptersIn = (trailSlug: string) =>
    chapters.filter(
      (c) => c.trailSlug === trailSlug && areasOf(c.slug).includes(area.slug),
    );
  const quizzesIn = (trailSlug: string) =>
    quizzes.filter(
      (q) => q.trailSlug === trailSlug && quizAreasOf(q.slug).includes(area.slug),
    );
  const hasContent =
    chapters.some((c) => areasOf(c.slug).includes(area.slug)) ||
    quizzes.some((q) => quizAreasOf(q.slug).includes(area.slug));

  // Drag-drop opera sobre a ordem GLOBAL única; só reordena dentro desta área.
  const handleDragStart = (e: React.DragEvent, slug: string) => {
    setDraggedSlug(slug);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (
    e: React.DragEvent,
    targetSlug: string,
    targetTrailSlug: string,
  ) => {
    e.preventDefault();
    if (!draggedSlug || draggedSlug === targetSlug) return;
    if (!areasOf(draggedSlug).includes(area.slug)) return;
    const di = chapters.findIndex((c) => c.slug === draggedSlug);
    const ti = chapters.findIndex((c) => c.slug === targetSlug);
    if (di < 0 || ti < 0) return;
    const reordered = [...chapters];
    const [item] = reordered.splice(di, 1);
    item.trailSlug = targetTrailSlug;
    reordered.splice(ti, 0, item);
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

  const chapterCard = (c: ChapterMeta) => {
    const isDragging = c.slug === draggedSlug;
    const otherAreas = areasOf(c.slug).filter((a) => a !== area.slug);
    return (
      <div
        key={c.slug}
        draggable
        onDragStart={(e) => handleDragStart(e, c.slug)}
        onDragOver={(e) => handleDragOver(e, c.slug, c.trailSlug)}
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
          <button
            type="button"
            className="admin-area-remove"
            title="Remover desta área"
            aria-label="Remover desta área"
            onClick={() => setPendingRemove(c)}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="admin-intro admin-area-detail-head">
        <div>
          <Link href="/admin" className="header-link">
            ← Áreas
          </Link>
          <h1>{area.name}</h1>
          {area.description && <p>{area.description}</p>}
        </div>

        <div className="admin-add" ref={addRef}>
          <button
            type="button"
            className="btn-complete"
            aria-haspopup="menu"
            aria-expanded={addOpen}
            onClick={() => setAddOpen((v) => !v)}
          >
            <Plus size={15} /> Adicionar
          </button>
          {addOpen && (
            <div className="admin-add-menu" role="menu">
              <div className="admin-add-group">Capítulo em…</div>
              {trails.map((t) => (
                <form action={createChapter} key={`c-${t.slug}`}>
                  <input type="hidden" name="area" value={area.slug} />
                  <input type="hidden" name="trail" value={t.slug} />
                  <button type="submit" className="admin-add-item">
                    {t.title}
                  </button>
                </form>
              ))}
              <div className="admin-add-group">Quiz em…</div>
              {trails.map((t) => (
                <form action={createQuiz} key={`q-${t.slug}`}>
                  <input type="hidden" name="area" value={area.slug} />
                  <input type="hidden" name="trail" value={t.slug} />
                  <button type="submit" className="admin-add-item">
                    {t.title}
                  </button>
                </form>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hasContent ? (
        <p className="admin-area-empty">
          Nenhum capítulo nesta área ainda. Use “Adicionar” acima, ou vincule um
          capítulo existente pela seção “Sem área” na lista de áreas.
        </p>
      ) : (
        trails.map((trail) => {
          const items = chaptersIn(trail.slug);
          const qs = quizzesIn(trail.slug);
          if (items.length === 0 && qs.length === 0) return null;
          return (
            <div className="admin-area-trail" key={trail.slug}>
              <div className="admin-area-trail-label">{trail.title}</div>
              <div className="admin-list">{items.map(chapterCard)}</div>
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

      <ConfirmModal
        open={pendingRemove !== null}
        title="Remover desta área"
        message={
          <>
            Tirar <strong>{pendingRemove?.title}</strong> da área{" "}
            <strong>{area.name}</strong>? O capítulo não é apagado — só deixa de
            aparecer aqui (e fica rascunho se não tiver outra área).
          </>
        }
        confirmLabel="Remover da área"
        onConfirm={() => {
          const c = pendingRemove;
          if (!c) return;
          startTransition(() => {
            const fd = new FormData();
            fd.set("slug", c.slug);
            fd.set("area", area.slug);
            removeChapterArea(fd);
          });
        }}
        onClose={() => setPendingRemove(null)}
      />
    </>
  );
}
