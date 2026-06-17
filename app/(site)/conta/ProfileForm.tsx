"use client";

import { useActionState } from "react";
import { updateOwnProfile, type ActionState } from "@/app/admin/actions";

const initial: ActionState = {};

export default function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, action, saving] = useActionState(updateOwnProfile, initial);

  return (
    <form action={action} className="account-form">
      <label className="field">
        <span>E-mail</span>
        <input value={email} disabled readOnly />
      </label>

      <label className="field">
        <span>Seu nome</span>
        <input
          name="name"
          defaultValue={name}
          maxLength={60}
          required
          autoFocus
          placeholder="Como você quer ser chamado"
        />
      </label>

      <div className="account-form-actions">
        <button type="submit" className="btn-complete" disabled={saving}>
          {saving ? "Salvando…" : "Salvar"}
        </button>
        {state.ok && <span className="editor-saved">Salvo ✓</span>}
        {state.error && <span className="admin-error">{state.error}</span>}
      </div>
    </form>
  );
}
