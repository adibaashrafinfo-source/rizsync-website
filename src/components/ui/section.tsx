import { cn } from '@/lib/utils';
import { Container } from './container';

/** Section vertical rhythm: 64px mobile / 96px desktop (§4.3). */
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
    <section id={id} aria-labelledby={labelledBy} className={cn('py-16 md:py-24', className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
