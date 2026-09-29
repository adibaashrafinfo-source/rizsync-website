import { cn } from '@/lib/utils';

/** 13px uppercase label above a heading — teal-ink on light, teal-on-navy on dark (§2.2). */
export function Eyebrow({
  children,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        'text-eyebrow font-bold tracking-[0.16em] uppercase',
        onDark ? 'text-teal-on-navy' : 'text-teal-ink',
        className,
      )}
    >
      {children}
    </p>
  );
}
