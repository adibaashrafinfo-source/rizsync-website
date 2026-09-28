/**
 * Pillar colour mapping — DESIGN.md §4.1.
 *
 * Tailwind needs class names to exist as complete literals at build time, so
 * every pillar variant is written out in full here rather than interpolated.
 */

export type PillarColor = 'teal' | 'orange' | 'gold';

export interface PillarTheme {
  /** 3px top border on pillar cards. */
  border: string;
  /** Tinted circle behind the pillar icon. */
  iconWrap: string;
  /** Icon stroke colour. */
  icon: string;
  /** Small text on white — uses the -600 shade for WCAG AA. */
  text: string;
  /** Solid fill, for dots and badges. */
  dot: string;
  /** Tinted section background. */
  tint: string;
  /** Ring shown when a wheel arc highlights its bubble. */
  ring: string;
  /** Raw hex, for inline SVG fills where a class cannot reach. */
  hex: string;
  /** Eyebrow colour on a service sub-page hero (on navy). */
  onDark: string;
}

export const pillarTheme: Record<PillarColor, PillarTheme> = {
  teal: {
    border: 'border-t-teal-500',
    iconWrap: 'bg-teal-50 text-teal-600',
    icon: 'text-teal-600',
    text: 'text-teal-600',
    dot: 'bg-teal-500',
    tint: 'bg-teal-50',
    ring: 'ring-teal-500',
    hex: '#0FA3A3',
    onDark: 'text-teal-500',
  },
  orange: {
    border: 'border-t-orange-500',
    iconWrap: 'bg-orange-50 text-orange-600',
    icon: 'text-orange-600',
    text: 'text-orange-600',
    dot: 'bg-orange-500',
    tint: 'bg-orange-50',
    ring: 'ring-orange-500',
    hex: '#F28C28',
    onDark: 'text-orange-500',
  },
  gold: {
    border: 'border-t-gold-500',
    iconWrap: 'bg-gold-50 text-gold-600',
    icon: 'text-gold-600',
    text: 'text-gold-600',
    dot: 'bg-gold-500',
    tint: 'bg-gold-50',
    ring: 'ring-gold-500',
    hex: '#C9A24D',
    onDark: 'text-gold-500',
  },
};
