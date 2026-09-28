import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Link variant from §4.5 — teal text, arrow slides 4px on hover. */
export function ArrowLink({
  href,
  children,
  className,
  colorClass = 'text-teal-600',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  colorClass?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors',
        colorClass,
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
