"use client";

import { useState } from "react";
import { deleteMediaFile } from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

type BlobInfo = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

export default function MediaManager({ initialBlobs }: { initialBlobs: BlobInfo[] }) {
  const [blobs, setBlobs] = useState<BlobInfo[]>(initialBlobs);
  const [deleting, setDeleting] = useState<string | null>(null);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiada para a área de transferência!");
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mídia definitivamente?")) return;
    setDeleting(url);
    try {
      const res = await deleteMediaFile(url);
      if (res.error) {
        toast.error(res.error);
      } else {
        setBlobs(blobs.filter((b) => b.url !== url));
        toast.success("Mídia excluída com sucesso.");
      }
    } catch {
      toast.error("Erro ao tentar excluir a mídia.");
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="media-manager">
      {blobs.length === 0 ? (
        <div
          style={{
            background: "var(--bg)",
            border: "2px dashed var(--border2)",
            borderRadius: "var(--radius)",
            padding: "48px",
            textAlign: "center",
            color: "var(--text2)",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--ink)", margin: 0 }}>Nenhuma mídia enviada ainda</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>
            As mídias aparecerão aqui conforme forem enviadas no editor de capítulos ou nos cartões de ferramentas.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {blobs.map((blob) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(blob.pathname);
            return (
              <div
                key={blob.url}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {/* Preview Area */}
                <div
                  style={{
                    height: "140px",
                    background: "var(--bg3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid var(--border)",
                    padding: "12px",
                  }}
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blob.url}
                      alt={blob.pathname}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "36px" }}>📄</span>
                  )}
                </div>

                {/* Info Area */}
                <div style={{ padding: "14px", flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "var(--ink)",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.35",
                      height: "36px",
                      marginBottom: "8px",
                    }}
                    title={blob.pathname}
                  >
                    {blob.pathname.split("/").pop()}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "var(--text3)",
                      marginTop: "auto",
                    }}
                  >
                    <span>{formatSize(blob.size)}</span>
                    <span>
                      {new Date(blob.uploadedAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions Area */}
                <div
                  style={{
                    display: "flex",
                    borderTop: "1px solid var(--border)",
                    background: "var(--bg2)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => copyUrl(blob.url)}
                    style={{
                      flexGrow: 1,
                      border: "none",
                      background: "none",
                      padding: "10px",
                      fontSize: "12px",
                      color: "var(--blue)",
                      cursor: "pointer",
                      borderRight: "1px solid var(--border)",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg4)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    disabled={deleting === blob.url}
                    onClick={() => handleDelete(blob.url)}
                    style={{
                      border: "none",
                      background: "none",
                      padding: "10px 16px",
                      fontSize: "12px",
                      color: "var(--bad)",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bad-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {deleting === blob.url ? "..." : "Excluir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
