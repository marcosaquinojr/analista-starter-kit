"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Eye,
  Pin,
  ScrollText,
} from "lucide-react";
import {
  saveChapter,
  deleteChapter,
  type ActionState,
} from "@/app/admin/actions";
import RichEditor from "@/components/editor/RichEditor";
import type {
  Chapter,
  TrailMeta,
  ChapterVersion,
  AreaMeta,
} from "@/lib/types";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

// chave estável de um conjunto de áreas, p/ comparar (ordem não importa)
const areaKey = (a: string[]) => [...a].sort().join(",");

export default function EditForm({
  chapter,
  trails,
  allAreas,
  chapterAreas,
  versions = [],
  isAiEnabled = false,
}: {
  chapter: Chapter;
  trails: TrailMeta[];
  allAreas: AreaMeta[];
  chapterAreas: string[];
  versions?: ChapterVersion[];
  isAiEnabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveChapter, initial);

  // Estados controlados para os campos do formulário
  const [title, setTitle] = useState(chapter.title);
  const [number, setNumber] = useState(chapter.number);
  const [trailSlug, setTrailSlug] = useState(chapter.trailSlug);
  const [readTime, setReadTime] = useState(chapter.readTime);
  const [description, setDescription] = useState(chapter.description);
  const [areaSlugs, setAreaSlugs] = useState<string[]>(chapterAreas);
  const [body, setBody] = useState(chapter.bodyHtml);

  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ChapterVersion | null>(null);

  const canDelete = confirmText.trim() === chapter.title.trim();

  // Verifica se há modificações não salvas comparado ao banco
  const isDirty =
    title !== chapter.title ||
    number !== chapter.number ||
    trailSlug !== chapter.trailSlug ||
    readTime !== chapter.readTime ||
    description !== chapter.description ||
    areaKey(areaSlugs) !== areaKey(chapterAreas) ||
    body !== chapter.bodyHtml;

  // Helpers de rascunho
  const restoreDraft = () => {
    const raw = localStorage.getItem(`draft-chapter-${chapter.slug}`);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setTitle(draft.title ?? "");
      setNumber(draft.number ?? "");
      setTrailSlug(draft.trailSlug ?? "");
      setReadTime(draft.readTime ?? "");
      setDescription(draft.description ?? "");
      setAreaSlugs(Array.isArray(draft.areaSlugs) ? draft.areaSlugs : chapterAreas);
      setBody(draft.bodyHtml ?? "");
      toast.success("Rascunho restaurado!");
    } catch {
      // ignora
    }
    setHasDraft(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(`draft-chapter-${chapter.slug}`);
    setHasDraft(false);
    toast.success("Rascunho descartado.");
  };

  // Verifica no carregamento se há rascunho local diferente
  useEffect(() => {
    const raw = localStorage.getItem(`draft-chapter-${chapter.slug}`);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        const diff =
          draft.title !== chapter.title ||
          draft.number !== chapter.number ||
          draft.trailSlug !== chapter.trailSlug ||
          draft.readTime !== chapter.readTime ||
          draft.description !== chapter.description ||
          (Array.isArray(draft.areaSlugs) ? areaKey(draft.areaSlugs) : "") !==
            areaKey(chapterAreas) ||
          draft.bodyHtml !== chapter.bodyHtml;

        if (diff) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setHasDraft(true);
        } else {
          localStorage.removeItem(`draft-chapter-${chapter.slug}`);
        }
      } catch {
        localStorage.removeItem(`draft-chapter-${chapter.slug}`);
      }
    }
  }, [chapter, chapter.slug]);

  // Debounce para salvar rascunho a cada 2s após parar de digitar
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const draft = {
        title,
        number,
        trailSlug,
        readTime,
        description,
        areaSlugs,
        bodyHtml: body,
        updatedAt: Date.now(),
      };
      localStorage.setItem(`draft-chapter-${chapter.slug}`, JSON.stringify(draft));
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, number, trailSlug, readTime, description, areaSlugs, body, isDirty, chapter.slug]);

  // Alerta antes de descarregar a página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Trata retorno do servidor e limpa rascunho
  useEffect(() => {
    if (state.ok) {
      toast.success("Capítulo publicado.");
      localStorage.removeItem(`draft-chapter-${chapter.slug}`);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, chapter.slug]);

  return (
    <form action={formAction} className="editor">
      <input type="hidden" name="slug" value={chapter.slug} />
      <input type="hidden" name="bodyHtml" value={body} />

      <div className="editor-bar">
        <div className="editor-bar-left">
          <span className="editor-slug">/c/{chapter.slug}</span>
          <span className="editor-updated">
            Última atualização: {chapter.updatedAt}
            {chapter.updatedBy ? ` por ${chapter.updatedBy}` : ""}
          </span>
        </div>
        <div className="editor-bar-right">
          {state.ok && (
            <span className="editor-saved">
              <Check size={14} strokeWidth={3} /> Publicado
            </span>
          )}
          {state.error && <span className="admin-error">{state.error}</span>}
          <button
            type="button"
            className="trail-btn"
            style={{
              borderColor: previewMode ? "var(--blue)" : "var(--border)",
              color: previewMode ? "var(--blue)" : "var(--text)",
              backgroundColor: previewMode ? "var(--blue-glow)" : "transparent",
            }}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Ocultar Preview" : "Visualizar Preview"}
          </button>
          <Link
            href="/admin"
            className="trail-btn"
            onClick={(e) => {
              if (isDirty && !confirm("Você tem alterações não salvas. Deseja mesmo sair?")) {
                e.preventDefault();
              }
            }}
          >
            Cancelar
          </Link>
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </div>

      {hasDraft && (
        <div className="callout warn" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div>
            <strong>Rascunho local disponível!</strong>
            <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>
              Você tem alterações locais não salvas/publicadas para este capítulo.
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="trail-btn" onClick={restoreDraft} style={{ borderColor: "var(--warn)", color: "var(--warn)", background: "white" }}>
              Restaurar
            </button>
            <button type="button" className="trail-btn" onClick={discardDraft} style={{ background: "white" }}>
              Descartar
            </button>
          </div>
        </div>
      )}

      <div className={`editor-main-layout ${previewMode ? "split-mode" : ""}`}>
        <div className="editor-edit-pane" style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          <div className="editor-meta">
            <label className="field field-grow">
              <span>Título</span>
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="field field-sm">
              <span>Número</span>
              <input name="number" value={number} onChange={(e) => setNumber(e.target.value)} />
            </label>
            <label className="field field-sm">
              <span>Trilha</span>
              <select name="trail" value={trailSlug} onChange={(e) => setTrailSlug(e.target.value)}>
                {trails.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field-sm">
              <span>Tempo de leitura</span>
              <input name="readTime" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
            </label>
            <label className="field field-full">
              <span>Descrição</span>
              <input name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <div className="field field-full">
              <span>Áreas</span>
              {allAreas.length === 0 ? (
                <span className="area-checks-empty">
                  Nenhuma área criada ainda. Crie em Conteúdo → Áreas.
                </span>
              ) : (
                <div className="area-checks">
                  {allAreas.map((a) => {
                    const checked = areaSlugs.includes(a.slug);
                    return (
                      <label
                        key={a.slug}
                        className={`area-check${checked ? " on" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="areas"
                          value={a.slug}
                          checked={checked}
                          onChange={(e) =>
                            setAreaSlugs((prev) =>
                              e.target.checked
                                ? [...prev, a.slug]
                                : prev.filter((s) => s !== a.slug),
                            )
                          }
                        />
                        {a.name}
                      </label>
                    );
                  })}
                </div>
              )}
              {allAreas.length > 0 && areaSlugs.length === 0 && (
                <span className="area-checks-hint">
                  Sem área = rascunho (não aparece pro leitor).
                </span>
              )}
            </div>
          </div>

          <RichEditor initialHtml={body} onChange={setBody} isAiEnabled={isAiEnabled} />

          {/* Campo de Notas de Revisão */}
          <div className="editor-meta" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="field field-full" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink)" }}>O que mudou nesta versão? (Notas de revisão)</span>
              <input
                name="revisionNote"
                placeholder="Ex: Atualizadas ferramentas do Azure e corrigida formatação"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border2)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg)",
                  fontSize: "14px",
                }}
              />
            </label>
          </div>

          {/* Painel do Histórico de Versões */}
          <div className="editor-meta" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: "6px" }}><ScrollText size={15} /> Histórico de Versões</span>
              <span className="editor-updated">{versions.length} {versions.length === 1 ? "versão salva" : "versões salvas"}</span>
            </div>
            {versions.length === 0 ? (
              <p style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "13px", margin: 0 }}>
                Nenhuma versão anterior gravada para este capítulo. O histórico começará a partir da próxima publicação.
              </p>
            ) : (
              <div style={{ maxHeight: "240px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                      <th style={{ padding: "8px 12px", color: "var(--text)" }}>Atualizado em</th>
                      <th style={{ padding: "8px 12px", color: "var(--text)" }}>Editor</th>
                      <th style={{ padding: "8px 12px", color: "var(--text)" }}>Nota</th>
                      <th style={{ padding: "8px 12px", color: "var(--text)", textAlign: "right" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((ver) => (
                      <tr key={ver.id} style={{ borderBottom: "1px solid var(--border)", verticalAlign: "middle" }}>
                        <td style={{ padding: "8px 12px", color: "var(--ink)", fontWeight: "500" }}>{ver.updatedAt}</td>
                        <td style={{ padding: "8px 12px", color: "var(--text)" }}>{ver.updatedBy}</td>
                        <td style={{ padding: "8px 12px", color: "var(--text2)", fontStyle: "italic" }}>{ver.revisionNote}</td>
                        <td style={{ padding: "8px 12px", textAlign: "right" }}>
                          <button
                            type="button"
                            className="trail-btn"
                            style={{ padding: "4px 8px", fontSize: "11px", height: "auto", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            onClick={() => setSelectedVersion(ver)}
                          >
                            <Eye size={12} /> Ver & Restaurar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="editor-danger">
            <div className="editor-danger-text">
              <strong style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><AlertTriangle size={15} /> Excluir capítulo</strong>
              <span>Remove este capítulo de vez. Esta ação não pode ser desfeita.</span>
            </div>
            <button
              type="button"
              className="trail-btn trail-btn-danger"
              onClick={() => {
                setConfirmText("");
                setShowDelete(true);
              }}
            >
              Excluir capítulo
            </button>
          </div>
        </div>

        {previewMode && (
          <div className="editor-preview-pane">
            <div className="editor-preview-content">
              <div className="chapter-header" style={{ marginBottom: "24px" }}>
                <span className="chapter-tag" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--blue)" }}>
                  {trails.find((t) => t.slug === trailSlug)?.title ?? trailSlug} · Cap {number || chapter.number}
                </span>
                <h1 className="chapter-title" style={{ fontSize: "28px", fontWeight: "700", color: "var(--ink)", marginTop: "8px", lineHeight: "1.2" }}>
                  {title || "Sem título"}
                </h1>
                {description && (
                  <p className="chapter-desc" style={{ fontSize: "15px", color: "var(--text2)", marginTop: "8px", lineHeight: "1.5" }}>
                    {description}
                  </p>
                )}
                <div className="chapter-meta" style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text3)", marginTop: "12px" }}>
                  {readTime && <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Clock size={13} /> {readTime}</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <Pin size={13} />{" "}
                    {areaSlugs.length === 0
                      ? "Rascunho (sem área)"
                      : allAreas
                          .filter((a) => areaSlugs.includes(a.slug))
                          .map((a) => a.name)
                          .join(", ")}
                  </span>
                </div>
              </div>
              <div
                className="chapter-body"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          </div>
        )}
      </div>

      {showDelete && (
        <div
          className="modal-backdrop"
          onClick={() => setShowDelete(false)}
          role="presentation"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
          >
            <h2 id="del-title" className="modal-title">
              Excluir capítulo
            </h2>
            <p className="modal-text">
              Esta ação <strong>não pode ser desfeita</strong>. Para confirmar,
              digite o título do capítulo:
            </p>
            <p className="modal-confirm-name">{chapter.title}</p>
            <input
              className="modal-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite o título exatamente"
              autoFocus
            />
            <div className="modal-actions">
              <button
                type="button"
                className="trail-btn"
                onClick={() => setShowDelete(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                formAction={deleteChapter}
                formNoValidate
                className="trail-btn trail-btn-danger"
                disabled={!canDelete}
              >
                Excluir definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVersion && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedVersion(null)}
          role="presentation"
        >
          <div
            className="modal-card"
            style={{ maxWidth: "800px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="modal-title">Detalhes da Versão Histórica</h2>
            <p className="modal-text" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
              Publicada por <strong>{selectedVersion.updatedBy}</strong> em <strong>{selectedVersion.updatedAt}</strong>.
              <br />
              <span style={{ fontStyle: "italic", color: "var(--text2)", display: "block", marginTop: "4px" }}>
                Nota: &quot;{selectedVersion.revisionNote}&quot;
              </span>
            </p>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg)",
                marginBottom: "20px"
              }}
            >
              <div className="chapter-header" style={{ marginBottom: "24px" }}>
                <span className="chapter-tag" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--blue)" }}>
                  {trails.find((t) => t.slug === selectedVersion.chapterSlug)?.title || selectedVersion.chapterSlug}
                </span>
                <h1 className="chapter-title" style={{ fontSize: "28px", fontWeight: "700", color: "var(--ink)", marginTop: "8px", lineHeight: "1.2" }}>
                  {selectedVersion.title}
                </h1>
                {selectedVersion.description && (
                  <p className="chapter-desc" style={{ fontSize: "15px", color: "var(--text2)", marginTop: "8px", lineHeight: "1.5" }}>
                    {selectedVersion.description}
                  </p>
                )}
              </div>
              <div
                className="chapter-body"
                dangerouslySetInnerHTML={{ __html: selectedVersion.bodyHtml }}
              />
            </div>

            <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
              <button
                type="button"
                className="btn-complete"
                style={{
                  backgroundColor: "var(--warn)",
                  borderColor: "var(--warn)",
                  color: "white",
                  padding: "0 16px",
                  height: "38px",
                  fontWeight: "600",
                  borderRadius: "var(--radius-sm)"
                }}
                onClick={() => {
                  setTitle(selectedVersion.title);
                  setDescription(selectedVersion.description);
                  setBody(selectedVersion.bodyHtml);
                  setSelectedVersion(null);
                  toast.success("Conteúdo restaurado para o editor (salve ou publique para consolidar).");
                }}
              >
                ⏪ Restaurar este Conteúdo no Editor
              </button>
              <button
                type="button"
                className="trail-btn"
                onClick={() => setSelectedVersion(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
