import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import ProgressDashboard from "./ProgressDashboard";
import { getSessionUser } from "@/lib/auth";
import { getChapters } from "@/lib/chapters";
import { getProgressOverview } from "@/lib/progress";

export const dynamic = "force-dynamic";

export default async function ProgressDashboardPage() {
  const session = await getSessionUser();
  if (session && session.role !== "admin") redirect("/admin");

  const [overview, chapters] = await Promise.all([
    getProgressOverview(),
    getChapters(),
  ]);

  return (
    <AdminChrome>
      <ProgressDashboard overview={overview} chapters={chapters} />
    </AdminChrome>
  );
}
