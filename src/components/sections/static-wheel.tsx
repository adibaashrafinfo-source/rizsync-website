'use client';

import { useState } from 'react';
import { ServiceWheel } from '@/components/home/service-wheel';

/**
 * Wheel for the Services hub hero (DESIGN.md §6.3.1) — the same component as
 * the home page, highlighting whichever pillar the visitor points at.
 */
export function StaticWheel() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div onMouseLeave={() => setActiveId(null)}>
      <ServiceWheel
        activeId={activeId}
        onActivate={setActiveId}
        className="mx-auto h-auto w-full max-w-[420px] overflow-visible"
      />
    </div>
  );
}
