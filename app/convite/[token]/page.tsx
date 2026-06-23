import AuthShell from "@/components/AuthShell";
import AcceptForm from "./AcceptForm";
import { CtMark } from "@/components/Logo";
import { getUserByInvite } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getUserByInvite(token);
  const expired =
    user?.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date();
  const valid = user && user.status === "invited" && !expired;

  return (
    <AuthShell>
      <div className="landing-logo">
        <CtMark size={42} />
      </div>
      {valid ? (
        <>
          <h1 className="landing-title">Definir sua senha</h1>
          <p className="landing-sub">
            Olá{user.name ? `, ${user.name}` : ""}! Crie uma senha para acessar a
            Citiesoft Onboard com <strong>{user.email}</strong>.
          </p>
          <AcceptForm token={token} />
        </>
      ) : (
        <>
          <h1 className="landing-title">Convite indisponível</h1>
          <p className="landing-sub">
            Este link de convite é inválido, já foi usado ou expirou. Peça a um
            administrador para gerar um novo.
          </p>
        </>
      )}
    </AuthShell>
  );
}
