# Revisão de conteúdo — Citiesoft Onboard

**Data:** 25/06/2026
**Escopo:** Conteúdo versionado no repositório (`lib/seed/chapters.ts`, `lib/seed/trails.ts`, `components/LandingPage.tsx` e textos de UID).
**Fora de escopo:** Quizzes (vivem no banco Neon, não estão versionados) e textos digitados via `/admin`.

> Status de cada item: 🟥 erro/correção · 🟧 inconsistência · 🟦 melhoria/estilo · ⬜ confirmar intenção
> Nada foi alterado ainda. Decidimos aqui e depois subimos.

---

## 🟥 Erros de português / ortografia

### INC-01 — "lêem" (grafia pré-Acordo Ortográfico)
- **Onde:** `lib/seed/chapters.ts:294` (Cap. 06 — card "Azure DevOps"). Também no `reference/prototype.html:1364` (fonte original).
- **Atual:** "Onde os PBIs vivem. Onde devs **lêem** o que você escreve."
- **Problema:** O circunflexo de "lêem/vêem/crêem/dêem" foi abolido no Acordo de 2009. Forma correta: **leem**.
- **Correção:** "Onde devs **leem** o que você escreve."

---

## 🟧 Inconsistência de pronome / pessoa verbal

### INC-02 — "viraste" (tu) no meio de texto em "você"
- **Onde:** `lib/seed/chapters.ts:542` (Cap. 11 — "Como você sabe que dominou o básico").
- **Atual:** "Outro analista te pede ajuda — isso significa que **viraste** referência em algo"
- **Problema:** Todo o material trata o leitor por "você"; "viraste" é conjugação de "tu". Quebra a uniformidade.
- **Opções:**
  - **A (recomendada):** "...isso significa que **você virou** referência em algo"
  - **B:** "...isso significa que **virou** referência em algo"

### INC-03 — Lista "Como discordar bem" mistura singular e plural
- **Onde:** `lib/seed/chapters.ts:42-47` (Cap. 01).
- **Atual:** itens 1–3 em imperativo singular ("Pergunte", "Apresente", "Proponha") e o item 4 em plural: "Se persiste o desacordo, **escalonem** juntos pra um terceiro."
- **Problema duplo:** (a) troca de número (singular → plural); (b) "escalonem" (de *escalonar* = distribuir em etapas) onde o sentido é *escalar/encaminhar*.
- **Opções:**
  - **A (recomendada):** "Se o desacordo persistir, **escale** o caso para um terceiro."
  - **B (mantém o tom colaborativo):** "Se o desacordo persistir, **subam juntos** o caso para um terceiro."

---

## 🟧 Conteúdo de rascunho / nota interna vazando para produção

Três capítulos ainda têm bilhetes de produção ("Q3/Q5/Q6 do form", "Esqueleto", "A definir") visíveis para o usuário final. Mesma classe de problema, IDs separados para tratarmos um a um.

### INC-04 — Callout "A definir após resposta do form (Q3...)"
- **Onde:** `lib/seed/chapters.ts:383` (Cap. 07 — Templates).
- **Atual:** "Localização exata — A definir após resposta do form (Q3 — onde mora hoje o conhecimento). Pode ser que migremos pra Confluence se o time pedir."
- **Opções:**
  - **A:** Substituir pelo local real dos templates (ex.: "SharePoint › Citiesoft › templates-analista") e remover o "a definir".
  - **B:** Remover o callout inteiro até a definição existir.

### INC-05 — Callout "Esqueleto ... Q5 do form"
- **Onde:** `lib/seed/chapters.ts:470` (Cap. 09 — FAQ).
- **Atual:** "Perguntas iniciais baseadas em padrões comuns. Serão complementadas com a Q5 do form..."
- **Opção (recomendada):** Remover o callout — o capítulo já funciona sem a meta-nota.

### INC-06 — Callout "Esqueleto ... Q6 do form"
- **Onde:** `lib/seed/chapters.ts:498` (Cap. 10 — Erros comuns).
- **Atual:** "Lista será refinada com base na Q6 do form... Abaixo, as hipóteses iniciais..."
- **Opção (recomendada):** Remover o callout (ou reescrever sem citar "form/Q6", mantendo só "lista baseada em casos reais de mais de um contrato").

---

## 🟧 Descrição × corpo divergentes

### INC-07 — Cap. 06 promete "Confluence" mas não cobre
- **Onde:** descrição em `lib/seed/chapters.ts:287` vs corpo `:290-350`.
- **Atual (descrição):** "Azure DevOps, Teams, **Confluence** — pra que serve cada uma na prática."
- **Problema:** O corpo cobre Azure DevOps, Teams, SharePoint/OneDrive e Lucid/Miro — **Confluence não aparece**. E no Cap. 07 o Confluence é tratado como hipótese futura ("pode ser que migremos"). A descrição promete algo que o capítulo não entrega.
- **Opções:**
  - **A (recomendada):** Trocar "Confluence" por "SharePoint" na descrição → "Azure DevOps, Teams, SharePoint — pra que serve cada uma na prática."
  - **B:** Adicionar uma seção de Confluence ao corpo (só se a ferramenta for mesmo usada).

---

## 🟧 Consistência de marca / nomenclatura

### INC-08 — "Sharepoint" → "SharePoint"
- **Onde:** `lib/seed/chapters.ts` — 8 ocorrências (linhas 296, 324, 325, 338, 370, 382 ×2, 472).
- **Problema:** A grafia oficial do produto Microsoft é **SharePoint** (P maiúsculo).
- **Correção:** Substituição global "Sharepoint" → "SharePoint".

### INC-09 — Produto chamado "o kit" no conteúdo vs "Citiesoft Onboard" na UI
- **Onde:** `lib/seed/chapters.ts:484` (Cap. 09): "O **kit** é o guia prático..."; UI usa "Citiesoft Onboard" de forma consistente (nav, layout, login, convite).
- **Problema:** O usuário lê "Citiesoft Onboard" na interface mas "o kit"/"este kit" no conteúdo — herança do nome antigo (Analista Starter Kit).
- **Opções:**
  - **A (recomendada):** Padronizar o conteúdo para "o Citiesoft Onboard" (ou "este guia").
  - **B:** Manter "kit" como apelido informal, se for intencional.

---

## ⬜ Confirmar intenção

### INC-10 — Footer "Desenvolvido pelo Citiesoft"
- **Onde:** `components/LandingPage.tsx:244`.
- **Atual:** "Desenvolvido **pelo** Citiesoft" (mudança deliberada feita nesta sessão; antes era "pela").
- **Ponto:** Se "Citiesoft" é tratado como **a empresa**, a concordância pediria "**pela** Citiesoft". Se o sentido é "o time/o produto Citiesoft", "pelo" se sustenta.
- **Ação:** Só confirmar qual leitura você quer. Sem mudança automática.

---

## 🟦 Melhorias de redação (menores)

### INC-11 — "alta-velocidade" (Cap. 11)
- **Onde:** `lib/seed/chapters.ts:569`.
- **Atual:** "Slack / Discord de Analistas: comunidades informais, **alta-velocidade**."
- **Problema:** Hífen indevido e frase truncada.
- **Sugestão:** "...comunidades informais **e de alta velocidade**." (ou "...informais, **de troca rápida**.")

### INC-12 — "Se persiste o desacordo" (Cap. 01)
- **Onde:** `lib/seed/chapters.ts:46` (parte do INC-03).
- **Sugestão:** Trocar o presente do indicativo pelo futuro do subjuntivo: "Se o desacordo **persistir**...". (Já contemplado nas opções do INC-03.)

### INC-13 — Formato de "readTime" sem padrão
- **Onde:** todos os capítulos.
- **Observação:** Os rótulos variam: "5 min de leitura", "Consulta livre", "5 min de leitura + consulta", "Consulta livre". Não é erro, mas se quiser padronização visual, vale uniformizar (ex.: sempre "X min de leitura" e usar "Consulta livre" só nos de referência — que já é o caso). **Baixa prioridade.**

---

## Resumo

| ID | Tipo | Severidade | Capítulo/Arquivo | Status |
|----|------|-----------|------------------|--------|
| INC-01 | Ortografia | Alta | Cap. 06 | ✅ Corrigido (leem) |
| INC-02 | Pronome | Média | Cap. 11 | ✅ Corrigido (você virou) |
| INC-03 | Concordância + léxico | Média | Cap. 01 | ✅ Corrigido (Se o desacordo persistir, escale…) |
| INC-04 | Rascunho vazando | Alta | Cap. 07 | ✅ Callout removido |
| INC-05 | Rascunho vazando | Alta | Cap. 09 | ✅ Callout removido |
| INC-06 | Rascunho vazando | Alta | Cap. 10 | ✅ Reescrito (sem "form/Q6") |
| INC-07 | Descrição × corpo | Média | Cap. 06 | ✅ Confluence → SharePoint |
| INC-08 | Marca | Baixa | Cap. 06/07/09 | ✅ Sharepoint → SharePoint (8×) |
| INC-09 | Nomenclatura | Média | Cap. 09 + UI | ✅ "kit" → "Citiesoft Onboard"/"guia" |
| INC-10 | Confirmar | — | Landing | ⬜ Mantido "pelo" (aguarda sua decisão) |
| INC-11 | Estilo | Baixa | Cap. 11 | ✅ Corrigido (alta velocidade) |
| INC-12 | Estilo | Baixa | Cap. 01 | ✅ Coberto pelo INC-03 |
| INC-13 | Padronização | Baixa | Todos | ⏭️ Pulado (não é erro) |
