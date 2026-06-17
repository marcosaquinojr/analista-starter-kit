"use client";

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import { type MouseEvent } from "react";

/**
 * NodeView do bloco "Cards": mantém os cartões editáveis inline (via
 * NodeViewContent) e acrescenta um × no canto para remover o bloco inteiro —
 * antes só dava pra apagar selecionando no teclado.
 */
export default function CardGridView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper className="cards-block">
      <button
        type="button"
        className="block-del"
        title="Remover bloco de cards"
        contentEditable={false}
        onMouseDown={(e: MouseEvent) => e.stopPropagation()}
        onClick={() => deleteNode()}
      >
        ×
      </button>
      <NodeViewContent className="cards" />
    </NodeViewWrapper>
  );
}
