"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { saveQuiz, deleteQuiz, type ActionState } from "@/app/admin/actions";
import type { QuizFull } from "@/lib/quizzes";
import type { TrailMeta, AreaMeta, ChapterMeta } from "@/lib/types";
import { toast } from "@/lib/toast-store";

const initial: ActionState = {};

type QOption = { text: string; correct: boolean };
type QState = { type: string; text: string; options: QOption[] };

export default function QuizEditor({
  quiz,
  trails,
  allAreas,
  allChapters,
}: {
  quiz: QuizFull;
  trails: TrailMeta[];
  allAreas: AreaMeta[];
  allChapters: ChapterMeta[];
}) {
  const [state, action, pending] = useActionState(saveQuiz, initial);

  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [trailSlug, setTrailSlug] = useState(quiz.trailSlug);
  const [passThreshold, setPassThreshold] = useState(String(quiz.passThreshold));
  const [seconds, setSeconds] = useState(String(quiz.secondsPerQuestion));
  const [areaSlugs, setAreaSlugs] = useState<string[]>(quiz.areaSlugs);
  const [prereqSlugs, setPrereqSlugs] = useState<string[]>(quiz.prereqSlugs);
  const [questions, setQuestions] = useState<QState[]>(
    quiz.questions.map((q) => ({
      type: q.type,
      text: q.text,
      options: q.options,
    })),
  );

  useEffect(() => {
    if (state.ok) toast.success("Quiz salvo.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  // ── perguntas ──────────────────────────────────────────────────────────
  const addQuestion = (type: "mc" | "tf") =>
    setQuestions((qs) => [
      ...qs,
      type === "tf"
        ? {
            type,
            text: "",
            options: [
              { text: "Verdadeiro", correct: true },
              { text: "Falso", correct: false },
            ],
          }
        : {
            type,
            text: "",
            options: [
              { text: "", correct: true },
              { text: "", correct: false },
            ],
          },
    ]);

  const update = (i: number, patch: (q: QState) => QState) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? patch(q) : q)));

  const removeQuestion = (i: number) =>
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));

  const setCorrect = (i: number, oi: number) =>
    update(i, (q) => ({
      ...q,
      options: q.options.map((o, j) => ({ ...o, correct: j === oi })),
    }));

  const setOptText = (i: number, oi: number, text: string) =>
    update(i, (q) => ({
      ...q,
      options: q.options.map((o, j) => (j === oi ? { ...o, text } : o)),
    }));

  const addOption = (i: number) =>
    update(i, (q) =>
      q.options.length < 4
        ? { ...q, options: [...q.options, { text: "", correct: false }] }
        : q,
    );

  const removeOption = (i: number, oi: number) =>
    update(i, (q) => {
      if (q.options.length <= 2) return q;
      const options = q.options.filter((_, j) => j !== oi);
      if (!options.some((o) => o.correct)) options[0].correct = true;
      return { ...q, options };
    });

  const tile = ["tile-red", "tile-blue", "tile-gold", "tile-green"];

  return (
    <form action={action} className="editor">
      <div className="editor-bar">
        <div className="editor-bar-left">
          <span className="editor-slug">/admin/quiz/{quiz.slug}</span>
          <span className="editor-updated">
            Última atualização: {quiz.updatedAt || "—"}
            {quiz.updatedBy ? ` por ${quiz.updatedBy}` : ""}
          </span>
        </div>
        <div className="editor-bar-right">
          {state.ok && <span className="editor-saved">Salvo ✓</span>}
          {state.error && <span className="admin-error">{state.error}</span>}
          <Link href="/admin" className="trail-btn">
            Cancelar
          </Link>
          <button type="submit" className="btn-complete" disabled={pending}>
            {pending ? "Salvando…" : "Salvar quiz"}
          </button>
        </div>
      </div>

      <div className="admin-intro">
        <Link href="/admin" className="header-link">
          ← Capítulos
        </Link>
        <h1>Editar quiz</h1>
        <p>
          Monte o quiz estilo Kahoot. Defina trilha, áreas e os capítulos
          que a pessoa precisa concluir pra liberar o quiz; depois adicione as
          perguntas.
        </p>
      </div>

      <input type="hidden" name="slug" value={quiz.slug} />
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />

      <div className="editor-meta" style={{ gap: "16px" }}>
        <label className="field field-grow">
          <span>Título</span>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="field field-sm">
          <span>Trilha</span>
          <select
            name="trail"
            value={trailSlug}
            onChange={(e) => setTrailSlug(e.target.value)}
          >
            {trails.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field field-sm">
          <span>Nota mínima (%)</span>
          <input
            name="passThreshold"
            type="number"
            min={0}
            max={100}
            value={passThreshold}
            onChange={(e) => setPassThreshold(e.target.value)}
          />
        </label>
        <label className="field field-sm">
          <span>Tempo/pergunta (s)</span>
          <input
            name="secondsPerQuestion"
            type="number"
            min={5}
            max={120}
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
        </label>
        <label className="field field-full">
          <span>Descrição</span>
          <input
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Aparece na capa do quiz"
          />
        </label>

        <div className="field field-full" style={{ marginTop: "4px" }}>
          <span>Áreas</span>
          {allAreas.length === 0 ? (
            <span className="area-checks-empty">Crie áreas em Conteúdo → Áreas.</span>
          ) : (
            <div className="area-checks">
              {allAreas.map((a) => {
                const on = areaSlugs.includes(a.slug);
                return (
                  <label key={a.slug} className={`area-check${on ? " on" : ""}`}>
                    <input
                      type="checkbox"
                      name="areas"
                      value={a.slug}
                      checked={on}
                      onChange={(e) =>
                        setAreaSlugs((p) =>
                          e.target.checked ? [...p, a.slug] : p.filter((s) => s !== a.slug),
                        )
                      }
                    />
                    {a.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="field field-full" style={{ marginTop: "4px" }}>
          <span>Pré-requisitos (capítulos que liberam o quiz)</span>
          {allChapters.length === 0 ? (
            <span className="area-checks-empty">Nenhum capítulo ainda.</span>
          ) : (
            <div className="area-checks">
              {allChapters.map((c) => {
                const on = prereqSlugs.includes(c.slug);
                return (
                  <label key={c.slug} className={`area-check${on ? " on" : ""}`}>
                    <input
                      type="checkbox"
                      name="prereqs"
                      value={c.slug}
                      checked={on}
                      onChange={(e) =>
                        setPrereqSlugs((p) =>
                          e.target.checked ? [...p, c.slug] : p.filter((s) => s !== c.slug),
                        )
                      }
                    />
                    {c.number} · {c.title}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Construtor de perguntas */}
      <div className="quiz-builder">
        <div className="quiz-builder-head">
          <span className="sidebar-label" style={{ margin: 0 }}>
            Perguntas ({questions.length})
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="trail-btn" onClick={() => addQuestion("mc")}>
              + Múltipla escolha
            </button>
            <button type="button" className="trail-btn" onClick={() => addQuestion("tf")}>
              + Verdadeiro/Falso
            </button>
          </div>
        </div>

        {questions.length === 0 && (
          <p className="area-checks-empty">
            Nenhuma pergunta ainda. Adicione múltipla escolha ou verdadeiro/falso.
          </p>
        )}

        {questions.map((q, i) => (
          <div className="quiz-q" key={i}>
            <div className="quiz-q-head">
              <span className="quiz-q-num">{i + 1}</span>
              <span className="quiz-q-type">
                {q.type === "tf" ? "Verdadeiro/Falso" : "Múltipla escolha"}
              </span>
              <button
                type="button"
                className="trail-btn trail-btn-danger"
                onClick={() => removeQuestion(i)}
                style={{ marginLeft: "auto" }}
              >
                Remover
              </button>
            </div>
            <input
              className="quiz-q-text"
              value={q.text}
              placeholder="Enunciado da pergunta"
              onChange={(e) => update(i, (qq) => ({ ...qq, text: e.target.value }))}
            />
            <div className="quiz-opts">
              {q.options.map((o, oi) => (
                <div className={`quiz-opt ${tile[oi % 4]}`} key={oi}>
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    checked={o.correct}
                    onChange={() => setCorrect(i, oi)}
                    title="Marcar como correta"
                  />
                  <input
                    className="quiz-opt-text"
                    value={o.text}
                    placeholder={`Opção ${oi + 1}`}
                    disabled={q.type === "tf"}
                    onChange={(e) => setOptText(i, oi, e.target.value)}
                  />
                  {q.type === "mc" && q.options.length > 2 && (
                    <button
                      type="button"
                      className="quiz-opt-x"
                      onClick={() => removeOption(i, oi)}
                      aria-label="Remover opção"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {q.type === "mc" && q.options.length < 4 && (
                <button
                  type="button"
                  className="trail-btn"
                  onClick={() => addOption(i)}
                >
                  + Opção
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.error && <p className="admin-error">{state.error}</p>}

      <div className="editor-danger" style={{ marginTop: "32px" }}>
        <div className="editor-danger-text">
          <strong>⚠️ Excluir quiz</strong>
          <span>Remove o quiz e suas perguntas de vez. Não pode ser desfeito.</span>
        </div>
        <button
          type="submit"
          formAction={deleteQuiz}
          className="trail-btn trail-btn-danger"
          onClick={(e) => {
            if (!confirm(`Excluir o quiz "${title}"?`)) e.preventDefault();
          }}
        >
          Excluir quiz
        </button>
      </div>
    </form>
  );
}
