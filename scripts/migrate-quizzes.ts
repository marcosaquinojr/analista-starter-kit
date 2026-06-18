/**
 * Quizzes gamificados (estilo Kahoot solo) + resultados pra XP/medalhas.
 * Cria 5 tabelas: quizzes, quiz_questions, quiz_prereqs, quiz_areas,
 * quiz_results. Aditiva e idempotente (CREATE TABLE IF NOT EXISTS) — não
 * toca em nada existente. XP/nível/medalhas são derivados de quiz_results.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-quizzes.ts
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");
  const sql = neon(url);

  console.log("Iniciando migração de quizzes…");

  await sql`
    CREATE TABLE IF NOT EXISTS quizzes (
      slug text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      trail_slug text NOT NULL REFERENCES trails(slug),
      pass_threshold integer NOT NULL DEFAULT 70,
      seconds_per_question integer NOT NULL DEFAULT 20,
      sort_order integer NOT NULL,
      updated_at text NOT NULL DEFAULT '',
      updated_by text NOT NULL DEFAULT ''
    )`;
  console.log("  ✓ quizzes");

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id text PRIMARY KEY,
      quiz_slug text NOT NULL REFERENCES quizzes(slug) ON DELETE CASCADE,
      type text NOT NULL,
      text text NOT NULL,
      options jsonb NOT NULL,
      points integer NOT NULL DEFAULT 1000,
      sort_order integer NOT NULL
    )`;
  console.log("  ✓ quiz_questions");

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_prereqs (
      quiz_slug text NOT NULL REFERENCES quizzes(slug) ON DELETE CASCADE,
      chapter_slug text NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
      PRIMARY KEY (quiz_slug, chapter_slug)
    )`;
  console.log("  ✓ quiz_prereqs");

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_areas (
      quiz_slug text NOT NULL REFERENCES quizzes(slug) ON DELETE CASCADE,
      area_slug text NOT NULL REFERENCES areas(slug) ON DELETE CASCADE,
      PRIMARY KEY (quiz_slug, area_slug)
    )`;
  console.log("  ✓ quiz_areas");

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_slug text NOT NULL REFERENCES quizzes(slug) ON DELETE CASCADE,
      score integer NOT NULL,
      correct_count integer NOT NULL,
      total_questions integer NOT NULL,
      passed boolean NOT NULL,
      taken_at text NOT NULL
    )`;
  console.log("  ✓ quiz_results");

  console.log("Migração de quizzes concluída.");
}

main().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
