'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/config/site';

/** Five gold-bordered chips that animate in one by one — DESIGN.md §6.1 ①. */
export function MottoStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {siteConfig.mottoWords.map((word, index) => (
        <motion.li
          key={word}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border border-gold-500/55 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-gold-500"
        >
          {word}
        </motion.li>
      ))}
    </ul>
  );
}
