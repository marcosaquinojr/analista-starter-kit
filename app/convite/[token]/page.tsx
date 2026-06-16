import AcceptForm from "./AcceptForm";
import { LogoLockup } from "@/components/Logo";
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
    <div className="admin-login">
      <div className="admin-login-card">
        <div style={{ marginBottom: 20 }}>
          <LogoLockup height={26} />
        </div>
        {valid ? (
          <>
            <h1>Definir sua senha</h1>
            <p className="admin-login-sub">
              Olá{user.name ? `, ${user.name}` : ""}! Crie uma senha para
              acessar o Analista Starter Kit com <strong>{user.email}</strong>.
            </p>
            <AcceptForm token={token} />
          </>
        ) : (
          <>
            <h1>Convite indisponível</h1>
            <p className="admin-login-sub">
              Este link de convite é inválido, já foi usado ou expirou. Peça a um
              administrador para gerar um novo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
