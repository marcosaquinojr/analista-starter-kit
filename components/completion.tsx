"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";
import { toggleChapterDone } from "@/app/admin/actions";

interface CompletionContextValue {
  completed: Set<string>;
  ready: boolean;
  isDone: (slug: string) => boolean;
  toggle: (slug: string) => void;
}

const CompletionContext = createContext<CompletionContextValue | null>(null);

/**
 * Progresso de leitura backed pelo servidor. O estado inicial vem do banco
 * (via layout do site) e cada marcação chama uma server action — otimista, com
 * rollback se a action falhar. Sem localStorage e sem "limpar tudo": progresso
 * é durável e o leitor não zera o próprio histórico de uma vez.
 */
export function CompletionProvider({
  initialCompleted,
  children,
}: {
  initialCompleted: string[];
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(initialCompleted),
  );
  const [, startTransition] = useTransition();

  const toggle = useCallback((slug: string) => {
    // Otimista: reflete na hora.
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    // Persiste no banco; se falhar, reconcilia com o estado retornado.
    startTransition(async () => {
      const res = await toggleChapterDone(slug);
      if (!res) return;
      setCompleted((prev) => {
        const next = new Set(prev);
        if (res.done) next.add(slug);
        else next.delete(slug);
        return next;
      });
    });
  }, []);

  const isDone = useCallback((slug: string) => completed.has(slug), [completed]);

  return (
    <CompletionContext.Provider
      value={{ completed, ready: true, isDone, toggle }}
    >
      {children}
    </CompletionContext.Provider>
  );
}

export function useCompletion() {
  const ctx = useContext(CompletionContext);
  if (!ctx)
    throw new Error("useCompletion deve ser usado dentro de CompletionProvider");
  return ctx;
}
