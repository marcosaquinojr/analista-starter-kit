"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { AreaMeta } from "@/lib/types";

export default function AreaSwitcher({
  areas,
  currentArea,
}: {
  areas: AreaMeta[];
  currentArea: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchArea(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("area", slug);
    router.push(`${pathname}?${params.toString()}`);
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
            title={a.description || a.name}
          >
            {a.name}
          </button>
        ))}
      </div>
    </div>
  );
}
