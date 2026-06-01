import { cookies } from "next/headers";

/**
 * Auth interina da área /admin (Fase 2). Uma senha compartilhada destrava
 * a edição; a sessão é um cookie httpOnly que carrega um segredo só do
 * servidor. Na Fase 3 isto é substituído por login Microsoft (Clerk) com
 * papéis por pessoa.
 */
export const ADMIN_COOKIE = "ask_admin";

export function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

export async function isAuthed(): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === secret;
}
