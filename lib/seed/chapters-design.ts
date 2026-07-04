import type { Chapter } from "@/lib/types";

/**
 * Trilha de onboarding da área DESIGN — capítulos de Rotina e Crescimento
 * (os de Contexto, 01-05, são compartilhados entre as áreas).
 * Espelha a estrutura da trilha de Negócios: numeração 06-12 dentro da área.
 *
 * `sortOrder` usa a faixa 206-212 (Negócios: 6-12; Dev: 106-112).
 *
 * Semeado pelo scripts/seed-trilhas-dev-design.ts (só insere, nunca
 * sobrescreve — o banco é a fonte da verdade depois que editores mexem).
 */
export const seedChaptersDesign: (Chapter & { sortOrder: number })[] = [
  {
    slug: "design-processo",
    number: "06",
    sortOrder: 206,
    trailSlug: "rotina",
    title: "O processo de design",
    description:
      "Do briefing ao handoff: onde o design entra no fluxo e o que sai de cada etapa.",
    readTime: "6 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Onde o design entra</h2>
<p>Aqui o design não é a etapa de "deixar bonito" depois que tudo foi decidido. O designer entra <strong>junto com o analista, na descoberta</strong> — porque em sistema de governo, o fluxo errado custa mais caro que a tela feia.</p>
<div class="process">
  <div class="process-step"><span class="step-num">1</span><span class="step-name">Briefing</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">2</span><span class="step-name">Discovery</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">3</span><span class="step-name">Protótipo</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">4</span><span class="step-name">Validação</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">5</span><span class="step-name">Handoff</span></div>
  <span class="process-arrow">→</span>
  <div class="process-step"><span class="step-num">6</span><span class="step-name">Acompanhamento</span></div>
</div>
<h2>01. Briefing</h2>
<p>Mesma entrada do analista (Cap. do processo de Negócios): problema declarado, quem decide, critério de pronto. Sua pergunta extra é: <strong>quem usa?</strong> Servidor de secretaria? Atendente de balcão? Cidadão no celular da fila? O usuário do setor público raramente é quem contrata — descubra os dois.</p>
<h2>02. Discovery</h2>
<p>O discovery aqui tem formato definido: um <strong>deck de Continuous Discovery</strong> com estrutura fixa que o time inteiro reconhece. As 8 telas:</p>
<ol>
  <li><strong>Capa</strong> — feature + contrato/cliente</li>
  <li><strong>Roadmap</strong> — onde essa feature está no plano</li>
  <li><strong>Descrição do caso</strong> — o problema em linguagem de negócio</li>
  <li><strong>Fluxo + personas</strong> — quem faz o quê, na ordem</li>
  <li><strong>Problem statement</strong> — o problema destilado numa frase</li>
  <li><strong>Problemas &amp; soluções</strong> — pareamento explícito</li>
  <li><strong>Hipótese</strong> — o que acreditamos e como saberemos</li>
  <li><strong>Opportunity tree</strong> — oportunidades ramificadas a partir do outcome</li>
</ol>
<div class="callout"><div class="callout-label">Por que estrutura fixa?</div>Cliente de contrato público compara entregas entre reuniões. Deck com o mesmo esqueleto sempre = cliente acha a informação sem reaprender o formato a cada feature.</div>
<h2>03. Protótipo</h2>
<p>Protótipo de discovery valida <strong>fluxo e decisão</strong>, não acabamento. As regras da casa estão no Cap. 08 — leia antes do seu primeiro protótipo, porque são contraintuitivas pra quem vem de outra cultura de design.</p>
<h2>04. Validação</h2>
<p>Protótipo na frente do usuário real (ou do cliente, quando o usuário não é acessível). O objetivo não é "aprovaram?" — é <strong>capturar onde o fluxo quebra</strong>: onde a pessoa hesitou, o que ela chamou por outro nome, que caso real não cabe no desenho. Ambiguidade descoberta aqui vira pergunta pro analista, não decisão silenciosa sua.</p>
<h2>05. Handoff</h2>
<p>Design validado vira insumo pro PBI do analista e pro dev. Handoff é o Cap. 09 — o resumo: estados completos (vazio, erro, carregando), specs no padrão do design system, e disponibilidade pra pergunta durante a sprint.</p>
<h2>06. Acompanhamento</h2>
<p>Seu trabalho não termina no handoff. Na homologação, olhe o que foi construído contra o que foi desenhado — divergência pequena agora é padrão quebrado daqui a 6 meses. Divergência combinada (limitação técnica) se registra no work item; divergência acidental se conversa com o dev antes de virar bug.</p>
<h2>Variações por tipo de cliente</h2>
<table>
  <tr><th>Tipo de cliente</th><th>Particularidade pro design</th></tr>
  <tr><td>Governo municipal</td><td>Usuário final com pouca familiaridade digital. Fluxo linear, rótulo literal, zero jargão de interface.</td></tr>
  <tr><td>Governo estadual</td><td>Múltiplos perfis e alçadas no mesmo sistema. Mapeie papéis antes de desenhar tela.</td></tr>
  <tr><td>Sistema interno</td><td>Usuário treinável e frequente. Densidade de informação pode (e deve) ser maior.</td></tr>
</table>
`,
  },
  {
    slug: "design-ferramentas",
    number: "07",
    sortOrder: 207,
    trailSlug: "rotina",
    title: "Ferramentas e identidade",
    description:
      "Figma, decks HTML, Azure DevOps pra designer — e o brand pack Citiesoft.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Stack do designer</h2>
<div class="cards">
  <div class="card"><div class="card-title">Figma</div><div class="card-desc">Telas, componentes, protótipos navegáveis. Fonte da verdade visual dos produtos.</div></div>
  <div class="card"><div class="card-title">Decks HTML</div><div class="card-desc">Apresentações de discovery e de fluxo no padrão Citiesoft — zero dependência, abrem em qualquer navegador do cliente.</div></div>
  <div class="card"><div class="card-title">Azure DevOps</div><div class="card-desc">Onde o design encontra a esteira: anexo/link no PBI, comentário nas dúvidas, validação em homologação.</div></div>
  <div class="card"><div class="card-title">Miro / Lucid</div><div class="card-desc">Jornada, mapa de fluxo, post-it de discovery. Rascunho pensante, não entrega.</div></div>
</div>
<h2>O brand pack Citiesoft</h2>
<p>Identidade aplicada de forma consistente em tudo que sai da casa:</p>
<ul>
  <li><strong>Red Hat Display</strong> — títulos e destaques.</li>
  <li><strong>Inter</strong> — texto corrido e interface.</li>
  <li><strong>Red Hat Mono</strong> — código, dado técnico, tabular quando precisa.</li>
  <li><strong>Paleta ancorada no azul Citiesoft</strong> — o azul é a cor de ação e identidade; a paleta completa com neutros e cores de estado fica na biblioteca do Figma.</li>
</ul>
<div class="callout"><div class="callout-label">Documentos formais</div>Docs Word/PDF da casa seguem o padrão próprio: H1 preto, H2 azul, timbrado oficial. Não invente variação — consistência de marca é parte da credibilidade com o cliente público.</div>
<h2>Figma: como a casa organiza</h2>
<ul>
  <li><strong>Um arquivo por produto/módulo</strong>, páginas por feature. Explorações numa página de rascunho, claramente separada do validado.</li>
  <li><strong>Use os componentes da biblioteca</strong> antes de criar novos. Componente novo se propõe pra biblioteca, não nasce solto num arquivo de feature.</li>
  <li><strong>Nomeie como o domínio nomeia</strong> — a tela é "Registro de Ponto", não "Screen 14 final v2". Dev e analista precisam achar.</li>
</ul>
<h2>Azure DevOps pra designer</h2>
<p>Você não escreve PBI, mas vive neles:</p>
<ul>
  <li>Link do Figma/protótipo vai <strong>no PBI</strong>, não só no chat. O que está fora do work item se perde.</li>
  <li>Dúvida de dev sobre a tela se responde no comentário do PBI — a resposta vira registro.</li>
  <li>Em homologação, divergência visual/de fluxo relevante vira apontamento seu no item (ou bug, se combinado com o QA do squad).</li>
</ul>
<div class="callout warn"><div class="callout-label">LGPD no material de design</div>Print de tela com dado real de servidor/cidadão não entra em protótipo, deck ou portfólio interno. Massa de exemplo é sempre fictícia — e verossímil (Cap. 08).</div>
`,
  },
  {
    slug: "design-prototipos",
    number: "08",
    sortOrder: 208,
    trailSlug: "rotina",
    title: "Protótipos de discovery: as regras da casa",
    description:
      "Protótipo valida fluxo, não cálculo — e nunca decide ambiguidade no lugar do usuário.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>O que um protótipo de discovery é (e não é)</h2>
<p>Protótipo de discovery existe pra responder <strong>uma pergunta</strong>: o fluxo desenhado sobrevive ao contato com o usuário real? Ele não é espec visual final, não é demo de venda e não é compromisso de escopo.</p>
<p>Dessa definição saem as três regras da casa. Elas são contraintuitivas — leia com atenção.</p>
<h2>Regra 1 — Protótipo valida fluxo, não cálculo</h2>
<p>Em protótipo de discovery, <strong>valores monetários e totalizações somem</strong> — fica apenas o valor de referência essencial do documento no cabeçalho (ex.: o valor da NF numa tela de despesa). Somatórios, saldos, valores de contrato: fora.</p>
<div class="callout"><div class="callout-label">Por quê</div>Número na tela sequestra a reunião. O cliente para de validar o fluxo e começa a conferir a conta — e a conta do protótipo é fictícia por definição. Discovery valida caminho; cálculo se valida em homologação, com regra implementada de verdade.</div>
<h2>Regra 2 — Nunca pressupor: ambiguidade aparece, não se resolve sozinha</h2>
<p>Quando o caso real tem ambiguidade (dois vínculos possíveis, duas classificações plausíveis, documento que pode pertencer a dois contratos), o protótipo <strong>não auto-resolve nem no caso feliz</strong>. A tela expõe a ambiguidade e pede a decisão do usuário.</p>
<div class="callout bad"><div class="callout-label">Errado</div>O protótipo "adivinha" a opção mais provável e segue o fluxo liso, porque fica elegante na demo.</div>
<div class="callout good"><div class="callout-label">Certo</div>O protótipo para e pergunta — porque é exatamente essa decisão que queremos ver o usuário tomar. A hesitação dele é o dado do discovery.</div>
<p>Sistema que decide sozinho no lugar do servidor público é sistema que produz apontamento de auditoria. O desenho reflete isso desde o protótipo.</p>
<h2>Regra 3 — Dado fictício, mas verossímil</h2>
<ul>
  <li>Nome, CPF, matrícula: sempre fictícios (LGPD, sem exceção).</li>
  <li>Mas o <strong>caso</strong> é real: use as situações que o analista mapeou no discovery, inclusive as feias (competência retroativa, vínculo duplo, documento sem classificação). Protótipo que só mostra o caso bonito não descobre nada.</li>
</ul>
<h2>Forma: o suficiente pra ser levado a sério</h2>
<ul>
  <li>Identidade Citiesoft aplicada (Cap. 07) — o cliente reconhece a casa.</li>
  <li>Fidelidade média: layout e hierarquia reais, sem polir microinteração. Polimento é depois da validação.</li>
  <li>Navegável no navegador do cliente sem instalação — deck HTML ou Figma em modo apresentação.</li>
</ul>
<h2>Apresentando o protótipo</h2>
<ol>
  <li>Enquadre: <em>"isto valida o fluxo; valores e acabamento vêm depois"</em> — dito em voz alta, sempre. Poupa 20 minutos de conferência de conta.</li>
  <li>Deixe o usuário dirigir. Você observa onde ele trava; quem apresenta demais valida de menos.</li>
  <li>Registre as decisões e hesitações no material do discovery — isso é insumo direto do PBI do analista.</li>
</ol>
<div class="callout good"><div class="callout-label">Sinal de protótipo bem calibrado</div>Na validação, o cliente discute o processo dele ("mas quem classifica isso hoje é outro setor…") em vez de discutir a cor do botão. Se a conversa foi pra regra de negócio, o protótipo cumpriu o papel.</div>
`,
  },
  {
    slug: "design-handoff",
    number: "09",
    sortOrder: 209,
    trailSlug: "rotina",
    title: "Handoff: do design ao dev",
    description:
      "Como entregar design que vira código sem telefone sem fio — estados, specs e acompanhamento.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>O princípio</h2>
<p>O dev não implementa a tela que você desenhou — implementa a tela que <strong>entendeu</strong> do que você entregou. Handoff bom fecha esse vão. A medida de sucesso: a feature sai como desenhada <em>sem</em> você precisar refazer nada em homologação.</p>
<h2>O checklist do handoff</h2>
<h3>1. Todos os estados, não só o feliz</h3>
<p>A tela "pronta" com um estado só está 40% pronta. Entregue:</p>
<ul>
  <li><strong>Vazio</strong> — primeira vez, sem dado. O que a pessoa vê e o que a chama pra ação?</li>
  <li><strong>Carregando</strong> — sistemas de governo consultam bases lentas; o estado de espera é rotina, não exceção.</li>
  <li><strong>Erro</strong> — validação de campo, falha de integração, permissão negada. Mensagem em linguagem do usuário, com saída ("o que eu faço agora?").</li>
  <li><strong>Cheio demais</strong> — a tabela com 400 linhas, o nome com 80 caracteres. Dado público é volumoso e feio; teste o layout contra ele.</li>
</ul>
<h3>2. Comportamento explícito</h3>
<ul>
  <li>O que cada botão faz, inclusive quando desabilitado e por quê.</li>
  <li>Regras de exibição: quem vê o quê por perfil/alçada — em sistema de governo, quase toda tela tem variação por papel.</li>
  <li>Validações de campo com as mensagens escritas por extenso (o dev não deve redigir microcopy na hora).</li>
</ul>
<h3>3. Specs no padrão da biblioteca</h3>
<p>Componente da biblioteca dispensa spec — aponte o componente. Spec detalhada só pro que é novo. Se você está medindo pixel de botão padrão, algo errou antes: ou o componente não está na biblioteca, ou você não o usou.</p>
<h2>A conversa de handoff</h2>
<p>Handoff não é link jogado no chat. É <strong>15-30 min com o dev</strong> (e o analista junto, idealmente no refinamento do PBI):</p>
<ol>
  <li>Percorra o fluxo na ordem do usuário, não tela por tela solta.</li>
  <li>Aponte onde mora a complexidade escondida (o estado de erro raro, a variação por perfil).</li>
  <li>Combine o canal de dúvida: comentário no PBI, resposta sua em até 1 dia útil durante a sprint.</li>
</ol>
<div class="callout warn"><div class="callout-label">Armadilha clássica</div>Design entregue e designer que some. Dúvida não respondida em horas vira decisão do dev — e a decisão do dev sob pressão de sprint raramente é a que você teria tomado.</div>
<h2>Acessibilidade: régua mínima</h2>
<p>Sistema público é usado por <strong>todo mundo</strong> — inclusive quem enxerga pouco, navega por teclado ou usa o celular de 5 anos atrás na rede da repartição. Régua mínima em toda entrega:</p>
<ul>
  <li>Contraste de texto adequado (WCAG AA) — cinza-claro-elegante em cima de branco reprova.</li>
  <li>Alvo de toque confortável e foco visível pra navegação por teclado.</li>
  <li>Informação nunca só por cor (o vermelho/verde do daltônico é a mesma cor).</li>
  <li>Rótulo literal em vez de ícone órfão — o servidor não adivinha hambúrguer.</li>
</ul>
<h2>Depois do handoff</h2>
<p>Valide em homologação contra o desenho (Cap. 06, etapa 6). Divergência é conversa, não emboscada: primeiro entenda se foi limitação técnica combinada ou desvio acidental — e registre o desfecho no work item.</p>
`,
  },
  {
    slug: "design-faq",
    number: "10",
    sortOrder: 210,
    trailSlug: "crescimento",
    title: "FAQ — Primeiros 30 dias",
    description: "As perguntas que todo designer novo faz, respondidas de uma vez.",
    readTime: "Consulta livre",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Trabalho diário</h2>
<div class="faq-item"><div class="q">Onde encontro a biblioteca de componentes e o brand pack?</div><div class="a">Na biblioteca do Figma da Citiesoft (peça acesso no primeiro dia) e no material de identidade no SharePoint. Se algo parecer desatualizado ou faltar, pergunte antes de criar por fora — pode existir e você não achou.</div></div>
<div class="faq-item"><div class="q">O cliente pediu uma tela "igual à do sistema antigo". Copio?</div><div class="a">Entenda antes o que ele quer preservar: quase sempre é o <em>hábito</em> (onde clica, a ordem dos campos), não o layout. Preserve o fluxo mental, melhore a forma — e valide com protótipo em vez de discutir opinião.</div></div>
<div class="faq-item"><div class="q">Tenho que esperar o PBI pronto pra começar a desenhar?</div><div class="a">Não — o ideal é o contrário: você entra no discovery junto com o analista e o desenho alimenta o PBI. Se chegou demanda "desenha aí que o PBI já existe", leia o PBI, mas confirme o problema com o analista antes de abrir o Figma.</div></div>
<div class="faq-item"><div class="q">Quanta fidelidade um protótipo de discovery precisa ter?</div><div class="a">Média: hierarquia e fluxo reais, identidade aplicada, zero polimento de microinteração. E as 3 regras do Cap. 08 valem sempre — sem valores calculados, sem auto-resolver ambiguidade, dado fictício verossímil.</div></div>
<div class="faq-item"><div class="q">Posso usar IA pra gerar tela/ilustração/copy?</div><div class="a">Como exploração, sim. Como entrega, só depois do seu crivo: componente da biblioteca no lugar do inventado, texto no vocabulário do domínio, e nada de dado real em prompt. Você assina o que entrega.</div></div>
<h2>Processo</h2>
<div class="faq-item"><div class="q">O dev implementou diferente do desenho. Abro bug?</div><div class="a">Primeiro conversa: foi limitação técnica combinada ou desvio acidental? Acidental e relevante → aponta no work item (ou bug, conforme o combinado do squad). Combinado → registre a decisão. Emboscada em homologação queima a ponte que você mais precisa.</div></div>
<div class="faq-item"><div class="q">O cliente quer aprovar cada tela. Reunião pra tudo?</div><div class="a">Não. Agrupe validações por fluxo (não por tela) e use o rito que já existe: o deck de discovery e as reuniões de alinhamento do contrato. Aprovação de tela solta vira microgestão do cliente sobre o Figma.</div></div>
<div class="faq-item"><div class="q">Me pediram "só um ajustezinho visual" direto no chat. Faço?</div><div class="a">Ajuste real de 5 minutos, faça — e registre no work item correspondente. Se não tem work item, peça pro solicitante alinhar com o PO: demanda que entra por fora da esteira é escopo invisível, e escopo invisível estoura sprint.</div></div>
<h2>Cultura</h2>
<div class="faq-item"><div class="q">Sou o único designer no squad. Quem revisa meu trabalho?</div><div class="a">Par de outro squad pra crítica de design (peça — é bem-visto), analista pro conteúdo/regra, dev pra viabilidade. Revisão de design aqui é como revisão de código: ninguém entrega sem segundo olhar.</div></div>
<div class="faq-item"><div class="q">Design "bonito" parece valer menos que prazo aqui. É isso mesmo?</div><div class="a">O que vale aqui é <em>fluxo que funciona pro servidor e pro cidadão</em> — estética serve a isso. Feature usável e sóbria no prazo vale mais que a linda atrasada. Com o tempo você entrega as duas coisas.</div></div>
<div class="faq-item"><div class="q">É normal não entender o domínio (folha, ponto, prestação de contas) no começo?</div><div class="a">Sim, e é metade do ofício. Use o Glossário (Cap. 03), sente com o analista, e peça pra assistir uma validação com usuário real o quanto antes — uma sessão ensina mais que uma semana de leitura.</div></div>
`,
  },
  {
    slug: "design-erros",
    number: "11",
    sortOrder: 211,
    trailSlug: "crescimento",
    title: "Erros comuns",
    description:
      "As armadilhas que pegam quase todo designer nos primeiros 3 meses — e como evitar.",
    readTime: "6 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<div class="callout"><div class="callout-label">Como ler este capítulo</div>Os erros abaixo se repetem nos primeiros meses e foram observados em mais de um contrato. Reconhecer o sintoma cedo evita o retrabalho.</div>
<h2>1. Desenhar a solução antes de entender o processo</h2>
<p><strong>Sintoma</strong>: tela linda que o cliente olha e diz "mas não é assim que funciona aqui".</p>
<p><strong>Causa raiz</strong>: partiu do padrão de mercado ("todo dashboard tem card de KPI") sem mapear o processo real do órgão — que tem alçada, portaria e exceção que nenhum benchmark cobre.</p>
<p><strong>Como evitar</strong>: antes de abrir o Figma, consiga descrever o processo atual em 5 frases, com os papéis certos. Não consegue? Volta pro discovery com o analista.</p>
<h2>2. Protótipo que decide demais</h2>
<p><strong>Sintoma</strong>: demo fluida, cliente encantado — e três ambiguidades críticas do processo passaram batidas porque o protótipo as resolveu sozinho.</p>
<p><strong>Causa raiz</strong>: otimizar a demo pra elegância em vez de otimizar pro aprendizado. É o erro que a Regra 2 do Cap. 08 existe pra impedir.</p>
<p><strong>Como evitar</strong>: liste as ambiguidades conhecidas do caso antes de prototipar e garanta que cada uma <em>aparece</em> no fluxo pedindo decisão do usuário.</p>
<h2>3. Validar com quem contrata, não com quem usa</h2>
<p><strong>Sintoma</strong>: secretário aprovou tudo; três meses depois, o servidor do balcão não consegue operar a tela.</p>
<p><strong>Causa raiz</strong>: no setor público, quem assina raramente é quem opera — e o acesso ao usuário real dá trabalho de conseguir.</p>
<p><strong>Como evitar</strong>: peça o acesso cedo, via gestor da conta. Uma sessão de 30 min com um atendente real vale mais que três reuniões de aprovação com a chefia.</p>
<h2>4. Esquecer os estados feios</h2>
<p><strong>Sintoma</strong>: em homologação, a tabela com 400 protocolos quebra o layout; a mensagem de erro da integração aparece em juridiquês do banco de dados.</p>
<p><strong>Causa raiz</strong>: desenhou com 5 linhas de dado bonito e nenhum estado de erro (Cap. 09, checklist).</p>
<p><strong>Como evitar</strong>: pra toda tela, os 4 estados: vazio, carregando, erro, cheio demais. Dado público é volumoso, antigo e cheio de exceção — desenhe contra ele.</p>
<h2>5. Handoff por link e silêncio</h2>
<p><strong>Sintoma</strong>: a feature sai 70% parecida com o desenho, e as diferenças são exatamente as partes difíceis.</p>
<p><strong>Causa raiz</strong>: link do Figma jogado no chat, sem conversa, sem estados, sem canal de dúvida. O dev decidiu sozinho o que faltava.</p>
<p><strong>Como evitar</strong>: o rito do Cap. 09 — conversa de handoff, estados completos, dúvida respondida em 1 dia útil durante a sprint.</p>
<h2>6. Brigar com a esteira</h2>
<p><strong>Sintoma</strong>: seu redesign "ideal" do módulo inteiro engavetado; frustração dos dois lados.</p>
<p><strong>Causa raiz</strong>: propor a revolução fora do rito — sem PBI, sem custo estimado, competindo com o backlog contratado.</p>
<p><strong>Como evitar</strong>: melhoria grande entra como proposta no rito do time (com o PO e o analista), fatiada em entregas que cabem em sprint. A esteira não é inimiga do bom design — é o único caminho dele até produção.</p>
<div class="callout good"><div class="callout-label">Boa notícia</div>Todo esse capítulo é resultado de erros que <strong>já cometemos</strong>. Você herda o aprendizado sem pagar o preço — desde que leia.</div>
`,
  },
  {
    slug: "design-proximos",
    number: "12",
    sortOrder: 212,
    trailSlug: "crescimento",
    title: "Próximos passos",
    description:
      "Quando você já dominar o básico, por onde aprofundar. Trilhas, recursos, marcos.",
    readTime: "5 min de leitura",
    updatedAt: "02/07/2026",
    bodyHtml: `
<h2>Como você sabe que dominou o básico</h2>
<ul>
  <li>Seu protótipo de discovery gera discussão de regra de negócio, não de cor de botão</li>
  <li>Seu handoff atravessa a sprint sem retrabalho de estado esquecido</li>
  <li>Você antecipa a ambiguidade do processo antes do analista apontar</li>
  <li>Dev ou analista te chama pra pensar o problema junto — você virou referência em algo</li>
</ul>
<p>Tipicamente acontece entre 4 e 8 meses de casa. Depois disso, você escolhe uma direção pra aprofundar.</p>
<h2>Trilhas de aprofundamento</h2>
<div class="cards">
  <div class="card"><div class="card-title">Especialização em domínio</div><div class="card-desc">Vire referência de design de um domínio (folha, ponto, benefícios, prestação de contas). Designer que entende a regra desenha o que o dev consegue construir e o auditor aceita.</div></div>
  <div class="card"><div class="card-title">Design system</div><div class="card-desc">Dono da biblioteca: componentes, tokens, documentação, governança de contribuição. Multiplica o time inteiro.</div></div>
  <div class="card"><div class="card-title">Pesquisa e discovery</div><div class="card-desc">Profundidade em entrevista, teste de usabilidade e síntese. Par natural do analista de negócios no front do discovery.</div></div>
  <div class="card"><div class="card-title">Caminho de produto</div><div class="card-desc">Migração pra PO/PM com a vantagem rara de saber materializar hipótese em protótipo testável.</div></div>
</div>
<h2>Recursos externos sugeridos</h2>
<h3>Livros</h3>
<ul>
  <li><strong>Continuous Discovery Habits</strong> (Teresa Torres) — a base do nosso formato de discovery, direto da fonte.</li>
  <li><strong>Não Me Faça Pensar</strong> (Steve Krug) — usabilidade essencial, leitura de um fim de semana.</li>
  <li><strong>The Design of Everyday Things</strong> (Don Norman) — os fundamentos que não envelhecem.</li>
  <li><strong>Forms that Work</strong> (Jarrett &amp; Gaffney) — sistema de governo é 80% formulário; este livro é sobre exatamente isso.</li>
</ul>
<h3>Referências de setor público</h3>
<ul>
  <li><strong>Design System do gov.br</strong> — padrões e componentes do governo federal brasileiro; referência obrigatória do nosso contexto.</li>
  <li><strong>GOV.UK Design System</strong> — a referência mundial de design de serviço público; os "patterns" valem ouro.</li>
  <li><strong>WCAG / eMAG</strong> — acessibilidade: a régua internacional e o modelo brasileiro pra governo.</li>
</ul>
<h3>Comunidades</h3>
<ul>
  <li>Comunidades brasileiras de UX/produto (encontros locais e grupos online) — troca rápida; valide contra o nosso contexto de contrato público.</li>
</ul>
<h2>Marcos da carreira aqui</h2>
<table>
  <tr><th>Tempo</th><th>Marco</th></tr>
  <tr><td>0-3 meses</td><td>Onboarding + primeiro protótipo de discovery validado com usuário real</td></tr>
  <tr><td>3-6 meses</td><td>Conduz validação com cliente sem par; handoff sem retrabalho de estados</td></tr>
  <tr><td>6-12 meses</td><td>Referência de design de um módulo; contribui componente pra biblioteca</td></tr>
  <tr><td>12-18 meses</td><td>Conduz o design de uma feature grande, do discovery ao acompanhamento</td></tr>
  <tr><td>18+ meses</td><td>Escolhe uma trilha de aprofundamento</td></tr>
</table>
`,
  },
];
