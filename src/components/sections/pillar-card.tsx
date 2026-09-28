import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { Service } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** DESIGN.md §6.1 ④ — 3px pillar-coloured top border, tinted icon, 4 bullets. */
export function PillarCard({ service }: { service: Service }) {
  const theme = pillarTheme[service.color];
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        'group flex h-full flex-col rounded-card border border-line border-t-[3px] bg-paper p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0',
        theme.border,
      )}
    >
      <span
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full',
          theme.iconWrap,
        )}
      >
        <Icon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
      </span>

      <h3 className="mt-5 text-lg leading-snug font-semibold text-navy-900">
        {service.title}
      </h3>

      <ul className="mt-4 flex flex-1 flex-col gap-2">
        {service.cardBullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-ink-600">
            <Check
              aria-hidden
              className={cn('mt-0.5 h-4 w-4 shrink-0', theme.icon)}
              strokeWidth={2}
            />
            {bullet}
          </li>
        ))}
      </ul>

      <span
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold',
          theme.text,
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
