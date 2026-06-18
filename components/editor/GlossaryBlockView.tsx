"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState, type MouseEvent } from "react";

export interface GlossItem {
  term: string;
  def: string;
}

export default function GlossaryBlockView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const [items, setItems] = useState<GlossItem[]>(() =>
    Array.isArray(node.attrs.items) ? (node.attrs.items as GlossItem[]) : [],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempItems, setTempItems] = useState<GlossItem[]>([]);

  const sync = (next: GlossItem[]) => {
    setItems(next);
    updateAttributes({ items: next });
  };

  const openModal = () => {
    setTempItems([...items]);
    setIsModalOpen(true);
  };

  const saveModal = () => {
    sync(tempItems);
    setIsModalOpen(false);
  };

  const updateTemp = (i: number, patch: Partial<GlossItem>) => {
    setTempItems(tempItems.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const addTemp = () => {
    setTempItems([...tempItems, { term: "", def: "" }]);
  };

  const removeTemp = (i: number) => {
    setTempItems(tempItems.filter((_, idx) => idx !== i));
  };

  return (
    <NodeViewWrapper
      className="gloss-editor"
      contentEditable={false}
      onMouseDown={(e: MouseEvent) => e.stopPropagation()}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--bg)",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <div className="gloss-editor-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <span className="html-block-tag">Glossário</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="hb-btn"
            onClick={openModal}
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            ✏️ Editar Termos
          </button>
          <button
            type="button"
            className="hb-btn hb-btn-danger"
            onClick={() => deleteNode()}
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            Remover bloco
          </button>
        </div>
      </div>

      <div className="gloss-preview" style={{ padding: "16px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.length === 0 ? (
          <span style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "13px" }}>
            Nenhum termo cadastrado ainda. Clique em &quot;Editar Termos&quot; para adicionar.
          </span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {items.map((it, idx) => (
              <div key={idx} style={{ fontSize: "13px", lineHeight: "1.4", borderLeft: "3px solid var(--blue)", paddingLeft: "8px" }}>
                <strong style={{ color: "var(--ink)" }}>{it.term || "(Termo vazio)"}</strong>
                <p style={{ margin: "2px 0 0 0", color: "var(--text)" }}>{it.def || "(Sem definição)"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: "600px", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Editar Termos do Glossário</h2>
            <p className="modal-text" style={{ marginBottom: "16px" }}>
              Adicione ou modifique os termos e definições do glossário abaixo.
            </p>

            <div
              className="gloss-editor-list"
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingRight: "4px",
              }}
            >
              {tempItems.length === 0 ? (
                <p style={{ color: "var(--text3)", textAlign: "center", fontStyle: "italic", padding: "20px 0" }}>
                  Nenhum termo adicionado. Clique no botão abaixo para começar.
                </p>
              ) : (
                tempItems.map((it, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      background: "var(--bg2)",
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input
                        className="modal-input"
                        style={{ marginBottom: 0 }}
                        placeholder="Termo (ex.: Edital)"
                        value={it.term}
                        onChange={(e) => updateTemp(i, { term: e.target.value })}
                      />
                      <textarea
                        className="modal-input"
                        style={{ marginBottom: 0, resize: "vertical" }}
                        placeholder="Definição..."
                        rows={2}
                        value={it.def}
                        onChange={(e) => updateTemp(i, { def: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      className="trail-btn trail-btn-danger"
                      style={{ padding: "6px 10px", minWidth: "auto", fontSize: "16px" }}
                      title="Remover termo"
                      onClick={() => removeTemp(i)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <button
                type="button"
                className="trail-btn"
                onClick={addTemp}
              >
                + Adicionar Termo
              </button>
              <div className="modal-actions" style={{ margin: 0 }}>
                <button
                  type="button"
                  className="trail-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-complete"
                  style={{ height: "38px", padding: "0 16px", borderRadius: "var(--radius-sm)", fontWeight: "600" }}
                  onClick={saveModal}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}
