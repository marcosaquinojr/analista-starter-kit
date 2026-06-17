"use client";

import { useState } from "react";
import type { AuditRow } from "@/lib/audit";
import type { ChangelogEntry } from "@/lib/changelog";

const ACTION_LABEL: Record<string, string> = {
  "chapter.create": "Criou capítulo",
  "chapter.update": "Editou capítulo",
  "chapter.delete": "Excluiu capítulo",
  "trail.create": "Criou trilha",
  "trail.update": "Editou trilha",
  "trail.delete": "Excluiu trilha",
  "home.update": "Editou página inicial",
  "profile.update": "Atualizou o perfil",
  "user.invite": "Convidou usuário",
  "user.role": "Mudou papel de usuário",
  "user.delete": "Removeu usuário",
};

function fmt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function LogView({
  audit,
  changelog,
}: {
  audit: AuditRow[];
  changelog: ChangelogEntry[];
}) {
  const [tab, setTab] = useState<"acoes" | "codigo">("acoes");

  return (
    <>
      <div className="admin-intro">
        <h1>Log</h1>
        <p>
          Histórico do que acontece no sistema. <strong>Ações de usuários</strong>{" "}
          registra o que cada pessoa fez na área interna; <strong>Versões do
          código</strong> lista as mudanças de desenvolvimento publicadas.
        </p>
      </div>

      <div className="log-tabs">
        <button
          type="button"
          className={`log-tab${tab === "acoes" ? " active" : ""}`}
          onClick={() => setTab("acoes")}
        >
          Ações de usuários
        </button>
        <button
          type="button"
          className={`log-tab${tab === "codigo" ? " active" : ""}`}
          onClick={() => setTab("codigo")}
        >
          Versões do código
        </button>
      </div>

      {tab === "acoes" ? (
        audit.length === 0 ? (
          <p className="admin-trail-empty">Nenhuma ação registrada ainda.</p>
        ) : (
          <div className="log-list">
            {audit.map((a) => (
              <div className="log-row" key={a.id}>
                <span className="log-when">{fmt(a.at)}</span>
                <span className="log-who">
                  {a.userName || a.userEmail || "—"}
                </span>
                <span className="log-what">
                  <span className="log-action">
                    {ACTION_LABEL[a.action] ?? a.action}
                  </span>
                  {a.target && <span className="log-target">{a.target}</span>}
                  {a.details && <span className="log-details">{a.details}</span>}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="changelog">
          {changelog.map((c, i) => (
            <div className="changelog-entry" key={i}>
              <div className="changelog-head">
                <span className="changelog-date">{c.date}</span>
                <span className="changelog-title">{c.title}</span>
              </div>
              <ul className="changelog-items">
                {c.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
