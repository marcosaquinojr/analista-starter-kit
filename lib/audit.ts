import "server-only";
import { randomUUID } from "node:crypto";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import type { AuditRow } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";

/**
 * Log de ações dos usuários (auditoria). `logAction` grava quem (snapshot de
 * nome/e-mail), quando (ISO) e o quê. Nunca deve derrubar a ação principal:
 * qualquer falha é engolida. Distinto do log de versões do código (changelog).
 */

export type { AuditRow };

export async function logAction(
  action: string,
  target = "",
  details = "",
): Promise<void> {
  try {
    const session = await getSessionUser();
    let name = "";
    let email = session?.email ?? "";
    if (session) {
      const row = await getUserById(session.uid);
      if (row) {
        name = row.name;
        email = row.email;
      }
    }
    await db.insert(auditLog).values({
      id: randomUUID(),
      at: new Date().toISOString(),
      userId: session?.uid ?? null,
      userName: name,
      userEmail: email,
      action,
      target,
      details,
    });
  } catch {
    // auditoria é best-effort — não propaga erro
  }
}

export async function listAudit(limit = 300): Promise<AuditRow[]> {
  return db.select().from(auditLog).orderBy(desc(auditLog.at)).limit(limit);
}
