"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createUserInvite,
  regenerateInvite,
  deleteUserAction,
  type ActionState,
} from "@/app/admin/actions";

const initial: ActionState = {};

type UserView = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
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

      {/* Lista */}
      <div className="trail-admin-list">
        {users.map((u) => {
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

                <span className={`user-role-badge role-${u.role}`}>
                  {ROLE_LABEL[u.role] ?? u.role}
                </span>
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
        })}
      </div>
    </>
  );
}
