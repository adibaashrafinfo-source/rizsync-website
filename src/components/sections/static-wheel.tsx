'use client';

import { useState } from 'react';
import { ServiceWheel } from '@/components/home/service-wheel';

/**
 * Smaller wheel for the Services hub hero (§6.3.1) — every pillar labelled,
 * no bubbles and no connectors.
 */
export function StaticWheel() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <ServiceWheel
      activeSlug={activeSlug}
      onActivate={setActiveSlug}
      showAllLabels
      labelClassName=""
      className="mx-auto w-full max-w-[460px]"
    />
  );
}
