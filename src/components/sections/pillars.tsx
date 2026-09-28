import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { PillarCard } from '@/components/sections/pillar-card';
import { services } from '@/data/services';

/** DESIGN.md §6.1 ④ — 3×2 desktop, 2×3 tablet, 1×6 mobile. */
export function Pillars() {
  return (
    <Section id="pillars" className="bg-mist" labelledBy="pillars-heading">
      <SectionHeading
        id="pillars-heading"
        eyebrow="Our Services"
        title="Six Pillars. One Trusted Partner."
        description="Everything a business or a family in Bangladesh needs to stay compliant, organised and moving forward — delivered by one team, to one standard."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.05} className="h-full">
            <PillarCard service={service} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
