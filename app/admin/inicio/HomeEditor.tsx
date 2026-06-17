"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { saveHome, type ActionState } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/settings";
import { heroHtml } from "@/lib/hero";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

/** Cores da marca para os atalhos da barra (rótulo + hex). */
const SWATCHES: ReadonlyArray<readonly [string, string]> = [
  ["Azul", "#146bfa"],
  ["Preto", "#0f172a"],
  ["Cinza", "#64748b"],
  ["Verde", "#059669"],
  ["Laranja", "#b45309"],
  ["Vermelho", "#b91c1c"],
];

export default function HomeEditor({
  home,
  chaptersCount,
  trailsCount,
}: {
  home: HomeContent;
  chaptersCount: number;
  trailsCount: number;
}) {
  const [state, action, saving] = useActionState(saveHome, initial);
  const [readTime, setReadTime] = useState(home.readTime);

  useEffect(() => {
    if (state.ok) toast.success("Página inicial publicada.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  // Conteúdo inicial dos campos editáveis (memoizado: identidade estável evita
  // que o React reescreva o contentEditable e apague a edição num re-render).
  const initialTitle = useMemo(() => heroHtml(home.title, "accent"), [home.title]);
  const initialSub = useMemo(
    () => heroHtml(home.subtitle, "strong"),
    [home.subtitle],
  );

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  const titleInput = useRef<HTMLInputElement>(null);
  const subInput = useRef<HTMLInputElement>(null);
  const tagInput = useRef<HTMLInputElement>(null);

  const savedRange = useRef<Range | null>(null);

  // Mantém os inputs ocultos (o que de fato é enviado) em sincronia com o que
  // está sendo editado visualmente.
  const sync = () => {
    if (titleInput.current && titleRef.current)
      titleInput.current.value = titleRef.current.innerHTML;
    if (subInput.current && subRef.current)
      subInput.current.value = subRef.current.innerHTML;
    if (tagInput.current && tagRef.current)
      tagInput.current.value = tagRef.current.innerText.trim();
  };

  // Guarda a seleção atual quando ela está dentro de um campo editável, para
  // restaurá-la antes de aplicar uma cor (o seletor de cor rouba o foco).
  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.getRangeAt(0).commonAncestorContainer;
    const host = node.nodeType === 1 ? (node as Element) : node.parentElement;
    if (host?.closest("[data-hero-edit]")) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const exec = (cmd: string, value?: string, css = false) => {
    restoreSelection();
    document.execCommand("styleWithCSS", false, css ? "true" : "false");
    document.execCommand(cmd, false, value);
    sync();
  };

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Página inicial</h1>
        <p>
          Edite o texto de boas-vindas direto na prévia — do jeitinho que ele
          aparece no site. Selecione um trecho e use a barra para deixar em
          negrito, itálico ou trocar a cor. As mudanças vão pro ar ao salvar.
        </p>
      </div>

      {/* Barra de formatação */}
      <div className="hero-toolbar">
        <div className="tb-group">
          <button
            type="button"
            className="tb-btn"
            title="Negrito"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("bold")}
          >
            <b>B</b>
          </button>
          <button
            type="button"
            className="tb-btn"
            title="Itálico"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("italic")}
          >
            <i>I</i>
          </button>
        </div>

        <div className="tb-group">
          <span className="tb-label">Cor</span>
          {SWATCHES.map(([name, color]) => (
            <button
              key={color}
              type="button"
              className="tb-swatch"
              title={name}
              style={{ background: color }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("foreColor", color, true)}
            />
          ))}
          <label
            className="tb-swatch tb-swatch-custom"
            title="Cor personalizada"
            onMouseDown={(e) => e.preventDefault()}
          >
            <span aria-hidden>+</span>
            <input
              type="color"
              onChange={(e) => exec("foreColor", e.target.value, true)}
            />
          </label>
        </div>

        <div className="tb-group">
          <button
            type="button"
            className="tb-btn"
            title="Limpar formatação"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("removeFormat")}
          >
            Limpar
          </button>
        </div>
      </div>

      <form action={action}>
        {/* Prévia editável — usa o CSS real do site */}
        <div className="welcome-hero hero-edit-canvas">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <span
            ref={tagRef}
            data-hero-edit
            className="welcome-tag hero-editable"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={sync}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            dangerouslySetInnerHTML={{ __html: home.tag }}
          />
          <h1
            ref={titleRef}
            data-hero-edit
            className="welcome-title hero-editable"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={sync}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            dangerouslySetInnerHTML={{ __html: initialTitle }}
          />
          <p
            ref={subRef}
            data-hero-edit
            className="welcome-sub hero-editable"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={sync}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            dangerouslySetInnerHTML={{ __html: initialSub }}
          />
          <div className="welcome-stats">
            <div className="welcome-stat">
              <div className="num">{chaptersCount}</div>
              <div className="lbl">capítulos</div>
            </div>
            <div className="welcome-stat">
              <div className="num">{trailsCount}</div>
              <div className="lbl">trilhas</div>
            </div>
            <div className="welcome-stat">
              <div className="num">{readTime || "—"}</div>
              <div className="lbl">leitura total</div>
            </div>
            <div className="welcome-stat">
              <div className="num">∞</div>
              <div className="lbl">consultas</div>
            </div>
          </div>
        </div>

        {/* Campos ocultos: é isto que vai pro banco */}
        <input ref={tagInput} type="hidden" name="tag" defaultValue={home.tag} />
        <input
          ref={titleInput}
          type="hidden"
          name="title"
          defaultValue={initialTitle}
        />
        <input
          ref={subInput}
          type="hidden"
          name="subtitle"
          defaultValue={initialSub}
        />

        <div className="hero-edit-foot">
          <label className="field field-narrow">
            <span>Tempo de leitura (estatística)</span>
            <input
              name="readTime"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="Ex.: ~45 min"
            />
          </label>
          <div className="home-editor-actions">
            <button type="submit" className="btn-complete" disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </button>
            {state.ok && <span className="editor-saved">Salvo ✓</span>}
            {state.error && <span className="admin-error">{state.error}</span>}
          </div>
        </div>
      </form>
    </>
  );
}
