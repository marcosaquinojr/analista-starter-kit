import "server-only";
import { randomUUID } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { UserRow } from "@/lib/db/schema";
import {
  hashPassword,
  newInviteToken,
  getSessionUser,
  type Role,
} from "@/lib/auth";

/**
 * Camada de acesso a usuários da área interna. As actions e páginas do /admin
 * consomem só estas funções.
 */

export type { UserRow };

export async function listUsers(): Promise<UserRow[]> {
  return db.select().from(users).orderBy(asc(users.createdAt));
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function getUserByInvite(token: string): Promise<UserRow | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.inviteToken, token))
    .limit(1);
  return row ?? null;
}

/** Cria um usuário em estado "convidado" e devolve o token do convite. */
export async function createInvite(opts: {
  email: string;
  name: string;
  role: Role;
}): Promise<string> {
  const token = newInviteToken();
  await db.insert(users).values({
    id: randomUUID(),
    email: opts.email.trim().toLowerCase(),
    name: opts.name.trim(),
    role: opts.role,
    passwordHash: null,
    inviteToken: token,
    inviteExpiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "invited",
    createdAt: new Date().toISOString(),
  });
  return token;
}

/** Gera um novo link de convite para quem ainda não aceitou. */
export async function resetInvite(id: string): Promise<string | null> {
  const row = await getUserById(id);
  if (!row || row.status !== "invited") return null;
  const token = newInviteToken();
  await db
    .update(users)
    .set({
      inviteToken: token,
      inviteExpiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    })
    .where(eq(users.id, id));
  return token;
}

/** A pessoa define a própria senha; o convite vira conta ativa. */
export async function acceptInvite(
  token: string,
  password: string,
): Promise<UserRow | null> {
  const row = await getUserByInvite(token);
  if (!row || row.status !== "invited") return null;
  if (row.inviteExpiresAt && new Date(row.inviteExpiresAt) < new Date())
    return null;
  await db
    .update(users)
    .set({
      passwordHash: hashPassword(password),
      status: "active",
      inviteToken: null,
      inviteExpiresAt: null,
    })
    .where(eq(users.id, row.id));
  return row;
}

export async function setUserRole(id: string, role: Role): Promise<void> {
  await db.update(users).set({ role }).where(eq(users.id, id));
}

/** A própria pessoa edita seu nome de exibição (usado em /conta). */
export async function setUserName(id: string, name: string): Promise<void> {
  await db.update(users).set({ name: name.trim() }).where(eq(users.id, id));
}

/** Atualiza nome + foto (avatar) da própria pessoa. */
export async function setUserProfile(
  id: string,
  name: string,
  avatarUrl: string,
): Promise<void> {
  await db
    .update(users)
    .set({ name: name.trim(), avatarUrl })
    .where(eq(users.id, id));
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

export async function countAdmins(): Promise<number> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));
  return rows.length;
}

/**
 * Guard para server actions: confirma no banco (revogação imediata) que o
 * usuário logado existe, está ativo e tem um dos papéis permitidos.
 */
export async function requireRole(
  ...allowed: Role[]
): Promise<UserRow | null> {
  const session = await getSessionUser();
  if (!session) return null;
  const row = await getUserById(session.uid);
  if (!row || row.status !== "active") return null;
  if (!allowed.includes(row.role as Role)) return null;
  return row;
}
