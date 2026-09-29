import type { PillarColor } from '@/lib/pillar';

/**
 * Home page copy — HOME_REDESIGN.md §4. Components render these strings and
 * never carry copy of their own, so every line on the page is edited here.
 *
 * Headings, the hero lead and the About heading are verbatim from the spec.
 * Paragraphs the spec leaves to the reference mockup are written to match it.
 * Segments marked `accent` render in that pillar colour.
 */

export interface Segment {
  text: string;
  accent?: PillarColor;
}

export const hero = {
  badge: { pill: 'Ethical', text: 'Guided by the Quranic Business Model' },
  title: [
    { text: 'RizSync ' },
    { text: 'Service', accent: 'orange' },
    { text: ' ' },
    { text: 'Solution', accent: 'teal' },
  ] satisfies Segment[],
  lead: 'Your unified professional partner for business & family — corporate compliance, government liaison, finance and digital transformation, under one trusted roof.',
  motto: [
    { word: 'Connect', color: 'teal' },
    { word: 'Simplify', color: 'orange' },
    { word: 'Protect', color: 'teal' },
    { word: 'Transform', color: 'orange' },
    { word: 'Grow', color: 'gold' },
  ] satisfies { word: string; color: PillarColor }[],
  primaryCta: 'Request Consultation',
  whatsappCta: 'WhatsApp Us',
  /** TODO(client): swap the placeholder avatars for real client photos. */
  socialProof: 'Trusted by entrepreneurs, SMEs, corporates & families since 2021',
};

export const about = {
  eyebrow: 'Who we are',
  title: [
    { text: 'One partner for every professional matter — handled with ' },
    { text: 'integrity', accent: 'orange' },
    { text: '.' },
  ] satisfies Segment[],
  body: 'Since 2021, RizSync has helped entrepreneurs, companies and families in Dhaka get their compliance, government and financial matters done — properly, on time, and without the runaround. One team holds the whole picture, so you explain your situation once.',
  points: [
    {
      label: 'Vision',
      text: "Bangladesh's most trusted platform connecting business support with personal welfare.",
    },
    {
      label: 'Mission',
      text: 'Simplify regulatory, financial and digital complexity through expert, ethical advice.',
    },
    {
      label: 'Values',
      text: 'Justice, trust, transparency and real benefit in every engagement.',
    },
  ],
  cta: 'More About RizSync',
  sinceYear: '2021',
  sinceLabel: "Serving Dhaka's businesses & families since",
  confidential: '100% Confidential',
  /** TODO(client): team/office photo for the navy panel. */
  photo: null as string | null,
};

export const pillarsSection = {
  eyebrow: 'Our services',
  title: 'Six pillars of expertise. One seamless experience.',
  cta: 'All Services',
};

export const benefitsSection = {
  eyebrow: 'Why RizSync',
  title: [
    { text: 'Less paperwork. Less waiting. ' },
    { text: 'More growth.', accent: 'gold' },
  ] satisfies Segment[],
  body: 'We handle the filings, the queues and the follow-ups — so you can put your time into the business and the people who depend on it.',
};

export const valuesSection = {
  eyebrow: 'Our ethical foundation',
  title: 'The Quranic Business Model',
  body: 'Four principles decide how we quote, what we take on and how your information is held.',
  link: 'Read about our values',
};

export const processSection = {
  eyebrow: 'How we work',
  title: 'From first call to finished file — in 4 steps',
};

export const testimonialsSection = {
  eyebrow: 'Client voices',
  title: 'What our clients say',
};

export const ctaBanner = {
  title: 'Ready for an ethical partnership?',
  body: 'Start with a free, confidential consultation. You will leave it knowing exactly what needs doing — and what it will cost.',
  cta: 'Request Consultation',
};

export const insightsSection = {
  eyebrow: 'Insights',
  title: 'Latest updates & guidance',
  cta: 'View all insights',
};

export const consultationSection = {
  eyebrow: 'Request consultation',
  title: "Let's simplify your business & family matters.",
  body: 'Tell us what you need. The first conversation is free and carries no obligation.',
  submit: 'Send Request',
};
