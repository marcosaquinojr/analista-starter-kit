"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveChapter,
  deleteChapter,
  type ActionState,
} from "@/app/admin/actions";
import RichEditor from "@/components/editor/RichEditor";
import type { Chapter, TrailMeta } from "@/lib/types";

const initial: ActionState = {};

export default function EditForm({
  chapter,
  trails,
}: {
  chapter: Chapter;
  trails: TrailMeta[];
}) {
  const [state, formAction, pending] = useActionState(saveChapter, initial);
  const [body, setBody] = useState(chapter.bodyHtml);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText.trim() === chapter.title.trim();

  return (
    <form action={formAction} className="editor">
      <input type="hidden" name="slug" value={chapter.slug} />
      <input type="hidden" name="bodyHtml" value={body} />

      <div className="editor-bar">
        <div className="editor-bar-left">
          <span className="editor-slug">/c/{chapter.slug}</span>
          <span className="editor-updated">
            Última atualização: {chapter.updatedAt}
            {chapter.updatedBy ? ` por ${chapter.updatedBy}` : ""}
          </span>
        </div>
        <div className="editor-bar-right">
          {state.ok && <span className="editor-saved">Publicado ✓</span>}
          {state.error && <span className="admin-error">{state.error}</span>}
          <Link href="/admin" className="trail-btn">
            Cancelar
          </Link>
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </div>

      <div className="editor-meta">
        <label className="field field-grow">
          <span>Título</span>
          <input name="title" defaultValue={chapter.title} required />
        </label>
        <label className="field field-sm">
          <span>Número</span>
          <input name="number" defaultValue={chapter.number} />
        </label>
        <label className="field field-sm">
          <span>Trilha</span>
          <select name="trail" defaultValue={chapter.trailSlug}>
            {trails.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tempo de leitura</span>
          <input name="readTime" defaultValue={chapter.readTime} />
        </label>
        <label className="field field-full">
          <span>Descrição</span>
          <input name="description" defaultValue={chapter.description} />
        </label>
      </div>

      <RichEditor initialHtml={chapter.bodyHtml} onChange={setBody} />

      <div className="editor-danger">
        <div className="editor-danger-text">
          <strong>Excluir capítulo</strong>
          <span>Remove este capítulo de vez. Esta ação não pode ser desfeita.</span>
        </div>
        <button
          type="button"
          className="trail-btn trail-btn-danger"
          onClick={() => {
            setConfirmText("");
            setShowDelete(true);
          }}
        >
          Excluir capítulo
        </button>
      </div>

      {showDelete && (
        <div
          className="modal-backdrop"
          onClick={() => setShowDelete(false)}
          role="presentation"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
          >
            <h2 id="del-title" className="modal-title">
              Excluir capítulo
            </h2>
            <p className="modal-text">
              Esta ação <strong>não pode ser desfeita</strong>. Para confirmar,
              digite o título do capítulo:
            </p>
            <p className="modal-confirm-name">{chapter.title}</p>
            <input
              className="modal-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite o título exatamente"
              autoFocus
            />
            <div className="modal-actions">
              <button
                type="button"
                className="trail-btn"
                onClick={() => setShowDelete(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                formAction={deleteChapter}
                formNoValidate
                className="trail-btn trail-btn-danger"
                disabled={!canDelete}
              >
                Excluir definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
