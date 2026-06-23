"use client";

import { useEffect } from "react";
import { CtMark } from "@/components/Logo";

export default function InicioOverlay({ userName }: { userName: string }) {
  const firstName = userName.trim().split(/\s+/)[0] ?? "";

  // Remove o ?welcome=1 da URL para que refresh/voltar não reexiba o boot.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("welcome")) {
      url.searchParams.delete("welcome");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, []);
  const greeting = firstName ? `Olá, ${firstName}` : "Citiesoft Onboard";

  return (
    <div className="boot-overlay" aria-hidden>
      <div className="boot-scanlines" />
      <div className="boot-noise" />
      <div className="boot-content">
        <div className="boot-logo">
          <CtMark size={60} fill="#fff" />
        </div>
        <span className="boot-name glitch" data-text={greeting}>
          {greeting}
        </span>
        <span className="boot-sub">Inicializando seu onboarding…</span>
        <div className="boot-bar">
          <span />
        </div>
      </div>
    </div>
  );
}
