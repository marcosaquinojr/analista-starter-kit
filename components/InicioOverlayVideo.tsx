"use client";

import { useEffect } from "react";

/**
 * Overlay de carregamento minimalista: o Citiezinho (vídeo WebM transparente)
 * caminha sobre a barra de progresso enquanto o onboarding é preparado.
 */
export default function InicioOverlayVideo({ userName }: { userName: string }) {
  const firstName = userName.trim().split(/\s+/)[0] ?? "";

  // Remove o ?welcome=1 (e mantém ?boot=) para refresh/voltar não reexibir.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("welcome")) {
      url.searchParams.delete("welcome");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, []);

  return (
    <div className="vboot" aria-hidden>
      <div className="vboot-inner">
        <span className="vboot-greeting">
          {firstName ? `Olá, ${firstName}` : "Citiesoft Academy"}
        </span>

        <div className="vboot-stage">
          <div className="vboot-walker">
            <video
              className="vboot-video"
              src="/citiezinho-walk.webm"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <div className="vboot-track">
            <span className="vboot-fill" />
          </div>
        </div>

        <span className="vboot-hint">Preparando seu onboarding…</span>
      </div>
    </div>
  );
}
