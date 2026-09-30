import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { Compass, Target } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { ArrowLink } from '@/components/ui/arrow-link';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBanner } from '@/components/home/cta-banner';
import { ValueCard } from '@/components/sections/value-card';
import { JsonLd } from '@/components/seo/json-ld';
import { getAboutContent, getSiteConfig, getTeam } from '@/lib/cms/queries';
import { initials } from '@/lib/utils';
import { breadcrumbSchema } from '@/lib/schema';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
];

export const metadata: Metadata = pageMetadata({
  title: 'About RizSync | Our Vision, Mission & Ethical Foundation',
  description:
    "Learn about RizSync's mission to simplify complexity in Bangladesh. We operate on a Quranic business model, prioritizing Justice, Trust, and Transparency in all client engagements.",
  path: '/about',
});

export default async function AboutPage() {
  const [about, team, siteConfig] = await Promise.all([
    getAboutContent(),
    getTeam(),
    getSiteConfig(),
  ]);
  const ethicalValues = about.values;
  const paragraphs = about.story.body.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        description={about.hero.description}
        crumbs={crumbs}
        image={about.hero.image || undefined}
      />

      {/* 2 — Our Story */}
      <Section className="bg-paper" labelledBy="story-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{about.story.eyebrow}</Eyebrow>
            <h2
              id="story-heading"
              className="mt-3 text-[28px] leading-tight font-bold text-navy-900 md:text-h2"
            >
              {about.story.title}
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-ink-600">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line shadow-soft">
              <Image
                src={about.story.image || '/images/about-story.webp'}
                alt={about.story.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 3 — Vision & Mission */}
      <Section className="bg-mist" labelledBy="vision-heading">
        <SectionHeading
          id="vision-heading"
          eyebrow={about.direction.eyebrow}
          title={about.direction.title}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col border-t-[3px] border-t-teal-500 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Compass aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-navy-900">{about.vision.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{about.vision.text}</p>
            </Card>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <Card className="flex h-full flex-col border-t-[3px] border-t-gold-500 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Target aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-navy-900">{about.mission.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{about.mission.text}</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* 4 — Values & the Quranic Business Model */}
      <section
        id="values"
        aria-labelledby="values-heading"
        className="relative overflow-hidden bg-navy-900 py-16 md:py-24"
      >
        <div aria-hidden className="bg-geometric pointer-events-none absolute inset-0" />

        <Container className="relative">
          <SectionHeading
            id="values-heading"
            eyebrow={about.valuesSection.eyebrow}
            title={about.valuesSection.title}
            description={about.valuesSection.description}
            onDark
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {ethicalValues.map((value, index) => (
              <li key={value.transliteration}>
                <Reveal delay={index * 0.06} className="h-full">
                  <ValueCard value={value} variant="detailed" />
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-white/55">
            {siteConfig.ethicsStatement}
          </p>
        </Container>
      </section>

      {/* 5 — Leadership */}
      <Section className="bg-paper" labelledBy="team-heading">
        <SectionHeading
          id="team-heading"
          eyebrow={about.teamSection.eyebrow}
          title={about.teamSection.title}
          description={about.teamSection.description}
        />

        {/* Compact preview — the full profiles live on /our-team. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <li key={member.id ?? `${member.title}-${index}`}>
              <Reveal delay={index * 0.06} className="h-full">
                <Card hoverable className="flex h-full items-center gap-4 p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-900">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name}, ${member.title}`}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-gold-500">
                        {initials(member.name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] leading-snug font-semibold text-navy-900">{member.name}</h3>
                    {member.title && member.title !== member.name ? (
                      <p className="mt-0.5 text-[13px] font-medium text-teal-600">{member.title}</p>
                    ) : null}
                    {member.credentials ? (
                      <p className="mt-1 text-[12px] leading-snug text-muted">{member.credentials}</p>
                    ) : null}
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <ArrowLink href="/our-team">Meet the full team</ArrowLink>
        </div>
      </Section>

      <CtaBanner
        title={about.cta.title}
        description={about.cta.description}
      />

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
