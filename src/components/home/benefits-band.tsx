import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Segments } from '@/components/ui/segments';
import { benefits } from '@/data/benefits';
import { benefitsSection } from '@/data/home';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** Navy benefits band — HOME_REDESIGN.md §4.7 (4fr / 8fr, 2 × 2 glass cards). */
export function BenefitsBand() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden bg-navy py-14 md:py-[72px] xl:py-28"
    >
      <div aria-hidden className="pattern-grid pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
          <Reveal>
            <Eyebrow onDark>{benefitsSection.eyebrow}</Eyebrow>
            <h2
              id="benefits-heading"
              className="mt-4 font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-white md:text-[38px] xl:text-[42px]"
            >
              <Segments segments={benefitsSection.title} onDark />
            </h2>
            <p className="mt-5 text-base leading-[1.7] text-on-navy-muted md:text-[17px]">
              {benefitsSection.body}
            </p>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title}>
                  <Reveal delay={index * 0.06} className="h-full">
                    <div className="h-full rounded-bubble border border-white/10 bg-white/5 p-6 md:p-7">
                      <span
                        className={cn(
                          'flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-navy',
                          pillarTheme[benefit.color].solid,
                        )}
                      >
                        <Icon aria-hidden className="h-6 w-6" strokeWidth={2} />
                      </span>
                      <h3 className="mt-5 font-display text-lg font-bold text-white md:text-xl">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[1.65] text-on-navy-soft">
                        {benefit.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
