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
        <h1>Área de edição</h1>
        <p className="admin-login-sub">
          Acesso interno ao Analista Starter Kit. Entre com a conta que você
          recebeu por convite.
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
