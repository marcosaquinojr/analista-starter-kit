"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Modal de confirmação reutilizável (substitui o confirm() do browser).
 * Controlado: o pai mantém o estado de "o que está pendente" e passa open.
 * Reusa as classes .modal-* já existentes no globals.css.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999 }} onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h2
          id="confirm-modal-title"
          className="modal-title"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          {danger && <AlertTriangle size={18} style={{ color: "var(--bad)" }} />}
          {title}
        </h2>
        {message && <div className="modal-text">{message}</div>}
        <div className="modal-actions">
          <button
            ref={cancelRef}
            type="button"
            className="trail-btn"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`trail-btn${danger ? " trail-btn-danger" : ""}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
