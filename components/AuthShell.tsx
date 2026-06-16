/**
 * Casca visual das telas públicas de autenticação (login e convite): vídeo de
 * fundo full-screen + card de vidro fosco (glassmorphism), conforme a direção
 * "imersiva" validada.
 *
 * O "vídeo" hoje é um mesh de gradiente animado em CSS (on-brand, sem asset e
 * leve). Pra trocar por filmagem real depois, basta substituir o conteúdo de
 * `.landing-bg` por:
 *   <video className="landing-video" autoPlay muted loop playsInline poster=…>
 *     <source src="/hero.mp4" type="video/mp4" />
 *   </video>
 */
export default function AuthShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden>
        <span className="mesh mesh-1" />
        <span className="mesh mesh-2" />
        <span className="mesh mesh-3" />
        <span className="landing-grain" />
      </div>
      <div className="landing-overlay" aria-hidden />
      <div className="landing-card">{children}</div>
      {footer && <p className="landing-footer">{footer}</p>}
    </div>
  );
}
