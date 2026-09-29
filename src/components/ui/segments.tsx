import type { Segment } from '@/data/home';
import { cn } from '@/lib/utils';

/**
 * Renders copy with coloured highlights (e.g. "Service" in orange in the H1).
 *
 * On navy the raw brand colours pass comfortably (orange ≈ 7:1). On white
 * they do not — raw orange is ~2.5:1 and raw teal ~2.9:1, under the 3:1 AA
 * floor even for large text — so light backgrounds use the darker shades.
 */
const onDarkClass = { teal: 'text-teal', orange: 'text-orange', gold: 'text-gold' } as const;
const onLightClass = {
  teal: 'text-teal-ink',
  orange: 'text-orange-icon',
  gold: 'text-gold-ink',
} as const;

export function Segments({ segments, onDark = false }: { segments: Segment[]; onDark?: boolean }) {
  const palette = onDark ? onDarkClass : onLightClass;
  return (
    <>
      {segments.map((segment, index) =>
        segment.accent ? (
          <span key={index} className={cn(palette[segment.accent])}>
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
