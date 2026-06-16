import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * Gate leve do app inteiro: ler o manual agora exige login (progresso é por
 * pessoa). Só /admin/login e /convite/* são públicas. Roda no edge, então só
 * checa PRESENÇA do cookie — a validação da assinatura e do papel acontece no
 * servidor (layout do site, AdminChrome e nas actions).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas: entrar e aceitar convite.
  if (pathname === "/admin/login" || pathname.startsWith("/convite")) {
    return NextResponse.next();
  }

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // tudo, menos assets estáticos e internals do Next
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
