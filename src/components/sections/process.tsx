import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { processSteps } from '@/data/faqs';
import { cn } from '@/lib/utils';

/** DESIGN.md §6.1 ⑥ — horizontal timeline, reused on service sub-pages. */
export function Process({
  className,
  eyebrow = 'How We Work',
  title = 'Four Steps, No Surprises',
  description = 'The same process on every engagement, whether it is one licence renewal or a full finance function.',
}: {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <Section className={cn('bg-paper', className)} labelledBy="process-heading">
      <SectionHeading
        id="process-heading"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
        {/* The connecting rule sits behind the numbered markers on desktop. */}
        <div
          aria-hidden
          className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-teal-500/25 via-gold-500/45 to-teal-500/25 md:block"
        />

        {processSteps.map((step, index) => (
          <li key={step.step} className="relative">
            <Reveal delay={index * 0.07}>
              <div className="flex flex-col items-center text-center md:items-center">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/45 bg-paper font-display text-lg font-bold text-navy-900 shadow-soft">
                  {step.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
