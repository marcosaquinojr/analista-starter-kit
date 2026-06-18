import AdminChrome from "@/components/AdminChrome";
import AreasManager from "./AreasManager";
import { getAreasWithCounts } from "@/lib/areas";

export const dynamic = "force-dynamic";

export default async function AreasAdminPage() {
  const areas = await getAreasWithCounts();
  return (
    <AdminChrome>
      <AreasManager areas={areas} />
    </AdminChrome>
  );
}
