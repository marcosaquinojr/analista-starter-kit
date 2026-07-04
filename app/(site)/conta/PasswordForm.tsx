"use client";

import { useActionState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { changeOwnPassword, type ActionState } from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

export default function PasswordForm() {
  const [state, action, saving] = useActionState(changeOwnPassword, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Senha alterada.");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="account-form">
      <label className="field">
        <span>Senha atual</span>
        <input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          required
        />
      </label>

      <label className="field">
        <span>Nova senha</span>
        <input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          minLength={8}
          required
          placeholder="Mínimo 8 caracteres"
        />
      </label>

      <label className="field">
        <span>Confirmar nova senha</span>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <div className="account-form-actions">
        <button type="submit" className="btn-complete" disabled={saving}>
          {saving ? "Salvando…" : "Trocar senha"}
        </button>
        {state.ok && (
          <span className="editor-saved">
            <Check size={14} strokeWidth={3} /> Salvo
          </span>
        )}
        {state.error && <span className="admin-error">{state.error}</span>}
      </div>
    </form>
  );
}
