/**
 * Iniciais para o avatar: usa o nome quando há; senão, cai no e-mail.
 * Função pura (sem server-only) — usada na sidebar do site e no header do admin.
 */
export function initials(name: string, email: string): string {
  const src = (name || "").trim() || email;
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}
