import type { Chapter } from "@/lib/types";

/**
 * Conteúdo inicial migrado do protótipo HTML (reference/prototype.html).
 * Serve como seed do banco e como fonte de leitura enquanto a camada de
 * dados (Postgres) não está conectada. `bodyHtml` usa as classes do design
 * system (.callout, .cards, .glossary, .process, .faq) renderizadas por
 * globals.css dentro de .chapter-body.
 */
export const seedChapters: Chapter[] = [
  {
    slug: "cultura",
    number: "01",
    trailSlug: "contexto",
    title: "Cultura Citiesoft",
    description:
      "O jeito do time, valores tácitos, o que a gente prioriza quando precisa escolher.",
    readTime: "5 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>O que a gente prioriza</h2>
<p>Antes de qualquer processo ou ferramenta, três coisas guiam decisão aqui:</p>
<div class="cards">
  <div class="card"><div class="card-title">Clareza &gt; volume</div><div class="card-desc">Vale mais um artefato curto e direto do que um documento de 20 páginas que ninguém lê.</div></div>
  <div class="card"><div class="card-title">Contexto do cliente</div><div class="card-desc">Trabalhamos muito com setor público. Decisões sem entender o contexto do edital, do servidor e do cidadão dão errado.</div></div>
  <div class="card"><div class="card-title">Decisão com dado</div><div class="card-desc">Achismo é ponto de partida, nunca de chegada. Antes de propor solução, busque pelo menos uma evidência.</div></div>
</div>
<h2>Os valores oficiais — e o que querem dizer na prática</h2>
<p>No papel, a Citiesoft tem quatro valores. Aqui é o que cada um significa na sua mesa:</p>
<div class="cards">
  <div class="card"><div class="card-title">Inovação</div><div class="card-desc">Propor o jeito melhor, não só o jeito conhecido.</div></div>
  <div class="card"><div class="card-title">Transparência</div><div class="card-desc">Decisão e impedimento ditos cedo e por escrito.</div></div>
  <div class="card"><div class="card-title">Excelência</div><div class="card-desc">Artefato que o cliente entende e o dev consegue executar.</div></div>
  <div class="card"><div class="card-title">Compromisso</div><div class="card-desc">Sustentar o combinado — com o time e com o cidadão que usa o que entregamos.</div></div>
</div>
<p>A missão que orienta tudo: <em>desenvolver ferramentas digitais intuitivas que elevem a qualidade dos serviços públicos</em> — por isso o contexto do cliente público pesa tanto por aqui.</p>
<h2>Como o time toma decisões</h2>
<p>A maioria das decisões técnicas é tomada <strong>em par</strong> — analista + dev sênior, ou analista + PO. Decisões de escopo passam pelo gestor da conta. Decisões de processo interno são feitas em retro mensal.</p>
<div class="callout"><div class="callout-label">Princípio</div>Discorde antes da decisão. Depois de fechada, todo mundo sustenta o combinado — mesmo quem era contra.</div>
<h2>Como discordar bem</h2>
<p>Discordar é esperado. Discordar com mau jeito quebra confiança. O padrão é:</p>
<ol>
  <li>Pergunte o motivo antes de criticar (<em>"O que te levou a propor isso?"</em>).</li>
  <li>Apresente sua leitura com evidência, não com tom.</li>
  <li>Proponha uma alternativa, não só um veto.</li>
  <li>Se o desacordo persistir, escale o caso para um terceiro.</li>
</ol>
<h2>O que NÃO acontece aqui</h2>
<p>Algumas práticas comuns em outros lugares são <strong>explicitamente evitadas</strong>:</p>
<ul>
  <li>"Manda pro cliente o que eles pediram" sem questionar — analista que vira escriba é desperdício.</li>
  <li>Reuniões longas sem agenda escrita.</li>
  <li>Decisão por hierarquia ("o chefe disse"). Hierarquia entra só em empate técnico.</li>
  <li>Documentação por documentação. Se não vai ser lido, não escreve.</li>
</ul>
<div class="callout good"><div class="callout-label">Sinal de cultura saudável</div>Você ouve um analista júnior discordando de um sênior numa reunião — e o sênior agradecendo. Acontece toda semana.</div>
`,
  },
  {
    slug: "quem-e-quem",
    number: "02",
    trailSlug: "contexto",
    title: "Quem é quem",
    description:
      "Organograma mínimo do time, papéis, e a pessoa certa pra cada tipo de dúvida.",
    readTime: "4 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Estrutura mínima do time</h2>
<p>O time se organiza em <strong>squads</strong> por cliente ou contrato. Cada squad tem:</p>
<div class="cards">
  <div class="card"><div class="card-title">Gestor da conta</div><div class="card-desc">Ponto único com o cliente. Decisões de escopo, prazo e financeiro.</div></div>
  <div class="card"><div class="card-title">Analista de negócio</div><div class="card-desc">Você. Descobre, escreve, valida, refina, entrega artefato.</div></div>
  <div class="card"><div class="card-title">PO interno</div><div class="card-desc">Prioriza o backlog dentro do escopo já fechado.</div></div>
  <div class="card"><div class="card-title">Dev sênior técnico</div><div class="card-desc">Valida viabilidade técnica antes de mandar o artefato pra entrega.</div></div>
</div>
<h2>Pra cada coisa, fala com…</h2>
<table>
  <tr><th>Pra…</th><th>Procura</th></tr>
  <tr><td>Entender o contrato / escopo macro</td><td>Gestor da conta</td></tr>
  <tr><td>Prioridade do que entra no sprint</td><td>PO interno</td></tr>
  <tr><td>Viabilidade técnica da feature</td><td>Dev sênior do squad</td></tr>
  <tr><td>Revisar artefato antes do PO ver</td><td>Outro analista do squad (par)</td></tr>
  <tr><td>Política interna Citiesoft (férias, RH, etc.)</td><td>Gestor de pessoas</td></tr>
  <tr><td>Histórico do cliente / contexto político</td><td>Gestor da conta</td></tr>
  <tr><td>Dúvida sobre Azure DevOps</td><td>PO interno ou qualquer dev</td></tr>
</table>
<h2>Mentoria pareada</h2>
<p>Todo entrante novo é pareado com um <strong>analista-mentor</strong> nos primeiros 60 dias. O mentor:</p>
<ul>
  <li>Faz reunião semanal de 30 min ("retrô individual")</li>
  <li>Revisa pelo menos 1 artefato seu por semana antes do PO</li>
  <li>Te apresenta às pessoas-chave do squad e dos clientes</li>
  <li>Está disponível pra perguntas via Teams direto (sem cerimônia)</li>
</ul>
<div class="callout"><div class="callout-label">Como acionar o mentor</div>Manda mensagem direta no Teams. Não precisa marcar reunião pra dúvida simples — pergunta vale como ferramenta de aprendizado.</div>
<h2>Como pedir ajuda sem culpa</h2>
<p>Aqui, pedir ajuda <strong>não é sinal de fraqueza</strong>. É sinal de que você está economizando o tempo do time evitando refação. Faça antes:</p>
<ol>
  <li>Tente sozinho por uns 15-20 min.</li>
  <li>Anote exatamente onde travou e o que já tentou.</li>
  <li>Pergunte com contexto: "Estou tentando X, esperava Y, mas saiu Z. Já chequei A e B."</li>
</ol>
<p>Quem fica travado em silêncio por horas é mais custoso que quem pergunta cedo. Esse é o jeito da casa.</p>
`,
  },
  {
    slug: "glossario",
    number: "03",
    trailSlug: "contexto",
    title: "Glossário",
    description:
      "Termos do domínio, siglas, jargão do cliente, jargão Citiesoft. Consulta rápida.",
    readTime: "Consulta livre",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Termos do setor público</h2>
<div class="glossary">
  <div class="glossary-item"><div class="glossary-term">Edital</div><div class="glossary-def">Documento que define escopo, regras e critérios de uma licitação pública. Onde o projeto começa, formalmente.</div></div>
  <div class="glossary-item"><div class="glossary-term">Termo de Referência (TR)</div><div class="glossary-def">Detalhamento técnico dentro do edital. Define o "o que" da contratação. O analista lê isto antes de tudo.</div></div>
  <div class="glossary-item"><div class="glossary-term">Ata de Registro de Preços (ARP)</div><div class="glossary-def">Documento que vincula fornecedor e órgão a preços e serviços por um período. Define o que pode ser comprado e a que preço.</div></div>
  <div class="glossary-item"><div class="glossary-term">LRF</div><div class="glossary-def">Lei de Responsabilidade Fiscal. Define limites de gasto público — afeta prazos de contratação e empenho.</div></div>
  <div class="glossary-item"><div class="glossary-term">Empenho</div><div class="glossary-def">Reserva orçamentária prévia ao gasto público. Sem empenho, contrato não anda — entender quando o empenho sai define cronograma.</div></div>
  <div class="glossary-item"><div class="glossary-term">TCE / TCU</div><div class="glossary-def">Tribunal de Contas Estadual / da União. Fiscalizam o gasto público. Auditam o que a gente entrega indiretamente.</div></div>
  <div class="glossary-item"><div class="glossary-term">LGPD</div><div class="glossary-def">Lei Geral de Proteção de Dados (Lei 13.709/2018). Rege como tratamos dado pessoal de cliente, servidor e cidadão — finalidade, necessidade, segurança e transparência. Afeta discovery e armazenamento direto.</div></div>
  <div class="glossary-item"><div class="glossary-term">CLT</div><div class="glossary-def">Consolidação das Leis do Trabalho. Base da jornada, horas extras e direitos do colaborador. Detalhes no Manual de Conduta.</div></div>
  <div class="glossary-item"><div class="glossary-term">Propriedade Intelectual</div><div class="glossary-def">Todo código, doc ou solução feito no vínculo pertence à Citiesoft (Lei 9.609/98). Não reaproveite artefato de cliente fora do projeto.</div></div>
</div>
<h2>Termos técnicos / produto</h2>
<div class="glossary">
  <div class="glossary-item"><div class="glossary-term">PBI (Product Backlog Item)</div><div class="glossary-def">Item do backlog no Azure DevOps. Unidade mínima de trabalho. O analista escreve, o dev implementa.</div></div>
  <div class="glossary-item"><div class="glossary-term">BRD (Business Requirements Document)</div><div class="glossary-def">Documento mais formal de requisitos. Usado quando o cliente exige doc longo pra aprovação interna.</div></div>
  <div class="glossary-item"><div class="glossary-term">BPMN</div><div class="glossary-def">Business Process Model and Notation. Notação padrão pra desenhar processos de negócio. Usada quando o processo É o produto.</div></div>
  <div class="glossary-item"><div class="glossary-term">DoR / DoD</div><div class="glossary-def">Definition of Ready / Definition of Done. Critérios pra um PBI entrar no sprint (DoR) ou sair (DoD).</div></div>
  <div class="glossary-item"><div class="glossary-term">Critério de aceite</div><div class="glossary-def">Condição mensurável que define "está pronto". Padrão: Dado X · Quando Y · Então Z.</div></div>
</div>
<h2>Jargão Citiesoft</h2>
<div class="glossary">
  <div class="glossary-item"><div class="glossary-term">Squad</div><div class="glossary-def">Time alocado a um cliente ou contrato. Pode mudar de configuração trimestralmente.</div></div>
  <div class="glossary-item"><div class="glossary-term">Retrô individual</div><div class="glossary-def">Reunião semanal de 30 min entre o analista e o mentor. Espaço informal pra desabafar e calibrar.</div></div>
  <div class="glossary-item"><div class="glossary-term">Par de revisão</div><div class="glossary-def">Outro analista que olha seu artefato antes do PO. Padrão obrigatório nos primeiros 90 dias.</div></div>
  <div class="glossary-item"><div class="glossary-term">Alpha de campo</div><div class="glossary-def">Quando o analista vai presencialmente ao cliente acompanhar uso da feature por 1 dia. Geralmente acontece pós-entrega de algo crítico.</div></div>
</div>
`,
  },
  {
    slug: "conduta",
    number: "04",
    trailSlug: "contexto",
    title: "Conduta e bem-estar",
    description:
      "O resumo prático de conduta, sigilo, bem-estar e direitos do dia a dia — com a fonte oficial no Manual de Conduta da Citiesoft.",
    readTime: "5 min de leitura",
    updatedAt: "01/06/2026",
    bodyHtml: `
<div class="callout"><div class="callout-label">Fonte oficial</div>Este capítulo é o <strong>resumo prático</strong> pro seu dia a dia. As regras completas, formais e com peso legal estão no <a href="/manual-de-conduta-citiesoft.pdf" target="_blank" rel="noopener"><strong>Manual de Conduta Citiesoft</strong></a> (mantido pelo RH). Em caso de conflito, vale o Manual — e você assina o Termo de Recebimento dele no onboarding.</div>
<h2>Como a gente espera que você se porte</h2>
<p>Nada de surpreendente — é o que sustenta a confiança no time:</p>
<ul>
  <li>Trate colegas, clientes e parceiros com <strong>cordialidade e respeito</strong>.</li>
  <li>Cumpra prazos com proatividade e <strong>comunique impedimentos cedo</strong> — não na véspera.</li>
  <li>Conduta íntegra e transparente em toda relação profissional.</li>
  <li>Espírito de equipe: compartilhe conhecimento, não acumule.</li>
  <li>Represente a Citiesoft com profissionalismo em eventos e com o cliente.</li>
</ul>
<h2>O que não passa</h2>
<div class="callout bad"><div class="callout-label">Conduta vedada</div>Assédio (moral ou sexual) e qualquer violência ou intimidação · linguagem ofensiva ou discriminatória · desvio ou apropriação de ativos, informações ou propriedade intelectual · divulgação não autorizada de dados de clientes ou projetos · falsificação de documentos ou relatórios · conflito de interesses não declarado. Isso pode levar a medida disciplinar, incluindo justa causa — detalhes no Manual.</div>
<h2>Sigilo: você lida com dado público sensível</h2>
<p>Como analista, você acessa contexto de órgãos, servidores e cidadãos. Trate tudo como confidencial:</p>
<ul>
  <li>Não divulgue informações de projetos, clientes ou estratégias — nem em redes sociais pessoais.</li>
  <li>Não fale em nome da Citiesoft sem autorização formal.</li>
  <li>Senha é sua: não compartilhe e reporte qualquer falha de segurança à TI.</li>
</ul>
<div class="callout"><div class="callout-label">Conecta com</div>É o mesmo cuidado de LGPD do discovery (Cap. 06): pausar gravação sensível, guardar documento só em sistema autorizado.</div>
<h2>Trabalho remoto</h2>
<p>A Citiesoft permite home office. O combinado é simples:</p>
<div class="cards">
  <div class="card"><div class="card-title">Disponível nos horários</div><div class="card-desc">Esteja acessível nas janelas combinadas com a equipe.</div></div>
  <div class="card"><div class="card-title">Canais oficiais</div><div class="card-desc">Comunicação ativa pelo Teams e ferramentas do squad.</div></div>
  <div class="card"><div class="card-title">Prazos valem igual</div><div class="card-desc">Entrega dentro do combinado, presencial ou não.</div></div>
  <div class="card"><div class="card-title">Sigilo em casa</div><div class="card-desc">O ambiente doméstico não relaxa a responsabilidade sobre os dados.</div></div>
</div>
<h2>Vestimenta</h2>
<p>Código <strong>casual profissional</strong> no dia a dia. Em reunião com cliente ou evento oficial, apresentação formal — ou conforme orientação do gestor.</p>
<h2>Saúde mental e carga de trabalho</h2>
<p>A empresa trata bem-estar como parte do trabalho, não como detalhe:</p>
<ul>
  <li>Passando por dificuldade? Fale com seu gestor ou com o RH — tem canal de escuta.</li>
  <li><strong>Hora extra recorrente é sinal de processo quebrado</strong>, não de dedicação. Leve ao mentor.</li>
  <li>A Citiesoft não tolera pressão abusiva nem metas desumanas.</li>
  <li>Faça pausas regulares (ergonomia/LER-DORT) e peça ajustes na estação de trabalho à TI ou à infra.</li>
</ul>
<h2>Assédio: tolerância zero</h2>
<div class="callout warn"><div class="callout-label">Canal de denúncia</div>Quem sofrer ou presenciar assédio deve <strong>reportar ao RH</strong>. As denúncias são tratadas com sigilo e seriedade, e <strong>retaliação contra quem denuncia é proibida</strong>. O descumprimento pode resultar em demissão por justa causa.</div>
<h2>Horas, intervalos e direitos</h2>
<p>Sua jornada segue a CLT (até 8h por dia). Hora extra, banco de horas, intervalos e demais direitos estão detalhados no Manual — não reproduzo as tabelas aqui pra não correr risco de ficar desatualizado.</p>
<div class="callout good"><div class="callout-label">Onde aprofundar</div>Tudo isto em versão completa e oficial no <strong>Manual de Conduta Citiesoft</strong> (com o RH). Em dúvida sobre conduta, jornada ou direitos, o RH é o ponto certo.<br><br><a href="/manual-de-conduta-citiesoft.pdf" target="_blank" rel="noopener">→ Abrir o Manual de Conduta (PDF)</a></div>
`,
  },
  {
    slug: "processo",
    number: "05",
    trailSlug: "rotina",
    title: "Processo do time",
    description:
      "Do início ao fim de uma demanda padrão. O que acontece de verdade — não o que está no PowerPoint da reunião kick-off.",
    readTime: "8 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>O fluxo, em uma linha</h2>
<div class="process">
  <div class="process-step"><span class="step-num">01</span><div class="step-name">Briefing inicial</div></div>
  <div class="process-arrow">→</div>
  <div class="process-step"><span class="step-num">02</span><div class="step-name">Discovery</div></div>
  <div class="process-arrow">→</div>
  <div class="process-step"><span class="step-num">03</span><div class="step-name">Escrita do artefato</div></div>
  <div class="process-arrow">→</div>
  <div class="process-step"><span class="step-num">04</span><div class="step-name">Refinamento</div></div>
  <div class="process-arrow">→</div>
  <div class="process-step"><span class="step-num">05</span><div class="step-name">Entrega</div></div>
</div>
<h2>01. Briefing inicial</h2>
<p>Toda demanda começa com uma <strong>conversa</strong>, não com um documento. Pode ser uma reunião com o cliente, uma mensagem do PO, ou um e-mail. Sua primeira função é <strong>capturar</strong> e <strong>confirmar</strong> o que ouviu — não interpretar.</p>
<div class="callout warn"><div class="callout-label">Armadilha clássica</div>Sair direto pra solução. Se o briefing veio como "queremos uma tela X", recue até "qual problema X resolve?" antes de qualquer coisa.</div>
<h3>O que você precisa sair com</h3>
<ul>
  <li><strong>Quem</strong> tem o problema (persona, papel, segmento)</li>
  <li><strong>O que</strong> é o problema, com pelo menos 1 exemplo concreto</li>
  <li><strong>Por que agora</strong> — o que tornou isso urgente</li>
  <li><strong>Critério de pronto</strong> mínimo — como saberemos que resolveu</li>
  <li><strong>Quem decide</strong> se a entrega aceita — nome e papel</li>
</ul>
<h2>02. Discovery</h2>
<p>O briefing levantou hipóteses. Discovery valida quais sobrevivem ao contato com a realidade. Tipicamente: 2-5 entrevistas com usuário, 1 sessão com dados de uso (se houver), 1 olhar nos artefatos existentes.</p>
<p>Não é fase "obrigatória" — pode ser comprimida em 1 conversa de 30 min se o problema for simples e bem conhecido. Mas <strong>nunca pule</strong> em demandas novas para a Citiesoft.</p>
<div class="callout"><div class="callout-label">Sinal de que pode pular</div>Mesmo problema que outro cliente já trouxe, com solução validada. Ainda assim, confirme com 1 ligação rápida.</div>
<h2>03. Escrita do artefato</h2>
<p>Saiu do discovery, agora você produz o <strong>documento de saída</strong>. O tipo depende do que foi acordado:</p>
<div class="cards">
  <div class="card"><div class="card-title">PBI no Azure DevOps</div><div class="card-desc">Default pra demandas pequenas/médias. Template no Cap. 07.</div></div>
  <div class="card"><div class="card-title">BRD curto</div><div class="card-desc">Quando o cliente precisa de doc formal pra aprovação interna.</div></div>
  <div class="card"><div class="card-title">Casos de uso</div><div class="card-desc">Sistemas com fluxos múltiplos / contratos públicos exigem.</div></div>
  <div class="card"><div class="card-title">BPMN</div><div class="card-desc">Quando o processo é o produto: discovery em órgão público sempre.</div></div>
</div>
<p>Use <strong>sempre</strong> os templates do Cap. 07 — não comece do zero. Eles foram validados por mais de uma entrega.</p>
<h2>04. Refinamento</h2>
<p>Antes de mandar pro cliente / PO / dev: <strong>revisão própria</strong> seguida de <strong>revisão de par</strong>.</p>
<h3>Checklist de revisão própria</h3>
<ul>
  <li>Problema declarado bate com o briefing inicial?</li>
  <li>Tem ao menos 1 critério de aceite claro?</li>
  <li>Linguagem está no nível do leitor (cliente lê? dev lê?)?</li>
  <li>Acrônimos e jargões estão explicados ou removidos?</li>
  <li>Tem exemplos concretos onde a abstração pesa?</li>
</ul>
<h3>Revisão de par</h3>
<p>Mande pra <strong>outro analista</strong> antes do PO. Dois pares de olhos pegam ~80% dos erros que o cliente apontaria. Quem revisar? Ver Cap. 02 (Quem é quem).</p>
<h2>05. Entrega</h2>
<p>Entrega é uma <strong>conversa</strong>, não um anexo de e-mail. Sempre acompanhe o artefato de uma chamada de 15-30 min:</p>
<ol>
  <li>Recap rápido do que foi solicitado</li>
  <li>O que entrou no escopo e o que ficou fora (com justificativa)</li>
  <li>Pontos de decisão que precisam de validação do cliente</li>
  <li>Próximos passos com responsável e data</li>
</ol>
<div class="callout good"><div class="callout-label">Sinal de entrega bem-feita</div>O cliente sai da call sabendo o que ele precisa fazer a seguir, sem precisar reabrir o documento.</div>
<h2>Variações por tipo de cliente</h2>
<table>
  <tr><th>Tipo de cliente</th><th>Particularidade do processo</th></tr>
  <tr><td>Governo municipal</td><td>Briefing tende a ser via ofício/edital. Discovery limitado por LGPD. Entrega formal em PDF + ata.</td></tr>
  <tr><td>Governo estadual</td><td>Mais camadas de aprovação. Sempre validar com TI do órgão antes de fechar escopo.</td></tr>
  <tr><td>Empresa privada</td><td>Mais rápido. Briefing pode ser por chat. Discovery direto com usuário final.</td></tr>
  <tr><td>Sistema interno Citiesoft</td><td>Briefing vem do PO interno. Discovery pode ser via Teams. Entrega no próprio PBI.</td></tr>
</table>
<h2>O que acontece quando o processo desanda</h2>
<div class="callout bad"><div class="callout-label">Sintomas comuns</div>Cliente devolveu o artefato com mais de 3 ajustes? Provavelmente o briefing (etapa 1) foi raso. Refaça a entrevista com o decisor, não tente "consertar" o documento.</div>
<p>Outros sintomas e diagnósticos no Cap. 10 (Erros comuns).</p>
`,
  },
  {
    slug: "ferramentas",
    number: "06",
    trailSlug: "rotina",
    title: "Ferramentas",
    description:
      "Azure DevOps, Teams, SharePoint — pra que serve cada uma na prática.",
    readTime: "6 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Stack do analista</h2>
<p>Você vai viver em ~4 ferramentas. Cada uma tem um propósito claro — usar a errada vira retrabalho.</p>
<div class="cards">
  <div class="card"><div class="card-title">Azure DevOps</div><div class="card-desc">Onde os PBIs vivem. Onde devs leem o que você escreve. Onde o sprint roda.</div></div>
  <div class="card"><div class="card-title">Microsoft Teams</div><div class="card-desc">Reuniões, chat de squad, comunicação rápida com cliente quando autorizado.</div></div>
  <div class="card"><div class="card-title">SharePoint / OneDrive</div><div class="card-desc">Documentos formais. Atas, BRDs longos, materiais de cliente.</div></div>
  <div class="card"><div class="card-title">Lucid / Miro</div><div class="card-desc">Diagramas BPMN, jornadas, mapas mentais durante discovery.</div></div>
</div>
<h2>Azure DevOps na prática</h2>
<p>É o sistema operacional do squad. Você passa metade do dia aqui.</p>
<h3>Tipos de work item</h3>
<ul>
  <li><strong>Feature</strong> — agrupa PBIs relacionados. Você raramente cria, mas vai usar pra organizar.</li>
  <li><strong>Product Backlog Item (PBI)</strong> — o item que você escreve. É a unidade mínima de trabalho.</li>
  <li><strong>Task</strong> — quebra técnica do PBI feita pelo dev. Você não escreve, mas valida no refinamento.</li>
  <li><strong>Bug</strong> — registro de defeito. Frequentemente quem abre é o QA, mas analista também pode.</li>
</ul>
<h3>Quando usar cada um</h3>
<table>
  <tr><th>Situação</th><th>O que criar</th></tr>
  <tr><td>Nova feature acordada com cliente</td><td>Feature → quebra em PBIs</td></tr>
  <tr><td>Pedido pontual do cliente ("muda esse botão")</td><td>PBI direto</td></tr>
  <tr><td>Problema descoberto em produção</td><td>Bug</td></tr>
  <tr><td>Refatoração técnica</td><td>PBI tipo "Technical debt"</td></tr>
</table>
<div class="callout warn"><div class="callout-label">Atenção</div>Não crie PBI sem critério de aceite, mesmo pra demandas pequenas. PBI sem critério vira retrabalho garantido.</div>
<h2>Microsoft Teams</h2>
<p>Use Teams pra <strong>conversa</strong>, não pra <strong>documento</strong>. Mensagem do Teams some na esteira.</p>
<ul>
  <li><strong>Chat do squad</strong>: dúvidas operacionais, alinhamentos rápidos.</li>
  <li><strong>Canal do cliente</strong>: quando autorizado pelo gestor da conta. Comunicação formal.</li>
  <li><strong>Reuniões</strong>: pause a gravação automática pra discovery sensível (LGPD).</li>
</ul>
<div class="callout"><div class="callout-label">Regra de ouro</div>Decisão tomada no Teams precisa virar resumo escrito no Azure DevOps ou no SharePoint. Se não virar, é como se não existisse.</div>
<h2>SharePoint / OneDrive</h2>
<p>Pra documentos que precisam <strong>durar</strong>. Ata de kick-off, BRD entregue, especificações longas, materiais que o cliente precisa anexar a um processo formal.</p>
<h3>Organização padrão</h3>
<ul>
  <li><strong>/clientes/[nome]/01-contrato</strong> — edital, ARP, TR.</li>
  <li><strong>/clientes/[nome]/02-discovery</strong> — entrevistas, atas, hipóteses.</li>
  <li><strong>/clientes/[nome]/03-entregas</strong> — versões oficiais dos artefatos.</li>
  <li><strong>/clientes/[nome]/04-reunioes</strong> — atas e gravações autorizadas.</li>
</ul>
<h2>LGPD: o mínimo que todo analista respeita</h2>
<p>Você lida com dado pessoal de cliente, servidor e cidadão. Quatro hábitos inegociáveis:</p>
<ul>
  <li>Não compartilhe dado pessoal de cliente ou colega sem autorização.</li>
  <li>Guarde documento com dado pessoal só em sistema seguro e autorizado — o SharePoint do cliente, não o seu desktop.</li>
  <li>Suspeita de vazamento? Comunique o RH na hora.</li>
  <li>Pause a gravação do Teams em discovery sensível e registre "pausado por LGPD".</li>
</ul>
<div class="callout"><div class="callout-label">Conecta com</div>Conduta, sigilo e o canal de denúncia estão no Cap. 04 (Conduta e bem-estar) e, completos, no Manual de Conduta.</div>
<h2>Lucid / Miro</h2>
<p>Visualização. Não documente em ferramenta visual o que cabe em texto — diagrama feio é pior que parágrafo bom.</p>
<ul>
  <li><strong>BPMN</strong>: diagramas de processo no Lucid (padrão Citiesoft).</li>
  <li><strong>Discovery</strong>: post-its, jornada, mapa de empatia no Miro.</li>
  <li><strong>Arquitetura</strong>: você não desenha. O dev sênior faz e te explica.</li>
</ul>
`,
  },
  {
    slug: "templates",
    number: "07",
    trailSlug: "rotina",
    title: "Templates",
    description:
      "Os artefatos que o time produz, em padrão pronto pra usar. Não escreva do zero.",
    readTime: "5 min de leitura + consulta",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Templates disponíveis</h2>
<p>São 6 templates oficiais. Cada um tem um caso de uso claro — escolher o errado custa retrabalho.</p>
<div class="cards">
  <div class="card"><div class="card-title">PBI Padrão</div><div class="card-desc">Default pra demanda pequena/média. Como/Quero/Para que + Dado/Quando/Então.</div></div>
  <div class="card"><div class="card-title">BRD curto</div><div class="card-desc">Doc formal pra cliente aprovar internamente. ~3 páginas.</div></div>
  <div class="card"><div class="card-title">Casos de uso</div><div class="card-desc">Sistema com fluxos múltiplos. Padrão UML simplificado.</div></div>
  <div class="card"><div class="card-title">BPMN do processo</div><div class="card-desc">Quando o processo é o produto. Notação BPMN 2.0 padrão.</div></div>
  <div class="card"><div class="card-title">Matriz de stakeholders</div><div class="card-desc">Pra projetos com mais de 5 atores envolvidos. Quem decide × quem influencia.</div></div>
  <div class="card"><div class="card-title">Ata de reunião</div><div class="card-desc">Decisões + responsáveis + prazos. Curta. Vai no SharePoint do cliente.</div></div>
</div>
<h2>Qual template escolher?</h2>
<table>
  <tr><th>Se a demanda é…</th><th>Use…</th></tr>
  <tr><td>Mudança pontual / feature pequena</td><td>PBI Padrão</td></tr>
  <tr><td>Feature grande que cliente precisa aprovar</td><td>BRD curto</td></tr>
  <tr><td>Sistema novo com várias telas</td><td>Casos de uso + BPMN</td></tr>
  <tr><td>Mapeamento de processo existente</td><td>BPMN</td></tr>
  <tr><td>Projeto com muitos atores políticos</td><td>Matriz de stakeholders + BRD</td></tr>
</table>
<h2>Como acessar os templates</h2>
<p>Os templates moram em <em>SharePoint &gt; Citiesoft &gt; templates-analista</em>. Copie a versão mais recente, salve no SharePoint do cliente, depois preencha. Não edite o template-mãe.</p>
<h2>Quando o template não cabe</h2>
<p>Se a demanda é tão específica que nenhum template encaixa, <strong>fale com seu mentor antes de criar do zero</strong>. Provavelmente:</p>
<ul>
  <li>Existe um template que você não encontrou — ele te aponta.</li>
  <li>A demanda é uma combinação de dois templates — ele te ajuda a combinar.</li>
  <li>É genuinamente novo — vocês criam juntos e adicionam à pasta.</li>
</ul>
<div class="callout good"><div class="callout-label">Contribuição</div>Templates não são intocáveis. Se você usar um e perceber que falta algo, abra uma sugestão de melhoria no canal do squad. A versão evolui.</div>
`,
  },
  {
    slug: "exemplos",
    number: "08",
    trailSlug: "rotina",
    title: "Exemplos reais",
    description:
      "Um artefato real (anonimizado) por template, com comentários explicando decisões e quase-erros.",
    readTime: "7 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Exemplo 1 — PBI Padrão</h2>
<p><strong>Cliente</strong>: prefeitura municipal de [X]. <strong>Contexto</strong>: módulo de protocolo de documentos.</p>
<div class="callout"><div class="callout-label">Trecho do PBI (anonimizado)</div>
<strong>Como</strong> servidor da Secretaria de Administração<br>
<strong>Quero</strong> filtrar protocolos pendentes por data de entrada<br>
<strong>Para que</strong> eu priorize os mais antigos no atendimento do dia<br><br>
<strong>Critérios de aceite:</strong><br>
1. <em>Dado</em> que existem protocolos pendentes, <em>quando</em> eu acesso a tela de filtros, <em>então</em> vejo o filtro "data de entrada" disponível.<br>
2. <em>Dado</em> que apliquei o filtro "última semana", <em>quando</em> a lista carrega, <em>então</em> só aparecem protocolos com data nos últimos 7 dias.<br>
3. <em>Dado</em> que o filtro está aplicado, <em>quando</em> eu volto e retorno à tela, <em>então</em> o filtro persiste (não reseta).</div>
<h3>O que esse exemplo tem de bom</h3>
<ul>
  <li>"Para que" é específico ("priorize os mais antigos"). Não é genérico ("ter mais agilidade").</li>
  <li>Critério 3 cobre estado da UI — fácil de esquecer, dá retrabalho garantido se omitido.</li>
  <li>Linguagem concreta — sem "deve permitir flexibilidade na visualização".</li>
</ul>
<h3>Onde quase errou</h3>
<p>A primeira versão tinha "permitir filtrar por vários critérios". Foi reescrita pra <strong>um critério específico</strong> (data) porque "vários critérios" gera 3-5 PBIs implícitos — o dev não saberia quando parar.</p>
<h2>Exemplo 2 — BPMN de processo</h2>
<p><strong>Cliente</strong>: secretaria estadual de [Y]. <strong>Contexto</strong>: solicitação de afastamento por servidor.</p>
<div class="callout"><div class="callout-label">Descrição do diagrama (anonimizado)</div>
<strong>Atores</strong>: Servidor, Chefia imediata, RH, Sistema.<br>
<strong>Fluxo principal</strong>:<br>
1. Servidor inicia solicitação no sistema → preenche tipo, data, justificativa.<br>
2. Sistema valida regras automáticas (estoque de licença, conflito de calendário).<br>
3. Chefia recebe notificação → aprova ou rejeita com justificativa.<br>
4. Se aprovada → RH valida documentação anexa.<br>
5. Se rejeitada → servidor recebe notificação com motivo.<br>
6. RH emite portaria final → status muda para "deferido".<br><br>
<strong>Decisão crítica capturada</strong>: o que acontece se a chefia não responder em 5 dias úteis. Decisão: escalona automaticamente pra chefia da chefia.</div>
<h3>O que esse exemplo tem de bom</h3>
<ul>
  <li>Identifica claramente os 4 atores antes de desenhar.</li>
  <li>Captura uma <strong>decisão crítica</strong> que ninguém tinha pensado (escalonamento automático).</li>
  <li>Separa validação técnica (sistema) de aprovação humana (chefia / RH).</li>
</ul>
<h3>Onde quase errou</h3>
<p>A primeira versão tratava chefia e RH como "fluxo de aprovação" genérico. Ao detalhar, virou claro que são <strong>dois tipos de aprovação diferentes</strong>: chefia decide mérito, RH valida procedimento. Separar evitou refação.</p>
<h2>Exemplo 3 — Ata de reunião curta</h2>
<p><strong>Reunião</strong>: alinhamento mensal com cliente Z. <strong>Duração</strong>: 45 min.</p>
<div class="callout"><div class="callout-label">Ata (anonimizada)</div>
<strong>Data</strong>: 12/05/2026 · <strong>Presentes</strong>: 3 (lado cliente) + 2 (lado Citiesoft)<br><br>
<strong>Decisões tomadas:</strong><br>
• Mudança no escopo da feature "relatórios mensais" — aceita. Inclui agora consolidação anual. Impacto de prazo: +1 sprint. Responsável: [PO]. Prazo de retorno do dev sênior: 19/05.<br>
• Adiamento da integração com [sistema externo] para Q4. Responsável: [gestor da conta].<br><br>
<strong>Pendências:</strong><br>
• Cliente precisa enviar layout do relatório anual até 19/05 — sem isso, o impacto de prazo aumenta.<br>
• Citiesoft vai validar com TI do órgão se o adiamento da integração afeta empenho. Resposta até 23/05.<br><br>
<strong>Próxima reunião</strong>: 09/06/2026.</div>
<h3>O que essa ata tem de bom</h3>
<ul>
  <li><strong>Curta</strong>. Cabe em 1 mensagem do Teams se precisar.</li>
  <li>Cada decisão tem <strong>responsável e prazo</strong>. Sem isso, decisão vira intenção.</li>
  <li>Pendências separadas explicitamente — qualquer leitor sabe o que falta.</li>
</ul>
`,
  },
  {
    slug: "faq",
    number: "09",
    trailSlug: "crescimento",
    title: "FAQ — Primeiros 30 dias",
    description: "As perguntas que todo novo analista faz, respondidas de uma vez.",
    readTime: "Consulta livre",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Trabalho diário</h2>
<div class="faq-item"><div class="q">Onde encontro a documentação do cliente X?</div><div class="a">SharePoint do cliente em <em>/clientes/[nome]/01-contrato</em>. Se não tem permissão, peça ao gestor da conta. Não tente conseguir por jeitinhos.</div></div>
<div class="faq-item"><div class="q">Como eu sei quando minha entrega está "pronta"?</div><div class="a">Critério: o decisor mapeado no briefing aceita sem ajustes substantivos. Pequenos ajustes de redação são esperados. Mais de 3 ajustes substantivos = briefing falhou (Cap. 05).</div></div>
<div class="faq-item"><div class="q">Com quem falo se eu travar?</div><div class="a">Mentor pareado (primeiros 60 dias). Depois: outro analista do squad. Em último caso: PO. Veja o mapa "Pra cada coisa, fala com…" no Cap. 02.</div></div>
<div class="faq-item"><div class="q">É normal demorar 2 semanas pra entender o que o cliente quer?</div><div class="a">Sim. Discovery bem-feita ganha tempo lá na frente. Se passar de 3 semanas sem progresso, alinhe com o mentor — pode ser briefing inicial mal feito.</div></div>
<div class="faq-item"><div class="q">Posso fazer reunião com cliente sozinho ou preciso de par?</div><div class="a">Primeiros 30 dias: par sempre. Entre 30-90 dias: par em reuniões formais (kick-off, alinhamento de escopo). Depois: depende do cliente. Confirme com seu gestor.</div></div>
<h2>Ferramentas</h2>
<div class="faq-item"><div class="q">Não tenho acesso ao Azure DevOps do cliente Y. O que faço?</div><div class="a">Peça acesso ao PO interno do squad. Demora ~2 dias úteis em média. Não é razão pra atrasar trabalho — peça acesso já no primeiro dia.</div></div>
<div class="faq-item"><div class="q">Tenho que aceitar a gravação automática do Teams em reuniões com cliente?</div><div class="a">Não. Pause antes de discovery sensível (dados pessoais, processos internos do órgão). Anote no chat: "Gravação pausada por LGPD" pra histórico.</div></div>
<div class="faq-item"><div class="q">Posso usar IA pra rascunhar PBIs?</div><div class="a">Sim, como ponto de partida. <strong>Nunca como entrega final</strong>. IA é pra acelerar a primeira versão; revisão crítica é humana. Verifique especialmente critérios de aceite — IA tende a inventar.</div></div>
<h2>Cultura e pessoas</h2>
<div class="faq-item"><div class="q">É normal eu não entender metade das siglas nas primeiras semanas?</div><div class="a">Sim. Use o Cap. 03 (Glossário) e pergunte sem culpa. Sigla que você não entendeu provavelmente outro também não — perguntar ajuda o time todo.</div></div>
<div class="faq-item"><div class="q">Posso discordar publicamente da decisão do PO?</div><div class="a">Sim, antes da decisão estar fechada. Use o padrão do Cap. 01 (Como discordar bem). Depois de fechada, sustente o combinado.</div></div>
<div class="faq-item"><div class="q">Qual a diferença entre este guia e o Manual de Conduta?</div><div class="a">O Citiesoft Onboard é o guia prático do seu trabalho de analista. O Manual de Conduta (RH) é a regra oficial, com peso legal, que vale pra toda a empresa. Conduta, jornada, LGPD e direitos: o resumo prático está no Cap. 04; a versão oficial, no Manual. Em conflito, vale o Manual.</div></div>
<div class="faq-item"><div class="q">Quantas horas devo trabalhar?</div><div class="a">As do contrato. Hora extra eventual acontece, hora extra recorrente é sinal de processo quebrado — leve pro mentor. Aqui ninguém ganha ponto por queimar fim de semana.</div></div>
`,
  },
  {
    slug: "erros",
    number: "10",
    trailSlug: "crescimento",
    title: "Erros comuns",
    description:
      "As armadilhas que pegam quase todo mundo nos primeiros 3 meses — e como evitar.",
    readTime: "6 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<div class="callout"><div class="callout-label">Como ler este capítulo</div>Os erros abaixo se repetem nos primeiros meses e foram observados em mais de um contrato. Reconhecer o sintoma cedo evita o retrabalho.</div>
<h2>1. Escopo mal entendido</h2>
<p><strong>Sintoma</strong>: cliente devolve o artefato com "isso não é o que pedi".</p>
<p><strong>Causa raiz</strong>: briefing pulou a etapa de confirmação. O analista anotou o que ouviu mas não repetiu pro cliente pra confirmar.</p>
<p><strong>Como evitar</strong>: ao fim do briefing, repita com suas palavras: <em>"Pra confirmar — vocês precisam de X, que vai atender Y, e o critério de sucesso é Z. Está certo?"</em> E peça confirmação por escrito (e-mail ou Teams).</p>
<h2>2. Linguagem técnica errada</h2>
<p><strong>Sintoma</strong>: cliente não-técnico não entende o artefato. Ou o dev entende mas perde a nuance do negócio.</p>
<p><strong>Causa raiz</strong>: não identificou o leitor antes de escrever.</p>
<p><strong>Como evitar</strong>: pergunte-se <em>"quem vai ler isto primeiro?"</em>. Cliente final → linguagem de negócio. PO interno → técnica mas com contexto. Dev → critérios de aceite testáveis, sem fluff.</p>
<h2>3. Não validou com stakeholder certo</h2>
<p><strong>Sintoma</strong>: artefato aprovado pelo PO, mas o "verdadeiro decisor" reabre tudo na semana seguinte.</p>
<p><strong>Causa raiz</strong>: o briefing não mapeou quem aprova de verdade. Frequentemente o decisor real é o secretário, não o coordenador que falou com você.</p>
<p><strong>Como evitar</strong>: pergunte explicitamente no briefing: <em>"Quem mais precisa aceitar isto antes da entrega? Tem alguém acima do(a) [nome] que pode reabrir essa decisão?"</em></p>
<h2>4. Critério de aceite vago</h2>
<p><strong>Sintoma</strong>: dev entrega algo "funcionando" mas o QA reabre como bug, ou o cliente diz "não era isso".</p>
<p><strong>Causa raiz</strong>: critério de aceite escrito como intenção ("deve permitir flexibilidade") em vez de comportamento ("dado X, quando Y, então Z").</p>
<p><strong>Como evitar</strong>: cada critério precisa ser <strong>testável</strong>. Se o QA não consegue escrever um teste a partir dele, refaça.</p>
<h2>5. Documentou o que não precisa, e não documentou o que precisa</h2>
<p><strong>Sintoma</strong>: artefato de 8 páginas, mas o dev ainda pergunta o que é "fluxo alternativo de erro".</p>
<p><strong>Causa raiz</strong>: padrão decorativo de documentação. Escreveu pra parecer profissional, não pra ser usado.</p>
<p><strong>Como evitar</strong>: pergunte antes de escrever cada seção: <em>"Quem vai usar isso e pra quê?"</em>. Se não tem leitor, corte. Se falta um leitor crítico (dev quer saber X mas não está no doc), escreva.</p>
<h2>6. Tratou demanda nova como demanda conhecida</h2>
<p><strong>Sintoma</strong>: cliente novo, problema "parecido" com outro que vocês resolveram — mas a solução não funciona porque contexto é diferente.</p>
<p><strong>Causa raiz</strong>: confiança excessiva em padrão anterior. Pulou discovery porque "já fizemos isso".</p>
<p><strong>Como evitar</strong>: mesmo em demanda familiar, faça pelo menos 1 entrevista com usuário do novo cliente. O padrão pode até confirmar — mas validar custa 30 min e evita semanas de retrabalho.</p>
<div class="callout good"><div class="callout-label">Boa notícia</div>Todo esse capítulo é resultado de erros que <strong>já cometemos</strong>. Você herda o aprendizado sem pagar o preço — desde que leia.</div>
`,
  },
  {
    slug: "proximos",
    number: "11",
    trailSlug: "crescimento",
    title: "Próximos passos",
    description:
      "Quando você já dominar o básico, por onde aprofundar. Trilhas, recursos externos, marcos.",
    readTime: "5 min de leitura",
    updatedAt: "19/05/2026",
    bodyHtml: `
<h2>Como você sabe que dominou o básico</h2>
<p>Sinais práticos:</p>
<ul>
  <li>Você produz um PBI bom sem precisar do mentor revisar antes</li>
  <li>Sabe quando comprimir e quando alongar a etapa de discovery</li>
  <li>Identifica o decisor real sem ter que perguntar 3 vezes</li>
  <li>Outro analista te pede ajuda — isso significa que você virou referência em algo</li>
</ul>
<p>Tipicamente acontece entre 4 e 8 meses de casa. Depois disso, você escolhe uma direção pra aprofundar.</p>
<h2>Trilhas de aprofundamento</h2>
<div class="cards">
  <div class="card"><div class="card-title">Especialização por cliente</div><div class="card-desc">Vire o "analista referência" pra um tipo de cliente (gov municipal, secretaria estadual, empresa privada). Conhecimento profundo de edital, contratação, jargão do setor.</div></div>
  <div class="card"><div class="card-title">Especialização por artefato</div><div class="card-desc">Domine 1-2 artefatos a fundo (ex: BRD ou BPMN). Vira a pessoa que outros analistas consultam quando o caso é difícil.</div></div>
  <div class="card"><div class="card-title">Caminho de PM</div><div class="card-desc">Migra pra Product Owner / Product Manager. Aprende priorização, métrica de produto, gestão de roadmap.</div></div>
  <div class="card"><div class="card-title">Caminho de mentoria</div><div class="card-desc">Vira mentor de analistas iniciantes. Foco em ensinar, não em executar mais. Caminho pra líder técnico do squad.</div></div>
</div>
<h2>Recursos externos sugeridos</h2>
<h3>Livros</h3>
<ul>
  <li><strong>Business Analysis For Dummies</strong> — leitura inicial, panorama do papel.</li>
  <li><strong>BABOK Guide</strong> (IIBA) — referência canônica. Não leia inteiro de uma vez; consulte por área de conhecimento.</li>
  <li><strong>Manual da Análise de Negócios</strong> (Carolina Hadad) — visão brasileira, contexto público.</li>
  <li><strong>Inspired</strong> (Marty Cagan) — pra quem mira o caminho de PM.</li>
</ul>
<h3>Cursos / certificações</h3>
<ul>
  <li><strong>IIBA — ECBA / CCBA / CBAP</strong>: trilha formal de certificação em análise de negócios.</li>
  <li><strong>Cursos PM3 / Tera</strong>: foco brasileiro, bom complemento prático.</li>
  <li><strong>BPMN 2.0 oficial (OMG)</strong>: se você for ficar no caminho de BPMN.</li>
</ul>
<h3>Comunidades</h3>
<ul>
  <li><strong>IIBA Brasil</strong>: encontros locais e online.</li>
  <li><strong>Slack / Discord de Analistas</strong>: comunidades informais e de alta velocidade.</li>
</ul>
<h2>Marcos da carreira aqui</h2>
<table>
  <tr><th>Tempo</th><th>Marco</th></tr>
  <tr><td>0-3 meses</td><td>Onboarding + primeiro PBI entregue sem ajustes substantivos</td></tr>
  <tr><td>3-6 meses</td><td>Autonomia pra fazer briefing sozinho com cliente</td></tr>
  <tr><td>6-12 meses</td><td>Vira "par" pra revisar artefato de analista novo</td></tr>
  <tr><td>12-18 meses</td><td>Conduz discovery completa de feature grande, do briefing à entrega</td></tr>
  <tr><td>18+ meses</td><td>Escolhe uma trilha de aprofundamento</td></tr>
</table>
`,
  },
];
