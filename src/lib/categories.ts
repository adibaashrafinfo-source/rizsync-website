import type { PillarColor } from '@/lib/pillar';

/**
 * Insight categories and their pillar colours. Kept out of `lib/mdx.ts`,
 * which reads the filesystem, so client components can import it.
 */

/** The fixed category set — DESIGN.md §6.5. */
export const insightCategories = [
  'Tax & VAT',
  'RJSC & Compliance',
  'Government Services',
  'Digital Transformation',
  'Islamic Finance',
  'Family Planning',
] as const;

export type InsightCategory = (typeof insightCategories)[number];

/** Each category borrows its pillar's colour for chips and fallback covers (§4.12). */
const categoryColors: Record<string, PillarColor> = {
  'Tax & VAT': 'teal',
  'RJSC & Compliance': 'orange',
  'Government Services': 'teal',
  'Digital Transformation': 'orange',
  'Islamic Finance': 'gold',
  'Family Planning': 'teal',
};

export function categoryColor(category: string): PillarColor {
  return categoryColors[category] ?? 'teal';
}
