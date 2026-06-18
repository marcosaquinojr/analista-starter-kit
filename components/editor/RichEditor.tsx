"use client";

import { useEffect, useReducer, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions } from "./extensions";
import { generateAIContent } from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

type Props = {
  initialHtml: string;
  onChange: (html: string) => void;
  isAiEnabled?: boolean;
};

export default function RichEditor({
  initialHtml,
  onChange,
  isAiEnabled = false,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: buildExtensions(),
    content: initialHtml,
    editorProps: {
      attributes: { class: "chapter-body editor-canvas" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // re-renderiza a toolbar quando a seleção/estado muda
  const [, force] = useReducer((x) => x + 1, 0);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAICall = async (promptType: string) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    if (!selectedText.trim()) {
      toast.error("Por favor, selecione algum texto no editor primeiro!");
      setAiMenuOpen(false);
      return;
    }

    setAiLoading(true);
    setAiMenuOpen(false);
    toast.success("Enviando solicitação ao assistente de IA...");

    try {
      const res = await generateAIContent(promptType, selectedText);
      if (res.error) {
        toast.error(res.error);
      } else if (res.text) {
        editor.chain().focus().insertContent(res.text).run();
        toast.success("Texto processado com sucesso!");
      }
    } catch {
      toast.error("Ocorreu um erro ao processar o texto via IA.");
    } finally {
      setAiLoading(false);
    }
  };
  useEffect(() => {
    if (!editor) return;
    const handler = () => force();
    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  }, [editor]);

  // Atualiza o editor se o HTML inicial mudar de fora (ex: restauração de rascunho)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (editor.getHTML() !== initialHtml) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  if (!editor) return <div className="editor-loading">Carregando editor…</div>;

  const inCallout = editor.isActive("callout");

  const Btn = ({
    on,
    active,
    children,
    title,
  }: {
    on: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      className={`tb-btn${active ? " active" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
    >
      {children}
    </button>
  );

  const insertCallout = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: "callout",
        attrs: { variant: "default" },
        content: [
          { type: "calloutLabel", content: [{ type: "text", text: "Nota" }] },
          {
            type: "paragraph",
            content: [{ type: "text", text: "Texto do destaque." }],
          },
        ],
      })
      .run();

  const insertCards = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: "cardGrid",
        content: [1, 2].map((n) => ({
          type: "card",
          content: [
            { type: "cardTitle", content: [{ type: "text", text: `Card ${n}` }] },
            { type: "cardDesc", content: [{ type: "text", text: "Descrição." }] },
          ],
        })),
      })
      .run();

  const insertTools = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: "tools",
        attrs: { items: [{ icon: "", name: "", desc: "", url: "" }] },
      })
      .run();

  const insertGlossary = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: "glossary",
        attrs: { items: [{ term: "", def: "" }] },
      })
      .run();

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <div className="tb-group">
          <Btn
            title="Negrito"
            active={editor.isActive("bold")}
            on={() => editor.chain().focus().toggleBold().run()}
          >
            <b>B</b>
          </Btn>
          <Btn
            title="Itálico"
            active={editor.isActive("italic")}
            on={() => editor.chain().focus().toggleItalic().run()}
          >
            <i>I</i>
          </Btn>
          <Btn title="Link" active={editor.isActive("link")} on={setLink}>
            🔗
          </Btn>
        </div>

        <div className="tb-group">
          <Btn
            title="Título"
            active={editor.isActive("heading", { level: 2 })}
            on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Btn>
          <Btn
            title="Subtítulo"
            active={editor.isActive("heading", { level: 3 })}
            on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Btn>
          <Btn
            title="Parágrafo"
            active={editor.isActive("paragraph")}
            on={() => editor.chain().focus().setParagraph().run()}
          >
            ¶
          </Btn>
        </div>

        <div className="tb-group">
          <Btn
            title="Lista"
            active={editor.isActive("bulletList")}
            on={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Lista
          </Btn>
          <Btn
            title="Lista numerada"
            active={editor.isActive("orderedList")}
            on={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Lista
          </Btn>
        </div>

        <div className="tb-group">
          <Btn title="Destaque" on={insertCallout}>
            + Destaque
          </Btn>
          <Btn title="Cards" on={insertCards}>
            + Cards
          </Btn>
          <Btn title="Ferramentas (cartões com ícone)" on={insertTools}>
            + Ferramentas
          </Btn>
          <Btn title="Glossário (termo + definição)" on={insertGlossary}>
            + Glossário
          </Btn>
          <Btn
            title="Tabela"
            on={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                .run()
            }
          >
            + Tabela
          </Btn>
        </div>

        {isAiEnabled && (
          <div className="tb-group" style={{ position: "relative" }}>
            <button
              type="button"
              className={`tb-btn ${aiMenuOpen ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
              onClick={() => setAiMenuOpen(!aiMenuOpen)}
              disabled={aiLoading}
            >
              {aiLoading ? "⏳ Processando..." : "✨ Assistente de IA"}
            </button>
            
            {aiMenuOpen && (
              <div className="rich-ai-dropdown">
                <button
                  type="button"
                  className="rich-ai-item"
                  onClick={() => handleAICall("acceptance_criteria")}
                >
                  BDD: Critérios de Aceite
                </button>
                <button
                  type="button"
                  className="rich-ai-item"
                  onClick={() => handleAICall("simplify")}
                >
                  Simplificar Jargão Técnico
                </button>
                <button
                  type="button"
                  className="rich-ai-item"
                  onClick={() => handleAICall("summarize")}
                >
                  Gerar Resumo Curto
                </button>
                <button
                  type="button"
                  className="rich-ai-item"
                  onClick={() => handleAICall("expand")}
                >
                  Melhorar / Expandir Redação
                </button>
              </div>
            )}
          </div>
        )}

        {inCallout && (
          <div className="tb-group tb-variants">
            <span className="tb-label">Cor do destaque:</span>
            {(
              [
                ["default", "Azul"],
                ["warn", "Laranja"],
                ["good", "Verde"],
                ["bad", "Vermelho"],
              ] as const
            ).map(([variant, label]) => (
              <button
                key={variant}
                type="button"
                className={`tb-variant tb-${variant}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("callout", { variant })
                    .run()
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rich-canvas-wrap">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
