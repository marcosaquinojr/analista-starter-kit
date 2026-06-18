import Link from "next/link";
import AdminChrome from "@/components/AdminChrome";
import AdminChaptersList from "./AdminChaptersList";
import { getChapters } from "@/lib/chapters";
import { getTrails } from "@/lib/trails";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [chapters, trails] = await Promise.all([getChapters(), getTrails()]);

  return (
    <AdminChrome>
      <div className="admin-intro">
        <div className="admin-intro-head">
          <h1>Capítulos</h1>
          <div className="admin-intro-actions">
            <Link href="/admin/inicio" className="trail-btn">
              Editar página inicial →
            </Link>
            <Link href="/admin/trilhas" className="trail-btn">
              Gerenciar trilhas →
            </Link>
          </div>
        </div>
        <p>
          Edite o conteúdo do manual. As mudanças vão pro ar na hora, sem
          publicar de novo. Arraste e solte os capítulos para reordená-los ou
          movê-los entre as trilhas.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div
        className="admin-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text2)", letterSpacing: "0.05em" }}>
            Total de Capítulos
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ink)", margin: "4px 0 0 0" }}>
            {chapters.length}
          </h2>
        </div>

        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text2)", letterSpacing: "0.05em" }}>
            Trilhas Organizadoras
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ink)", margin: "4px 0 0 0" }}>
            {trails.length}
          </h2>
        </div>

        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text2)", letterSpacing: "0.05em" }}>
            Status do Portal
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--good)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--good)",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Pronto para Leitura</span>
          </div>
        </div>
      </div>

      <AdminChaptersList initialChapters={chapters} trails={trails} />
    </AdminChrome>
  );
}
