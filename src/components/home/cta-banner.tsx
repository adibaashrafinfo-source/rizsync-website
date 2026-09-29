import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ctaBanner } from '@/data/home';
import { cn } from '@/lib/utils';

/**
 * Container-width navy panel with two decorative rings — HOME_REDESIGN.md
 * §4.11. Shared by the inner pages, which pass their own copy.
 */
export function CtaBanner({
  title = ctaBanner.title,
  description = ctaBanner.body,
  href = '/contact#consultation-form',
  label = ctaBanner.cta,
  className,
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className={cn('bg-white py-14 md:py-[72px] xl:py-24', className)}>
      <Container>
        <div className="relative isolate overflow-hidden rounded-panel-lg bg-navy px-6 py-12 text-center sm:px-10 md:px-14 md:py-16 lg:px-[72px] lg:text-left">
          {/* Decorative rings */}
          <span
            aria-hidden
            className="absolute -top-32 -right-32 -z-10 h-[200px] w-[200px] rounded-full border-[30px] border-orange/90 lg:-top-40 lg:-right-20 lg:h-[380px] lg:w-[380px] lg:border-[56px]"
          />
          <span
            aria-hidden
            className="absolute -bottom-36 -left-16 -z-10 h-[180px] w-[180px] rounded-full border-[28px] border-teal/90 lg:left-[38%] lg:-bottom-[210px] lg:h-[300px] lg:w-[300px] lg:border-[44px]"
          />

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2
                id="cta-heading"
                className="font-display text-[28px] leading-[1.12] font-bold tracking-[-0.03em] text-white md:text-[38px] xl:text-[42px]"
              >
                {title}
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-on-navy-muted md:text-[17px]">
                {description}
              </p>
            </div>
            <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
              <Link href={href}>
                {label}
                <ArrowRight aria-hidden className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
