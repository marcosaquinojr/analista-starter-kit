import type { Chapter } from "@/lib/types";

/**
 * Trilha de onboarding da área DESENVOLVIMENTO — capítulos de Rotina e
 * Crescimento (os de Contexto, 01-05, são compartilhados entre as áreas).
 * Espelha a estrutura da trilha de Negócios: numeração 06-12 dentro da área.
 *
 * `sortOrder` usa a faixa 106-112 pra não colidir com Negócios (6-12) e
 * ordenar depois dos capítulos compartilhados (1-5) na visão do leitor.
 *
 * Semeado pelo scripts/seed-trilhas-dev-design.ts (só insere, nunca
 * sobrescreve — o banco é a fonte da verdade depois que editores mexem).
 */
export const seedChaptersDev: (Chapter & { sortOrder: number })[] = [
  {
    slug: "dev-processo",
    number: "06",
    sortOrder: 106,
    trailSlug: "rotina",
    title: "Do PBI ao deploy",
    description:
      "O caminho de uma demanda dentro do squad: refinamento, código, PR, teste e entrega.",
    readTime: "6 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>O fluxo em 6 passos</h2>
<p>Toda entrega de código aqui percorre o mesmo caminho. Conhecer o caminho evita a maior fonte de retrabalho do dev novo: começar a codar antes da hora.</p>
<div class="process">
  <div class="process-step"><span class="step-num">1</span><span class="step-name">Refinamento</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">2</span><span class="step-name">Planejamento</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">3</span><span class="step-name">Desenvolvimento</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">4</span><span class="step-name">Pull Request</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">5</span><span class="step-name">Teste (QA)</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">6</span><span class="step-name">Deploy</span></div>
</div>
<h2>01. Refinamento</h2>
<p>O PBI chega escrito pelo analista de negócios no padrão <strong>Como / Quero / Para</strong> + critérios de aceite (muitos em Gherkin: <em>Dado / Quando / Então</em>). Seu papel no refinamento não é estimar em silêncio — é <strong>atacar o PBI antes que ele te ataque</strong>:</p>
<ul>
  <li>Todo critério de aceite é testável? Se você não consegue imaginar o teste, o QA também não vai conseguir.</li>
  <li>Tem fluxo de erro descrito? ("E se o CPF não existir?") Se não tem, pergunte agora, não na sprint.</li>
  <li>Depende de outra equipe, integração ou dado que ainda não existe? Sinalize como bloqueio.</li>
</ul>
<div class="callout"><div class="callout-label">Regra da casa</div>Dúvida sobre regra de negócio se resolve com o analista <strong>por escrito no PBI</strong> (comentário no Azure DevOps), não em conversa de corredor. A resposta vira parte da especificação.</div>
<h2>02. Planejamento</h2>
<p>PBI aceito na sprint ganha <strong>Tasks</strong> — a quebra técnica é sua, não do analista. Task boa cabe em um dia de trabalho. Se a quebra revelar que o PBI é maior do que parecia, avise o PO <em>antes</em> de começar, não no fim da sprint.</p>
<h2>03. Desenvolvimento</h2>
<ul>
  <li>Crie a branch a partir da branch de desenvolvimento do repositório, nomeada com o número do work item (padrão do squad — confirme no seu primeiro dia).</li>
  <li>Commits pequenos e descritivos. O revisor lê o histórico antes do diff.</li>
  <li>Critério de aceite implementado = critério testado por você primeiro. QA não é peneira de erro básico.</li>
</ul>
<div class="callout warn"><div class="callout-label">Atenção</div>Não marque a Task como concluída com código só na sua máquina. Concluído = commitado, PR aberto e build passando.</div>
<h2>04. Pull Request</h2>
<p>Todo código passa por revisão de par — sem exceção, inclusive sênior. O Cap. 08 detalha o que o revisor olha. O resumo: PR pequeno, descrição ligando ao PBI, e você é o primeiro revisor do seu próprio diff.</p>
<h2>05. Teste</h2>
<p>Merge feito, o PBI vai para o ambiente de homologação e muda para <strong>ready for test</strong>. O QA executa os Test Cases derivados dos critérios de aceite. Bug reprovado volta pra você com passos de reprodução — corrigir bug da sprint tem prioridade sobre feature nova.</p>
<h2>06. Deploy</h2>
<p>Deploy em produção segue janela combinada com o cliente — em contrato público, subir "quando ficou pronto" pode violar acordo de mudança. Quem autoriza a janela é o gestor da conta; quem executa segue o procedimento do squad.</p>
<h2>Quando o fluxo desanda</h2>
<div class="callout bad"><div class="callout-label">Sintoma clássico</div>PBI reprovado 2+ vezes pelo QA no mesmo critério. Quase sempre a causa não é código — é critério ambíguo que você e o QA leram diferente. Pare de corrigir no escuro: chame analista + QA e alinhem a leitura em 15 min.</div>
`,
  },
  {
    slug: "dev-ferramentas",
    number: "07",
    sortOrder: 107,
    trailSlug: "rotina",
    title: "Ferramentas e stack",
    description:
      "Azure DevOps (Boards, Repos, Pipelines), Teams, ambientes e a stack dos produtos.",
    readTime: "6 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Stack do dev</h2>
<p>Você vai viver em ~4 lugares. Cada um tem um propósito claro:</p>
<div class="cards">
  <div class="card"><div class="card-title">Azure DevOps</div><div class="card-desc">Boards (PBIs, Tasks, Bugs), Repos (código e PRs) e Pipelines (build). O sistema operacional do squad.</div></div>
  <div class="card"><div class="card-title">Microsoft Teams</div><div class="card-desc">Chat do squad, daily, alinhamentos. Conversa, não documentação.</div></div>
  <div class="card"><div class="card-title">IDE + Git</div><div class="card-desc">Sua oficina. Configuração padrão do projeto no README de cada repositório.</div></div>
  <div class="card"><div class="card-title">Ambientes</div><div class="card-desc">Desenvolvimento → homologação → produção. Cada um com seu banco e seu propósito.</div></div>
</div>
<h2>A stack dos produtos</h2>
<p>Os sistemas da Citiesoft atendem majoritariamente o setor público — prefeituras, secretarias estaduais, órgãos legislativos. A base típica dos produtos:</p>
<ul>
  <li><strong>Back-end Java</strong> — APIs dos sistemas de gestão.</li>
  <li><strong>Front-end Angular</strong> — os módulos web.</li>
  <li><strong>Mobile</strong> — apps de módulos específicos (ex.: registro de ponto, atendimento em campo).</li>
</ul>
<p>Cada contrato tem particularidades de versão e infraestrutura — o dev sênior do squad te apresenta o repositório e o ambiente do seu projeto na primeira semana. Não assuma que dois projetos são iguais por usarem a mesma stack.</p>
<h2>Azure DevOps na prática</h2>
<h3>Boards</h3>
<ul>
  <li><strong>PBI</strong> — o que fazer, escrito pelo analista. Você lê, questiona e implementa.</li>
  <li><strong>Task</strong> — a quebra técnica. Essa é sua: crie, estime e atualize.</li>
  <li><strong>Bug</strong> — defeito com passos de reprodução. QA abre a maioria; você também pode (e deve, quando achar).</li>
  <li><strong>Test Case</strong> — roteiro de teste do QA, derivado dos critérios de aceite do PBI.</li>
</ul>
<div class="callout"><div class="callout-label">Regra de ouro</div>O board é o retrato do squad. Item parado em "Doing" há 3 dias sem comentário é invisibilidade, não trabalho. Atualize o estado e comente o bloqueio.</div>
<h3>Repos e Pipelines</h3>
<ul>
  <li>PR sempre vinculado ao work item (o Azure DevOps liga automaticamente pelo número na branch/commit).</li>
  <li>Build quebrado na branch principal é prioridade zero do squad — na dúvida, quem quebrou conserta, quem viu avisa.</li>
</ul>
<h2>Ambientes: o mapa mental</h2>
<table>
  <tr><th>Ambiente</th><th>Pra quê</th><th>Quem mexe</th></tr>
  <tr><td>Desenvolvimento</td><td>Integrar o trabalho do squad; pode quebrar.</td><td>Devs</td></tr>
  <tr><td>Homologação</td><td>QA executa os Test Cases; cliente valida quando aplicável.</td><td>QA + devs (correções)</td></tr>
  <tr><td>Produção</td><td>O sistema real, com dado real de cidadão e servidor público.</td><td>Deploy autorizado, janela combinada</td></tr>
</table>
<div class="callout warn"><div class="callout-label">LGPD no ambiente</div>Dado de produção é dado pessoal real. Não copie base de produção pra sua máquina, não cole dado real em chat/print, e massa de teste se constrói anonimizada. Suspeita de vazamento? Comunique na hora (Cap. 04).</div>
<h2>Teams</h2>
<p>Mesma regra do time inteiro: decisão tomada em conversa <strong>precisa virar registro</strong> — comentário no work item ou resumo no canal. Decisão técnica que só existe na memória de uma call não existe.</p>
`,
  },
  {
    slug: "dev-padroes",
    number: "08",
    sortOrder: 108,
    trailSlug: "rotina",
    title: "Padrões de código e Pull Requests",
    description:
      "O que faz um PR ser aprovado rápido aqui — e o que trava revisão.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>O princípio</h2>
<p>Código aqui é lido por muito mais gente (e por muito mais tempo) do que é escrito. Sistemas de contrato público vivem anos e trocam de mãos — o padrão existe pra proteger quem vem depois de você. Inclusive você daqui a 6 meses.</p>
<h2>Padrões que valem em qualquer repositório</h2>
<ul>
  <li><strong>Siga o padrão do arquivo</strong>, mesmo que não seja o seu favorito. Consistência local vale mais que preferência pessoal. Quer mudar o padrão? Proponha no squad, não no PR de feature.</li>
  <li><strong>Nome diz o que é</strong> — variável, método e classe em nome descritivo. Comentário explica o <em>porquê</em> que o código não consegue mostrar; nunca narra o óbvio.</li>
  <li><strong>Não deixe código morto</strong> — bloco comentado "pra garantia" vai pro lixo; o Git guarda a história.</li>
  <li><strong>Tratamento de erro é parte da feature</strong>, não enfeite. Fluxo de exceção sem tratamento é bug esperando o QA (ou pior, o cidadão) achar.</li>
</ul>
<h2>Anatomia de um PR bom</h2>
<div class="cards">
  <div class="card"><div class="card-title">Pequeno</div><div class="card-desc">Um PBI, uma preocupação. PR de 2000 linhas não é revisado — é abençoado. E benção não pega bug.</div></div>
  <div class="card"><div class="card-title">Contextualizado</div><div class="card-desc">Descrição diz o que muda, por que, e como testar. Link com o work item sempre.</div></div>
  <div class="card"><div class="card-title">Auto-revisado</div><div class="card-desc">Você leu o próprio diff antes de pedir revisão. Sobrou console.log, import morto, arquivo de config pessoal? Volta.</div></div>
  <div class="card"><div class="card-title">Build verde</div><div class="card-desc">Pedir revisão com build quebrado é pedir pra revisar duas vezes.</div></div>
</div>
<h2>O que o revisor olha (nessa ordem)</h2>
<ol>
  <li><strong>Correção</strong> — implementa os critérios de aceite? Cobre os fluxos de erro?</li>
  <li><strong>Segurança e dado</strong> — validação de entrada, permissão de acesso, nenhum dado pessoal logado à toa.</li>
  <li><strong>Legibilidade</strong> — outra pessoa mantém isso sem te ligar?</li>
  <li><strong>Padrão</strong> — consistente com o repositório?</li>
</ol>
<h2>Como receber revisão</h2>
<p>Comentário no seu PR não é ataque — é o mecanismo mais barato que existe de pegar defeito antes do cliente. O padrão de resposta é o mesmo do Cap. 01 (Como discordar bem): responda com argumento, não com tom; concorde por escrito ("feito no commit X") ou discorde propondo alternativa. Comentário ignorado sem resposta trava o PR e queima confiança.</p>
<h2>Como fazer revisão</h2>
<ul>
  <li>Priorize: revisar PR dos outros vem <strong>antes</strong> de escrever código novo. PR parado trava o fluxo do squad inteiro.</li>
  <li>Comente o problema e o caminho: <em>"isso quebra quando a lista vem vazia — vale um guard aqui"</em> ensina; "tá errado" só irrita.</li>
  <li>Separe o obrigatório do opcional: prefixe sugestões de gosto com "nit:" pra não travar merge por vírgula.</li>
</ul>
<div class="callout good"><div class="callout-label">Sinal de maturidade</div>Seu PR levou 12 comentários e você respondeu todos sem defensividade, corrigiu 9 e argumentou 3. Isso é um ótimo primeiro mês.</div>
`,
  },
  {
    slug: "dev-qualidade",
    number: "09",
    sortOrder: 109,
    trailSlug: "rotina",
    title: "Qualidade: testes, bugs e QA",
    description:
      "Como a qualidade funciona aqui: o que você testa, o que o QA testa, e o ciclo de vida do bug.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Quem testa o quê</h2>
<p>Qualidade não é departamento — é cadeia. Cada elo pega um tipo de defeito:</p>
<table>
  <tr><th>Elo</th><th>Pega</th></tr>
  <tr><td>Você, antes do PR</td><td>Erro básico: fluxo feliz quebrado, exceção não tratada, critério não implementado.</td></tr>
  <tr><td>Revisor do PR</td><td>Defeito de lógica, segurança, caso de borda que você não viu.</td></tr>
  <tr><td>QA em homologação</td><td>Comportamento contra os critérios de aceite (Test Cases), regressão, integração entre módulos.</td></tr>
  <tr><td>Cliente na validação</td><td>Nada, idealmente. Cada defeito que chega aqui custou 10x mais do que se você tivesse pegado.</td></tr>
</table>
<div class="callout"><div class="callout-label">Regra da casa</div>QA reprovar é o processo <strong>funcionando</strong>, não acusação. Bug achado em homologação é vitória do time; bug achado pelo cidadão é derrota do time. A métrica que importa é onde o defeito foi pego.</div>
<h2>O ciclo de vida do bug</h2>
<ol>
  <li><strong>QA reprova o Test Case</strong> e abre o Bug no Azure DevOps: passos de reprodução, resultado esperado × obtido, evidência (print/vídeo).</li>
  <li><strong>Você reproduz primeiro</strong>. Bug que você não reproduziu, você não entendeu. Não reproduz? Comente no bug pedindo detalhe — não devolva "não acontece aqui".</li>
  <li><strong>Corrige a causa, não o sintoma.</strong> Esconder o erro da tela não é correção.</li>
  <li><strong>Comente o que era</strong> — uma linha de causa raiz no bug ensina o time inteiro e alimenta o "Erros comuns".</li>
  <li><strong>Volta pro QA reteste.</strong> Só o QA fecha bug que o QA abriu.</li>
</ol>
<h2>Testes automatizados</h2>
<p>A régua mínima, em qualquer repositório:</p>
<ul>
  <li>Regra de negócio nova → teste cobrindo o caso principal e o de borda que te dá medo.</li>
  <li>Bug corrigido → teste que falharia com o bug. Bug que voltou duas vezes é vergonha evitável.</li>
  <li>Cobertura do módulo nunca diminui por causa do seu PR.</li>
</ul>
<p>O padrão de ferramenta e o nível de exigência variam por repositório — confirme com o dev sênior do squad qual é a régua do seu projeto.</p>
<h2>Particularidade do setor público</h2>
<p>Nossos sistemas calculam folha, benefício, ponto de servidor, prestação de contas. <strong>Erro de cálculo aqui não é bug cosmético — afeta salário e direito de gente real</strong>, e pode virar apontamento de auditoria pro cliente. Regra de cálculo tem prioridade máxima de teste, sempre com massa de dados que cubra as exceções da lei (a regra "de 3%" sempre tem um parágrafo único que ninguém leu).</p>
<div class="callout good"><div class="callout-label">Hábito que diferencia</div>Antes de dar a Task por pronta, releia os critérios de aceite do PBI um a um marcando: testei, testei, testei. Custa 5 minutos e é a diferença entre "ready for test" e "reprovado de novo".</div>
`,
  },
  {
    slug: "dev-faq",
    number: "10",
    sortOrder: 110,
    trailSlug: "crescimento",
    title: "FAQ — Primeiros 30 dias",
    description: "As perguntas que todo dev novo faz, respondidas de uma vez.",
    readTime: "Consulta livre",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Trabalho diário</h2>
<div class="faq-item"><div class="q">Não tenho acesso ao repositório / ambiente do projeto. O que faço?</div><div class="a">Peça ao dev sênior do squad já no primeiro dia — acesso demora alguns dias úteis em média e não é motivo pra ficar parado: enquanto espera, leia o README do projeto, os últimos PRs aprovados e os PBIs da sprint.</div></div>
<div class="faq-item"><div class="q">O PBI está ambíguo. Implemento minha interpretação ou pergunto?</div><div class="a">Pergunta — por escrito, no comentário do PBI, marcando o analista. Implementar interpretação própria de regra de negócio é a fonte nº 1 de retrabalho (Cap. 11). A resposta escrita vira especificação.</div></div>
<div class="faq-item"><div class="q">Quanto tempo posso ficar travado antes de pedir ajuda?</div><div class="a">Regra prática: 1-2 horas de tentativa honesta, aí pergunta no chat do squad com contexto (o que tentou, o que aconteceu). Travar meio dia em silêncio custa mais caro pro time do que a pergunta "boba".</div></div>
<div class="faq-item"><div class="q">Achei um trecho de código ruim que não é do meu PBI. Refatoro?</div><div class="a">Regra do escoteiro com freio: melhoria pequena e segura no arquivo que você já está mexendo, pode. Refatoração maior vira PBI técnico — proponha no refinamento. Não misture refactor grande com feature no mesmo PR.</div></div>
<div class="faq-item"><div class="q">Posso usar IA pra gerar código?</div><div class="a">Sim, como acelerador — nunca como entrega sem revisão. Você assina o que commita: entenda cada linha, teste, e cuidado redobrado com regra de negócio (IA inventa com confiança). E nunca cole dado real de cliente ou código proprietário em ferramenta não autorizada.</div></div>
<h2>Processo</h2>
<div class="faq-item"><div class="q">Minha estimativa estourou. Escondo correndo ou aviso?</div><div class="a">Avisa na daily, sem drama. Estimativa é hipótese, não promessa de sangue. O que queima não é estourar — é o PO descobrir no último dia da sprint.</div></div>
<div class="faq-item"><div class="q">O QA reprovou algo que "funciona na minha máquina". E agora?</div><div class="a">Homologação é o juiz, não a sua máquina. Reproduza no ambiente onde falhou. Diferença clássica: dado, configuração ou permissão que só existe lá. "Na minha máquina funciona" não fecha bug.</div></div>
<div class="faq-item"><div class="q">Posso subir algo direto pra produção se for urgente?</div><div class="a">Não por conta própria — produção de contrato público tem janela e autorização (gestor da conta). Urgência real (sistema parado) tem rito próprio de hotfix: acione o dev sênior e siga o procedimento do squad.</div></div>
<h2>Cultura</h2>
<div class="faq-item"><div class="q">Recebi muitos comentários no meu primeiro PR. Isso é ruim?</div><div class="a">É o esperado — e é investimento do revisor em você. PR de novato com zero comentário é revisor desatento, não código perfeito. Em 2-3 meses o volume cai naturalmente.</div></div>
<div class="faq-item"><div class="q">Posso discordar tecnicamente do dev sênior?</div><div class="a">Pode e deve — com argumento e antes da decisão fechada (Cap. 01, "Como discordar bem"). Depois de fechada, sustenta o combinado. Hierarquia aqui só desempata empate técnico.</div></div>
<div class="faq-item"><div class="q">É normal não entender o domínio (folha, ponto, benefício) nas primeiras semanas?</div><div class="a">Completamente. O domínio é metade do trabalho e leva meses. Use o Glossário (Cap. 03), pergunte ao analista do squad, e leia os PBIs antigos do módulo — são a melhor documentação de regra de negócio que temos.</div></div>
`,
  },
  {
    slug: "dev-erros",
    number: "11",
    sortOrder: 111,
    trailSlug: "crescimento",
    title: "Erros comuns",
    description:
      "As armadilhas que pegam quase todo dev nos primeiros 3 meses — e como evitar.",
    readTime: "6 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<div class="callout"><div class="callout-label">Como ler este capítulo</div>Os erros abaixo se repetem nos primeiros meses e foram observados em mais de um projeto. Reconhecer o sintoma cedo evita o retrabalho.</div>
<h2>1. Codar antes de entender a regra</h2>
<p><strong>Sintoma</strong>: feature "pronta" reprovada pelo QA ou pelo analista com "não é isso que a regra diz".</p>
<p><strong>Causa raiz</strong>: leu o título do PBI e deduziu o resto. Regra de negócio de setor público tem exceção em cima de exceção (a lei manda).</p>
<p><strong>Como evitar</strong>: antes de codar, releia os critérios de aceite e escreva no PBI um comentário de 3 linhas com a sua leitura da regra. Se o analista confirmar, você tem especificação; se corrigir, você economizou uma sprint.</p>
<h2>2. PR gigante</h2>
<p><strong>Sintoma</strong>: PR parado dias sem revisão, revisor pedindo "resume aí o que muda", merge com conflito gigante no fim.</p>
<p><strong>Causa raiz</strong>: juntou feature + refactor + ajuste de estilo numa branch só que viveu duas semanas.</p>
<p><strong>Como evitar</strong>: PR por preocupação, não por sprint. Se a descrição do PR precisa de "além disso, também…", já passou da hora de dividir.</p>
<h2>3. Silêncio no bloqueio</h2>
<p><strong>Sintoma</strong>: daily de segunda: "tô terminando". Daily de quinta: "tô terminando". Sexta: não tinha nem começado a parte difícil.</p>
<p><strong>Causa raiz</strong>: medo de parecer incapaz. Efeito real: o squad descobre o atraso tarde demais pra ajudar.</p>
<p><strong>Como evitar</strong>: bloqueio dito em 24h é problema do time (e o time resolve); bloqueio dito no fim da sprint é problema seu. Falar cedo é competência, não fraqueza.</p>
<h2>4. Testar só o fluxo feliz</h2>
<p><strong>Sintoma</strong>: QA reprova com dado vazio, data inválida, usuário sem permissão, servidor em situação atípica (afastado, cedido, isento…).</p>
<p><strong>Causa raiz</strong>: testou com o dado bonito que você mesmo criou.</p>
<p><strong>Como evitar</strong>: pra cada critério de aceite, pergunte "e quando NÃO?". As exceções do domínio público (competência fechada, vínculo duplo, retroativo) são onde os bugs moram.</p>
<h2>5. Resolver "rapidinho" por fora do processo</h2>
<p><strong>Sintoma</strong>: ajuste feito direto no banco de homologação, config mudada na mão, fix sem work item. Três semanas depois, ninguém sabe por que o ambiente se comporta diferente.</p>
<p><strong>Causa raiz</strong>: pressa genuína + boa intenção. O processo parece burocracia até o dia em que a auditoria (ou o bug fantasma) chega.</p>
<p><strong>Como evitar</strong>: se não tem work item e não tem registro, não aconteceu — e vai voltar pra te assombrar. O atalho de 10 minutos custa horas de arqueologia depois.</p>
<h2>6. Assumir que homologação = sua máquina</h2>
<p><strong>Sintoma</strong>: "funciona local" reprovado em homologação; horas de debate até descobrir diferença de dado, versão ou permissão.</p>
<p><strong>Causa raiz</strong>: ambiente tratado como detalhe.</p>
<p><strong>Como evitar</strong>: reproduza no ambiente onde o problema foi reportado antes de discutir. O ambiente do QA é o que conta pra aprovação; o seu é só oficina.</p>
<div class="callout good"><div class="callout-label">Boa notícia</div>Todo esse capítulo é resultado de erros que <strong>já cometemos</strong>. Você herda o aprendizado sem pagar o preço — desde que leia.</div>
`,
  },
  {
    slug: "dev-proximos",
    number: "12",
    sortOrder: 112,
    trailSlug: "crescimento",
    title: "Próximos passos",
    description:
      "Quando você já dominar o básico, por onde aprofundar. Trilhas, recursos, marcos.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Como você sabe que dominou o básico</h2>
<ul>
  <li>Seu PR médio é aprovado com poucos comentários e sem retrabalho de regra de negócio</li>
  <li>Você pega um PBI e identifica sozinho as perguntas que faltam antes de codar</li>
  <li>Bug reprovado pelo QA virou exceção, não rotina</li>
  <li>Outro dev te chama pra revisar ou pra discutir solução — você virou referência em algo</li>
</ul>
<p>Tipicamente acontece entre 4 e 8 meses de casa. Depois disso, você escolhe uma direção pra aprofundar.</p>
<h2>Trilhas de aprofundamento</h2>
<div class="cards">
  <div class="card"><div class="card-title">Especialização em domínio</div><div class="card-desc">Vire a referência de um domínio de negócio (folha, ponto, benefícios, prestação de contas). Aqui, quem entende a lei + o código é raro e valioso.</div></div>
  <div class="card"><div class="card-title">Especialização técnica</div><div class="card-desc">Profundidade em uma camada: back-end e integrações, front-end Angular, mobile, ou banco/performance. Vira quem o squad chama no caso difícil.</div></div>
  <div class="card"><div class="card-title">Caminho de dev sênior do squad</div><div class="card-desc">Arquitetura, viabilidade técnica com o analista, revisão como ofício. Menos "codar mais", mais "fazer o squad codar melhor".</div></div>
  <div class="card"><div class="card-title">Caminho de qualidade</div><div class="card-desc">Automação de testes, esteira de qualidade, cultura de teste. Ponte natural com o time de QA.</div></div>
</div>
<h2>Recursos externos sugeridos</h2>
<h3>Livros</h3>
<ul>
  <li><strong>Código Limpo</strong> (Robert C. Martin) — leia crítico: os princípios valem, o dogma não.</li>
  <li><strong>The Pragmatic Programmer</strong> (Hunt & Thomas) — o manual do ofício.</li>
  <li><strong>Refactoring</strong> (Martin Fowler) — pra melhorar código legado sem quebrá-lo, que é 70% do trabalho real.</li>
  <li><strong>Domain-Driven Design destilado</strong> (Vaughn Vernon) — vocabulário pra conversar de domínio com o analista.</li>
</ul>
<h3>Prática contínua</h3>
<ul>
  <li>Documentação oficial da sua stack (Java/Spring, Angular) — versão que o projeto usa, não a última da moda.</li>
  <li>Ler PR dos seniores do squad — de graça e no contexto real do produto.</li>
  <li>Comunidades locais e online da stack — troca rápida, mas valide contra o padrão do projeto.</li>
</ul>
<h2>Marcos da carreira aqui</h2>
<table>
  <tr><th>Tempo</th><th>Marco</th></tr>
  <tr><td>0-3 meses</td><td>Onboarding + primeiro PBI entregue passando no QA de primeira</td></tr>
  <tr><td>3-6 meses</td><td>Pega PBIs médios sem acompanhamento; revisa PR de colegas</td></tr>
  <tr><td>6-12 meses</td><td>Referência em um módulo do produto; participa de refinamento com o analista</td></tr>
  <tr><td>12-18 meses</td><td>Conduz entrega técnica de feature grande, do refinamento ao deploy</td></tr>
  <tr><td>18+ meses</td><td>Escolhe uma trilha de aprofundamento</td></tr>
</table>
`,
  },
];
