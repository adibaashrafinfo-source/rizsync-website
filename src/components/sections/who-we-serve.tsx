import { Briefcase, Building, Rocket, Users } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { audiences } from '@/data/faqs';

const icons = [Rocket, Briefcase, Building, Users];

/** DESIGN.md §6.1 ⑦. */
export function WhoWeServe() {
  return (
    <Section className="bg-mist" labelledBy="audience-heading">
      <SectionHeading
        id="audience-heading"
        eyebrow="Who We Serve"
        title="Built for the People Who Carry the Risk"
        description="From a first company registration to a family's long-term security, the standard of care is the same."
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((audience, index) => {
          const Icon = icons[index];
          return (
            <li key={audience.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <Card hoverable className="flex h-full flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-900">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy-900">
                    {audience.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {audience.benefit}
                  </p>
                </Card>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
