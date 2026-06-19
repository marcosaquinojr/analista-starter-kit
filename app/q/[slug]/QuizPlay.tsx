"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Circle,
  Diamond,
  Flame,
  Play,
  RotateCcw,
  Square,
  Target,
  Triangle,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { submitQuizResult } from "@/app/admin/actions";
import ConfirmModal from "@/components/ConfirmModal";

type Option = { text: string; correct: boolean };
type Question = { id: string; type: string; text: string; options: Option[] };
type Quiz = {
  slug: string;
  title: string;
  description: string;
  passThreshold: number;
  secondsPerQuestion: number;
  questions: Question[];
};

const TILES = [
  { cls: "q-red", Icon: Triangle },
  { cls: "q-blue", Icon: Diamond },
  { cls: "q-gold", Icon: Circle },
  { cls: "q-green", Icon: Square },
];

// ── Som (Web Audio, sintetizado — sem assets) ──────────────────────────────
let globalMuted = typeof window !== "undefined" ? localStorage.getItem("quiz-muted") === "true" : false;
let actx: AudioContext | null = null;
function tone(freq: number, durMs: number, type: OscillatorType = "sine", vol = 0.15) {
  if (globalMuted) return;
  try {
    if (!actx)
      actx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + durMs / 1000);
    o.stop(actx.currentTime + durMs / 1000);
  } catch {
    /* áudio bloqueado — segue sem som */
  }
}
function playChiptuneNote(freq: number, durMs: number, vol = 0.05) {
  if (globalMuted) return;
  try {
    if (!actx)
      actx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    if (actx.state === "suspended") {
      actx.resume();
    }
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.linearRampToValueAtTime(vol * 0.7, actx.currentTime + durMs * 0.1 / 1000);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + durMs / 1000);
    o.connect(g);
    g.connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + durMs / 1000);
  } catch {
    /* áudio bloqueado — segue sem som */
  }
}
const sfx = {
  start: () => [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 130), i * 110)),
  correct: () => {
    tone(880, 120, "triangle");
    setTimeout(() => tone(1320, 160, "triangle"), 90);
  },
  wrong: () => tone(150, 300, "sawtooth", 0.12),
  finish: () =>
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 200, "triangle"), i * 130)),
};

export default function QuizPlay({ quiz }: { quiz: Quiz }) {
  const total = quiz.questions.length;
  const maxMs = quiz.secondsPerQuestion * 1000;

  const [phase, setPhase] = useState<"lobby" | "playing" | "done">("lobby");
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxMs);
  const [gain, setGain] = useState<number | null>(null); // pontos da última pergunta
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    pct: number;
    passed: boolean;
    score: number;
  } | null>(null);
  const [muted, setMuted] = useState(globalMuted);
  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const toggleMute = () => {
    const nextVal = !muted;
    globalMuted = nextVal;
    setMuted(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz-muted", String(nextVal));
    }
  };
  const startRef = useRef(0);
  const pauseStartRef = useRef(0);
  const answersRef = useRef<{ questionId: string; chosenIndex: number; msTaken: number }[]>([]);
  const correctRef = useRef(0);
  const scoreRef = useRef(0);
  const lockRef = useRef(false);

  const q = quiz.questions[qi];

  const beginQuestion = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    setGain(null);
    setTimeLeft(maxMs);
    startRef.current = Date.now();
    lockRef.current = false;
  }, [maxMs]);

  const finish = useCallback(() => {
    const correct = correctRef.current;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= quiz.passThreshold;
    setResult({ correct, total, pct, passed, score: scoreRef.current });
    setPhase("done");
    sfx.finish();
    // persiste no servidor (recomputa lá); best-effort, não trava a UI
    submitQuizResult({ quizSlug: quiz.slug, answers: answersRef.current }).catch(
      () => {},
    );
  }, [total, quiz.passThreshold, quiz.slug]);

  const answer = useCallback(
    (index: number | null) => {
      if (lockRef.current) return;
      lockRef.current = true;
      const msTaken = Math.min(Date.now() - startRef.current, maxMs);
      const chosen = index;
      const isCorrect = chosen != null && q.options[chosen]?.correct === true;
      answersRef.current.push({
        questionId: q.id,
        chosenIndex: chosen ?? -1,
        msTaken,
      });
      let pts = 0;
      if (isCorrect) {
        pts = Math.round(500 + 500 * ((maxMs - msTaken) / maxMs));
        correctRef.current += 1;
        scoreRef.current += pts;
        setScore(scoreRef.current);
        setCombo((c) => c + 1);
        sfx.correct();
      } else {
        setCombo(0);
        sfx.wrong();
      }
      setGain(isCorrect ? pts : 0);
      setSelected(chosen);
      setRevealed(true);

      window.setTimeout(() => {
        if (qi + 1 >= total) {
          finish();
        } else {
          setQi((i) => i + 1);
        }
      }, 1500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revealed, q, maxMs, qi, total],
  );

  // Cronômetro da pergunta (o setState ocorre no callback do intervalo).
  useEffect(() => {
    if (phase !== "playing" || revealed || showExitConfirm) return;
    const id = window.setInterval(() => {
      const left = maxMs - (Date.now() - startRef.current);
      if (left <= 0) {
        window.clearInterval(id);
        answer(null); // tempo esgotou = errou
      } else {
        setTimeLeft(left);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [phase, revealed, qi, maxMs, answer, showExitConfirm]);

  // Ao trocar de pergunta, reinicia o estado dela (seleção, timer…).
  useEffect(() => {
    if (phase === "playing") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      beginQuestion();
    }
  }, [qi, phase, beginQuestion]);

  // Música de fundo 8-bit (chiptune) loop
  useEffect(() => {
    if (phase !== "playing" || muted) return;

    // Sequência de notas (arpeggio retro cativante)
    const melody = [
      // Am
      220.00, 261.63, 329.63, 440.00, 329.63, 261.63,
      220.00, 261.63, 329.63, 440.00, 329.63, 261.63,
      // F
      174.61, 220.00, 261.63, 349.23, 261.63, 220.00,
      174.61, 220.00, 261.63, 349.23, 261.63, 220.00,
      // G
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
      // E
      164.81, 207.65, 246.94, 329.63, 246.94, 207.65,
      164.81, 207.65, 246.94, 329.63, 246.94, 207.65,
    ];

    let noteIndex = 0;
    const intervalMs = 200; // 5 notas por segundo

    const timer = window.setInterval(() => {
      const freq = melody[noteIndex % melody.length];
      playChiptuneNote(freq, intervalMs - 20, 0.03); // Volume bem sutil
      noteIndex++;
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [phase, muted]);

  // Pausa e ajusta o timer quando o modal de confirmação estiver aberto
  useEffect(() => {
    if (showExitConfirm) {
      pauseStartRef.current = Date.now();
    } else if (pauseStartRef.current > 0) {
      const pausedDuration = Date.now() - pauseStartRef.current;
      startRef.current += pausedDuration;
      pauseStartRef.current = 0;
    }
  }, [showExitConfirm]);

  const start = () => {
    sfx.start();
    answersRef.current = [];
    correctRef.current = 0;
    scoreRef.current = 0;
    lockRef.current = false;
    setScore(0);
    setCombo(0);
    setQi(0);
    setPhase("playing");
  };

  const replay = () => {
    setResult(null);
    setPhase("lobby");
  };

  // ── Lobby ────────────────────────────────────────────────────────────────
  if (phase === "lobby") {
    const xp = total * 1000;
    return (
      <div className="quiz-stage">
        <div className="quiz-lobby">
          <span className="quiz-lobby-badge">QUIZ</span>
          <h1 className="quiz-lobby-title">{quiz.title}</h1>
          {quiz.description && <p className="quiz-lobby-desc">{quiz.description}</p>}
          <div className="quiz-lobby-stats">
            <div>
              <strong>{total}</strong>
              <span>{total === 1 ? "pergunta" : "perguntas"}</span>
            </div>
            <div>
              <strong>{quiz.secondsPerQuestion}s</strong>
              <span>por pergunta</span>
            </div>
            <div>
              <strong>até {xp}</strong>
              <span>XP em jogo</span>
            </div>
            <div>
              <strong>{quiz.passThreshold}%</strong>
              <span>pra passar</span>
            </div>
          </div>
          <button className="quiz-start" onClick={start}>
            <Play size={20} fill="currentColor" strokeWidth={0} />
            Começar
          </button>
          <Link href="/" className="quiz-exit">
            <ArrowLeft size={15} />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  // ── Tela final ─────────────────────────────────────────────────────────────
  if (phase === "done" && result) {
    return (
      <div className="quiz-stage">
        {result.passed && <Confetti />}
        <div className="quiz-result">
          <div className={`quiz-result-emoji ${result.passed ? "pass" : "fail"}`}>
            {result.passed ? <Trophy size={72} /> : <Target size={72} />}
          </div>
          <h1 className="quiz-result-title">
            {result.passed ? "Você passou!" : "Quase lá!"}
          </h1>
          <div className="quiz-result-score">{result.score} XP</div>
          <p className="quiz-result-sub">
            {result.correct} de {result.total} certas · {result.pct}%
            {!result.passed && ` (precisa de ${quiz.passThreshold}%)`}
          </p>
          <div className="quiz-result-actions">
            <button className="quiz-start" onClick={replay}>
              <RotateCcw size={18} />
              Refazer
            </button>
            <Link href="/" className="quiz-exit-btn">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Pergunta ────────────────────────────────────────────────────────────────
  const pct = Math.max(0, (timeLeft / maxMs) * 100);
  const secondsLeft = Math.ceil(timeLeft / 1000);
  return (
    <div className="quiz-stage playing">
      <div className="quiz-topbar">
        <button
          type="button"
          className="quiz-topbar-exit-btn"
          title="Sair do quiz"
          onClick={() => setShowExitConfirm(true)}
        >
          <X size={15} />
          <span>Sair</span>
        </button>
        <span className="quiz-progress">
          {qi + 1}/{total}
        </span>
        <div className="quiz-timer">
          <div className="quiz-timer-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="quiz-timer-text">{secondsLeft}s</span>
        <span className="quiz-score">
          {score} XP
          {combo >= 2 && (
            <span className="quiz-combo">
              <Flame size={13} fill="currentColor" /> {combo}
            </span>
          )}
        </span>
        <button className="quiz-topbar-mute" onClick={toggleMute} title={muted ? "Ativar som" : "Desativar som"}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="quiz-question">
        <h2 key={qi} className="quiz-question-text">
          {q.text}
        </h2>
        {gain != null && (
          <div className={`quiz-gain ${gain > 0 ? "good" : "bad"}`} key={`g-${qi}`}>
            {gain > 0 ? `+${gain}` : "Errou"}
          </div>
        )}
      </div>

      <div className={`quiz-grid n-${q.options.length}`}>
        {q.options.map((o, i) => {
          const t = TILES[i % 4];
          const state = revealed
            ? o.correct
              ? "correct"
              : i === selected
                ? "wrong"
                : "dim"
            : "";
          const Shape = t.Icon;
          return (
            <button
              key={i}
              className={`quiz-tile ${t.cls} ${state}`}
              disabled={revealed}
              onClick={() => answer(i)}
            >
              <span className="quiz-tile-shape">
                <Shape size={22} fill="currentColor" strokeWidth={0} />
              </span>
              <span className="quiz-tile-text">{o.text}</span>
              {revealed && o.correct && (
                <span className="quiz-tile-mark">
                  <Check size={18} strokeWidth={3} />
                </span>
              )}
              {revealed && i === selected && !o.correct && (
                <span className="quiz-tile-mark">
                  <X size={18} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ConfirmModal
        open={showExitConfirm}
        title="Sair do Quiz"
        message="Deseja mesmo sair do quiz? Seu progresso nesta tentativa será perdido."
        confirmLabel="Sair"
        cancelLabel="Continuar jogando"
        danger
        onConfirm={() => router.push("/")}
        onClose={() => setShowExitConfirm(false)}
      />
    </div>
  );
}

// Confete simples (sem dependência). As peças aleatórias são geradas UMA vez,
// no inicializador do useState (escopo de módulo) — render puro, sem
// Math.random durante a renderização e sem setState em efeito.
type Piece = { left: number; delay: number; dur: number; bg: string; rot: number };
function makeConfetti(): Piece[] {
  const colors = ["#e21b3c", "#1368ce", "#d89e00", "#26890c", "#146bfa", "#ec4899"];
  return Array.from({ length: 90 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 2.2 + Math.random() * 1.4,
    bg: colors[i % colors.length],
    rot: Math.random() * 360,
  }));
}
function Confetti() {
  const [pieces] = useState<Piece[]>(makeConfetti);
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.bg,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
