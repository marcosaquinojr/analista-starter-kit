"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check } from "lucide-react";
import {
  createTrail,
  updateTrail,
  deleteTrail,
  moveTrail,
  type ActionState,
} from "@/app/admin/actions";
import type { TrailWithCount } from "@/lib/trails";
import { toast } from "@/lib/toast-store";
import ConfirmModal from "@/components/ConfirmModal";

const initial: ActionState = {};

export default function TrailsManager({
  trails,
}: {
  trails: TrailWithCount[];
}) {
  const [createState, createAction, creating] = useActionState(
    createTrail,
    initial,
  );
  const [editState, editAction, editing] = useActionState(updateTrail, initial);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TrailWithCount | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (createState.ok) toast.success("Trilha criada.");
    else if (createState.error) toast.error(createState.error);
  }, [createState]);

  useEffect(() => {
    if (editState.ok) toast.success("Trilha salva.");
    else if (editState.error) toast.error(editState.error);
  }, [editState]);

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Trilhas</h1>
        <p>
          As seções do menu. Crie, renomeie, reordene ou remova — as mudanças
          vão pro ar na hora. Uma trilha só aparece no site quando tem ao menos
          um capítulo.
        </p>
      </div>

      {/* Nova trilha */}
      <form action={createAction} className="trail-create" key={trails.length}>
        <div className="trail-create-fields">
          <label className="field field-grow">
            <span>Nova trilha</span>
            <input name="title" placeholder="Ex.: Ferramentas" required />
          </label>
          <label className="field field-grow">
            <span>Descrição</span>
            <input
              name="description"
              placeholder="Uma linha que resume a seção"
            />
          </label>
          <button type="submit" className="btn-complete" disabled={creating}>
            {creating ? "Criando…" : "Criar trilha"}
          </button>
        </div>
        {createState.error && (
          <span className="admin-error">{createState.error}</span>
        )}
      </form>

      {/* Lista */}
      <div className="trail-admin-list">
        {trails.map((t, idx) => {
          const isOpen = openSlug === t.slug;
          const blocked = t.chapterCount > 0;
          return (
            <div className="trail-admin-row" key={t.slug}>
              <div className="trail-admin-main">
                <div className="trail-admin-order">
                  <form action={moveTrail}>
                    <input type="hidden" name="slug" value={t.slug} />
                    <input type="hidden" name="dir" value="up" />
                    <button
                      type="submit"
                      className="trail-move"
                      disabled={idx === 0}
                      aria-label="Subir"
                    >
                      <ArrowUp size={15} />
                    </button>
                  </form>
                  <form action={moveTrail}>
                    <input type="hidden" name="slug" value={t.slug} />
                    <input type="hidden" name="dir" value="down" />
                    <button
                      type="submit"
                      className="trail-move"
                      disabled={idx === trails.length - 1}
                      aria-label="Descer"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </form>
                </div>

                <div className="admin-row-body">
                  <span className="admin-row-title">{t.title}</span>
                  <span className="admin-row-desc">
                    {t.description || "— sem descrição —"}
                  </span>
                  <span className="trail-admin-slug">/{t.slug}</span>
                </div>

                <span
                  className={`trail-count${blocked ? "" : " trail-count-empty"}`}
                >
                  {t.chapterCount} {t.chapterCount === 1 ? "capítulo" : "capítulos"}
                </span>

                <div className="trail-admin-actions">
                  <button
                    type="button"
                    className="trail-btn"
                    onClick={() => setOpenSlug(isOpen ? null : t.slug)}
                  >
                    {isOpen ? "Fechar" : "Editar"}
                  </button>
                  <button
                    type="button"
                    className="trail-btn trail-btn-danger"
                    disabled={blocked}
                    onClick={() => setPendingDelete(t)}
                    title={
                      blocked
                        ? "Tem capítulos — mova-os para outra trilha antes de excluir"
                        : "Excluir trilha"
                    }
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {isOpen && (
                <form action={editAction} className="trail-edit">
                  <input type="hidden" name="slug" value={t.slug} />
                  <label className="field field-grow">
                    <span>Título</span>
                    <input name="title" defaultValue={t.title} required />
                  </label>
                  <label className="field field-grow">
                    <span>Descrição</span>
                    <input name="description" defaultValue={t.description} />
                  </label>
                  <button
                    type="submit"
                    className="btn-complete"
                    disabled={editing}
                  >
                    {editing ? "Salvando…" : "Salvar"}
                  </button>
                  {editState.ok && (
                    <span className="editor-saved">
                      <Check size={14} strokeWidth={3} /> Salvo
                    </span>
                  )}
                  {editState.error && (
                    <span className="admin-error">{editState.error}</span>
                  )}
                </form>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Excluir trilha"
        message={
          <>
            Excluir a trilha <strong>{pendingDelete?.title}</strong>? Esta ação
            não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        danger
        onConfirm={() => {
          const t = pendingDelete;
          if (!t) return;
          startTransition(() => {
            const fd = new FormData();
            fd.set("slug", t.slug);
            deleteTrail(fd);
          });
        }}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
