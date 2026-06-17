/**
 * Mini-store de toasts (avisos curtos de "concluído"/"erro"), sem dependências
 * nem context: qualquer client component chama `toast.success/error`, e o
 * <Toaster/> montado no layout assina e exibe. Auto-some depois de alguns seg.
 */
export type ToastType = "success" | "error";
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let toasts: Toast[] = [];
const listeners = new Set<(t: Toast[]) => void>();
let counter = 0;

function emit() {
  for (const l of listeners) l(toasts);
}

export function subscribe(fn: (t: Toast[]) => void): () => void {
  listeners.add(fn);
  fn(toasts);
  return () => {
    listeners.delete(fn);
  };
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function push(type: ToastType, message: string) {
  const id = ++counter;
  toasts = [...toasts, { id, type, message }];
  emit();
  setTimeout(() => dismissToast(id), 3800);
}

export const toast = {
  success: (m: string) => push("success", m),
  error: (m: string) => push("error", m),
};
