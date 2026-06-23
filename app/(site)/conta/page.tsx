import Link from "next/link";
import { redirect } from "next/navigation";
import { Fingerprint, Trash2 } from "lucide-react";
import ProfileForm from "./ProfileForm";
import PasskeyManager from "@/components/PasskeyManager";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { listUserCredentials } from "@/lib/webauthn";
import { passkeyRemove } from "@/app/admin/webauthn-actions";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  // O layout do site já exige login; aqui buscamos os dados atuais da conta.
  const session = await getSessionUser();
  if (!session) redirect("/admin/login");
  const user = await getUserById(session.uid);
  if (!user) redirect("/admin/login");

  const passkeys = await listUserCredentials(user.id);

  return (
    <div className="account">
      <Link href="/" className="header-link">
        ← Voltar ao manual
      </Link>
      <h1 className="account-title">Seu perfil</h1>
      <p className="account-sub">
        Esse nome aparece no menu e identifica seu progresso de leitura.
      </p>
      <ProfileForm
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
      />

      <section className="account-passkeys">
        <h2 className="account-section-title">
          <Fingerprint size={18} /> Login com Touch ID
        </h2>
        <p className="account-sub">
          Cadastre este dispositivo para entrar com o desbloqueio do Mac (Touch
          ID ou senha) — sem digitar e-mail e senha.
        </p>

        {passkeys.length > 0 && (
          <ul className="passkey-list">
            {passkeys.map((p) => (
              <li key={p.id} className="passkey-item">
                <span className="passkey-item-info">
                  <Fingerprint size={15} />
                  <span>
                    <strong>{p.deviceName || "Dispositivo"}</strong>
                    <small>
                      cadastrado em{" "}
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </small>
                  </span>
                </span>
                <form action={passkeyRemove}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="passkey-remove"
                    title="Remover dispositivo"
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <PasskeyManager />
      </section>
    </div>
  );
}
