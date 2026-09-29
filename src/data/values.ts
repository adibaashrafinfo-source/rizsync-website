import type { PillarColor } from '@/lib/pillar';

/**
 * The Quranic Business Model — HOME_REDESIGN.md §4.8 and DESIGN.md §6.2.4.
 * `short` is used on the home page, `long` on the About page.
 */
export interface EthicalValue {
  arabic: string;
  transliteration: string;
  english: string;
  short: string;
  long: string;
  /** Colour of the Arabic word on the home card (its ink shade on white). */
  accent: PillarColor;
  /** Amanah is the featured navy card with gold Arabic (§4.8). */
  featured?: boolean;
}

export const ethicalValues: EthicalValue[] = [
  {
    arabic: 'عدل',
    transliteration: 'Adl',
    accent: 'teal',
    english: 'Justice',
    short: 'Fair dealing for every client, on every engagement, whatever its size.',
    long: 'Justice means the same standard of care for a sole trader and a corporate group, fees that reflect the work actually performed, and advice that serves your interest even when another course would earn us more. Where a service you have asked for would not benefit you, we say so.',
  },
  {
    arabic: 'أمانة',
    transliteration: 'Amanah',
    accent: 'gold',
    featured: true,
    english: 'Trust',
    short: 'Your documents and information are held as a trust, never as an asset.',
    long: 'Every document you give us is held under NDA-level confidentiality. Files are accessible only to the named specialists on your engagement, originals are handed over and returned under written acknowledgement, and nothing about your affairs is discussed outside the engagement — including with other clients in your industry.',
  },
  {
    arabic: 'شفافية',
    transliteration: 'Shaffafiyyah',
    accent: 'orange',
    english: 'Transparency',
    short: 'Scope, fee and timeline agreed in writing before any work begins.',
    long: 'You receive a written scope, a fixed fee and a realistic timeline before we start. Government fees are passed through at the published rate with the original receipt attached. If something will take longer or cost more, you hear it from us early — not on the invoice.',
  },
  {
    arabic: 'نفع',
    transliteration: "Naf’ah",
    accent: 'gold',
    english: 'Benefit',
    short: 'Work is measured by the benefit it delivers, not the hours it fills.',
    long: 'We recommend the smallest intervention that solves the problem. If a clearer process removes the need for a system, we will tell you. Our measure of a good engagement is whether your position improved — in time saved, risk reduced or clarity gained — not how much of it we performed.',
  },
];
