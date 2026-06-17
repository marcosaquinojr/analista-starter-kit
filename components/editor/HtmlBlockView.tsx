"use client";

import { useState, type MouseEvent } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

function friendlyName(html: string): string {
  if (html.includes("glossary")) return "Glossário";
  if (html.includes("process")) return "Diagrama de processo";
  if (html.includes("faq-item")) return "Pergunta (FAQ)";
  if (html.includes("<table")) return "Tabela";
  return "Bloco";
}

/**
 * NodeView para os blocos ricos pouco frequentes (glossário, processo, FAQ).
 * Mostra o bloco já renderizado (não HTML cru) e, ao clicar em "Editar",
 * abre uma edição estruturada simples. Preserva o conteúdo fielmente.
 */
export default function HtmlBlockView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const html = (node.attrs.html as string) ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(html);

  return (
    <NodeViewWrapper
      className="html-block"
      contentEditable={false}
      onMouseDown={(e: MouseEvent) => e.stopPropagation()}
    >
      <div className="html-block-bar">
        <span className="html-block-tag">{friendlyName(html)}</span>
        <div className="html-block-actions">
          {editing ? (
            <>
              <button
                type="button"
                className="hb-btn hb-btn-primary"
                onClick={() => {
                  updateAttributes({ html: draft });
                  setEditing(false);
                }}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="hb-btn"
                onClick={() => {
                  setDraft(html);
                  setEditing(false);
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="hb-btn"
                onClick={() => {
                  setDraft(html);
                  setEditing(true);
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="hb-btn hb-btn-danger"
                onClick={() => deleteNode()}
              >
                Remover
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          className="html-block-editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          rows={Math.min(20, Math.max(6, draft.split("\n").length + 1))}
        />
      ) : (
        <div
          className="html-block-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </NodeViewWrapper>
  );
}
