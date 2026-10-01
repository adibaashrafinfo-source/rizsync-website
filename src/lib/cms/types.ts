import type { PillarColor } from '@/lib/pillar';

/**
 * Shapes of everything the admin panel can edit. The public site renders
 * these; `src/lib/cms/defaults.ts` supplies the values used before the
 * database is reachable (local dev, or a Supabase outage at build time).
 */

export type Accent = PillarColor;

/* ---------------------------------------------------------------- settings */

export interface Office {
  label: string;
  street: string;
  locality: string;
  region: string;
  country: string;
}

export interface SiteSettings {
  /**
   * Logos uploaded in the admin panel. Empty means the built-in SyncMark
   * lock-up is used instead, so the header never renders blank.
   */
  branding: {
    /** Shown in the header, which sits on navy — needs light artwork. */
    headerLogo: string;
    /** Shown in the footer (also navy). Falls back to the header logo. */
    footerLogo: string;
    /** Full-colour logo for light backgrounds and sharing cards. */
    lightBackgroundLogo: string;
    /** Rendered height of the header logo, in pixels. */
    headerLogoHeight: number;
    /** Rendered height of the footer logo, in pixels. */
    footerLogoHeight: number;
    /** Hide the "RizSync / Service Solution" text when the logo includes it. */
    showWordmark: boolean;
  };
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  founded: string;
  copyrightStartYear: number;
  ethicsStatement: string;
  heroImage: string;
  contact: {
    email: string;
    phoneDisplay: string;
    /** International digits only, e.g. 8801711504625. */
    phoneNumber: string;
    whatsappNumber: string;
    whatsappMessage: string;
    hours: string;
    openingHoursSchema: string;
  };
  offices: {
    corporate: Office;
    operations: Office;
  };
  mapEmbedSrc: string;
  mapDirectionsUrl: string;
  social: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    x: string;
    tiktok: string;
  };
}

/** Settings plus the values derived from them — what components read. */
export interface SiteConfig extends Omit<SiteSettings, 'contact' | 'offices'> {
  url: string;
  logo: string;
  ogImage: string;
  analytics: { gtmId: string; metaPixelId: string };
  mottoWords: string[];
  contact: SiteSettings['contact'] & {
    phoneHref: string;
    whatsappHref: string;
    whatsappPrefilled: string;
  };
  offices: {
    corporate: Office & { full: string };
    operations: Office & { full: string };
  };
}

/* --------------------------------------------------------------- services */

export interface ServiceContentItem {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface HeroCard {
  title: string;
  subtitle: string;
  chips: string[];
}

export interface Service {
  id?: string;
  slug: string;
  /** "01"–"06", derived from the display order. */
  number: string;
  title: string;
  shortTitle: string;
  heroCard?: HeroCard | null;
  h1: string;
  navDescription: string;
  intro: string;
  color: Accent;
  /** Name from the icon registry in `src/lib/cms/icons.ts`. */
  icon: string;
  bullets: string[];
  items: ServiceContentItem[];
  whyRizsync: { value: string; text: string }[];
  faqs: Faq[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/* ------------------------------------------------------------------- home */

export interface EthicalValue {
  arabic: string;
  transliteration: string;
  english: string;
  short: string;
  long: string;
  accent: Accent;
  featured?: boolean;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
  color: Accent;
}

export interface ProcessStep {
  title: string;
  description: string;
  color: 'navy' | 'teal' | 'orange' | 'gold';
}

/**
 * Title fields marked "markup" accept `{orange:word}` / `{teal:word}` /
 * `{gold:word}` to colour part of the heading (see `parseSegments`).
 */
export interface HomeContent {
  hero: {
    badge: { pill: string; text: string };
    /** markup */
    title: string;
    lead: string;
    motto: { word: string; color: Accent }[];
    primaryCta: string;
    whatsappCta: string;
    socialProof: string;
  };
  about: {
    eyebrow: string;
    /** markup */
    title: string;
    body: string;
    points: { label: string; text: string }[];
    cta: string;
    sinceYear: string;
    sinceLabel: string;
    confidential: string;
    photo: string;
    photoAlt: string;
  };
  pillarsSection: { eyebrow: string; title: string; cta: string };
  benefitsSection: { eyebrow: string; /** markup */ title: string; body: string };
  benefits: Benefit[];
  valuesSection: { eyebrow: string; title: string; body: string; link: string };
  processSection: { eyebrow: string; title: string };
  processSteps: ProcessStep[];
  testimonialsSection: { eyebrow: string; title: string };
  ctaBanner: { title: string; body: string; cta: string };
  insightsSection: { eyebrow: string; title: string; cta: string };
  faqSection: { eyebrow: string; /** markup */ title: string; body: string; cta: string };
  consultationSection: { eyebrow: string; title: string; body: string; submit: string };
}

/* ------------------------------------------------------------------ about */

export interface AboutContent {
  hero: { eyebrow: string; title: string; description: string; image: string };
  story: {
    eyebrow: string;
    title: string;
    /** Paragraphs separated by a blank line. */
    body: string;
    image: string;
    imageAlt: string;
  };
  direction: { eyebrow: string; title: string };
  vision: { title: string; text: string };
  mission: { title: string; text: string };
  valuesSection: { eyebrow: string; title: string; description: string };
  values: EthicalValue[];
  teamSection: { eyebrow: string; title: string; description: string };
  cta: { title: string; description: string };
}

/* ------------------------------------------------------------ collections */

export interface TeamMember {
  id?: string;
  name: string;
  /** Primary designation, e.g. "Consultant — Tax & VAT". */
  title: string;
  /** Qualifications line, e.g. "FCA, Advocate, Supreme Court of Bangladesh". */
  credentials: string;
  /** Key of the /our-team section this profile belongs to. */
  group: string;
  bio: string;
  /** Short capability bullets shown under the biography. */
  expertise: string[];
  photo: string | null;
  linkedin: string | null;
  email: string | null;
}

/* -------------------------------------------------------------- our team */

export interface TeamGroup {
  /** Matches TeamMember.group. */
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: Accent;
}

export interface TeamContent {
  hero: { eyebrow: string; title: string; description: string; image: string };
  intro: { eyebrow: string; /** markup */ title: string; body: string };
  stats: { value: string; label: string }[];
  groups: TeamGroup[];
  cta: { title: string; description: string };
}

export interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  photo?: string | null;
}

/* -------------------------------------------------------------------- ceo */

export type ExpertiseColor = 'green' | 'blue' | 'orange' | 'purple' | 'teal';

export interface CeoContent {
  hero: { eyebrow: string; title: string; description: string };
  name: string;
  credentials: string;
  role: string;
  headline: string;
  photo: string;
  photoAlt: string;
  /** Paragraphs separated by a blank line. */
  summary: string;
  location: string;
  email: string;
  highlights: { value: string; label: string }[];
  experienceSection: { eyebrow: string; title: string };
  experience: { role: string; company: string; period: string; summary: string; points: string[] }[];
  achievements: { title: string; text: string; period: string }[];
  skills: string[];
  certifications: string[];
  education: { degree: string; institution: string }[];
  expertiseSection: { eyebrow: string; /** markup */ title: string; body: string };
  expertise: { title: string; note: string; icon: string; color: ExpertiseColor }[];
  cta: { title: string; description: string };
}
