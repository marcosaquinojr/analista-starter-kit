"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CtMark } from "@/components/Logo";

const LINE1 = "Onde o Conhecimento";
const LINE2_PRE = "Encontra a ";
const GRADIENT = "Prática.";
const FULL = `${LINE1}\n${LINE2_PRE}${GRADIENT}`;

const GRADIENT_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #146bfa 0%, #06b6d4 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function TypedHeadline() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setCount(FULL.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= FULL.length) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);

  const shown = FULL.slice(0, count);
  const [l1, l2 = ""] = shown.split("\n");
  const l2pre = l2.slice(0, LINE2_PRE.length);
  const l2grad = l2.slice(LINE2_PRE.length);
  const onLine1 = count <= LINE1.length;

  return (
    <h1
      style={{
        fontFamily: 'var(--font-display), "Red Hat Display", sans-serif',
        fontSize: "clamp(36px, 5.5vw, 62px)",
        fontWeight: 800,
        color: "#1a1a2e",
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        marginBottom: "18px",
        position: "relative",
      }}
    >
      <style>{`@keyframes caretSoft { 0%,100%{opacity:1} 50%{opacity:0.15} }`}</style>
      {l1}
      {onLine1 && <Caret />}
      <br />
      {l2pre}
      <span style={GRADIENT_STYLE}>{l2grad}</span>
      {!onLine1 && <Caret />}
    </h1>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "3px",
        height: "0.78em",
        marginLeft: "5px",
        verticalAlign: "baseline",
        background: "linear-gradient(135deg, #146bfa 0%, #06b6d4 100%)",
        borderRadius: "2px",
        animation: "caretSoft 1.1s ease-in-out infinite",
      }}
    />
  );
}

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        fontFamily: 'var(--font-body), "Inter", sans-serif',
        color: "#3c3c3c",
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(20,107,250,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CtMark size={26} />
          <span
            style={{
              fontFamily: 'var(--font-display), "Red Hat Display", sans-serif',
              fontWeight: 800,
              fontSize: "15px",
              letterSpacing: "-0.01em",
              color: "#3c3c3c",
            }}
          >
            Citiesoft Academy
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "64px 24px 80px",
          position: "relative",
        }}
      >
        {/* Glow blob */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(20,107,250,0.13) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Headline — efeito de digitação */}
        <TypedHeadline />

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "#3c3c3c",
            opacity: 0.55,
            maxWidth: "600px",
            lineHeight: 1.65,
            marginBottom: "32px",
            position: "relative",
          }}
        >
          Manual de onboarding interno da Citiesoft. Trilhas guiadas, conteúdo
          prático e avaliações para você se integrar com confiança.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Link
            href="/admin/login"
            className="landing-enter-btn"
            style={{
              background: "#146bfa",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 24px rgba(20,107,250,0.35)",
            }}
          >
            Entrar <span className="landing-enter-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "28px 24px 32px",
          borderTop: "1px solid rgba(20,107,250,0.08)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#3c3c3c",
            opacity: 0.6,
          }}
        >
          © {new Date().getFullYear()} Citiesoft. Todos os direitos reservados.
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "#3c3c3c",
            opacity: 0.45,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          Desenvolvido com <span style={{ color: "#146bfa" }}>💙</span> pela
          Citiesoft
        </span>
      </footer>
    </div>
  );
}
