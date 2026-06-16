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

  return (
    <form action={formAction} className="editor">
      <input type="hidden" name="slug" value={chapter.slug} />
      <input type="hidden" name="bodyHtml" value={body} />

      <div className="editor-bar">
        <div className="editor-bar-left">
          <Link href="/admin" className="header-link">
            ← Capítulos
          </Link>
          <span className="editor-slug">/c/{chapter.slug}</span>
        </div>
        <div className="editor-bar-right">
          {state.ok && <span className="editor-saved">Salvo ✓</span>}
          {state.error && <span className="admin-error">{state.error}</span>}
          <button
            type="submit"
            formAction={deleteChapter}
            formNoValidate
            className="trail-btn trail-btn-danger"
            onClick={(e) => {
              if (
                !confirm(
                  `Excluir o capítulo "${chapter.title}"? Isso não pode ser desfeito.`,
                )
              )
                e.preventDefault();
            }}
          >
            Excluir
          </button>
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Salvando…" : "Salvar"}
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
    </form>
  );
}
