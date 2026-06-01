"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "analista-kit-completion-v1";

interface CompletionContextValue {
  completed: Set<string>;
  ready: boolean;
  isDone: (slug: string) => boolean;
  toggle: (slug: string) => void;
  reset: () => void;
}

const CompletionContext = createContext<CompletionContextValue | null>(null);

export function CompletionProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setCompleted(new Set(arr));
      }
    } catch {
      // ignora storage indisponível
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignora
    }
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setCompleted(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignora
    }
  }, []);

  const isDone = useCallback((slug: string) => completed.has(slug), [completed]);

  return (
    <CompletionContext.Provider
      value={{ completed, ready, isDone, toggle, reset }}
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
