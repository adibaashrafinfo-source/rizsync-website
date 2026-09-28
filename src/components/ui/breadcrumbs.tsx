import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Visual breadcrumb. The matching BreadcrumbList JSON-LD is emitted separately
 * by `<JsonLd>` so the markup stays clean.
 */
export function Breadcrumbs({
  items,
  onDark = false,
  className,
}: {
  items: Crumb[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-sm',
          onDark ? 'text-white/65' : 'text-ink-600',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors',
                    onDark ? 'hover:text-gold-500' : 'hover:text-teal-600',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={onDark ? 'text-white' : 'text-navy-900'}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight aria-hidden className="h-3.5 w-3.5 opacity-60" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
