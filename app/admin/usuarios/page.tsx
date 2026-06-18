import { redirect } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import UsersManager from "./UsersManager";
import { getSessionUser } from "@/lib/auth";
import { listUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  // AdminChrome já barra leitor/sem-sessão; aqui exigimos admin.
  const session = await getSessionUser();
  if (session && session.role !== "admin") redirect("/admin");

  const users = await listUsers();
  return (
    <AdminChrome>
      <UsersManager
        users={users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
          onboardingTrack: u.onboardingTrack,
        }))}
        currentUserId={session?.uid ?? ""}
      />
    </AdminChrome>
  );
}
