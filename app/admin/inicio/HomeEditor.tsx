"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveHome, type ActionState } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/settings";

const initial: ActionState = {};

export default function HomeEditor({ home }: { home: HomeContent }) {
  const [state, action, saving] = useActionState(saveHome, initial);

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Página inicial</h1>
        <p>
          O texto de boas-vindas que abre o manual. As mudanças vão pro ar na
          hora. Para destacar um trecho, envolva-o em{" "}
          <code>**asteriscos duplos**</code> — fica azul no título e em negrito
          no subtítulo.
        </p>
      </div>

      <form action={action} className="home-editor">
        <label className="field">
          <span>Etiqueta (acima do título)</span>
          <input
            name="tag"
            defaultValue={home.tag}
            placeholder="Ex.: Bem-vindo à Citiesoft"
          />
        </label>

        <label className="field">
          <span>Título</span>
          <textarea
            name="title"
            defaultValue={home.title}
            rows={3}
            required
            placeholder="Use **palavra** para destacar em azul"
          />
        </label>

        <label className="field">
          <span>Subtítulo</span>
          <textarea
            name="subtitle"
            defaultValue={home.subtitle}
            rows={4}
            placeholder="Use **trecho** para dar ênfase"
          />
        </label>

        <label className="field field-narrow">
          <span>Tempo de leitura (estatística)</span>
          <input
            name="readTime"
            defaultValue={home.readTime}
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
      </form>
    </>
  );
}
