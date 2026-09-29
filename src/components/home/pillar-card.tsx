import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** Card hover shared by every clickable card — HOME_REDESIGN.md §2.3. */
export const cardHover =
  'transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-line-2 hover:shadow-lift motion-reduce:hover:translate-y-0';

/** Pillar card — HOME_REDESIGN.md §4.6. `featured` is the navy variant. */
export function PillarCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const theme = pillarTheme[service.color];
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        'group relative flex h-full flex-col rounded-card border p-7 md:p-9',
        featured
          ? 'border-navy bg-navy shadow-featured transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0'
          : cn('border-line bg-white shadow-soft', cardHover),
      )}
    >
      <span
        className={cn(
          'absolute top-7 right-7 font-display text-[15px] font-bold md:top-9 md:right-9',
          featured ? 'text-on-navy-faint' : 'text-number',
        )}
      >
        {service.number}
      </span>

      <span
        className={cn(
          'flex h-[60px] w-[60px] items-center justify-center rounded-2xl',
          featured ? cn(theme.solid, 'text-navy') : cn(theme.tile, theme.tileIcon),
        )}
      >
        <Icon aria-hidden className="h-7 w-7" strokeWidth={2} />
      </span>

      <h3
        className={cn(
          'mt-7 font-display text-xl leading-[1.25] font-bold md:text-h3',
          featured ? 'text-white' : 'text-navy',
        )}
      >
        {service.title}
      </h3>

      <p
        className={cn(
          'mt-3 flex-1 text-[15px] leading-[1.7]',
          featured ? 'text-on-navy-muted' : 'text-ink-600',
        )}
      >
        {service.bullets.join(' · ')}
      </p>

      <span
        className={cn(
          'mt-6 inline-flex items-center gap-1.5 text-[15px] font-bold',
          featured ? theme.onDark : theme.ink,
        )}
      >
        Learn more
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
