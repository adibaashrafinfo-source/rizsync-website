import type { HomeContent } from '@/lib/cms/types';
import { defaultBenefits } from '@/data/benefits';
import { defaultProcessSteps } from '@/data/process';

/**
 * Home page copy — HOME_REDESIGN.md §4. Components render these strings and
 * never carry copy of their own, so every line on the page is edited here.
 *
 * Headings, the hero lead and the About heading are verbatim from the spec.
 * Paragraphs the spec leaves to the reference mockup are written to match it.
 * Segments marked `accent` render in that pillar colour.
 */

export const defaultHome: HomeContent = {
  hero: {
    badge: { pill: 'Ethical', text: 'Guided by the Quranic Business Model' },
    title: 'RizSync {orange:Service} {teal:Solution}',
    lead: 'Your unified professional partner for business & family — corporate compliance, government liaison, finance and digital transformation, under one trusted roof.',
    motto: [
      { word: 'Connect', color: 'teal' },
      { word: 'Simplify', color: 'orange' },
      { word: 'Protect', color: 'teal' },
      { word: 'Transform', color: 'orange' },
      { word: 'Grow', color: 'gold' },
    ],
    primaryCta: 'Request Consultation',
    whatsappCta: 'WhatsApp Us',
    /** TODO(client): swap the placeholder avatars for real client photos. */
    socialProof: 'Trusted by entrepreneurs, SMEs, corporates & families since 2021',
  },

  about: {
    eyebrow: 'Who we are',
    title: 'One partner for every professional matter — handled with {orange:integrity}.',
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
    /** Photo for the navy panel; set to null to fall back to the star pattern. */
    photo: '/images/team/about-office.webp',
    photoAlt: 'A RizSync advisor at a desk overlooking the city skyline',
  },

  pillarsSection: {
    eyebrow: 'Our services',
    title: 'Six pillars of expertise. One seamless experience.',
    cta: 'All Services',
  },
  benefitsSection: {
    eyebrow: 'Why RizSync',
    title: 'Less paperwork. Less waiting. {gold:More growth.}',
    body: 'We handle the filings, the queues and the follow-ups — so you can put your time into the business and the people who depend on it.',
  },

  valuesSection: {
    eyebrow: 'Our ethical foundation',
    title: 'The Quranic Business Model',
    body: 'Four principles decide how we quote, what we take on and how your information is held.',
    link: 'Read about our values',
  },

  processSection: {
    eyebrow: 'How we work',
    title: 'From first call to finished file — in 4 steps',
  },

  testimonialsSection: {
    eyebrow: 'Client voices',
    title: 'What our clients say',
  },

  ctaBanner: {
    title: 'Ready for an ethical partnership?',
    body: 'Start with a free, confidential consultation. You will leave it knowing exactly what needs doing — and what it will cost.',
    cta: 'Request Consultation',
  },

  insightsSection: {
    eyebrow: 'Insights',
    title: 'Latest updates & guidance',
    cta: 'View all insights',
  },

  faqSection: {
    eyebrow: 'FAQ',
    title: 'Questions we hear {teal:every week}',
    body: 'Straight answers about how we work, what we charge and which services fit your situation. Can’t find yours? Ask us directly.',
    cta: 'Ask a question',
  },

  consultationSection: {
    eyebrow: 'Request consultation',
    title: "Let's simplify your business & family matters.",
    body: 'Tell us what you need. The first conversation is free and carries no obligation.',
    submit: 'Send Request',
  },
  benefits: defaultBenefits,
  processSteps: defaultProcessSteps,
};
