import AdminChrome from "@/components/AdminChrome";
import { listMediaFiles } from "@/app/admin/actions";
import MediaManager from "./MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMidiasPage() {
  const res = await listMediaFiles();
  const initialBlobs = res.blobs || [];

  return (
    <AdminChrome>
      <div className="admin-intro" style={{ marginBottom: "24px" }}>
        <h1 className="admin-title">Biblioteca de Mídias</h1>
        <p className="admin-desc" style={{ color: "var(--text2)", fontSize: "14px", marginTop: "4px" }}>
          Gerencie imagens e arquivos enviados ao Vercel Blob para usar nos capítulos do manual.
        </p>
      </div>
      <MediaManager initialBlobs={initialBlobs} />
    </AdminChrome>
  );
}
