/**
 * Nome do cookie de sessão. Fica num arquivo próprio (sem dependências de
 * node:crypto) porque o `proxy.ts` roda no edge e só precisa do nome — não
 * pode importar o lib/auth, que usa APIs de Node.
 */
export const SESSION_COOKIE = "ask_session";

/**
 * Cookie do modo "Visualizando como" (preview de área do admin/editor).
 * Vive num cookie — e não em ?area= — porque o layout do site (que monta a
 * sidebar) não tem acesso a searchParams; com cookie, home, sidebar e
 * navegação de capítulos enxergam a mesma área.
 */
export const PREVIEW_AREA_COOKIE = "ask_preview_area";
