import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { ProcessSteps } from '@/components/home/process-steps';
import { ConsultationSection } from '@/components/home/consultation-section';
import { JsonLd } from '@/components/seo/json-ld';
import { services, serviceBySlug } from '@/data/services';
import { ethicalValues } from '@/data/values';
import { pillarTheme } from '@/lib/pillar';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

/** All six sub-pages are statically generated from src/data/services.ts. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    keywords: service.seo.keywords,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const theme = pillarTheme[service.color];
  const Icon = service.icon;
  const related = services.filter((candidate) => candidate.slug !== service.slug).slice(0, 3);

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title, href: `/services/${service.slug}` },
  ];

  return (
    <>
      <PageHero
        eyebrow={service.title}
        eyebrowClassName={theme.onDark}
        title={service.h1}
        description={service.intro}
        crumbs={crumbs}
      >
        <div className="flex flex-col items-start gap-5 lg:items-end">
          <span
            className={cn(
              'inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5',
              theme.onDark,
            )}
          >
            <Icon aria-hidden className="h-10 w-10" strokeWidth={1.2} />
          </span>
          <Button asChild size="lg">
            <Link href={`/contact?service=${service.slug}#consultation-form`}>
              Request Consultation
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* ② What We Handle */}
      <Section className="bg-paper" labelledBy="handle-heading">
        <SectionHeading
          id="handle-heading"
          eyebrow="What We Handle"
          title="The Work, in Detail"
          description="Nothing here is outsourced to a third party without telling you. If a task falls outside our expertise, we say so rather than learn on your file."
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {service.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 0.05} className="h-full">
                <Card hoverable className="flex h-full flex-col p-6">
                  <span
                    className={cn(
                      'inline-flex h-11 w-11 items-center justify-center rounded-full',
                      theme.iconWrap,
                    )}
                  >
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {item.description}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ③ Why RizSync for this */}
      <section
        aria-labelledby="why-heading"
        className="relative overflow-hidden bg-navy-900 py-16 md:py-24"
      >
        <div aria-hidden className="bg-geometric pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
          <SectionHeading
            id="why-heading"
            eyebrow="Why RizSync"
            title={`Why Bring This to Us`}
            description="Three commitments that decide how this work is done — drawn from the values the whole practice runs on."
            onDark
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {service.whyRizsync.map((point, index) => {
              const value = ethicalValues.find(
                (candidate) => candidate.transliteration === point.value,
              );
              return (
                <li key={point.value}>
                  <Reveal delay={index * 0.06} className="h-full">
                    <div className="flex h-full flex-col rounded-card border border-white/12 bg-white/[0.04] p-6">
                      <span className="flex items-baseline gap-2">
                        {value ? (
                          <span
                            lang="ar"
                            className="font-arabic text-2xl leading-none text-gold-500"
                          >
                            {value.arabic}
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold tracking-wide text-gold-500">
                          {point.value}
                          {value ? ` — ${value.english}` : ''}
                        </span>
                      </span>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {point.text}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ④ Process */}
      <ProcessSteps />

      {/* ⑤ Service FAQ */}
      <Section className="bg-mist" labelledBy="service-faq-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="service-faq-heading"
              eyebrow="Questions"
              title={`${service.title}: The Detail`}
              align="left"
            />
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-card border border-line bg-paper px-6 shadow-soft md:px-8">
              <FAQAccordion faqs={service.faqs} idPrefix={service.slug} />
            </div>
          </div>
        </div>
      </Section>

      {/* ⑥ Related services */}
      <Section className="bg-paper" labelledBy="related-heading">
        <SectionHeading
          id="related-heading"
          eyebrow="Related Services"
          title="Often Needed Alongside This"
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {related.map((item) => {
            const relatedTheme = pillarTheme[item.color];
            const RelatedIcon = item.icon;
            return (
              <li key={item.slug}>
                <Link
                  href={`/services/${item.slug}`}
                  className={cn(
                    'group flex h-full flex-col rounded-card border border-line border-t-[3px] bg-paper p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0',
                    relatedTheme.border,
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-11 w-11 items-center justify-center rounded-full',
                      relatedTheme.iconWrap,
                    )}
                  >
                    <RelatedIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                    {item.navDescription}
                  </p>
                  <span
                    className={cn(
                      'mt-4 inline-flex items-center gap-1.5 text-sm font-semibold',
                      relatedTheme.text,
                    )}
                  >
                    Learn more
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="secondaryLight">
            <Link href="/services">View all six pillars</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">
              Talk to us
              <Check aria-hidden className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* ⑦ CTA with the subject pre-selected to this service */}
      <ConsultationSection defaultSubject={service.slug} />

      <JsonLd
        graph={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            name: service.h1,
            description: service.seo.description,
            url: `/services/${service.slug}`,
            items: service.items,
          }),
          faqSchema(service.faqs),
        ]}
      />
    </>
  );
}
