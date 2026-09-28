import { cn } from '@/lib/utils';

/** Base surface: 16px radius, 1px --line border, soft shadow (§4.3). */
export function Card({
  className,
  children,
  hoverable = false,
}: {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-paper shadow-soft',
        hoverable &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
