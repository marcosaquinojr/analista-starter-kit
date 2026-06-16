"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import { LogoLockup } from "@/components/Logo";

const initial: ActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div style={{ marginBottom: 20 }}>
          <LogoLockup height={26} />
        </div>
        <h1>Entrar</h1>
        <p className="admin-login-sub">
          Acesse o Analista Starter Kit com a conta que você recebeu por
          convite. Seu progresso de leitura fica salvo na sua conta.
        </p>
        <form action={formAction}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoFocus
            autoComplete="email"
            placeholder="voce@citiesoft.com"
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
          {state.error && <p className="admin-error">{state.error}</p>}
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
