import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { StaticWheel } from '@/components/sections/static-wheel';
import { CtaBanner } from '@/components/sections/cta-banner';
import { JsonLd } from '@/components/seo/json-ld';
import { services } from '@/data/services';
import { generalFaqs } from '@/data/faqs';
import { pillarTheme } from '@/lib/pillar';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Comprehensive Professional Services | RizSync Service Solution',
  description:
    "Explore RizSync's six core pillars of service, from Finance & Accounting to Digital Transformation and Family Welfare. Tailored for SMEs, Corporates, and Individuals in Bangladesh.",
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Six Pillars. One Trusted Partner."
        description="Everything a business or a family in Bangladesh needs to stay compliant, organised and moving forward — delivered by one team, to one standard of conduct."
        crumbs={crumbs}
      >
        <StaticWheel />
      </PageHero>

      {/* Alternating image/text rows — §6.3.2 */}
      <Section className="bg-paper" labelledBy="pillars-detail-heading">
        <SectionHeading
          id="pillars-detail-heading"
          eyebrow="What We Do"
          title="Where We Can Take Work Off Your Desk"
          description="Each pillar is a full service line, not a referral. Follow any of them for the detail, the process and the fees."
        />

        <div className="mt-14 flex flex-col gap-14 md:gap-20">
          {services.map((service, index) => {
            const theme = pillarTheme[service.color];
            const Icon = service.icon;
            const flip = index % 2 === 1;

            return (
              <Reveal key={service.slug}>
                <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  {/*
                    TODO(client): swap this motif panel for photography once the
                    image library arrives (§4.4).
                  */}
                  <div
                    className={cn(
                      'relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card border border-line',
                      theme.tint,
                      flip && 'md:order-2',
                    )}
                  >
                    <div aria-hidden className="bg-circuit absolute inset-0 opacity-[0.08]" />
                    <Icon
                      aria-hidden
                      className={cn('relative h-24 w-24', theme.icon)}
                      strokeWidth={1.1}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-5 left-5 h-2.5 w-2.5 rounded-full',
                        theme.dot,
                      )}
                    />
                  </div>

                  <div className={cn(flip && 'md:order-1')}>
                    <Eyebrow className={theme.text}>
                      Pillar {String(index + 1).padStart(2, '0')}
                    </Eyebrow>
                    <h3 className="mt-2 text-2xl leading-snug font-bold text-navy-900 md:text-[28px]">
                      {service.h1}
                    </h3>
                    <p className="mt-3 text-ink-600">{service.intro}</p>

                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {service.items.slice(0, 4).map((item) => (
                        <li
                          key={item.title}
                          className="flex items-start gap-2 text-sm text-ink-900"
                        >
                          <Check
                            aria-hidden
                            className={cn('mt-0.5 h-4 w-4 shrink-0', theme.icon)}
                            strokeWidth={2}
                          />
                          {item.title}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      {/* Pillar names are long; let the label wrap rather
                          than widen the column on a 360px screen. */}
                      <Button
                        asChild
                        variant="secondaryLight"
                        className="h-auto min-h-12 py-3 text-left whitespace-normal"
                      >
                        <Link href={`/services/${service.slug}`}>
                          Explore {service.title}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* FAQ — §6.3.4 */}
      <Section className="bg-mist" labelledBy="services-faq-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="services-faq-heading"
              eyebrow="Common Questions"
              title="Before You Get in Touch"
              description="If your question is not here, ask it in the consultation — there is no charge for the conversation."
              align="left"
            />
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-card border border-line bg-paper px-6 shadow-soft md:px-8">
              <FAQAccordion faqs={generalFaqs} idPrefix="services" />
            </div>
          </div>
        </div>
      </Section>

      <CtaBanner />

      <JsonLd graph={[breadcrumbSchema(crumbs), faqSchema(generalFaqs)]} />
    </>
  );
}
