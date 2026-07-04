# Revisão do projeto — Citiesoft Onboard

**Data:** 02/07/2026
**Escopo:** código (`app/`, `lib/`, `components/`, `scripts/`), modelo de dados no Neon (leitura), UX/UI do leitor e infra do repositório.
**Também nesta rodada:** composição das trilhas de onboarding das áreas **Desenvolvimento** e **Design** (ver seção final).

> Prioridade: 🟥 alta · 🟧 média · 🟦 melhoria/UX
> Nada foi publicado no banco. Código novo está no repo aguardando sua revisão.

---

## 🟥 Alta prioridade

### REV-01 — Conteúdo de produção sem backup versionado (drift seed × banco)
- **Evidência:** o banco tem 12 capítulos (com `conduta` e `novo-capitulo-2`, renumerados 01–12) e 1 quiz com 8 perguntas; o `lib/seed/chapters.ts` ainda tem os 11 antigos com outra numeração. Quizzes e edições do /admin existem **só no Neon**.
- **Risco:** `db:seed:force` destruiria edições; perda do banco = perda do conteúdo real; não há como diffar o que os editores mudaram.
- **Sugestão:** script `content:export` que faz dump de `chapters`, `trails`, `areas`, `chapter_areas`, `quizzes` (+perguntas), `settings` para JSON versionado no repo (ex.: `content-backup/`). Rodar antes de cada deploy (lembrando: deploy é por CLI, commitar junto). Opcional: cron semanal.

### REV-02 — Histórico de versões ordenado errado
- **Onde:** `lib/chapters.ts:94` — `orderBy(desc(chapterVersions.updatedAt))` sobre string `"dd/mm/aaaa às HH:mm"`.
- **Problema:** ordenação de string dia-primeiro não é cronológica: "30/06/2026" > "01/07/2026". O histórico do admin lista versões fora de ordem assim que cruza mês/ano.
- **Sugestão:** gravar também um carimbo ISO (nova coluna `created_at`), ordenar por ele; manter a string só pra exibição. Alternativa rápida: ordenar por `id` se o id for gerado crescente.

### REV-03 — Sessão de 7 dias não reage a mudança de papel/remoção
- **Onde:** `lib/auth.ts` — token HMAC stateless com `role` embutido, validade 7 dias.
- **Problema:** admin rebaixado ou usuário removido continua com o papel antigo até o token expirar.
- **Sugestão:** nos pontos que já buscam o usuário no banco (layouts), validar `status === "active"` e usar o `role` **do banco**, não o do token. Custo ~zero (a query já existe).

---

## 🟧 Média prioridade

### REV-04 — Login sem limite de tentativas
- Sem rate-limit/lockout no login por senha. Ferramenta interna, risco baixo, mas é barato: contador de falhas por e-mail (tabela ou memória) com atraso progressivo. Nota: `scryptSync` é síncrono e bloqueia o event loop — em rajada de tentativas isso vira problema duplo.

### REV-05 — Slug de produção "novo-capitulo-2"
- O capítulo "Processos internos" vive em `/c/novo-capitulo-2`. Sugestões: (a) permitir editar slug no /admin (com redirect do antigo), ou (b) gerar slug do título na criação em vez de "novo-capitulo-N". Atenção: renomear slug hoje cascateia `progress` (ON DELETE CASCADE) — precisa migrar o progresso junto.

### REV-06 — Preview de área inconsistente (AreaSwitcher)
- O "Visualizando como" do `/inicio` troca só o miolo da página; a **sidebar continua na área do próprio usuário**. Admin visualizando "Design" vê home de Design com menu de Negócios. Sugestão: propagar `?area=` pro layout/Shell no modo preview (ou badge "preview parcial" até lá).

### REV-07 — `@playwright/test` instalado, zero testes
- Não há `playwright.config.*` nem pasta de testes. Ou criar o smoke mínimo (login → ler capítulo → marcar concluído → quiz) — o app já é estável o bastante pra valer o seguro — ou remover a dependência.

### REV-08 — Datas como string de exibição no schema
- `chapters.updatedAt`, `quizzes.updatedAt` etc. guardam `"dd/mm/aaaa às HH:mm"`. `getLastUpdated()` faz parse manual com regex. Mesmo remédio do REV-02: ISO no banco, formatação na borda. Refactor gradual (não urgente, mas cada feature nova herda a fragilidade).

### REV-09 — Limpeza menor
- `app/(site)/c/[slug]/page.tsx:12` — `generateStaticParams` sob layout `force-dynamic` não tem efeito; remover.
- Campo de busca da sidebar com estilos inline (`components/Shell.tsx:168-190`) — mover pra `globals.css` como o resto do design system.

---

## 🟦 UX/UI (leitor)

### UX-01 — Usuário não vê a própria trilha/área
Com 4 áreas ativas, o leitor não tem nenhum indicador de qual trilha está fazendo. Sugestão: badge no hub ("Trilha de Desenvolvimento") e na página /conta.

### UX-02 — Progresso ignora quizzes
A barra do hub e o "Continuar de onde parei" contam só capítulos (`HomeView.tsx:29-32`). Quiz passado não move a barra e o CTA nunca aponta pra quiz destravado. Sugestão: incluir quizzes no total ou linha separada ("2 medalhas de quiz").

### UX-03 — Quiz invisível na sidebar
Quizzes só aparecem na home. Quem termina o cap. 09 dentro do leitor não descobre que destravou o quiz. Sugestão: item de quiz na trilha correspondente da sidebar (badge QUIZ + cadeado/check).

### UX-04 — Busca da sidebar sem estado vazio
Filtro que zera todas as seções deixa o menu mudo — sem "nenhum capítulo encontrado". E a busca não olha o corpo do capítulo (só título/número/descrição). A mensagem de vazio é 5 linhas; busca no corpo pode esperar.

### UX-05 — Quiz bloqueado não diz o que falta
Card mostra "Conclua os pré-requisitos" genérico. Listar os capítulos pendentes (nome, linkado) transforma frustração em roteiro.

### UX-06 — Falta continuidade ao concluir capítulo
Ao clicar "Marcar como concluído", nada sugere o próximo passo. Sugestão: o bloco de conclusão vira "Concluído ✓ — Próximo: 07 Ferramentas →". Fluxo de leitura contínua é o coração do produto.

### UX-07 — Progresso por trilha na sidebar
Rótulo da trilha poderia mostrar "Rotina · 2/4". Barato e dá senso de etapa (a informação já está no cliente).

### UX-08 — Acessibilidade (varredura rápida)
- Input de busca sem `aria-label` (placeholder não é rótulo).
- Conferir contraste de `.brand-sub`, `.trail-desc` e do check verde sobre fundo claro (WCAG AA).
- Garantir `:focus-visible` nos cards de capítulo/quiz (navegação por teclado).

---

## 🟥 Infra do repositório (fora do app, mas urgente)

### REV-10 — Repo dentro do iCloud Drive
- **Evidência:** `git log`/`git status` travam (timeout >2 min) nesta máquina; `.git/` contém `index 2`, `index 3`, `index 4` — artefatos clássicos de conflito de sincronização do iCloud (a pasta `~/Documents` é sincronizada).
- **Risco:** corrupção de índice/objetos, travas aleatórias, duplicatas fantasmas. Isso afeta **todos os repos** em `~/Documents/AKNO/code/`.
- **Sugestão:** mover os repos pra fora do iCloud (ex.: `~/dev/`) ou renomear a pasta pai para `code.nosync`. No mínimo, apagar os `index N` órfãos do `.git/`.
- **Nota:** por causa disso, não consegui conferir se `feat/pagina-inicial-editavel-e-perfil` (branch atual) já foi mergeada na `main` — vale checar antes do próximo deploy.

---

## Trilhas novas — Desenvolvimento e Design (compostas nesta rodada)

O modelo já estava pronto: as 4 áreas existem no banco e os capítulos 01–05 (Contexto) são compartilhados entre todas. O que faltava — e foi composto — são os capítulos de **Rotina** e **Crescimento** de Dev e Design, espelhando 1:1 a estrutura de Negócios (numeração 06–12 dentro de cada área):

| # | Desenvolvimento (`sortOrder` 106+) | Design (`sortOrder` 206+) | Trilha |
|---|---|---|---|
| 06 | Do PBI ao deploy | O processo de design | Rotina |
| 07 | Ferramentas e stack | Ferramentas e identidade | Rotina |
| 08 | Padrões de código e Pull Requests | Protótipos de discovery: as regras da casa | Rotina |
| 09 | Qualidade: testes, bugs e QA | Handoff: do design ao dev | Rotina |
| 10 | FAQ — Primeiros 30 dias | FAQ — Primeiros 30 dias | Crescimento |
| 11 | Erros comuns | Erros comuns | Crescimento |
| 12 | Próximos passos | Próximos passos | Crescimento |

Mais 1 quiz por área ("Quiz — Rotina do Dev" / "Quiz — Rotina do Design"), 6 perguntas cada, destravados ao concluir os caps. 06–09 da área.

**Arquivos:**
- `lib/seed/chapters-dev.ts` · `lib/seed/chapters-design.ts` — conteúdo
- `scripts/seed-trilhas-dev-design.ts` — publicação (só insere; nunca sobrescreve; idempotente)
- `package.json` → `npm run db:seed:trilhas`

**Pontos que só você pode validar antes de publicar** (escrevi de forma genérica onde não tinha certeza — sem inventar nomes de ambiente, repositório ou ferramenta):
1. **Dev:** padrão de nome de branch, nomes reais dos ambientes, stack mobile, ferramenta/nível de exigência de teste automatizado, rito de hotfix e quem autoriza janela de deploy.
2. **Design:** estado real da biblioteca Figma e onde mora o brand pack no SharePoint; se o rito de aprovação com cliente descrito bate com a prática.
3. **Quizzes:** revisar perguntas e gabarito (em especial "8 telas" e a dupla tipográfica — estão como regra da casa).
4. As **3 regras de protótipo** (fluxo≠cálculo, só valor de referência no cabeçalho, nunca auto-resolver ambiguidade) viraram o Cap. 08 de Design — confirme se a formulação está do jeito que você ensina.

**Publicação, quando validar:** `npm run db:seed:trilhas` (safe: capítulo/quiz existente é preservado).

---

## Pendências herdadas da revisão de conteúdo (25/06)
- INC-10 — footer "Desenvolvido **pelo** Citiesoft" segue aguardando sua decisão (pelo/pela).
- INC-13 — padronização dos rótulos de `readTime` (pulado por não ser erro). As trilhas novas seguiram o padrão vigente ("X min de leitura" / "Consulta livre").
