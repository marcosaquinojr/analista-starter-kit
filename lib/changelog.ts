/**
 * Log de versões do CÓDIGO (mudanças de desenvolvimento), mantido à mão e
 * versionado no git. Separado do log de AÇÕES DOS USUÁRIOS (esse vem do banco,
 * em lib/audit.ts). Acrescente uma entrada no topo a cada conjunto de mudanças.
 */
export interface ChangelogEntry {
  date: string; // dd/mm/aaaa
  title: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "17/06/2026",
    title: "Auditoria, navegação e UX do editor",
    items: [
      "Log de ações dos usuários (auditoria) + log de versões do código no /admin/log",
      "Capítulos passam a registrar data, hora e quem fez a última atualização",
      "Exclusão de capítulo agora exige digitar o título em um modal de confirmação",
      "Abas fixas no cabeçalho do admin (Capítulos, Página inicial, Progresso, Usuários, Log)",
      "Editor: \"Publicar\"/\"Cancelar\", última atualização visível, exclusão movida para zona discreta",
      "Upload de imagem em Ferramentas com estados claros (enviando/erro/carregada)",
      "Listas com bullets/numeração voltam a aparecer",
    ],
  },
  {
    date: "17/06/2026",
    title: "Edição visual da página inicial + perfil + Blob",
    items: [
      "Edição WYSIWYG do hero da página inicial (negrito, itálico, cores)",
      "Perfil de usuário: avatar com iniciais e nome no menu; página /conta",
      "Vercel Blob provisionado — upload de ícones em Ferramentas funcionando",
    ],
  },
  {
    date: "16/06/2026",
    title: "Citiesoft Onboard — base",
    items: [
      "Sistema de acessos próprio (papéis, convites por link)",
      "Editor de capítulos (Tiptap), trilhas e progresso por usuário",
      "Landing imersiva de login/convite e rodapé de última atualização",
    ],
  },
];
