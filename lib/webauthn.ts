import "server-only";
import { cookies, headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { webauthnCredentials } from "@/lib/db/schema";

/**
 * Suporte a WebAuthn (passkeys): login com o desbloqueio do dispositivo
 * (Touch ID / senha do Mac) sem digitar senha. Usa autenticador de plataforma
 * e credenciais "discoverable" (resident keys) → login sem precisar do e-mail.
 */

export const RP_NAME = "Citiesoft Onboard";
const CHALLENGE_COOKIE = "ck_wa_chal";

/** Deriva rpID + origin do host da requisição (vale em localhost e em prod). */
export async function rpInfo(): Promise<{ rpID: string; origin: string }> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const rpID = host.split(":")[0];
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return { rpID, origin: `${proto}://${host}` };
}

export async function setChallenge(challenge: string): Promise<void> {
  const store = await cookies();
  store.set(CHALLENGE_COOKIE, challenge, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 300,
  });
}

/** Lê e remove o desafio salvo (uso único). */
export async function takeChallenge(): Promise<string | null> {
  const store = await cookies();
  const v = store.get(CHALLENGE_COOKIE)?.value ?? null;
  if (v) store.delete(CHALLENGE_COOKIE);
  return v;
}

// ── Codificação Uint8Array ⇄ base64url ────────────────────────────────────
export function toB64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}
export function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const buf = Buffer.from(s, "base64url");
  const out = new Uint8Array(buf.byteLength);
  out.set(buf);
  return out;
}

// ── Acesso ao banco ───────────────────────────────────────────────────────
export async function listUserCredentials(userId: string) {
  return db
    .select()
    .from(webauthnCredentials)
    .where(eq(webauthnCredentials.userId, userId));
}

export async function getCredentialById(id: string) {
  const [row] = await db
    .select()
    .from(webauthnCredentials)
    .where(eq(webauthnCredentials.id, id))
    .limit(1);
  return row ?? null;
}

export async function insertCredential(c: {
  id: string;
  userId: string;
  publicKey: string;
  counter: number;
  transports: string;
  deviceName: string;
}) {
  await db.insert(webauthnCredentials).values({
    ...c,
    createdAt: new Date().toISOString(),
  });
}

export async function bumpCounter(id: string, counter: number) {
  await db
    .update(webauthnCredentials)
    .set({ counter })
    .where(eq(webauthnCredentials.id, id));
}

export async function deleteCredential(id: string, userId: string) {
  await db
    .delete(webauthnCredentials)
    .where(
      and(eq(webauthnCredentials.id, id), eq(webauthnCredentials.userId, userId)),
    );
}
