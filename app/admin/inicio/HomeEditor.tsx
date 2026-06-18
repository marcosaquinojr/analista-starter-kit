"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { Check } from "lucide-react";
import { saveHome, type ActionState } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/settings";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

/**
 * Editor da página inicial. A home virou um hub pessoal (saudação + progresso +
 * "continuar de onde parei"), montado automaticamente — então aqui só se edita
 * o aviso opcional do rodapé. Os campos antigos do hero (tag/título/subtítulo/
 * tempo de leitura) seguem preservados no banco via inputs ocultos, mas não
 * aparecem mais no site.
 */
export default function HomeEditor({ home }: { home: HomeContent }) {
  const [state, action, saving] = useActionState(saveHome, initial);

  useEffect(() => {
    if (state.ok) toast.success("Aviso atualizado.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Página inicial</h1>
        <p>
          A página inicial é um hub pessoal — saúda quem entrou, mostra o
          progresso e leva direto pro próximo capítulo. Aqui você controla só o
          aviso opcional do rodapé, útil pra sinalizar uma fase (ex.: Alpha) ou
          deixar um recado pro time.
        </p>
      </div>

      <form action={action}>
        {/* Preserva os valores antigos do hero no banco (não exibidos na home) */}
        <input type="hidden" name="tag" defaultValue={home.tag} />
        <input type="hidden" name="title" defaultValue={home.title} />
        <input type="hidden" name="subtitle" defaultValue={home.subtitle} />
        <input type="hidden" name="readTime" defaultValue={home.readTime} />

        <div className="hero-note-edit">
          <div className="hero-note-head">
            Aviso no rodapé da página{" "}
            <span className="hero-note-hint">
              — deixe o texto vazio para remover o aviso
            </span>
          </div>
          <div className="hero-note-fields">
            <label className="field field-narrow">
              <span>Etiqueta</span>
              <input
                name="noteLabel"
                defaultValue={home.noteLabel}
                placeholder="Ex.: Alpha"
              />
            </label>
            <label className="field field-grow">
              <span>Texto do aviso</span>
              <textarea
                name="noteText"
                defaultValue={home.noteText}
                rows={2}
                placeholder="Deixe vazio para não exibir nenhum aviso"
              />
            </label>
          </div>
        </div>

        <div className="home-editor-actions">
          <button type="submit" className="btn-complete" disabled={saving}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
          {state.ok && (
            <span className="editor-saved">
              <Check size={14} strokeWidth={3} /> Salvo
            </span>
          )}
          {state.error && <span className="admin-error">{state.error}</span>}
        </div>
      </form>
    </>
  );
}
