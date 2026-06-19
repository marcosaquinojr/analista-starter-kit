"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check } from "lucide-react";
import {
  createArea,
  updateArea,
  deleteArea,
  moveArea,
  type ActionState,
} from "@/app/admin/actions";
import type { AreaWithCount } from "@/lib/areas";
import { toast } from "@/lib/toast-store";
import ConfirmModal from "@/components/ConfirmModal";

const initial: ActionState = {};

export default function AreasManager({ areas }: { areas: AreaWithCount[] }) {
  const [createState, createAction, creating] = useActionState(
    createArea,
    initial,
  );
  const [editState, editAction, editing] = useActionState(updateArea, initial);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AreaWithCount | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (createState.ok) toast.success("Área criada.");
    else if (createState.error) toast.error(createState.error);
  }, [createState]);

  useEffect(() => {
    if (editState.ok) toast.success("Área salva.");
    else if (editState.error) toast.error(editState.error);
  }, [editState]);

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Áreas</h1>
        <p>
          As áreas de onboarding (ex.: Negócios, Desenvolvimento). Cada pessoa
          pertence a uma área e vê só os capítulos dela. Um capítulo pode ser
          marcado em mais de uma área (reuso) lá no editor do capítulo.
        </p>
      </div>

      {/* Nova área */}
      <form action={createAction} className="trail-create" key={areas.length}>
        <div className="trail-create-fields">
          <label className="field field-grow">
            <span>Nova área</span>
            <input name="name" placeholder="Ex.: Design" required />
          </label>
          <label className="field field-grow">
            <span>Descrição</span>
            <input
              name="description"
              placeholder="Uma linha que resume a área"
            />
          </label>
          <button type="submit" className="btn-complete" disabled={creating}>
            {creating ? "Criando…" : "Criar área"}
          </button>
        </div>
        {createState.error && (
          <span className="admin-error">{createState.error}</span>
        )}
      </form>

      {/* Lista */}
      <div className="trail-admin-list">
        {areas.map((a, idx) => {
          const isOpen = openSlug === a.slug;
          const blocked = a.chapterCount > 0;
          return (
            <div className="trail-admin-row" key={a.slug}>
              <div className="trail-admin-main">
                <div className="trail-admin-order">
                  <form action={moveArea}>
                    <input type="hidden" name="slug" value={a.slug} />
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
                  <form action={moveArea}>
                    <input type="hidden" name="slug" value={a.slug} />
                    <input type="hidden" name="dir" value="down" />
                    <button
                      type="submit"
                      className="trail-move"
                      disabled={idx === areas.length - 1}
                      aria-label="Descer"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </form>
                </div>

                <div className="admin-row-body">
                  <span className="admin-row-title">{a.name}</span>
                  <span className="admin-row-desc">
                    {a.description || "— sem descrição —"}
                  </span>
                  <span className="trail-admin-slug">/{a.slug}</span>
                </div>

                <span
                  className={`trail-count${blocked ? "" : " trail-count-empty"}`}
                >
                  {a.chapterCount}{" "}
                  {a.chapterCount === 1 ? "capítulo" : "capítulos"}
                </span>

                <div className="trail-admin-actions">
                  <button
                    type="button"
                    className="trail-btn"
                    onClick={() => setOpenSlug(isOpen ? null : a.slug)}
                  >
                    {isOpen ? "Fechar" : "Editar"}
                  </button>
                  <button
                    type="button"
                    className="trail-btn trail-btn-danger"
                    disabled={blocked}
                    onClick={() => setPendingDelete(a)}
                    title={
                      blocked
                        ? "Tem capítulos vinculados — desmarque-os desta área antes de excluir"
                        : "Excluir área"
                    }
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {isOpen && (
                <form action={editAction} className="trail-edit">
                  <input type="hidden" name="slug" value={a.slug} />
                  <label className="field field-grow">
                    <span>Nome</span>
                    <input name="name" defaultValue={a.name} required />
                  </label>
                  <label className="field field-grow">
                    <span>Descrição</span>
                    <input name="description" defaultValue={a.description} />
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
        title="Excluir área"
        message={
          <>
            Excluir a área <strong>{pendingDelete?.name}</strong>? Esta ação não
            pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        danger
        onConfirm={() => {
          const a = pendingDelete;
          if (!a) return;
          startTransition(() => {
            const fd = new FormData();
            fd.set("slug", a.slug);
            deleteArea(fd);
          });
        }}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
