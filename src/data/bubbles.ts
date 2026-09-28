import type { PillarColor } from '@/lib/pillar';

/**
 * The three Service Bubbles that sit beside the wheel — DESIGN.md §6.1 ②.
 * `slug` ties each bubble to its wheel arc so hovering either one highlights
 * the other.
 */
export interface ServiceBubble {
  slug: string;
  title: string;
  /** Ethical sub-title, rendered in italics under the bubble heading. */
  subtitle: string;
  color: PillarColor;
  /** Bubble 3 is teal/gold — a gold ring over a teal body. */
  accent?: PillarColor;
  items: string[];
}

export const serviceBubbles: ServiceBubble[] = [
  {
    slug: 'business-corporate',
    title: 'Business & Corporate Services',
    subtitle: 'Trust (Amanah)-based support',
    color: 'orange',
    items: [
      'RJSC / Tax & VAT',
      'Bangladesh Bank Filings',
      'Corporate Documentation',
      'Regulatory Compliance',
    ],
  },
  {
    slug: 'government-assistance',
    title: 'Government Service Assistance',
    subtitle: 'Ethical bureau-navigation',
    color: 'teal',
    items: [
      'BRTA Services',
      'DNCC / City Corp Matters',
      'Passport & Renewal',
      'Land Fees & Tax',
    ],
  },
  {
    slug: 'why-rizsync',
    title: 'Benefits & Value: Transformation',
    subtitle: 'Just value delivery',
    color: 'teal',
    accent: 'gold',
    items: [
      'Significant Time Savings',
      'Economy Saving',
      'Expert Documentation',
      'Partner for Business & Family',
      'Tech Back-Office',
    ],
  },
];

/** Arc order around the wheel, clockwise from the upper right (§6.1 ②). */
export const wheelOrder = [
  'business-corporate',
  'government-assistance',
  'why-rizsync',
  'family-welfare',
  'finance-accounting',
  'digital-transformation',
] as const;

/** Two-line labels drawn outside the ring. Hand-split so they never wrap badly. */
export const wheelLabels: Record<string, [string, string]> = {
  'business-corporate': ['Business &', 'Corporate'],
  'government-assistance': ['Government', 'Assistance'],
  'why-rizsync': ['Benefits', '& Value'],
  'family-welfare': ['Family', 'Welfare'],
  'finance-accounting': ['Finance &', 'Accounting'],
  'digital-transformation': ['Digital', 'Transformation'],
};
