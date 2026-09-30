import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, BadgeCheck, Briefcase, GraduationCap, Mail, MapPin, Sparkles } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Segments } from '@/components/ui/segments';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBanner } from '@/components/home/cta-banner';
import { JsonLd } from '@/components/seo/json-ld';
import { getCeoContent, getSiteConfig } from '@/lib/cms/queries';
import { getIcon } from '@/lib/cms/icons';
import { breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/config/site';
import type { ExpertiseColor } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'CEO Profile', href: '/ceo-profile' },
];

export const metadata: Metadata = pageMetadata({
  title: 'CEO Profile | Mohammed Mohsunud Dayan — RizSync',
  description:
    'Mohammed Mohsunud Dayan (MBA, NSU), CFO & Managing Director of RizSync — 25+ years in treasury, collections, tax, VAT and finance transformation in Bangladesh.',
  path: '/ceo-profile',
});

/** Circular gradient badges, echoing the client's service artwork. */
const expertiseTone: Record<ExpertiseColor, string> = {
  green: 'from-[#5BBF3A] to-[#2E8B1E] shadow-[0_10px_22px_-10px_rgb(46_139_30/0.8)]',
  blue: 'from-[#2F7DE1] to-[#1450A8] shadow-[0_10px_22px_-10px_rgb(20_80_168/0.8)]',
  orange: 'from-[#FFA53A] to-[#E36A0C] shadow-[0_10px_22px_-10px_rgb(227_106_12/0.8)]',
  purple: 'from-[#9B6BE0] to-[#6A36B8] shadow-[0_10px_22px_-10px_rgb(106_54_184/0.8)]',
  teal: 'from-[#22B8B0] to-[#0B7F86] shadow-[0_10px_22px_-10px_rgb(11_127_134/0.8)]',
};

export default async function CeoProfilePage() {
  const [ceo, siteConfig] = await Promise.all([getCeoContent(), getSiteConfig()]);
  const paragraphs = ceo.summary.split(/\n\s*\n/).filter((p) => p.trim());

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ceo.name,
    jobTitle: ceo.role,
    description: ceo.headline,
    image: ceo.photo.startsWith('http') ? ceo.photo : absoluteUrl(ceo.photo),
    worksFor: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    alumniOf: ceo.education.map((item) => ({ '@type': 'CollegeOrUniversity', name: item.institution })),
  };

  return (
    <>
      <JsonLd graph={[personSchema, breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={ceo.hero.eyebrow} title={ceo.hero.title} description={ceo.hero.description} crumbs={crumbs} />

      {/* Profile */}
      <Section className="bg-paper" labelledBy="ceo-name">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[380px]">
              <div aria-hidden className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-teal/25 via-transparent to-orange/25 blur-xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-line bg-white p-3 shadow-float">
                <div className="relative aspect-[325/344] overflow-hidden rounded-[18px] bg-mist">
                  <Image
                    src={ceo.photo || '/images/ceo/mohsunud-dayan.webp'}
                    alt={ceo.photoAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 380px"
                    className="object-cover"
                  />
                </div>
                <div className="px-2 pt-4 pb-2">
                  <p className="font-display text-lg font-bold text-navy">{ceo.name}</p>
                  <p className="text-[14px] text-ink-600">{ceo.role}</p>
                  <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink-600">
                    {ceo.location ? (
                      <li className="flex items-center gap-2">
                        <MapPin aria-hidden className="h-4 w-4 shrink-0 text-teal-ink" />
                        {ceo.location}
                      </li>
                    ) : null}
                    {ceo.email ? (
                      <li className="flex items-center gap-2">
                        <Mail aria-hidden className="h-4 w-4 shrink-0 text-teal-ink" />
                        <a href={`mailto:${ceo.email}`} className="hover:text-navy hover:underline">
                          {ceo.email}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="min-w-0">
            <Eyebrow>{ceo.credentials ? `CEO · ${ceo.credentials}` : 'CEO'}</Eyebrow>
            <h2 id="ceo-name" className="mt-3 font-display text-[30px] leading-tight font-bold tracking-[-0.02em] text-navy md:text-[40px]">
              {ceo.name}
            </h2>
            <p className="mt-2 font-display text-[16px] font-semibold text-teal-ink md:text-[18px]">{ceo.headline}</p>
            <div className="mt-5 flex flex-col gap-4 text-ink-600 md:text-[17px] md:leading-[1.7]">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {ceo.highlights.length ? (
              <dl className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {ceo.highlights.map((item) => (
                  <div key={item.label} className="rounded-card border border-line bg-white p-4 shadow-soft">
                    <dt className="sr-only">{item.label}</dt>
                    <dd>
                      <span className="block font-display text-[24px] leading-none font-bold text-navy">{item.value}</span>
                      <span className="mt-2 block text-[13px] leading-snug text-ink-600">{item.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Expertise */}
      <Section className="relative overflow-hidden bg-mist" labelledBy="expertise-heading">
        <SectionHeading
          id="expertise-heading"
          eyebrow={ceo.expertiseSection.eyebrow}
          title={<Segments segments={ceo.expertiseSection.title} />}
          description={ceo.expertiseSection.body}
        />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ceo.expertise.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <li key={`${item.title}-${index}`}>
                <Reveal delay={Math.min(index, 8) * 0.04}>
                  <div className="group flex h-full items-center gap-4 rounded-card border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/15 hover:shadow-soft">
                    <span
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ring-4 ring-white transition-transform duration-200 group-hover:scale-105',
                        expertiseTone[item.color] ?? expertiseTone.blue,
                      )}
                    >
                      <Icon aria-hidden className="h-[22px] w-[22px]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[15px] leading-snug font-semibold text-navy">{item.title}</span>
                      {item.note ? <span className="mt-0.5 block text-[13px] text-ink-600">({item.note})</span> : null}
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Career */}
      <Section className="bg-paper" labelledBy="experience-heading">
        <SectionHeading
          id="experience-heading"
          align="left"
          eyebrow={ceo.experienceSection.eyebrow}
          title={ceo.experienceSection.title}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,360px)] lg:gap-14">
          <ol className="relative flex min-w-0 flex-col gap-6 border-l-2 border-line pl-6 md:pl-8">
            {ceo.experience.map((job, index) => (
              <li key={`${job.role}-${index}`} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-6 -left-[33px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white md:-left-[41px]',
                    index === 0 ? 'bg-orange' : 'bg-teal',
                  )}
                />
                <Reveal>
                  <article className="rounded-card border border-line bg-white p-5 shadow-soft md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-[18px] leading-snug font-bold text-navy">{job.role}</h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[14px] font-semibold text-teal-ink">
                          <Briefcase aria-hidden className="h-4 w-4" />
                          {job.company}
                        </p>
                      </div>
                      {job.period ? (
                        <span className="rounded-full bg-mist px-3 py-1 text-[12px] font-semibold whitespace-nowrap text-navy">
                          {job.period}
                        </span>
                      ) : null}
                    </div>
                    {job.summary ? <p className="mt-3 text-[15px] text-ink-600">{job.summary}</p> : null}
                    {job.points.length ? (
                      <ul className="mt-3 flex flex-col gap-2 text-[14px] text-ink-600">
                        {job.points.map((point) => (
                          <li key={point} className="flex gap-2.5">
                            <BadgeCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-teal-ink" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>

          <aside className="flex min-w-0 flex-col gap-6">
            {ceo.achievements.length ? (
              <div className="relative overflow-hidden rounded-card bg-navy p-6 text-white shadow-float">
                <div aria-hidden className="pattern-grid absolute inset-0 opacity-60" />
                <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-teal/25 blur-3xl" />
                <h3 className="relative flex items-center gap-2 font-display text-[17px] font-bold text-white">
                  <Award aria-hidden className="h-5 w-5 text-gold" /> Signature achievements
                </h3>
                <ul className="relative mt-4 flex flex-col gap-4">
                  {ceo.achievements.map((item) => (
                    <li key={item.title} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                      <p className="flex flex-wrap items-baseline justify-between gap-2 font-semibold text-white">
                        {item.title}
                        {item.period ? <span className="text-[12px] font-medium text-gold">{item.period}</span> : null}
                      </p>
                      <p className="mt-1 text-[14px] text-on-navy-muted">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {ceo.skills.length ? (
              <div className="rounded-card border border-line bg-white p-6 shadow-soft">
                <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-navy">
                  <Sparkles aria-hidden className="h-5 w-5 text-orange-icon" /> Core skills
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {ceo.skills.map((skill) => (
                    <li key={skill} className="rounded-full bg-teal-50 px-3 py-1.5 text-[13px] font-semibold text-teal-ink">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-card border border-line bg-white p-6 shadow-soft">
              <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-navy">
                <GraduationCap aria-hidden className="h-5 w-5 text-teal-ink" /> Education
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {ceo.education.map((item) => (
                  <li key={item.degree}>
                    <p className="font-semibold text-navy">{item.degree}</p>
                    <p className="text-[14px] text-ink-600">{item.institution}</p>
                  </li>
                ))}
              </ul>
              {ceo.certifications.length ? (
                <>
                  <h4 className="mt-5 text-[13px] font-bold tracking-wide text-muted uppercase">Professional certifications</h4>
                  <ul className="mt-2 flex flex-col gap-1.5 text-[14px] text-ink-600">
                    {ceo.certifications.map((item) => (
                      <li key={item} className="flex gap-2">
                        <BadgeCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>

      <CtaBanner title={ceo.cta.title} description={ceo.cta.description} />
    </>
  );
}
