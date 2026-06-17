"use client";

import { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  const sync = (next: ToolItem[]) => {
    setItems(next);
    updateAttributes({ items: next });
  };
  const update = (i: number, patch: Partial<ToolItem>) =>
    sync(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const add = () => sync([...items, { icon: "", name: "", desc: "", url: "" }]);
  const remove = (i: number) => sync(items.filter((_, idx) => idx !== i));

  const onUpload = async (i: number, file: File) => {
    setError(null);
    setUploading(i);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadToolIcon(fd);
    setUploading(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.url) update(i, { icon: res.url });
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

      {error && <p className="tools-editor-error">{error}</p>}

      <div className="tools-editor-list">
        {items.map((it, i) => (
          <div className="tools-editor-row" key={i}>
            <label
              className="tools-icon-pick"
              title="Enviar ícone (PNG, SVG, JPG, WEBP — máx. 512 KB)"
            >
              {it.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.icon} alt="" />
              ) : (
                <span className="tools-icon-empty">
                  {uploading === i ? "…" : "+ ícone"}
                </span>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(i, f);
                  e.target.value = "";
                }}
              />
            </label>

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
        ))}
      </div>

      <button type="button" className="hb-btn" onClick={add}>
        + Adicionar ferramenta
      </button>
    </NodeViewWrapper>
  );
}
