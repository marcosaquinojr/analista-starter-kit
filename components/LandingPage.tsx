"use client";

import Link from "next/link";
import { CtMark } from "@/components/Logo";

/**
 * Página pública na raiz do site (visitante sem login). É uma ferramenta
 * interna, então nada de pitch de venda: só a marca, uma linha do que é, e o
 * botão de entrar. Tom escuro/imersivo coerente com a tela de login.
 */
export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#030712",
        color: "#f3f4f6",
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
      {/* Brilho de fundo sutil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 35%, rgba(20, 107, 250, 0.13), transparent 60%)",
          pointerEvents: "none",
        }}
      />

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
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Citiesoft Academy
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#9ca3af",
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
            background: "#ffffff",
            color: "#030712",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
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
          color: "#4b5563",
        }}
      >
        © {new Date().getFullYear()} Citiesoft
      </footer>
    </div>
  );
}
