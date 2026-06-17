"use client";

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import { type MouseEvent } from "react";

/**
 * NodeView de um card individual: mantém título/descrição editáveis inline
 * (NodeViewContent) e mostra um × no canto para remover só aquele card. Apagar
 * o último card do bloco remove o bloco inteiro (content "card+").
 */
export default function CardView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper className="card">
      <button
        type="button"
        className="block-del card-del"
        title="Remover este card"
        contentEditable={false}
        onMouseDown={(e: MouseEvent) => e.stopPropagation()}
        onClick={() => deleteNode()}
      >
        ×
      </button>
      <NodeViewContent className="card-content" />
    </NodeViewWrapper>
  );
}
