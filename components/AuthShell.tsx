export default function AuthShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <div className="landing landing--tech">
      <div className="landing-bg" aria-hidden>
        {/* grid em perspectiva (piso tech) */}
        <div className="tech-grid" />
        {/* glows de marca */}
        <span className="mesh mesh-1" />
        <span className="mesh mesh-2" />
        <span className="mesh mesh-3" />
        {/* partículas flutuantes */}
        <div className="tech-particles">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <span className="landing-grain" />
      </div>
      <div className="landing-overlay" aria-hidden />
      <div className="landing-card landing-card--tech">
        {children}
      </div>
      {footer && <p className="landing-footer">{footer}</p>}
    </div>
  );
}
