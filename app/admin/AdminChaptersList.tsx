"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChapterMeta, TrailMeta } from "@/lib/types";
import type { QuizMeta } from "@/lib/quizzes";
import { saveChaptersOrder, createChapter, createQuiz } from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

export default function AdminChaptersList({
  initialChapters,
  trails,
  quizzes = [],
}: {
  initialChapters: ChapterMeta[];
  trails: TrailMeta[];
  quizzes?: QuizMeta[];
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);

  const byTrail = (trailSlug: string) =>
    chapters.filter((c) => c.trailSlug === trailSlug);
  const quizzesOf = (trailSlug: string) =>
    quizzes.filter((q) => q.trailSlug === trailSlug);

  const handleDragStart = (e: React.DragEvent, slug: string) => {
    setDraggedSlug(slug);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetSlug: string, targetTrailSlug: string) => {
    e.preventDefault();
    if (!draggedSlug || draggedSlug === targetSlug) return;

    const draggedIdx = chapters.findIndex((c) => c.slug === draggedSlug);
    const targetIdx = chapters.findIndex((c) => c.slug === targetSlug);
    if (draggedIdx < 0 || targetIdx < 0) return;

    const reordered = [...chapters];
    const [item] = reordered.splice(draggedIdx, 1);
    item.trailSlug = targetTrailSlug;
    reordered.splice(targetIdx, 0, item);
    setChapters(reordered);
  };

  const handleDragOverEmptyTrail = (e: React.DragEvent, targetTrailSlug: string) => {
    e.preventDefault();
    if (!draggedSlug) return;

    const draggedIdx = chapters.findIndex((c) => c.slug === draggedSlug);
    if (draggedIdx < 0) return;

    const trailItems = chapters.filter((c) => c.trailSlug === targetTrailSlug);
    if (trailItems.length === 0) {
      const reordered = [...chapters];
      const [item] = reordered.splice(draggedIdx, 1);
      item.trailSlug = targetTrailSlug;
      reordered.push(item);
      setChapters(reordered);
    }
  };

  const handleDragEnd = async () => {
    setDraggedSlug(null);
    try {
      const payload = chapters.map((c) => ({
        slug: c.slug,
        trailSlug: c.trailSlug,
      }));
      await saveChaptersOrder(payload);
      toast.success("Ordem dos capítulos salva.");
    } catch {
      toast.error("Falha ao salvar a nova ordem.");
    }
  };

  return (
    <>
      {trails.map((trail) => {
        const items = byTrail(trail.slug);
        return (
          <section
            className="admin-trail"
            key={trail.slug}
            onDragOver={(e) => handleDragOverEmptyTrail(e, trail.slug)}
            style={{
              padding: "16px",
              border: "1px dashed transparent",
              borderRadius: "8px",
              marginBottom: "16px",
              transition: "border-color 0.2s",
            }}
          >
            <div className="admin-trail-head">
              <div className="sidebar-label">{trail.title}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <form action={createChapter}>
                  <input type="hidden" name="trail" value={trail.slug} />
                  <button type="submit" className="trail-btn">
                    + Novo capítulo
                  </button>
                </form>
                <form action={createQuiz}>
                  <input type="hidden" name="trail" value={trail.slug} />
                  <button type="submit" className="trail-btn">
                    + Novo quiz
                  </button>
                </form>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="admin-trail-empty" style={{ border: "2px dashed #cbd5e1", padding: "16px", borderRadius: "6px", textAlign: "center", color: "#64748b" }}>
                Trilha sem capítulos ainda. Arraste um capítulo aqui para mover.
              </p>
            ) : (
              <div className="admin-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map((c) => {
                  const isDragging = c.slug === draggedSlug;
                  return (
                    <div
                      key={c.slug}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.slug)}
                      onDragOver={(e) => handleDragOver(e, c.slug, trail.slug)}
                      onDragEnd={handleDragEnd}
                      className="admin-chapter-card"
                      style={{
                        opacity: isDragging ? 0.4 : 1,
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        border: isDragging ? "2px dashed var(--blue)" : "1px solid var(--border)",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Drag Handle Icon */}
                      <div
                        style={{
                          padding: "16px 0 16px 16px",
                          color: "var(--text3)",
                          display: "flex",
                          alignItems: "center",
                          cursor: "grab",
                        }}
                      >
                        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="3" cy="3" r="1" fill="currentColor" />
                          <circle cx="3" cy="9" r="1" fill="currentColor" />
                          <circle cx="3" cy="15" r="1" fill="currentColor" />
                          <circle cx="9" cy="3" r="1" fill="currentColor" />
                          <circle cx="9" cy="9" r="1" fill="currentColor" />
                          <circle cx="9" cy="15" r="1" fill="currentColor" />
                        </svg>
                      </div>

                      <Link
                        href={`/admin/${c.slug}`}
                        className="admin-row"
                        style={{
                          pointerEvents: draggedSlug ? "none" : "auto",
                          display: "flex",
                          alignItems: "center",
                          padding: "16px",
                          textDecoration: "none",
                          flexGrow: 1,
                          minWidth: 0,
                        }}
                      >
                        <span className="admin-row-num" style={{ marginRight: "16px", fontWeight: "bold", fontSize: "16px", color: "var(--blue)" }}>
                          {c.number}
                        </span>
                        <span className="admin-row-body" style={{ flexGrow: 1, minWidth: 0 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span className="admin-row-title" style={{ color: "var(--ink)", fontWeight: "600", fontSize: "15px" }}>
                              {c.title}
                            </span>
                          </span>
                          <span className="admin-row-desc" style={{ display: "block", fontSize: "12px", color: "var(--text2)", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.description}
                          </span>
                        </span>
                        <span className="admin-row-meta" style={{ fontSize: "11px", color: "var(--text3)", flexShrink: 0, marginLeft: "16px" }}>
                          Atualizado {c.updatedAt} →
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {quizzesOf(trail.slug).length > 0 && (
              <div className="admin-quiz-list">
                {quizzesOf(trail.slug).map((q) => (
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
          </section>
        );
      })}
    </>
  );
}
