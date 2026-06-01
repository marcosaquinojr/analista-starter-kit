"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="brand-mark">C</div>
        <h1>Área de edição</h1>
        <p className="admin-login-sub">
          Acesso interno ao Analista Starter Kit. Em breve isto vira login pela
          sua conta Microsoft.
        </p>
        <form action={formAction}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
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
