'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ServiceBubble } from '@/data/bubbles';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/**
 * One of the three bubbles beside the wheel — DESIGN.md §6.1 ②.
 * Hovering it highlights the matching arc, and vice versa.
 */
export function ServiceBubbleCard({
  bubble,
  active,
  onActivate,
  className,
  style,
}: {
  bubble: ServiceBubble;
  active: boolean;
  onActivate: (slug: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const theme = pillarTheme[bubble.color];
  const accent = pillarTheme[bubble.accent ?? bubble.color];

  return (
    <Link
      href={`/services/${bubble.slug}`}
      onMouseEnter={() => onActivate(bubble.slug)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(bubble.slug)}
      onBlur={() => onActivate(null)}
      style={style}
      className={cn(
        'group block rounded-bubble border border-white/12 bg-navy-950/85 p-4 text-left shadow-lift ring-2 ring-transparent backdrop-blur-sm transition-all duration-300',
        active && `-translate-y-1 ${accent.ring} bg-navy-950/95`,
        className,
      )}
    >
      <span className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', theme.dot)}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-snug font-bold text-white">
            {bubble.title}
          </span>
          <span className={cn('mt-0.5 block text-[12.5px] italic', accent.text)}>
            {bubble.subtitle}
          </span>
        </span>
      </span>

      <ul className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] leading-snug text-white/70">
        {bubble.items.map((item, index) => (
          <li key={item} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden className="text-white/25">
                &middot;
              </span>
            ) : null}
            {item}
          </li>
        ))}
      </ul>

      <span
        className={cn(
          'mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold',
          accent.text,
        )}
      >
        Learn more
        <ArrowRight
          aria-hidden
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
