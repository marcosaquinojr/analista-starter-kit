/**
 * Publica as trilhas de onboarding das áreas DESENVOLVIMENTO e DESIGN:
 * capítulos 06-12 (Rotina + Crescimento) de cada área + 1 quiz por área.
 *
 * Comportamento SEGURO e idempotente (mesmo espírito do db:seed):
 *   - capítulo/quiz que já existe é preservado (nunca sobrescreve edição
 *     feita no /admin); só insere o que falta.
 *   - perguntas do quiz só são inseridas quando o quiz é criado agora.
 *   - pode rodar quantas vezes quiser.
 *
 * Pré-requisito: áreas `desenvolvimento` e `design` e trilhas `rotina` e
 * `crescimento` já existem no banco (verificado em 02/07/2026).
 *
 *   npm run db:seed:trilhas
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  chapters,
  chapterAreas,
  quizzes,
  quizQuestions,
  quizAreas,
  quizPrereqs,
} from "../lib/db/schema";
import { seedChaptersDev } from "../lib/seed/chapters-dev";
import { seedChaptersDesign } from "../lib/seed/chapters-design";

type Opt = { text: string; correct: boolean };
interface SeedQuiz {
  slug: string;
  title: string;
  description: string;
  trailSlug: string;
  sortOrder: number;
  areaSlug: string;
  prereqSlugs: string[];
  questions: { type: "mc" | "tf"; text: string; options: Opt[] }[];
}

const seedQuizzes: SeedQuiz[] = [
  {
    slug: "quiz-rotina-dev",
    title: "Quiz — Rotina do Dev",
    description: "Valide o que você absorveu dos capítulos 06 a 09.",
    trailSlug: "rotina",
    sortOrder: 2,
    areaSlug: "desenvolvimento",
    prereqSlugs: ["dev-processo", "dev-ferramentas", "dev-padroes", "dev-qualidade"],
    questions: [
      {
        type: "mc",
        text: "Você pegou um PBI com um critério de aceite ambíguo. Qual é o caminho da casa?",
        options: [
          { text: "Implementar a interpretação mais provável e seguir", correct: false },
          { text: "Perguntar por escrito no comentário do PBI, marcando o analista", correct: true },
          { text: "Resolver numa conversa de corredor e codar", correct: false },
          { text: "Devolver o PBI pro backlog sem comentário", correct: false },
        ],
      },
      {
        type: "tf",
        text: "Build quebrado na branch principal é prioridade zero do squad.",
        options: [
          { text: "Verdadeiro", correct: true },
          { text: "Falso", correct: false },
        ],
      },
      {
        type: "mc",
        text: "O QA reprovou seu PBI e você não reproduz o bug na sua máquina. O que fazer?",
        options: [
          { text: "Devolver com \"não acontece aqui\"", correct: false },
          { text: "Reproduzir no ambiente de homologação, onde foi reportado", correct: true },
          { text: "Pedir pro QA executar o Test Case de novo", correct: false },
          { text: "Subir uma correção preventiva por garantia", correct: false },
        ],
      },
      {
        type: "mc",
        text: "Qual dessas opções descreve um PR saudável?",
        options: [
          { text: "2000 linhas cobrindo a sprint inteira", correct: false },
          { text: "Pequeno, vinculado ao work item, build verde e auto-revisado", correct: true },
          { text: "Sem descrição — o código fala por si", correct: false },
          { text: "Feature + refactor + estilo, tudo junto pra economizar revisão", correct: false },
        ],
      },
      {
        type: "tf",
        text: "Copiar a base de produção pra sua máquina é aceitável se for só temporário.",
        options: [
          { text: "Verdadeiro", correct: false },
          { text: "Falso", correct: true },
        ],
      },
      {
        type: "mc",
        text: "Quem fecha um bug aberto pelo QA?",
        options: [
          { text: "O dev que corrigiu, ao dar merge", correct: false },
          { text: "O PO, na revisão da sprint", correct: false },
          { text: "O QA, depois do reteste", correct: true },
          { text: "Fecha automaticamente com o deploy", correct: false },
        ],
      },
    ],
  },
  {
    slug: "quiz-rotina-design",
    title: "Quiz — Rotina do Design",
    description: "Valide o que você absorveu dos capítulos 06 a 09.",
    trailSlug: "rotina",
    sortOrder: 3,
    areaSlug: "design",
    prereqSlugs: ["design-processo", "design-ferramentas", "design-prototipos", "design-handoff"],
    questions: [
      {
        type: "mc",
        text: "Num protótipo de discovery de uma tela de despesa, quais valores monetários aparecem?",
        options: [
          { text: "Todos: somatórios, saldos e valores de contrato", correct: false },
          { text: "Só o valor de referência do documento no cabeçalho (ex.: valor da NF)", correct: true },
          { text: "Nenhum número, nunca", correct: false },
          { text: "Os valores reais do cliente, pra dar realismo", correct: false },
        ],
      },
      {
        type: "tf",
        text: "Quando o caso tem ambiguidade, o protótipo deve resolvê-la sozinho no caso feliz pra demo fluir melhor.",
        options: [
          { text: "Verdadeiro", correct: false },
          { text: "Falso", correct: true },
        ],
      },
      {
        type: "mc",
        text: "O deck de Continuous Discovery da casa tem estrutura fixa de quantas telas?",
        options: [
          { text: "6", correct: false },
          { text: "8", correct: true },
          { text: "10", correct: false },
          { text: "Varia por feature", correct: false },
        ],
      },
      {
        type: "mc",
        text: "O que um handoff completo inclui?",
        options: [
          { text: "A tela final polida, e o resto o dev deduz", correct: false },
          { text: "Estados (vazio/carregando/erro/cheio), comportamento por perfil e conversa com o dev", correct: true },
          { text: "O link do Figma jogado no chat do squad", correct: false },
          { text: "Um PDF com todas as telas exportadas", correct: false },
        ],
      },
      {
        type: "tf",
        text: "Validar o fluxo com o secretário que contrata substitui a validação com o servidor que opera a tela.",
        options: [
          { text: "Verdadeiro", correct: false },
          { text: "Falso", correct: true },
        ],
      },
      {
        type: "mc",
        text: "Qual é a dupla tipográfica do brand pack Citiesoft?",
        options: [
          { text: "Red Hat Display (títulos) + Inter (texto)", correct: true },
          { text: "Roboto + Open Sans", correct: false },
          { text: "Montserrat + Lato", correct: false },
          { text: "Arial + Helvetica", correct: false },
        ],
      },
    ],
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const db = drizzle(neon(url));

  const areaOf: Record<string, string> = {};
  for (const c of seedChaptersDev) areaOf[c.slug] = "desenvolvimento";
  for (const c of seedChaptersDesign) areaOf[c.slug] = "design";

  console.log("\nModo seguro: só insere o que falta; não toca no que existe.\n");

  // ── Capítulos + vínculo com a área ─────────────────────────────────────
  let inserted = 0;
  let skipped = 0;
  for (const c of [...seedChaptersDev, ...seedChaptersDesign]) {
    const area = areaOf[c.slug];
    const row = {
      slug: c.slug,
      sortOrder: c.sortOrder,
      number: c.number,
      trailSlug: c.trailSlug,
      title: c.title,
      description: c.description,
      readTime: c.readTime,
      bodyHtml: c.bodyHtml,
      updatedAt: c.updatedAt,
      onboardingTrack: area, // campo legado, mantido coerente
    };
    const res = await db
      .insert(chapters)
      .values(row)
      .onConflictDoNothing({ target: chapters.slug })
      .returning({ slug: chapters.slug });
    if (res.length > 0) {
      inserted += 1;
      console.log(`  ✓ (inserido) [${area}] ${c.number} ${c.title}`);
    } else {
      skipped += 1;
      console.log(`  – (já existe, mantido) [${area}] ${c.number} ${c.title}`);
    }
    // vínculo capítulo ↔ área (idempotente; vale mesmo pro capítulo pré-existente)
    await db
      .insert(chapterAreas)
      .values({ chapterSlug: c.slug, areaSlug: area })
      .onConflictDoNothing();
  }
  console.log(`\nCapítulos: ${inserted} inseridos, ${skipped} preservados.`);

  // ── Quizzes ────────────────────────────────────────────────────────────
  for (const q of seedQuizzes) {
    const res = await db
      .insert(quizzes)
      .values({
        slug: q.slug,
        title: q.title,
        description: q.description,
        trailSlug: q.trailSlug,
        sortOrder: q.sortOrder,
        updatedAt: "02/07/2026",
        updatedBy: "seed",
      })
      .onConflictDoNothing({ target: quizzes.slug })
      .returning({ slug: quizzes.slug });

    if (res.length === 0) {
      console.log(`  – quiz "${q.title}" já existe — perguntas preservadas.`);
    } else {
      for (const [i, question] of q.questions.entries()) {
        await db
          .insert(quizQuestions)
          .values({
            id: `${q.slug}-q${i + 1}`,
            quizSlug: q.slug,
            type: question.type,
            text: question.text,
            options: question.options,
            points: 1000,
            sortOrder: i + 1,
          })
          .onConflictDoNothing();
      }
      console.log(`  ✓ quiz "${q.title}" criado com ${q.questions.length} perguntas.`);
    }

    // vínculos (idempotentes, valem mesmo se o quiz já existia)
    await db
      .insert(quizAreas)
      .values({ quizSlug: q.slug, areaSlug: q.areaSlug })
      .onConflictDoNothing();
    for (const prereq of q.prereqSlugs) {
      await db
        .insert(quizPrereqs)
        .values({ quizSlug: q.slug, chapterSlug: prereq })
        .onConflictDoNothing();
    }
  }

  console.log("\nConcluído. Confira no /admin (áreas Desenvolvimento e Design).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
