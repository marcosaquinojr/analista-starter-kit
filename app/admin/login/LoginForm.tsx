"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="landing-form">
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
      {state.error && <p className="landing-error">{state.error}</p>}
      <button type="submit" className="landing-btn" disabled={pending}>
        {pending ? "Entrando…" : "Entrar →"}
      </button>
    </form>
  );
}
