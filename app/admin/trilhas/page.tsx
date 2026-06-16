import AdminChrome from "@/components/AdminChrome";
import TrailsManager from "./TrailsManager";
import { getTrailsWithCounts } from "@/lib/trails";

export const dynamic = "force-dynamic";

export default async function TrailsAdminPage() {
  const trails = await getTrailsWithCounts();
  return (
    <AdminChrome>
      <TrailsManager trails={trails} />
    </AdminChrome>
  );
}
