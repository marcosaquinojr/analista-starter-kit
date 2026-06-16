/**
 * Nome do cookie de sessão. Fica num arquivo próprio (sem dependências de
 * node:crypto) porque o `proxy.ts` roda no edge e só precisa do nome — não
 * pode importar o lib/auth, que usa APIs de Node.
 */
export const SESSION_COOKIE = "ask_session";
