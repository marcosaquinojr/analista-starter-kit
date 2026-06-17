/**
 * Normaliza o conteúdo do hero da página inicial para HTML.
 *
 * O editor passou a salvar HTML (negrito, cor etc., como nos capítulos). Mas
 * valores antigos podem estar em texto puro com a convenção `**trecho**`. Esta
 * função aceita os dois: se já houver tag HTML, devolve como está; senão,
 * converte os `**...**` em destaque (azul no título, peso no subtítulo).
 *
 * Pura (sem server-only) — usada pelo render do site e pelo editor.
 */
export function heroHtml(value: string, kind: "accent" | "strong"): string {
  if (!value) return "";
  if (/<[a-z][^>]*>/i.test(value)) return value;
  const open = kind === "accent" ? '<span class="accent">' : "<strong>";
  const close = kind === "accent" ? "</span>" : "</strong>";
  return value.replace(/\*\*(.+?)\*\*/g, `${open}$1${close}`);
}
