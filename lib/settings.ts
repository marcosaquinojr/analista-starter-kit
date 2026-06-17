import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

/**
 * Conteúdo editável da página inicial (o "hero" de boas-vindas). Antes ficava
 * hardcoded no componente HomeView; agora vem da tabela `settings` (chave/valor)
 * e é editável pelo /admin/inicio com edição visual (WYSIWYG). `title` e
 * `subtitle` guardam HTML (negrito, cor etc.); valores legados em texto puro
 * com `**...**` continuam suportados via lib/hero.ts.
 */
export interface HomeContent {
  tag: string;
  title: string;
  subtitle: string;
  readTime: string;
}

export const HOME_DEFAULTS: HomeContent = {
  tag: "Bem-vindo à Citiesoft",
  title:
    'Você não vai precisar <span class="accent">adivinhar</span> como as coisas funcionam aqui.',
  subtitle:
    "Este manual reúne o que os analistas mais experientes do time aprenderam na marra — para você chegar produzindo com qualidade <strong>desde o primeiro mês</strong>.",
  readTime: "~45 min",
};

const KEYS = {
  tag: "home_tag",
  title: "home_title",
  subtitle: "home_subtitle",
  readTime: "home_readtime",
} as const;

export async function getHomeContent(): Promise<HomeContent> {
  const rows = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, Object.values(KEYS)));
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    tag: map.get(KEYS.tag) ?? HOME_DEFAULTS.tag,
    title: map.get(KEYS.title) ?? HOME_DEFAULTS.title,
    subtitle: map.get(KEYS.subtitle) ?? HOME_DEFAULTS.subtitle,
    readTime: map.get(KEYS.readTime) ?? HOME_DEFAULTS.readTime,
  };
}

export async function saveHomeContent(c: HomeContent): Promise<void> {
  const entries = [
    { key: KEYS.tag, value: c.tag },
    { key: KEYS.title, value: c.title },
    { key: KEYS.subtitle, value: c.subtitle },
    { key: KEYS.readTime, value: c.readTime },
  ];
  for (const e of entries) {
    await db
      .insert(settings)
      .values(e)
      .onConflictDoUpdate({ target: settings.key, set: { value: e.value } });
  }
}
