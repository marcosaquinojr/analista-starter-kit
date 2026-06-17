import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  // O layout do site já exige login; aqui buscamos os dados atuais da conta.
  const session = await getSessionUser();
  if (!session) redirect("/admin/login");
  const user = await getUserById(session.uid);
  if (!user) redirect("/admin/login");

  return (
    <div className="account">
      <Link href="/" className="header-link">
        ← Voltar ao manual
      </Link>
      <h1 className="account-title">Seu perfil</h1>
      <p className="account-sub">
        Esse nome aparece no menu e identifica seu progresso de leitura.
      </p>
      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
}
