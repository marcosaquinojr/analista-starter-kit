"use client";

import { useCompletion } from "@/components/completion";

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function ChapterComplete({ slug }: { slug: string }) {
  const { isDone, toggle, ready } = useCompletion();
  const done = ready && isDone(slug);

  return (
    <div className={`chapter-complete${done ? " done" : ""}`}>
      <div className="chapter-complete-text">
        {done ? (
          <>
            <strong>Capítulo concluído.</strong> Ele aparece marcado no menu e na
            home.
          </>
        ) : (
          <>
            <strong>Terminou este capítulo?</strong> Marque como concluído para
            acompanhar seu progresso.
          </>
        )}
      </div>
      <button className="btn-complete" onClick={() => toggle(slug)}>
        {done ? (
          <>
            <Check /> Concluído — desfazer
          </>
        ) : (
          "Marcar como concluído"
        )}
      </button>
    </div>
  );
}
