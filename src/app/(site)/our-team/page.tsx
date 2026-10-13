import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, Mail } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Segments } from '@/components/ui/segments';
import { LinkedInIcon } from '@/components/ui/social-icons';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBanner } from '@/components/home/cta-banner';
import { JsonLd } from '@/components/seo/json-ld';
import { getSiteConfig, getTeam, getTeamContent } from '@/lib/cms/queries';
import { breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/config/site';
import { pillarTheme } from '@/lib/pillar';
import { initials } from '@/lib/utils';
import type { TeamGroup, TeamMember } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Our Team', href: '/our-team' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Our Team | Chartered Accountants, Advocates & Tax Specialists — RizSync',
  description:
    'Meet the RizSync team: chartered accountants, an Advocate of the Supreme Court of Bangladesh, income tax practitioners, protection specialists and technologists.',
  path: '/our-team',
});

export default async function OurTeamPage() {
  const [team, page, siteConfig] = await Promise.all([getTeam(), getTeamContent(), getSiteConfig()]);

  // Sections keep their configured order; anyone whose group no longer exists
  // still appears, under the last section, so a profile is never hidden.
  const known = new Set(page.groups.map((group) => group.key));
  const sections = page.groups
    .map((group, index) => ({
      group,
      members: team.filter(
        (member) =>
          member.group === group.key ||
          (index === page.groups.length - 1 && !known.has(member.group ?? '')),
      ),
    }))
    .filter((section) => section.members.length);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    employee: team.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.title,
      ...(member.photo
        ? { image: member.photo.startsWith('http') ? member.photo : absoluteUrl(member.photo) }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd graph={[schema, breadcrumbSchema(crumbs)]} />
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        crumbs={crumbs}
        image={page.hero.image || undefined}
      />

      {/* Intro + numbers */}
      <Section className="bg-paper" labelledBy="team-intro-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>{page.intro.eyebrow}</Eyebrow>
            <h2
              id="team-intro-heading"
              className="mt-3 font-display text-[28px] leading-[1.14] font-bold tracking-[-0.02em] text-navy md:text-[38px]"
            >
              <Segments segments={page.intro.title} />
            </h2>
            <p className="mt-5 text-ink-600 md:text-[17px] md:leading-[1.7]">{page.intro.body}</p>
          </div>

          {page.stats.length ? (
            <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {page.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-card border border-line bg-white p-4 shadow-soft lg:p-5"
                >
                  <dd className="font-display text-[26px] leading-none font-bold text-navy lg:text-[30px]">
                    {stat.value}
                  </dd>
                  <dt className="text-[13px] leading-snug text-ink-600 lg:text-[14px]">{stat.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Section>

      {/* One section per group */}
      {sections.map(({ group, members }, index) => (
        <Section
          key={group.key}
          id={group.key}
          className={index % 2 === 0 ? 'bg-mist' : 'bg-paper'}
          labelledBy={`${group.key}-heading`}
        >
          <SectionHeading
            id={`${group.key}-heading`}
            eyebrow={group.eyebrow}
            title={group.title}
            description={group.description}
            size="md"
          />
          <ul
            className={cn(
              'mx-auto mt-12 grid gap-6 sm:gap-7',
              members.length === 1 && 'max-w-sm',
              members.length === 2 && 'max-w-3xl sm:grid-cols-2',
              members.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {members.map((member, memberIndex) => (
              <li key={member.id ?? `${group.key}-${memberIndex}`}>
                <Reveal delay={memberIndex * 0.07} className="h-full">
                  <ProfileCard member={member} accent={group.accent} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Container className="pt-2 pb-16 md:pb-24">
        <CtaBanner title={page.cta.title} description={page.cta.description} className="px-0" />
      </Container>
    </>
  );
}

function ProfileCard({ member, accent }: { member: TeamMember; accent: TeamGroup['accent'] }) {
  const theme = pillarTheme[accent] ?? pillarTheme.teal;
  // A profile awaiting its real name is stored with the designation as the
  // name; don't print the same line twice.
  const showTitle = member.title && member.title !== member.name;
  // Portraits are letterboxed rather than cropped, so no face is cut off.
  const tags = member.expertise?.slice(0, 4) ?? [];
  const moreTags = Math.max(0, (member.expertise?.length ?? 0) - tags.length);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/15 hover:shadow-float">
      {/* Portrait — shown whole on a tinted panel. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-mist to-white">
        <span aria-hidden className={cn('absolute inset-x-0 top-0 z-10 h-1', theme.solid)} />
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.title}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
            className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
            <div aria-hidden className="bg-geometric absolute inset-0" />
            <span className="relative font-display text-4xl font-bold text-gold-500">
              {initials(member.name)}
            </span>
          </div>
        )}
        {/* Keeps the name legible where a portrait runs light at the foot. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
        />
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[19px] leading-snug font-bold text-navy">{member.name}</h3>
        {showTitle ? (
          <p className={cn('mt-1.5 text-[14px] leading-snug font-semibold', theme.ink)}>
            {member.title}
          </p>
        ) : null}
        {member.credentials ? (
          <p className="mt-2.5 flex items-start gap-2 text-[12.5px] leading-snug text-muted">
            <BadgeCheck aria-hidden className={cn('mt-px h-4 w-4 shrink-0', theme.ink)} />
            {member.credentials}
          </p>
        ) : null}

        {member.bio ? (
          <p className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-ink-600">{member.bio}</p>
        ) : null}

        <div className="flex-1" />

        {tags.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {tags.map((item) => (
              <li
                key={item}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11.5px] leading-tight font-semibold',
                  theme.tile,
                  theme.tileIcon,
                )}
              >
                {item}
              </li>
            ))}
            {moreTags ? (
              <li className="rounded-full bg-mist px-2.5 py-1 text-[11.5px] leading-tight font-semibold text-muted">
                +{moreTags} more
              </li>
            ) : null}
          </ul>
        ) : null}

        {member.linkedin || member.email ? (
          <div className="mt-4 flex items-center gap-2">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                aria-label={`${member.name} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-600 transition-colors hover:border-navy/40 hover:text-navy"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-600 transition-colors hover:border-navy/40 hover:text-navy"
              >
                <Mail aria-hidden className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
