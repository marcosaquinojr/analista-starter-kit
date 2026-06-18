"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  createUserInvite,
  regenerateInvite,
  deleteUserAction,
  changeUserRole,
  changeUserTrack,
  type ActionState,
} from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

type UserView = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  onboardingTrack: string;
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  leitor: "Leitor",
};

function InviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="invite-link">
      <span className="invite-link-label">
        Link de convite gerado — envie pra pessoa:
      </span>
      <div className="invite-link-row">
        <input readOnly value={url} onFocus={(e) => e.target.select()} />
        <button
          type="button"
          className="trail-btn"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

export default function UsersManager({
  users,
  currentUserId,
}: {
  users: UserView[];
  currentUserId: string;
}) {
  const [createState, createAction, creating] = useActionState(
    createUserInvite,
    initial,
  );
  const [regenState, regenAction] = useActionState(regenerateInvite, initial);
  const [trackFilter, setTrackFilter] = useState<"all" | "negocios" | "desenvolvimento">("all");

  const filteredUsers = users.filter((u) => {
    if (trackFilter === "all") return true;
    return u.onboardingTrack === trackFilter;
  });

  useEffect(() => {
    if (createState.ok) toast.success("Convite criado.");
    else if (createState.error) toast.error(createState.error);
  }, [createState]);

  useEffect(() => {
    if (regenState.ok) toast.success("Novo link de convite gerado.");
    else if (regenState.error) toast.error(regenState.error);
  }, [regenState]);

  return (
    <>
      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Usuários</h1>
        <p>
          Crie acessos por convite. A pessoa abre o link, define a própria senha
          e entra. Admin gerencia usuários e edita; Editor só edita o conteúdo;
          Leitor só visualiza.
        </p>
      </div>

      {/* Novo convite */}
      <form action={createAction} className="trail-create" key={users.length}>
        <div className="trail-create-fields">
          <label className="field field-grow">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              placeholder="pessoa@citiesoft.com"
              required
            />
          </label>
          <label className="field field-grow">
            <span>Nome</span>
            <input name="name" placeholder="Nome da pessoa" />
          </label>
          <label className="field field-sm">
            <span>Papel</span>
            <select name="role" defaultValue="editor">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="leitor">Leitor</option>
            </select>
          </label>
          <label className="field field-sm">
            <span>Trilha</span>
            <select name="onboardingTrack" defaultValue="negocios">
              <option value="negocios">Negócios</option>
              <option value="desenvolvimento">Desenvolvimento</option>
            </select>
          </label>
          <button type="submit" className="btn-complete" disabled={creating}>
            {creating ? "Criando…" : "Criar convite"}
          </button>
        </div>
        {createState.error && (
          <span className="admin-error">{createState.error}</span>
        )}
        {createState.inviteUrl && <InviteLink url={createState.inviteUrl} />}
      </form>

      {regenState.inviteUrl && (
        <div className="trail-create">
          <InviteLink url={regenState.inviteUrl} />
        </div>
      )}
      {regenState.error && <p className="admin-error">{regenState.error}</p>}

      {/* Filtros de Trilha */}
      <div className="admin-nav-tabs" style={{ marginBottom: "20px", width: "fit-content" }}>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "all" ? " active" : ""}`}
          onClick={() => setTrackFilter("all")}
        >
          Todos ({users.length})
        </button>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "negocios" ? " active" : ""}`}
          onClick={() => setTrackFilter("negocios")}
        >
          Negócios / Analista ({users.filter(u => u.onboardingTrack === "negocios").length})
        </button>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "desenvolvimento" ? " active" : ""}`}
          onClick={() => setTrackFilter("desenvolvimento")}
        >
          Desenvolvimento / Dev ({users.filter(u => u.onboardingTrack === "desenvolvimento").length})
        </button>
      </div>

      {/* Lista */}
      <div className="trail-admin-list">
        {filteredUsers.length === 0 ? (
          <p className="admin-trail-empty" style={{ padding: "20px 8px" }}>Nenhum usuário nesta trilha.</p>
        ) : (
          filteredUsers.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <div className="trail-admin-row" key={u.id}>
                <div className="trail-admin-main">
                  <div className="admin-row-body">
                    <span className="admin-row-title">
                      {u.name || u.email}
                      {isSelf && <span className="user-you"> (você)</span>}
                    </span>
                    <span className="admin-row-desc">{u.email}</span>
                  </div>

                  {isSelf ? (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className={`user-role-badge role-${u.role}`}>
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                      <span
                        className="user-role-badge"
                        style={{
                          backgroundColor: "var(--blue-faint)",
                          color: "var(--blue)",
                          border: "1px solid rgba(20, 107, 250, 0.15)",
                          textTransform: "uppercase",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "3px 8px"
                        }}
                      >
                        {u.onboardingTrack === "negocios" ? "Negócios" : "Dev"}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <form action={changeUserRole} className="role-select-form">
                        <input type="hidden" name="id" value={u.id} />
                        <select
                          name="role"
                          defaultValue={u.role}
                          className={`role-select role-${u.role}`}
                          title="Mudar papel"
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="leitor">Leitor</option>
                        </select>
                      </form>
                      <form action={changeUserTrack} className="role-select-form">
                        <input type="hidden" name="id" value={u.id} />
                        <select
                          name="onboardingTrack"
                          defaultValue={u.onboardingTrack}
                          className="track-select"
                          title="Mudar trilha"
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          <option value="negocios">Negócios</option>
                          <option value="desenvolvimento">Dev</option>
                        </select>
                      </form>
                    </div>
                  )}
                  <span
                    className={`user-status ${
                      u.status === "active" ? "is-active" : "is-invited"
                    }`}
                  >
                    {u.status === "active" ? "Ativo" : "Convite pendente"}
                  </span>

                  <div className="trail-admin-actions">
                    {u.status === "invited" && (
                      <form action={regenAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <button type="submit" className="trail-btn">
                          Gerar link
                        </button>
                      </form>
                    )}
                    <form
                      action={deleteUserAction}
                      onSubmit={(e) => {
                        if (!confirm(`Remover o acesso de "${u.email}"?`))
                          e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <button
                        type="submit"
                        className="trail-btn trail-btn-danger"
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "Você não pode remover o próprio acesso"
                            : "Remover acesso"
                        }
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
