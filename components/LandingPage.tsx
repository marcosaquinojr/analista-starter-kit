"use client";

import Link from "next/link";
import { CtMark } from "@/components/Logo";

/**
 * Página pública na raiz do site (visitante sem login). Ferramenta interna:
 * nada de pitch de venda — só a marca, uma linha do que é, e o botão de entrar.
 * Tema claro, coerente com o login e o resto do app.
 */
export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 100% at 50% 0%, var(--blue-50), transparent 55%), var(--bg3)",
        color: "var(--ink)",
        fontFamily: 'var(--font-body), "Inter", -apple-system, sans-serif',
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "relative",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "22px",
          maxWidth: "440px",
        }}
      >
        <CtMark size={46} />

        <div>
          <h1
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Citiesoft Academy
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text2)",
              marginTop: "10px",
              lineHeight: 1.55,
            }}
          >
            Manual de onboarding interno da Citiesoft. Entre com a conta que você
            recebeu por convite.
          </p>
        </div>

        <Link
          href="/admin/login"
          style={{
            background: "var(--blue)",
            color: "#fff",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          Entrar <span aria-hidden>→</span>
        </Link>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "24px",
          fontSize: "12px",
          color: "var(--text3)",
        }}
      >
        © {new Date().getFullYear()} Citiesoft
      </footer>
    </div>
  );
}
