"use client";

import { useEffect, useRef, useState } from "react";

const MOTIVACIONAIS = [
  { text: "Cada capítulo te deixa mais Citier! 💙", pose: "heart" },
  { text: "Foco no progresso, não na perfeição. 🚀", pose: "star_idea" },
  { text: "Você tá indo muito bem. Bora pra próxima? 🔥", pose: "celebrating_fists" },
  { text: "Conhecimento é o melhor investimento. 📚", pose: "clipboard" },
  { text: "Um passo de cada vez chega longe. 👣", pose: "dancing" },
  { text: "Bora aprender algo novo hoje? ✨", pose: "laptop" },
  { text: "Confia no processo — você consegue! 💪", pose: "flexing" },
  { text: "Tamo junto nessa jornada! 🤝", pose: "peace_sign" },
] as const;

const INTRO_POSE = "waving";
const IDLE_POSE = "thumbs_up";

function citiePose(pose: string) {
  return `/citiezinho/${pose}.png`;
}

export default function CitieMascot({ introMessage }: { introMessage: string }) {
  const [phase, setPhase] = useState<"intro" | "idle" | "talking">("intro");
  const [message, setMessage] = useState(introMessage);
  const [pose, setPose] = useState<string>(INTRO_POSE);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Após alguns segundos falando a saudação, colapsa para a versão 2D.
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("idle");
      setPose(IDLE_POSE);
    }, 6500);
    return () => clearTimeout(t);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function speak() {
    const pick =
      MOTIVACIONAIS[Math.floor(Math.random() * MOTIVACIONAIS.length)];
    setMessage(pick.text);
    setPose(pick.pose);
    setPhase("talking");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPhase("idle");
      setPose(IDLE_POSE);
    }, 5500);
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
            src={citiePose(pose)}
            alt=""
            width={64}
            height={64}
            className="citie-img"
          />
        ) : (
          <span className="citie-chip">
            <span className="citie-chip-face">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={citiePose(pose)}
                alt=""
                key={pose}
                className="citie-chip-img"
              />
            </span>
            <span className="citie-chip-dot" aria-hidden />
          </span>
        )}
      </button>
    </div>
  );
}
