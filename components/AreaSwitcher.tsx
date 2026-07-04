"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { AreaMeta } from "@/lib/types";
import { setPreviewArea } from "@/app/admin/actions";

export default function AreaSwitcher({
  areas,
  currentArea,
}: {
  areas: AreaMeta[];
  currentArea: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Preview via cookie (server action) em vez de ?area=: assim a sidebar
  // (montada no layout, sem acesso a searchParams) acompanha a troca.
  function switchArea(slug: string) {
    startTransition(async () => {
      await setPreviewArea(slug);
      router.refresh();
    });
  }

  return (
    <div className="area-switcher">
      <span className="area-switcher-label">Visualizando como</span>
      <div className="area-switcher-pills">
        {areas.map((a) => (
          <button
            key={a.slug}
            type="button"
            className={`area-pill${a.slug === currentArea ? " area-pill--active" : ""}`}
            onClick={() => switchArea(a.slug)}
            disabled={pending}
            title={a.description || a.name}
          >
            {a.name}
          </button>
        ))}
      </div>
    </div>
  );
}
