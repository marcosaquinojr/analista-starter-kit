"use client";

import { useEffect, useRef, useState } from "react";

const MOTIVACIONAIS = [
  "Cada capítulo te deixa mais Citier! 💙",
  "Foco no progresso, não na perfeição. 🚀",
  "Você tá indo muito bem. Bora pra próxima? 🔥",
  "Conhecimento é o melhor investimento. 📚",
  "Um passo de cada vez chega longe. 👣",
  "Bora aprender algo novo hoje? ✨",
  "Confia no processo — você consegue! 💪",
  "Tamo junto nessa jornada! 🤝",
];

export default function CitieMascot({ introMessage }: { introMessage: string }) {
  const [phase, setPhase] = useState<"intro" | "idle" | "talking">("intro");
  const [message, setMessage] = useState(introMessage);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Após alguns segundos falando a saudação, colapsa para a versão 2D.
  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 6500);
    return () => clearTimeout(t);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function speak() {
    const phrase =
      MOTIVACIONAIS[Math.floor(Math.random() * MOTIVACIONAIS.length)];
    setMessage(phrase);
    setPhase("talking");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("idle"), 5500);
  }

  const isIntro = phase === "intro";
  const showBubble = phase === "intro" || phase === "talking";

  return (
    <div className={`citie-mascot${isIntro ? "" : " citie-mascot--idle"}`}>
      {showBubble && (
        <div className="citie-bubble citie-bubble--left" key={message}>
          {message}
        </div>
      )}
      <button
        type="button"
        className="citie-trigger"
        onClick={speak}
        aria-label="Falar com o Citiezinho"
        title="Clique para uma dose de motivação"
      >
        {isIntro ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/citiezinho.png"
            alt=""
            width={64}
            height={64}
            className="citie-img"
          />
        ) : (
          <span className="citie-chip">
            <span className="citie-chip-face">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/citiezinho.png" alt="" className="citie-chip-img" />
            </span>
            <span className="citie-chip-dot" aria-hidden />
          </span>
        )}
      </button>
    </div>
  );
}
