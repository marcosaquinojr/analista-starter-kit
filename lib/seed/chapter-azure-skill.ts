import type { Chapter } from "@/lib/types";

/**
 * Capítulo novo da área NEGÓCIOS: apresenta a skill do Claude Code que
 * publica PBI e Bug no Azure DevOps no padrão visual da Citiesoft.
 * Ocupa a posição 09 da trilha Rotina (depois de "Exemplos reais", 08).
 *
 * Semeado por scripts/seed-cap-azure-skill.ts (só insere, nunca sobrescreve).
 * Não renumera FAQ/Erros/Próximos automaticamente — o banco de produção já
 * está com numeração diferente do seed (ver REVISAO_PROJETO_2026-07-02.md,
 * REV-01); ajuste a ordem final no /admin depois de revisar.
 */
export const seedChapterAzureSkill: Chapter & { sortOrder: number } = {
  slug: "skill-azure-backlog",
  number: "09",
  sortOrder: 9,
  trailSlug: "rotina",
  title: "IA no dia a dia: publicando PBI e Bug",
  description:
    "A skill do Claude Code que publica PBI e Bug no Azure DevOps no padrão visual da casa — instale e configure em 10 minutos.",
  readTime: "8 min de leitura + instalação",
  updatedAt: "14/07/2026",
  bodyHtml: `
<h2>O que é isto</h2>
<p>Uma <strong>skill</strong> é um pacote de instruções que ensina o Claude Code a executar uma tarefa específica do seu trabalho do jeito certo, sem você precisar reexplicar as regras toda vez. Esta skill — <code>azure-backlog</code> — sabe publicar PBI e Bug no Azure DevOps no padrão visual oficial da Citiesoft, respeitando hierarquia, sprint e o "gate de Done". Você só decide o conteúdo de negócio; ela cuida da forma.</p>
<div class="callout"><div class="callout-label">Por que isso importa</div>Formatar um PBI bonito à mão (HTML, cores, cenários Gherkin em cartões) é o tipo de trabalho repetitivo que rouba tempo de análise de verdade. A skill aplica o padrão sozinha — e nunca deixa passar um erro de hierarquia que gera retrabalho no board.</div>

<h2>O que ela garante sozinha</h2>
<div class="cards">
  <div class="card"><div class="card-title">Padrão visual oficial</div><div class="card-desc">HTML com barra lateral azul, callouts, User Story em destaque, cenários Gherkin em cartões — sem emojis, do jeito que a casa adotou.</div></div>
  <div class="card"><div class="card-title">Hierarquia correta</div><div class="card-desc">Diagnostica como o seu projeto trata Bug (bugsBehavior) antes de criar qualquer item — evita o erro clássico "same category hierarchy".</div></div>
  <div class="card"><div class="card-title">Gate de Done</div><div class="card-desc">Nunca deixa mover um PBI para Done com Task, Bug ou Test Case ainda em aberto.</div></div>
  <div class="card"><div class="card-title">Achar órfãos</div><div class="card-desc">Lista work items sem pai no seu projeto — útil pra limpar o board antes de uma reunião de acompanhamento.</div></div>
</div>
<div class="callout warn"><div class="callout-label">O que ela não faz</div>Não decide o conteúdo de negócio da PBI (regras, critérios de aceite) — isso continua sendo você. E nunca publica nada sem você revisar antes: sempre confira o que o Claude vai subir antes de confirmar.</div>

<h2>Passo 1 — Instalar</h2>
<p>A skill é um repositório público no GitHub da Citiesoft. Instalar é um comando só, colado no Terminal:</p>
<pre><code>git clone https://github.com/marcosaquinojr/azure-backlog.git ~/.claude/skills/azure-backlog</code></pre>
<p>Depois disso, <strong>abra (ou reinicie) o Claude Code</strong> — não precisa configurar nada agora. A skill se apresenta sozinha na primeira vez que você pedir algo do Azure DevOps.</p>
<div class="callout good"><div class="callout-label">Repositório</div><a href="https://github.com/marcosaquinojr/azure-backlog" target="_blank" rel="noopener"><strong>→ Ver o repositório da skill no GitHub</strong></a></div>
<div class="callout warn"><div class="callout-label">Não tem o git instalado?</div>Baixe o ZIP diretamente pelo botão verde "Code → Download ZIP" na página do repositório, extraia e copie a pasta <code>azure-backlog</code> para <code>~/.claude/skills/</code>.</div>

<h2>Passo 2 — Criar e vincular seu PAT</h2>
<p>O Azure DevOps não aceita seu login normal para automação — é preciso um <strong>Personal Access Token (PAT)</strong>, uma senha especial só para isso. Na primeira vez que você pedir para a skill publicar algo, o Claude conduz esse processo com você, pergunta por pergunta. Veja o que esperar, passo a passo:</p>
<ol>
  <li><strong>Dados básicos.</strong> O Claude pergunta seu e-mail no Azure DevOps e o nome exato do seu projeto (ex.: <code>SES - Sistema de Prestacao de Contas</code>). Copie o nome como aparece no topo da tela em <code>dev.azure.com/Citiesoft</code> — precisa ser idêntico.</li>
  <li><strong>Onde guardar o token.</strong> O Claude sugere <code>~/.azure_devops.env</code> — um arquivo simples, fora de qualquer pasta de documentos, que só existe no seu computador. Aceite a sugestão ou informe outro caminho.</li>
  <li><strong>Gerar o token no Azure DevOps</strong> (o Claude te guia, mas o caminho manual é este):
    <ul>
      <li>Acesse <strong>dev.azure.com/Citiesoft</strong> já logado.</li>
      <li>Canto superior direito → <strong>User settings</strong> → <strong>Personal access tokens</strong> → <strong>+ New Token</strong>.</li>
      <li><em>Name:</em> algo como "Claude Code — backlog". <em>Organization:</em> <strong>Citiesoft</strong>. <em>Expiration:</em> 90 dias é um bom padrão.</li>
      <li><em>Scopes → Custom defined:</em> marque <strong>Work Items</strong> (Read, write & manage), <strong>Test Management</strong> (Read & write), <strong>Project and Team</strong> (Read) e <strong>Identity</strong> (Read).</li>
      <li>Clique <strong>Create</strong> e <strong>copie o token na hora</strong> — ele só aparece uma vez.</li>
    </ul>
  </li>
  <li><strong>Colar o token com segurança.</strong> O Claude cria o arquivo e tenta abri-lo no seu editor. Quando abrir, cole o token depois de <code>AZURE_DEVOPS_PAT=</code> e salve:
<pre><code>AZURE_DEVOPS_ORG=Citiesoft
AZURE_DEVOPS_PAT=seutokenaqui</code></pre>
  </li>
  <li><strong>Se o editor não abrir</strong>, o Claude oferece uma alternativa pelo terminal que lê o token sem mostrá-lo na tela e sem ele passar pela conversa — só aceite quando pedir e cole o token quando o terminal pausar esperando.</li>
  <li><strong>Pronto.</strong> O Claude valida o acesso automaticamente. Se der erro, ele te leva de volta a este fluxo — nunca ignora ou desiste silenciosamente.</li>
</ol>
<div class="callout"><div class="callout-label">Regra de ouro</div>O token <strong>nunca</strong> é digitado no chat, nunca aparece impresso na conversa e nunca deve ir para nenhum repositório ou vault compartilhado. Ele mora só no arquivo local, no seu computador.</div>
<div class="callout warn"><div class="callout-label">Token expirou?</div>Se depois de um tempo a skill começar a dar erro de autenticação, gere um novo token repetindo o passo 3 e cole no mesmo arquivo, substituindo o antigo.</div>

<h2>Passo 3 — Usar no dia a dia</h2>
<p>Depois de configurada, é só pedir em português normal:</p>
<div class="cards">
  <div class="card"><div class="card-title">"Publica esse PBI no Azure"</div><div class="card-desc">Cole o texto da PBI (ou aponte pro documento) — a skill monta o HTML no padrão visual e publica.</div></div>
  <div class="card"><div class="card-title">"Abre um bug pra esse defeito"</div><div class="card-desc">Descreva o problema, passos e ambiente — a skill gera o Bug no formato oficial, já linkado ao PBI e ao Test Case de origem.</div></div>
  <div class="card"><div class="card-title">"Acha os itens órfãos do meu projeto"</div><div class="card-desc">Lista work items sem pai, útil antes de uma reunião de acompanhamento do board.</div></div>
</div>
<p><strong>Sempre revise antes de confirmar.</strong> A skill monta e sugere; quem aprova a publicação é você.</p>

<h2>Encontrou um caso que a skill não cobre?</h2>
<p>Cada projeto tem particularidades (campos customizados, um tipo de work item diferente). Quando isso acontecer, não force um formato — pergunte ao seu mentor ou combine com quem administra esta skill na Academy, pra virar uma atualização que ajuda todo mundo.</p>
<div class="callout"><div class="callout-label">Conecta com</div>O padrão de PBI/Bug que esta skill aplica é o mesmo explicado nos capítulos <strong>Ferramentas</strong> (06) e <strong>Templates</strong> (07) — esta skill automatiza a formatação, não substitui o raciocínio de negócio que você aprendeu ali.</div>
`,
};
