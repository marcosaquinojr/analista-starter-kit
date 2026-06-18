"use client";

import { useRef, useState, type MouseEvent } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Check, Pencil } from "lucide-react";
import { uploadToolIcon } from "@/app/admin/actions";

export interface ToolItem {
  icon: string;
  name: string;
  desc: string;
  url: string;
}

export default function ToolsBlockView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const [items, setItems] = useState<ToolItem[]>(() =>
    Array.isArray(node.attrs.items) ? (node.attrs.items as ToolItem[]) : [],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempItems, setTempItems] = useState<ToolItem[]>([]);

  const [uploading, setUploading] = useState<number | null>(null);
  const [errorAt, setErrorAt] = useState<{ i: number; msg: string } | null>(
    null,
  );
  const [doneAt, setDoneAt] = useState<number | null>(null);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sync = (next: ToolItem[]) => {
    setItems(next);
    updateAttributes({ items: next });
  };

  const openModal = () => {
    setTempItems([...items]);
    setIsModalOpen(true);
    setErrorAt(null);
    setDoneAt(null);
  };

  const saveModal = () => {
    sync(tempItems);
    setIsModalOpen(false);
  };

  const updateTemp = (i: number, patch: Partial<ToolItem>) => {
    setTempItems(tempItems.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const addTemp = () => {
    setTempItems([...tempItems, { icon: "", name: "", desc: "", url: "" }]);
  };

  const removeTemp = (i: number) => {
    setTempItems(tempItems.filter((_, idx) => idx !== i));
  };

  const onUploadTemp = async (i: number, file: File) => {
    setErrorAt(null);
    setDoneAt(null);
    setUploading(i);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadToolIcon(fd);
      if (res.error) {
        setErrorAt({ i, msg: res.error });
      } else if (res.url) {
        setTempItems(prev => prev.map((item, idx) => idx === i ? { ...item, icon: res.url! } : item));
        setDoneAt(i);
        setTimeout(() => setDoneAt((d) => (d === i ? null : d)), 2500);
      }
    } catch {
      setErrorAt({ i, msg: "Falha no envio. Tente de novo." });
    } finally {
      setUploading(null);
    }
  };

  return (
    <NodeViewWrapper
      className="tools-editor"
      contentEditable={false}
      onMouseDown={(e: MouseEvent) => e.stopPropagation()}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--bg)",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <div className="tools-editor-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <span className="html-block-tag">Ferramentas</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="hb-btn"
            onClick={openModal}
            style={{ fontSize: "12px", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: "5px" }}
          >
            <Pencil size={12} /> Editar Ferramentas
          </button>
          <button
            type="button"
            className="hb-btn hb-btn-danger"
            onClick={() => deleteNode()}
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            Remover bloco
          </button>
        </div>
      </div>

      <div className="tools-preview" style={{ padding: "16px", background: "var(--bg)", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        {items.length === 0 ? (
          <span style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "13px", gridColumn: "1 / -1" }}>
            Nenhuma ferramenta cadastrada ainda. Clique em &quot;Editar Ferramentas&quot; para adicionar.
          </span>
        ) : (
          items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--bg2)" }}>
              {it.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.icon} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "4px" }} />
              ) : (
                <div style={{ width: "32px", height: "32px", background: "var(--bg4)", borderRadius: "4px" }} />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: "block", fontSize: "12px", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {it.name || "(Sem nome)"}
                </strong>
                <span style={{ display: "block", fontSize: "10px", color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {it.desc || "(Sem descrição)"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: "680px", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Editar Ferramentas</h2>
            <p className="modal-text" style={{ marginBottom: "16px" }}>
              Adicione ferramentas com seus respectivos ícones, nomes, descrições e links de destino.
            </p>

            <div
              className="tools-editor-list"
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingRight: "4px",
              }}
            >
              {tempItems.length === 0 ? (
                <p style={{ color: "var(--text3)", textAlign: "center", fontStyle: "italic", padding: "20px 0" }}>
                  Nenhuma ferramenta adicionada. Clique no botão abaixo para começar.
                </p>
              ) : (
                tempItems.map((it, i) => {
                  const isUp = uploading === i;
                  const isErr = errorAt?.i === i;
                  const isDone = doneAt === i;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        background: "var(--bg2)",
                        padding: "16px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {/* Image Picker */}
                      <div
                        className={`tools-icon-pick${isUp ? " is-uploading" : ""}${
                          isErr ? " is-error" : ""
                        }${it.icon && !isUp ? " has-icon" : ""}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          border: "2px dashed var(--border2)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "var(--bg)"
                        }}
                        title="Enviar imagem (PNG, SVG, JPG, WEBP — máx. 512 KB)"
                        onClick={() => !isUp && fileRefs.current[i]?.click()}
                      >
                        {isUp ? (
                          <span className="tools-spinner" style={{ width: "20px", height: "20px" }} />
                        ) : it.icon ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={it.icon}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                              onError={() =>
                                setErrorAt({ i, msg: "A imagem não carregou." })
                              }
                            />
                            <span className="tools-icon-hover" style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", opacity: 0, transition: "opacity 0.2s" }}>
                              Trocar
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: "10px", color: "var(--text2)", textAlign: "center", padding: "4px" }}>
                            {isErr ? "Erro" : "+ ícone"}
                          </span>
                        )}
                        <input
                          ref={(el) => {
                            fileRefs.current[i] = el;
                          }}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onUploadTemp(i, f);
                            e.target.value = "";
                          }}
                        />
                      </div>

                      {/* Input fields */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            className="modal-input"
                            style={{ marginBottom: 0, flex: 1 }}
                            placeholder="Nome (ex.: Azure DevOps)"
                            value={it.name}
                            onChange={(e) => updateTemp(i, { name: e.target.value })}
                          />
                          <input
                            className="modal-input"
                            style={{ marginBottom: 0, flex: 1 }}
                            placeholder="Link (https://...)"
                            value={it.url}
                            onChange={(e) => updateTemp(i, { url: e.target.value })}
                          />
                        </div>
                        <input
                          className="modal-input"
                          style={{ marginBottom: 0 }}
                          placeholder="Descrição curta..."
                          value={it.desc}
                          onChange={(e) => updateTemp(i, { desc: e.target.value })}
                        />
                        {isUp && <span style={{ fontSize: "10px", color: "var(--text2)" }}>Enviando imagem…</span>}
                        {isErr && <span style={{ fontSize: "10px", color: "var(--bad)" }}>{errorAt.msg}</span>}
                        {isDone && <span style={{ fontSize: "10px", color: "var(--good)", display: "inline-flex", alignItems: "center", gap: "3px" }}><Check size={11} /> Imagem carregada</span>}
                      </div>

                      <button
                        type="button"
                        className="trail-btn trail-btn-danger"
                        style={{ padding: "6px 10px", minWidth: "auto", fontSize: "16px" }}
                        title="Remover ferramenta"
                        onClick={() => removeTemp(i)}
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <button
                type="button"
                className="trail-btn"
                onClick={addTemp}
              >
                + Adicionar Ferramenta
              </button>
              <div className="modal-actions" style={{ margin: 0 }}>
                <button
                  type="button"
                  className="trail-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-complete"
                  style={{ height: "38px", padding: "0 16px", borderRadius: "var(--radius-sm)", fontWeight: "600" }}
                  onClick={saveModal}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}
