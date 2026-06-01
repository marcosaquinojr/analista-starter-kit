"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { saveChapter, type ActionState } from "@/app/admin/actions";
import type { Chapter } from "@/lib/types";

const initial: ActionState = {};

const SNIPPETS: { label: string; html: string }[] = [
  { label: "Título (H2)", html: "\n<h2>Novo título</h2>\n" },
  { label: "Subtítulo (H3)", html: "\n<h3>Subtítulo</h3>\n" },
  { label: "Parágrafo", html: "\n<p>Escreva aqui…</p>\n" },
  {
    label: "Lista",
    html: "\n<ul>\n  <li>Item um</li>\n  <li>Item dois</li>\n</ul>\n",
  },
  {
    label: "Destaque (azul)",
    html: '\n<div class="callout"><div class="callout-label">Nota</div>Texto do destaque.</div>\n',
  },
  {
    label: "Atenção (laranja)",
    html: '\n<div class="callout warn"><div class="callout-label">Atenção</div>Texto de atenção.</div>\n',
  },
  {
    label: "Positivo (verde)",
    html: '\n<div class="callout good"><div class="callout-label">Sinal bom</div>Texto positivo.</div>\n',
  },
  {
    label: "Alerta (vermelho)",
    html: '\n<div class="callout bad"><div class="callout-label">Cuidado</div>Texto de alerta.</div>\n',
  },
  {
    label: "Cards",
    html: '\n<div class="cards">\n  <div class="card"><div class="card-title">Card 1</div><div class="card-desc">Descrição.</div></div>\n  <div class="card"><div class="card-title">Card 2</div><div class="card-desc">Descrição.</div></div>\n</div>\n',
  },
  {
    label: "Tabela",
    html: "\n<table>\n  <tr><th>Coluna A</th><th>Coluna B</th></tr>\n  <tr><td>valor</td><td>valor</td></tr>\n</table>\n",
  },
  {
    label: "Pergunta (FAQ)",
    html: '\n<div class="faq-item"><div class="q">Pergunta?</div><div class="a">Resposta.</div></div>\n',
  },
];

export default function EditForm({ chapter }: { chapter: Chapter }) {
  const [state, formAction, pending] = useActionState(saveChapter, initial);
  const [body, setBody] = useState(chapter.bodyHtml);
  const taRef = useRef<HTMLTextAreaElement>(null);

  function insert(html: string) {
    const ta = taRef.current;
    if (!ta) {
      setBody((b) => b + html);
      return;
    }
    const start = ta.selectionStart ?? body.length;
    const end = ta.selectionEnd ?? body.length;
    const next = body.slice(0, start) + html + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + html.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <form action={formAction} className="editor">
      <input type="hidden" name="slug" value={chapter.slug} />

      <div className="editor-bar">
        <div className="editor-bar-left">
          <Link href="/admin" className="header-link">
            ← Capítulos
          </Link>
          <span className="editor-slug">/c/{chapter.slug}</span>
        </div>
        <div className="editor-bar-right">
          {state.ok && <span className="editor-saved">Salvo ✓</span>}
          {state.error && <span className="admin-error">{state.error}</span>}
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="editor-meta">
        <label className="field field-grow">
          <span>Título</span>
          <input name="title" defaultValue={chapter.title} required />
        </label>
        <label className="field field-sm">
          <span>Número</span>
          <input name="number" defaultValue={chapter.number} />
        </label>
        <label className="field field-sm">
          <span>Trilha</span>
          <select name="trail" defaultValue={chapter.trail}>
            <option value="Contexto">Contexto</option>
            <option value="Rotina">Rotina</option>
            <option value="Crescimento">Crescimento</option>
          </select>
        </label>
        <label className="field">
          <span>Tempo de leitura</span>
          <input name="readTime" defaultValue={chapter.readTime} />
        </label>
        <label className="field field-full">
          <span>Descrição</span>
          <input name="description" defaultValue={chapter.description} />
        </label>
      </div>

      <div className="editor-toolbar">
        <span className="editor-toolbar-label">Inserir:</span>
        {SNIPPETS.map((s) => (
          <button
            key={s.label}
            type="button"
            className="snippet-btn"
            onClick={() => insert(s.html)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="editor-split">
        <div className="editor-pane">
          <div className="editor-pane-label">Conteúdo (HTML)</div>
          <textarea
            ref={taRef}
            name="bodyHtml"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="editor-pane">
          <div className="editor-pane-label">Pré-visualização</div>
          <div className="editor-preview">
            <div className="chapter-header">
              <span className="chapter-tag">
                {chapter.trail} · Cap {chapter.number}
              </span>
              <h1 className="chapter-title">{chapter.title}</h1>
            </div>
            <div
              className="chapter-body"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
