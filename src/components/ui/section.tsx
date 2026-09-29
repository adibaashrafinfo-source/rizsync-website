import { cn } from '@/lib/utils';
import { Container } from './container';

/** Section rhythm — 56px mobile, 72px tablet, 112px desktop (§2.3). */
export function Section({
  id,
  className,
  containerClassName,
  children,
  bleed = false,
  labelledBy,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  /** Skip the inner Container when the section manages its own layout. */
  bleed?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('py-14 md:py-[72px] xl:py-28', className)}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
