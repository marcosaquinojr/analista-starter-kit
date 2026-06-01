/**
 * Marca Citiesoft `<ct>` — recriada como SVG a partir do brand kit oficial
 * (Figma "Branding · Citiesoft"). Quadrado azul → chip branco → `<ct>` azul.
 */
export function CtMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Citiesoft"
    >
      <rect width="40" height="40" rx="9" fill="var(--blue, #1068f8)" />
      <rect x="5" y="10.5" width="30" height="19" rx="3.5" fill="#ffffff" />
      <path
        d="M14 15.5 L10.3 20 L14 24.5"
        fill="none"
        stroke="var(--blue, #1068f8)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 15.5 L29.7 20 L26 24.5"
        fill="none"
        stroke="var(--blue, #1068f8)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="20"
        y="20.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--blue, #1068f8)"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="12"
      >
        ct
      </text>
    </svg>
  );
}

/** Lockup horizontal: marca + wordmark "Citiesoft". */
export function LogoLockup({ height = 30 }: { height?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(height * 0.34),
      }}
    >
      <CtMark size={Math.round(height * 1.2)} />
      <span
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 800,
          fontSize: Math.round(height * 0.92),
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Citiesoft
      </span>
    </span>
  );
}
