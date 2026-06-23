"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import {
  passkeyAuthOptions,
  passkeyAuthVerify,
} from "@/app/admin/webauthn-actions";

export default function PasskeyLoginButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    setError(null);
    setBusy(true);
    try {
      const opt = await passkeyAuthOptions();
      if (opt.error || !opt.options) {
        setError(opt.error ?? "Não foi possível iniciar.");
        setBusy(false);
        return;
      }
      const resp = await startAuthentication({ optionsJSON: opt.options });
      const res = await passkeyAuthVerify(resp);
      if (res.ok && res.redirectTo) {
        router.push(res.redirectTo);
        return;
      }
      setError(res.error ?? "Não foi possível entrar.");
    } catch {
      // usuário cancelou o prompt do sistema ou não há dispositivo cadastrado
      setError("Login cancelado ou nenhum dispositivo cadastrado aqui.");
    }
    setBusy(false);
  }

  return (
    <div className="passkey-login">
      <div className="login-divider">
        <span>ou</span>
      </div>
      <button
        type="button"
        className="passkey-btn"
        onClick={handle}
        disabled={busy}
      >
        <Fingerprint size={18} />
        {busy ? "Aguardando o dispositivo…" : "Entrar com Touch ID"}
      </button>
      {error && <p className="landing-error" style={{ marginTop: 10 }}>{error}</p>}
    </div>
  );
}
