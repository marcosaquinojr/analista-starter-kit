"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState, type MouseEvent } from "react";

export interface GlossItem {
  term: string;
  def: string;
}

/**
 * NodeView do bloco "Glossário": lista estruturada de termo + definição, em vez
 * de HTML cru. Round-trip via data-items (ver extensions). Usa os tokens/fontes
 * do Design System — nada hardcoded.
 */
export default function GlossaryBlockView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const [items, setItems] = useState<GlossItem[]>(() =>
    Array.isArray(node.attrs.items) ? (node.attrs.items as GlossItem[]) : [],
  );

  const sync = (next: GlossItem[]) => {
    setItems(next);
    updateAttributes({ items: next });
  };
  const update = (i: number, patch: Partial<GlossItem>) =>
    sync(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const add = () => sync([...items, { term: "", def: "" }]);
  const remove = (i: number) => sync(items.filter((_, idx) => idx !== i));

  return (
    <NodeViewWrapper
      className="gloss-editor"
      contentEditable={false}
      onMouseDown={(e: MouseEvent) => e.stopPropagation()}
    >
      <div className="gloss-editor-bar">
        <span className="html-block-tag">Glossário</span>
        <button
          type="button"
          className="hb-btn hb-btn-danger"
          onClick={() => deleteNode()}
        >
          Remover bloco
        </button>
      </div>

      <div className="gloss-editor-list">
        {items.map((it, i) => (
          <div className="gloss-editor-row" key={i}>
            <div className="gloss-editor-fields">
              <input
                className="gloss-term-input"
                placeholder="Termo (ex.: Edital)"
                value={it.term}
                onChange={(e) => update(i, { term: e.target.value })}
              />
              <textarea
                className="gloss-def-input"
                placeholder="Definição"
                rows={2}
                value={it.def}
                onChange={(e) => update(i, { def: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="tools-remove"
              title="Remover termo"
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="hb-btn" onClick={add}>
        + Adicionar termo
      </button>
    </NodeViewWrapper>
  );
}
