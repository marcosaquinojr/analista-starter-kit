import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import ProgressDashboard from "./ProgressDashboard";
import { getSessionUser } from "@/lib/auth";
import { getProgressOverview } from "@/lib/progress";
import { getAreasWithCounts } from "@/lib/areas";

export const dynamic = "force-dynamic";

export default async function ProgressDashboardPage() {
  const session = await getSessionUser();
  if (session && session.role !== "admin") redirect("/admin");

  const [overview, areas] = await Promise.all([
    getProgressOverview(),
    getAreasWithCounts(),
  ]);

  return (
    <AdminChrome>
      <ProgressDashboard overview={overview} areas={areas} />
    </AdminChrome>
  );
}
