'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { hero } from '@/data/home';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** Connect · Simplify · Protect · Transform · Grow — staggered 80ms (§4.2, §5). */
export function MottoChips() {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Our motto">
      {hero.motto.map(({ word, color }, index) => (
        <motion.li
          key={word}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'inline-flex h-[38px] items-center rounded-chip border px-4 text-sm font-semibold',
            pillarTheme[color].chipOnNavy,
          )}
        >
          {word}
        </motion.li>
      ))}
    </ul>
  );
}
