import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { PillarCard } from '@/components/home/pillar-card';
import { services } from '@/data/services';
import { pillarsSection } from '@/data/home';

/** Business is the fixed featured card on the home page (§4.6). */
const FEATURED = 'business-corporate';

/** Six-pillar grid — HOME_REDESIGN.md §4.6: 3 cols, 2 below 1024, 1 below 640. */
export function PillarsGrid() {
  return (
    <Section id="pillars" className="bg-mist" labelledBy="pillars-heading">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="pillars-heading"
          eyebrow={pillarsSection.eyebrow}
          title={pillarsSection.title}
          align="left"
          className="max-w-[640px]"
        />
        <Button asChild variant="outline-dark" className="shrink-0">
          <Link href="/services">
            {pillarsSection.cta}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.slug}>
            <Reveal delay={index * 0.05} className="h-full">
              <PillarCard service={service} featured={service.slug === FEATURED} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
