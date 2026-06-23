"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint } from "lucide-react";
import { startRegistration } from "@simplewebauthn/browser";
import {
  passkeyRegisterOptions,
  passkeyRegisterVerify,
} from "@/app/admin/webauthn-actions";

export default function PasskeyManager() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  async function enable() {
    setMsg(null);
    setBusy(true);
    try {
      const opt = await passkeyRegisterOptions();
      if (opt.error || !opt.options) {
        setMsg({ type: "err", text: opt.error ?? "Não foi possível iniciar." });
        setBusy(false);
        return;
      }
      const resp = await startRegistration({ optionsJSON: opt.options });
      const deviceName =
        (navigator as Navigator & { platform?: string }).platform ||
        "Este dispositivo";
      const res = await passkeyRegisterVerify(resp, deviceName);
      if (res.ok) {
        setMsg({
          type: "ok",
          text: "Dispositivo cadastrado! Agora você pode entrar com o Touch ID.",
        });
        router.refresh();
      } else {
        setMsg({ type: "err", text: res.error ?? "Não foi possível cadastrar." });
      }
    } catch {
      setMsg({ type: "err", text: "Cadastro cancelado pelo dispositivo." });
    }
    setBusy(false);
  }

  return (
    <div className="passkey-manager">
      <button
        type="button"
        className="trail-btn"
        onClick={enable}
        disabled={busy}
      >
        <Fingerprint size={15} />
        {busy ? "Aguardando o dispositivo…" : "Cadastrar este dispositivo"}
      </button>
      {msg && (
        <span
          className={msg.type === "ok" ? "editor-saved" : "admin-error"}
          style={{ marginLeft: 4 }}
        >
          {msg.text}
        </span>
      )}
    </div>
  );
}
