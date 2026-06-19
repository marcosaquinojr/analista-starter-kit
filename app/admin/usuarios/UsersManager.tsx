"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Check } from "lucide-react";
import {
  createUserInvite,
  regenerateInvite,
  deleteUserAction,
  changeUserRole,
  changeUserTrack,
  type ActionState,
} from "@/app/admin/actions";
import { toast } from "@/lib/toast-store";
import type { AreaMeta } from "@/lib/types";
import ConfirmModal from "@/components/ConfirmModal";

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
          style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
        >
          {copied ? (
            <>
              <Check size={13} strokeWidth={3} /> Copiado
            </>
          ) : (
            "Copiar"
          )}
        </button>
      </div>
    </div>
  );
}

export default function UsersManager({
  users,
  currentUserId,
  areas,
}: {
  users: UserView[];
  currentUserId: string;
  areas: AreaMeta[];
}) {
  const [createState, createAction, creating] = useActionState(
    createUserInvite,
    initial,
  );
  const [regenState, regenAction] = useActionState(regenerateInvite, initial);
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [pendingDelete, setPendingDelete] = useState<UserView | null>(null);
  const [, startTransition] = useTransition();

  const filteredUsers = users.filter((u) => {
    if (trackFilter === "all") return true;
    return u.onboardingTrack === trackFilter;
  });

  const areaName = (slug: string) =>
    areas.find((a) => a.slug === slug)?.name ?? slug;

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
            <span>Área</span>
            <select name="onboardingTrack" defaultValue={areas[0]?.slug ?? ""}>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
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

      {/* Filtros de área */}
      <div className="admin-nav-tabs" style={{ marginBottom: "20px", width: "fit-content" }}>
        <button
          type="button"
          className={`admin-nav-tab${trackFilter === "all" ? " active" : ""}`}
          onClick={() => setTrackFilter("all")}
        >
          Todos ({users.length})
        </button>
        {areas.map((a) => (
          <button
            key={a.slug}
            type="button"
            className={`admin-nav-tab${trackFilter === a.slug ? " active" : ""}`}
            onClick={() => setTrackFilter(a.slug)}
          >
            {a.name} (
            {users.filter((u) => u.onboardingTrack === a.slug).length})
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="trail-admin-list">
        {filteredUsers.length === 0 ? (
          <p className="admin-trail-empty" style={{ padding: "20px 8px" }}>Nenhum usuário nesta área.</p>
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
                      <span className="track-badge">
                        {areaName(u.onboardingTrack)}
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
                          title="Mudar área"
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          {areas.map((a) => (
                            <option key={a.slug} value={a.slug}>
                              {a.name}
                            </option>
                          ))}
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
                    <button
                      type="button"
                      className="trail-btn trail-btn-danger"
                      disabled={isSelf}
                      onClick={() => setPendingDelete(u)}
                      title={
                        isSelf
                          ? "Você não pode remover o próprio acesso"
                          : "Remover acesso"
                      }
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Remover acesso"
        message={
          <>
            Remover o acesso de <strong>{pendingDelete?.email}</strong>? A pessoa
            perde o login; o histórico de progresso é apagado.
          </>
        }
        confirmLabel="Remover"
        danger
        onConfirm={() => {
          const u = pendingDelete;
          if (!u) return;
          startTransition(() => {
            const fd = new FormData();
            fd.set("id", u.id);
            deleteUserAction(fd);
          });
        }}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
