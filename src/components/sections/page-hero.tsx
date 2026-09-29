import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

/** Shared navy hero for every inner page (§6.2.1, §6.3.1, §6.4.1, §6.5, §6.6.1). */
export function PageHero({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  crumbs,
  children,
  className,
}: {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('relative overflow-hidden bg-navy-900 py-14 md:py-20', className)}
    >
      <div aria-hidden className="bg-circuit pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-navy-950/70 via-transparent to-navy-950/60"
      />

      <Container className="relative">
        <Breadcrumbs items={crumbs} onDark />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className={cn(children ? 'lg:col-span-7' : 'lg:col-span-9')}>
            {eyebrow ? (
              <Eyebrow onDark className={eyebrowClassName}>{eyebrow}</Eyebrow>
            ) : null}
            <h1 className="mt-3 text-[32px] leading-[1.12] font-bold tracking-[-0.02em] text-white md:text-[44px]">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {children ? <div className="lg:col-span-5">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
