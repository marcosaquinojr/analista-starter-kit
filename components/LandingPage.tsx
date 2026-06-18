"use client";

import Link from "next/link";
import { CtMark } from "@/components/Logo";

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
      }}
    >
      {/* Background Code/Development Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/development_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      
      {/* Dark & Glowing Overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(20, 107, 250, 0.12), transparent 65%), linear-gradient(180deg, rgba(3, 7, 18, 0.2) 0%, #030712 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Decorative Glow Dot */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(20, 107, 250, 0.08)",
          filter: "blur(120px)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          padding: "28px 32px",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CtMark size={32} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
            <span style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "-0.02em", color: "#ffffff" }}>
              Citiesoft Academy
            </span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Manual de Onboarding</span>
          </div>
        </div>

        <Link
          href="/admin/login"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#f3f4f6",
            padding: "8px 22px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "none",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
          }}
        >
          Acessar Manual
        </Link>
      </header>

      {/* Hero Section */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 24px 60px",
          maxWidth: "850px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Glow Badge */}
        <div
          style={{
            background: "rgba(20, 107, 250, 0.06)",
            border: "1px solid rgba(20, 107, 250, 0.2)",
            color: "#60a5fa",
            padding: "5px 14px",
            borderRadius: "100px",
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          Conhecimento técnico compartilhado
        </div>

        {/* Title with subtle gradient */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            lineHeight: "1.12",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: "24px",
            background: "linear-gradient(180deg, #ffffff 50%, #d1d5db 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          O manual definitivo de{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Engenharia & Requisitos
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "17px",
            lineHeight: "1.6",
            color: "#9ca3af",
            marginBottom: "40px",
            maxWidth: "600px",
          }}
        >
          Acelere seu onboarding de forma guiada com trilhas customizadas para Analistas e Desenvolvedores. Encontre especificações, documentação e melhores práticas de engenharia de software da Citiesoft.
        </p>

        {/* Action Button */}
        <Link
          href="/admin/login"
          style={{
            background: "#ffffff",
            color: "#030712",
            padding: "14px 34px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 255, 255, 0.1)";
          }}
        >
          Começar leitura <span>→</span>
        </Link>
      </main>

      {/* Pillars Section */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "20px 24px 80px",
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "28px",
              backdropFilter: "blur(16px)",
              transition: "border-color 0.25s, background-color 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            }}
          >
            <span style={{ fontSize: "22px", display: "block", marginBottom: "16px" }}>🎯</span>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
              Alinhamento de Negócios
            </h3>
            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>
              Compreenda as regras de negócios de forma profunda e aprenda a traduzi-las em especificações funcionais ricas e compreensíveis.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "28px",
              backdropFilter: "blur(16px)",
              transition: "border-color 0.25s, background-color 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            }}
          >
            <span style={{ fontSize: "22px", display: "block", marginBottom: "16px" }}>💻</span>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
              Trilha de Desenvolvimento
            </h3>
            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>
              Explore o ecossistema técnico da Citiesoft: documentação de APIs, modelagem de banco de dados, fluxos de CI/CD e boas práticas.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "28px",
              backdropFilter: "blur(16px)",
              transition: "border-color 0.25s, background-color 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            }}
          >
            <span style={{ fontSize: "22px", display: "block", marginBottom: "16px" }}>⚡</span>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
              Progresso Integrado
            </h3>
            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>
              Acompanhe sua jornada de onboarding diretamente pela área de leitura com marcação de capítulos concluídos e métricas ativas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "24px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "center",
          fontSize: "12px",
          color: "#4b5563",
        }}
      >
        © {new Date().getFullYear()} Citiesoft Academy. Todos os direitos reservados.
      </footer>
    </div>
  );
}
