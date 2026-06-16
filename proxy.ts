import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * Gate leve de /admin/* (exceto /admin/login): sem cookie de sessão, manda
 * pro login. Roda no edge, então só checa PRESENÇA do cookie — a validação
 * da assinatura e do papel acontece no servidor (AdminChrome e nas actions),
 * que é onde a autorização precisa valer de qualquer jeito.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.get(SESSION_COOKIE)?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
