"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};
const LAST_EMAIL_KEY = "ct-last-email";

interface PasswordCredentialCtor {
  new (data: { id: string; password: string; name?: string }): Credential;
}

function Spinner() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2.5px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "loginSpin 0.65s linear infinite",
        verticalAlign: "middle",
      }}
    />
  );
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);
  const [remember, setRemember] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Prefill com o último e-mail salvo e foca a senha (Keychain/autofill cuidam dela).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LAST_EMAIL_KEY);
    } catch {
      // ignora storage indisponível
    }
    if (saved && emailRef.current) {
      emailRef.current.value = saved;
      setRemember(true);
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, []);

  // No sucesso: salva o e-mail, registra a credencial (Touch ID/autofill) e navega.
  useEffect(() => {
    if (!state.ok || !state.redirectTo) return;
    const target = state.redirectTo;
    const email = emailRef.current?.value?.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    try {
      if (remember && email) localStorage.setItem(LAST_EMAIL_KEY, email);
      else if (!remember) localStorage.removeItem(LAST_EMAIL_KEY);
    } catch {
      // ignora
    }

    const go = () => router.push(target);

    // Credential Management API (Chromium): salva a senha → habilita o autofill
    // com Touch ID no próximo login. Em navegadores sem suporte, só navega.
    const w = window as unknown as { PasswordCredential?: PasswordCredentialCtor };
    if (email && password && w.PasswordCredential && navigator.credentials?.store) {
      try {
        const cred = new w.PasswordCredential({ id: email, password, name: email });
        // Dispara o save; o prompt do Chrome persiste mesmo após navegar.
        void navigator.credentials.store(cred);
      } catch {
        // sem suporte / bloqueado — segue o fluxo
      }
    }
    go();
  }, [state, remember, router]);

  return (
    <>
      <style>{`@keyframes loginSpin { to { transform: rotate(360deg); } }`}</style>
      <form action={formAction} className="landing-form">
        <label htmlFor="email">E-mail</label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="voce@citiesoft.com"
          disabled={pending}
        />
        <label htmlFor="password">Senha</label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={pending}
        />

        <label className="login-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Lembrar meu e-mail neste dispositivo</span>
        </label>

        {state.error && <p className="landing-error">{state.error}</p>}
        <button
          type="submit"
          className="landing-btn"
          disabled={pending}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {pending ? (
            <>
              <Spinner /> Verificando...
            </>
          ) : (
            "Entrar →"
          )}
        </button>
      </form>
    </>
  );
}
