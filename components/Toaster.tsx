"use client";

import { useEffect, useState } from "react";
import { subscribe, dismissToast, type Toast } from "@/lib/toast-store";

export default function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => subscribe(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="toaster" aria-live="polite">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`toast toast-${t.type}`}
          onClick={() => dismissToast(t.id)}
          title="Dispensar"
        >
          <span className="toast-icon" aria-hidden>
            {t.type === "success" ? "✓" : "!"}
          </span>
          <span className="toast-msg">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
