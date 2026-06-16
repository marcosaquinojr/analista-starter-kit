import "server-only";
import {
  createHmac,
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * Autenticação própria da área /admin. Cada pessoa entra com a própria conta
 * (e-mail + senha); a sessão é um token assinado (HMAC) guardado num cookie
 * httpOnly. Sem dependências externas — só node:crypto.
 *
 * Substituiu a senha compartilhada interina. Microsoft/Entra (Clerk) fica como
 * evolução futura: trocaria só este arquivo + o login.
 */

export type Role = "admin" | "editor" | "leitor";
export { SESSION_COOKIE };

const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET não definida");
  return s;
}

// ── Senha (scrypt + salt aleatório) ───────────────────────────────────────
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ── Token de sessão (stateless, assinado) ─────────────────────────────────
export interface SessionUser {
  uid: string;
  email: string;
  role: Role;
}

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export function signSession(user: SessionUser): string {
  const payload = { ...user, exp: Date.now() + MAX_AGE * 1000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { uid: data.uid, email: data.email, role: data.role };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSession(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Token de convite (URL-safe).
export function newInviteToken(): string {
  return randomBytes(24).toString("base64url");
}
