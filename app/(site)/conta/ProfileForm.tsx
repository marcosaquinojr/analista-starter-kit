"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  updateOwnProfile,
  uploadAvatar,
  type ActionState,
} from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";
import { initials } from "@/lib/initials";

const initial: ActionState = {};

export default function ProfileForm({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl: string;
}) {
  const [state, action, saving] = useActionState(updateOwnProfile, initial);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [nameVal, setNameVal] = useState(name);
  const [uploading, setUploading] = useState(false);
  const [upError, setUpError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) toast.success("Perfil atualizado.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  const onPick = async (file: File) => {
    setUpError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadAvatar(fd);
      if (res.error) setUpError(res.error);
      else if (res.url) setAvatar(res.url);
    } catch {
      setUpError("Falha no envio. Tente de novo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={action} className="account-form">
      <input type="hidden" name="avatarUrl" value={avatar} />

      <div className="account-avatar-row">
        <span className="account-avatar" aria-hidden>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" />
          ) : (
            initials(nameVal, email)
          )}
        </span>
        <div className="account-avatar-actions">
          <button
            type="button"
            className="trail-btn"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Enviando…" : avatar ? "Trocar foto" : "Enviar foto"}
          </button>
          {avatar && (
            <button
              type="button"
              className="trail-btn trail-btn-danger"
              onClick={() => setAvatar("")}
            >
              Remover
            </button>
          )}
          {upError && <span className="admin-error">{upError}</span>}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <label className="field">
        <span>E-mail</span>
        <input value={email} disabled readOnly />
      </label>

      <label className="field">
        <span>Seu nome</span>
        <input
          name="name"
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          maxLength={60}
          required
          placeholder="Como você quer ser chamado"
        />
      </label>

      <div className="account-form-actions">
        <button type="submit" className="btn-complete" disabled={saving}>
          {saving ? "Salvando…" : "Salvar"}
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
