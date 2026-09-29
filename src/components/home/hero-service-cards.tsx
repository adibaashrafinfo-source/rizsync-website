'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/**
 * One of the three cards beside the hero wheel — HOME_REDESIGN.md §4.3.
 * Inactive = glass on navy; active = solid white with a 3px pillar ring.
 * Both states render the same chips so the stack never changes height.
 */
export const HeroServiceCard = forwardRef<
  HTMLAnchorElement,
  {
    service: Service;
    active: boolean;
    onActivate: (slug: string) => void;
    className?: string;
  }
>(function HeroServiceCard({ service, active, onActivate, className }, ref) {
  const card = service.heroCard;
  if (!card) return null;

  const theme = pillarTheme[service.color];
  const Icon = service.icon;

  return (
    <Link
      ref={ref}
      href={`/services/${service.slug}`}
      onMouseEnter={() => onActivate(service.slug)}
      onFocus={() => onActivate(service.slug)}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group relative block rounded-bubble border p-5 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out',
        active
          ? 'border-transparent bg-white'
          : 'border-white/[0.16] bg-white/[0.08] backdrop-blur-sm hover:bg-white/[0.12]',
        className,
      )}
      style={
        active
          ? { boxShadow: `0 0 0 3px ${theme.hex}, 0 30px 60px -20px rgba(0,0,0,.6)` }
          : undefined
      }
    >
      <span className="flex items-start gap-3.5">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-200',
            active ? cn(theme.solid, 'text-navy') : 'bg-white/10 text-white',
          )}
        >
          <Icon aria-hidden className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              'block font-display text-[17px] leading-tight font-bold transition-colors duration-200',
              active ? 'text-navy' : 'text-white',
            )}
          >
            {card.title}
          </span>
          <span
            className={cn(
              'mt-1 block text-[13px] font-medium transition-colors duration-200',
              active ? theme.ink : 'text-on-navy-soft',
            )}
          >
            {card.subtitle}
          </span>
        </span>
        <ArrowRight
          aria-hidden
          className={cn(
            'mt-1 h-4 w-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5',
            active ? 'text-navy opacity-100' : 'text-white opacity-50',
          )}
        />
      </span>

      <span className="mt-4 flex flex-wrap gap-1.5">
        {card.chips.map((chip) => (
          <span
            key={chip}
            className={cn(
              'rounded-md border px-2.5 py-1 text-[12px] leading-tight font-semibold transition-colors duration-200',
              active ? cn('border-transparent', theme.chipOnLight) : 'border-white/[0.14] text-on-navy-muted',
            )}
          >
            {chip}
          </span>
        ))}
      </span>
    </Link>
  );
});
