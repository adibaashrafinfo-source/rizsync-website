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
import { LinkedInIcon } from '@/components/ui/social-icons';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBanner } from '@/components/home/cta-banner';
import { ValueCard } from '@/components/sections/value-card';
import { JsonLd } from '@/components/seo/json-ld';
import { ethicalValues } from '@/data/values';
import { team } from '@/data/team';
import { siteConfig } from '@/config/site';
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About RizSync"
        description="Simplifying complexity, ethically."
        crumbs={crumbs}
        image="/images/page-heroes/about.webp"
      />

      {/* 2 — Our Story */}
      <Section className="bg-paper" labelledBy="story-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Our Story</Eyebrow>
            <h2
              id="story-heading"
              className="mt-3 text-[28px] leading-tight font-bold text-navy-900 md:text-h2"
            >
              Founded in Mirpur, Built on One Observation
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-ink-600">
              <p>
                RizSync began in {siteConfig.founded} with a simple observation about doing
                business in Bangladesh: the hard part is rarely the work itself. It is the
                number of separate people you have to hold together to get anything finished
                — one for the books, another for the filings, a third for the licence, and
                nobody with the whole picture.
              </p>
              <p>
                Our founders had spent years on the other side of that: watching capable
                businesses lose weeks to resubmissions, and families lose months to
                documentation nobody had explained. The gap was not expertise. It was
                coordination, and a standard of conduct you could rely on when you were not
                in the room.
              </p>
              <p>
                So we built one practice across six disciplines — finance, corporate,
                government liaison, digital operations and family welfare — under a single
                ethical framework. From our offices on Mazar Road in Mirpur, we now act for
                entrepreneurs, SMEs, corporate groups and families across Dhaka and beyond.
              </p>
              <p className="border-l-2 border-gold-500 pl-4 text-ink-900 italic">
                Placeholder narrative — TODO(client): replace with the founder&rsquo;s own
                account of how RizSync started.
              </p>
            </div>
          </div>

          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line shadow-soft">
              {/* TODO(client) §4.4: replace with real photography of the practice. */}
              <Image
                src="/images/about-story.webp"
                alt="The RizSync mark set within a circuit and geometric lattice motif"
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
          eyebrow="Direction"
          title="Where We Are Going, and How"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col border-t-[3px] border-t-teal-500 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Compass aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-navy-900">Our Vision</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">
                To be Bangladesh&rsquo;s most trusted platform connecting professional
                business support with personal welfare.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <Card className="flex h-full flex-col border-t-[3px] border-t-gold-500 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Target aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-navy-900">Our Mission</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">
                To empower organizations and individuals by simplifying regulatory,
                financial, and digital complexities through expert, human-centric, and
                ethical advisory.
              </p>
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
            eyebrow="Our Values"
            title="The Quranic Business Model"
            description="Our operations are guided by principles of Islamic business ethics, ensuring:"
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
          eyebrow="Leadership"
          title="The People Accountable for Your File"
          description="Placeholder profiles — TODO(client): supply names, titles, biographies, photographs and LinkedIn URLs."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <li key={`${member.title}-${index}`}>
              <Reveal delay={index * 0.06} className="h-full">
                <Card hoverable className="flex h-full flex-col overflow-hidden">
                  {/*
                    Initials stand in for the photograph until real images are
                    supplied — a broken <img> would look worse than this does.
                  */}
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-navy-900">
                    <div aria-hidden className="bg-geometric absolute inset-0" />
                    <span className="relative font-display text-4xl font-bold text-gold-500">
                      {member.initials}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-semibold text-navy-900">{member.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-teal-600">{member.title}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                      {member.bio}
                    </p>
                    <a
                      href={member.linkedin}
                      aria-label={`${member.name} on LinkedIn`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-600 transition-colors hover:border-navy-900/40 hover:text-navy-900"
                    >
                      <LinkedInIcon className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner
        title="Work with a partner you can hold to a standard"
        description="Start with a free consultation. You will leave it knowing what needs doing — and whether you need us to do it."
      />

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
