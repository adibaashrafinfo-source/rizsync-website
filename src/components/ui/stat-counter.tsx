'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import type { Stat } from '@/data/stats';

/** Counts up once, the first time the stat scrolls into view (§6.1 ③). */
export function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(stat.value);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic so the number settles rather than stopping dead.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(stat.value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, stat.value]);

  // Years must not be grouped as "2,021".
  const isYear = stat.value > 1900 && stat.value < 2200;
  const display = isYear ? String(value) : value.toLocaleString('en-US');

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-[34px] leading-none font-bold text-navy-900 md:text-[42px]">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-ink-600">{stat.label}</p>
    </div>
  );
}
