import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { processSteps } from '@/data/process';
import { processSection } from '@/data/home';
import { cn } from '@/lib/utils';

const circleClass = {
  navy: 'bg-navy text-white',
  teal: 'bg-teal text-navy',
  orange: 'bg-orange text-navy',
  gold: 'bg-gold text-navy',
} as const;

/**
 * Four-step process — HOME_REDESIGN.md §4.9. Horizontal from 768px with the
 * connecting rule passing behind the number circles; a vertical timeline
 * with the rule on the left below that. Also used on every service page.
 */
export function ProcessSteps({
  eyebrow = processSection.eyebrow,
  title = processSection.title,
  className,
}: {
  eyebrow?: string;
  title?: string;
  className?: string;
}) {
  return (
    <Section className={cn('bg-mist', className)} labelledBy="process-heading">
      <SectionHeading id="process-heading" eyebrow={eyebrow} title={title} />

      <ol className="relative mt-14 grid gap-10 md:mt-16 md:grid-cols-4 md:gap-8">
        {/* Rule: vertical on the left for mobile, horizontal through the circles from md. */}
        <span
          aria-hidden
          className="absolute top-8 bottom-8 left-8 w-0.5 bg-line-2 md:top-8 md:right-[12.5%] md:bottom-auto md:left-[12.5%] md:h-0.5 md:w-auto"
        />

        {processSteps.map((step, index) => (
          <li key={step.step} className="relative">
            <Reveal delay={index * 0.07}>
              <div className="flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                <span
                  className={cn(
                    'relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[6px] border-mist font-display text-xl font-bold',
                    circleClass[step.color],
                  )}
                >
                  {step.step}
                </span>
                <div className="pt-3 md:pt-0">
                  <h3 className="font-display text-lg font-bold text-navy md:mt-6 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.7] text-ink-600 md:mx-auto md:max-w-[240px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
