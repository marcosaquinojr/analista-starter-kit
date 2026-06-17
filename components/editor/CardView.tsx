"use client";

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import { type MouseEvent } from "react";

/**
 * NodeView de um card individual: título/descrição editáveis inline
 * (NodeViewContent) + × no canto para remover só aquele card.
 *
 * Cuidado: o bloco exige ao menos um card (content "card+"). Se este for o
 * último, removemos o bloco inteiro — senão o ProseMirror recria um card vazio
 * e parece que "não apagou".
 */
export default function CardView({
  editor,
  node,
  getPos,
}: NodeViewProps) {
  const onDelete = () => {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (pos == null) return;
    const $pos = editor.state.doc.resolve(pos);
    const grid = $pos.parent;

    if (grid.type.name === "cardGrid" && grid.childCount <= 1) {
      // último card → remove o bloco inteiro
      editor
        .chain()
        .focus()
        .deleteRange({ from: $pos.before($pos.depth), to: $pos.after($pos.depth) })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .run();
    }
  };

  return (
    <NodeViewWrapper className="card">
      <button
        type="button"
        className="block-del card-del"
        title="Remover este card"
        contentEditable={false}
        onMouseDown={(e: MouseEvent) => e.stopPropagation()}
        onClick={onDelete}
      >
        ×
      </button>
      <NodeViewContent className="card-content" />
    </NodeViewWrapper>
  );
}
