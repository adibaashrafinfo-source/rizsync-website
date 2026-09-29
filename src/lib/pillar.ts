/**
 * Pillar colour mapping — DESIGN.md §4.1 / HOME_REDESIGN.md §2.1 and §3.
 *
 * Tailwind needs class names to exist as complete literals at build time, so
 * every pillar variant is written out in full here rather than interpolated.
 */

export type PillarColor = 'teal' | 'orange' | 'gold';

export interface PillarTheme {
  /** Raw hex, for inline SVG strokes and box-shadows. */
  hex: string;
  /** Tinted square behind an icon on white (§2.3). */
  tile: string;
  /** Icon colour inside a tinted tile — the accessible ink shade. */
  tileIcon: string;
  /** Solid pillar fill — featured tiles, number circles, dots. */
  solid: string;
  /** Small text on white. Never the raw brand colour (§2.1 contrast rules). */
  ink: string;
  /** Motto / service chip on navy: 14% fill, 45% border, light text. */
  chipOnNavy: string;
  /** Chip on white (active hero card, blog category). */
  chipOnLight: string;
  /** Focus/active ring colour. */
  ring: string;

  // v1 names still used by inner pages.
  border: string;
  iconWrap: string;
  icon: string;
  text: string;
  dot: string;
  tint: string;
  onDark: string;
}

export const pillarTheme: Record<PillarColor, PillarTheme> = {
  teal: {
    hex: '#0FA3A3',
    tile: 'bg-teal-50',
    tileIcon: 'text-teal-ink',
    solid: 'bg-teal',
    ink: 'text-teal-ink',
    chipOnNavy: 'border-teal/45 bg-teal/[0.14] text-teal-chip',
    chipOnLight: 'bg-teal-50 text-teal-ink',
    ring: 'ring-teal',
    border: 'border-t-teal',
    iconWrap: 'bg-teal-50 text-teal-ink',
    icon: 'text-teal-ink',
    text: 'text-teal-ink',
    dot: 'bg-teal',
    tint: 'bg-teal-50',
    onDark: 'text-teal-on-navy',
  },
  orange: {
    hex: '#F28C28',
    tile: 'bg-orange-50',
    tileIcon: 'text-orange-icon',
    solid: 'bg-orange',
    ink: 'text-orange-ink',
    chipOnNavy: 'border-orange/45 bg-orange/[0.14] text-orange-chip',
    chipOnLight: 'bg-orange-50 text-orange-ink',
    ring: 'ring-orange',
    border: 'border-t-orange',
    iconWrap: 'bg-orange-50 text-orange-icon',
    icon: 'text-orange-icon',
    text: 'text-orange-ink',
    dot: 'bg-orange',
    tint: 'bg-orange-50',
    onDark: 'text-orange-chip',
  },
  gold: {
    hex: '#C9A24D',
    tile: 'bg-gold-50',
    tileIcon: 'text-gold-ink',
    solid: 'bg-gold',
    ink: 'text-gold-ink',
    chipOnNavy: 'border-gold/45 bg-gold/[0.14] text-gold-chip',
    chipOnLight: 'bg-gold-50 text-gold-ink',
    ring: 'ring-gold',
    border: 'border-t-gold',
    iconWrap: 'bg-gold-50 text-gold-ink',
    icon: 'text-gold-ink',
    text: 'text-gold-ink',
    dot: 'bg-gold',
    tint: 'bg-gold-50',
    onDark: 'text-gold-chip',
  },
};
