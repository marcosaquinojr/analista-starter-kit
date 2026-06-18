"use client";

import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { deleteMediaFile, uploadMedia } from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

const ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,application/pdf";

type BlobInfo = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

export default function MediaManager({ initialBlobs }: { initialBlobs: BlobInfo[] }) {
  const [blobs, setBlobs] = useState<BlobInfo[]>(initialBlobs);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadMedia(fd);
      if (res.error) {
        toast.error(res.error);
      } else if (res.blob) {
        const b = res.blob;
        setBlobs((prev) => [{ ...b, uploadedAt: new Date(b.uploadedAt) }, ...prev]);
        toast.success("Mídia enviada.");
      }
    } catch {
      toast.error("Erro ao enviar a mídia.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
      <div className="media-toolbar">
        <button
          type="button"
          className="trail-btn"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Enviando…" : "＋ Enviar mídia"}
        </button>
        <span className="media-toolbar-hint">PNG, JPG, SVG, WEBP, GIF ou PDF · até 5 MB</span>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>

      {blobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 21" />
            </svg>
          </span>
          <p className="empty-state-title">Nenhuma mídia enviada ainda</p>
          <p className="empty-state-desc">
            Envie pelo botão “Enviar mídia” acima — ou elas aparecem aqui
            conforme forem enviadas no editor de capítulos.
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
                    <FileText size={36} style={{ color: "var(--text3)" }} />
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
