import { cn } from '@/lib/utils';

/** 13px uppercase gold label above a heading (§4.2). */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-eyebrow font-semibold tracking-[0.12em] text-gold-600 uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}
