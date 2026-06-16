"use client";

import { useActionState } from "react";
import { acceptInviteAction, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

export default function AcceptForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    acceptInviteAction,
    initial,
  );

  return (
    <form action={formAction} className="landing-form">
      <input type="hidden" name="token" value={token} />
      <label htmlFor="password">Senha (mín. 8 caracteres)</label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="new-password"
        placeholder="••••••••"
        minLength={8}
        required
      />
      <label htmlFor="confirm">Confirme a senha</label>
      <input
        id="confirm"
        name="confirm"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        required
      />
      {state.error && <p className="landing-error">{state.error}</p>}
      <button type="submit" className="landing-btn" disabled={pending}>
        {pending ? "Entrando…" : "Criar senha e entrar"}
      </button>
    </form>
  );
}
