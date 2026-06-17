"use client";

import { useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { uploadToolIcon } from "@/app/admin/actions";

export interface ToolItem {
  icon: string;
  name: string;
  desc: string;
  url: string;
}

/**
 * NodeView do bloco "Ferramentas": uma lista editável de cartões (ícone enviado
 * + nome + descrição + link). O ícone vai pro Vercel Blob via server action e a
 * URL pública fica guardada no item. Round-trip via data-items (ver extensions).
 */
export default function ToolsBlockView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const [items, setItems] = useState<ToolItem[]>(() =>
    Array.isArray(node.attrs.items) ? (node.attrs.items as ToolItem[]) : [],
  );
  const [uploading, setUploading] = useState<number | null>(null);
  const [errorAt, setErrorAt] = useState<{ i: number; msg: string } | null>(
    null,
  );
  const [doneAt, setDoneAt] = useState<number | null>(null);
  // refs dos inputs de arquivo (um por card) — disparamos o clique manualmente
  // porque o ProseMirror engole o clique no <label> dentro do node view.
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sync = (next: ToolItem[]) => {
    setItems(next);
    updateAttributes({ items: next });
  };
  const update = (i: number, patch: Partial<ToolItem>) =>
    sync(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const add = () => sync([...items, { icon: "", name: "", desc: "", url: "" }]);
  const remove = (i: number) => sync(items.filter((_, idx) => idx !== i));

  const onUpload = async (i: number, file: File) => {
    setErrorAt(null);
    setDoneAt(null);
    setUploading(i);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadToolIcon(fd);
      if (res.error) {
        setErrorAt({ i, msg: res.error });
      } else if (res.url) {
        update(i, { icon: res.url });
        setDoneAt(i);
        // o ✓ some sozinho depois de um tempo
        setTimeout(() => setDoneAt((d) => (d === i ? null : d)), 2500);
      }
    } catch {
      setErrorAt({ i, msg: "Falha no envio. Tente de novo." });
    } finally {
      setUploading(null);
    }
  };

  return (
    <NodeViewWrapper className="tools-editor" contentEditable={false}>
      <div className="tools-editor-bar">
        <span className="html-block-tag">Ferramentas</span>
        <button
          type="button"
          className="hb-btn hb-btn-danger"
          onClick={() => deleteNode()}
        >
          Remover bloco
        </button>
      </div>

      <div className="tools-editor-list">
        {items.map((it, i) => {
          const isUp = uploading === i;
          const isErr = errorAt?.i === i;
          const isDone = doneAt === i;
          return (
          <div className="tools-editor-row" key={i}>
            <div
              className={`tools-icon-pick${isUp ? " is-uploading" : ""}${
                isErr ? " is-error" : ""
              }${it.icon && !isUp ? " has-icon" : ""}`}
              title="Enviar imagem (PNG, SVG, JPG, WEBP — máx. 512 KB)"
              role="button"
              tabIndex={0}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => !isUp && fileRefs.current[i]?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileRefs.current[i]?.click();
                }
              }}
            >
              {isUp ? (
                <span className="tools-spinner" aria-label="Enviando…" />
              ) : it.icon ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.icon}
                    alt=""
                    onError={() =>
                      setErrorAt({ i, msg: "A imagem não carregou." })
                    }
                  />
                  <span className="tools-icon-hover">Trocar</span>
                  {isDone && (
                    <span className="tools-icon-done" aria-label="Carregada">
                      ✓
                    </span>
                  )}
                </>
              ) : (
                <span className="tools-icon-empty">
                  {isErr ? "Erro" : "+ imagem"}
                </span>
              )}
              <input
                ref={(el) => {
                  fileRefs.current[i] = el;
                }}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(i, f);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="tools-fields">
              <input
                className="tools-input"
                placeholder="Nome (ex.: Azure DevOps)"
                value={it.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
              <input
                className="tools-input"
                placeholder="Descrição curta"
                value={it.desc}
                onChange={(e) => update(i, { desc: e.target.value })}
              />
              <input
                className="tools-input"
                placeholder="Link (https://…)"
                value={it.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
              {isUp && (
                <span className="tools-field-status">Enviando imagem…</span>
              )}
              {isErr && (
                <span className="tools-field-error">{errorAt.msg}</span>
              )}
              {isDone && (
                <span className="tools-field-status tools-field-ok">
                  Imagem carregada ✓
                </span>
              )}
            </div>

            <button
              type="button"
              className="tools-remove"
              title="Remover ferramenta"
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
          );
        })}
      </div>

      <button type="button" className="hb-btn" onClick={add}>
        + Adicionar ferramenta
      </button>
    </NodeViewWrapper>
  );
}
