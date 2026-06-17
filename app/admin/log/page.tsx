import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import LogView from "./LogView";
import { getSessionUser } from "@/lib/auth";
import { listAudit } from "@/lib/audit";
import { CHANGELOG } from "@/lib/changelog";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  // Só admin vê o log geral.
  const session = await getSessionUser();
  if (session && session.role !== "admin") redirect("/admin");

  const audit = await listAudit();
  return (
    <AdminChrome>
      <LogView audit={audit} changelog={CHANGELOG} />
    </AdminChrome>
  );
}
