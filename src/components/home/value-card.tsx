import type { EthicalValue } from '@/data/values';
import { cn } from '@/lib/utils';

const arabicInk = {
  teal: 'text-teal-ink',
  orange: 'text-orange-icon',
  gold: 'text-gold-ink',
} as const;

/**
 * Home-page value card — HOME_REDESIGN.md §4.8. Amanah is the featured navy
 * card with gold Arabic; the others are white with the value's ink colour.
 */
export function ValueCard({ value }: { value: EthicalValue }) {
  const featured = Boolean(value.featured);

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-card border p-7 md:p-8',
        featured ? 'border-navy bg-navy shadow-featured' : 'border-line bg-white shadow-soft',
      )}
    >
      <span
        lang="ar"
        dir="rtl"
        className={cn(
          'block text-left font-arabic text-[46px] leading-[1.2]',
          featured ? 'text-gold' : arabicInk[value.accent],
        )}
      >
        {value.arabic}
      </span>
      <h3
        className={cn(
          'mt-4 font-display text-lg font-bold md:text-xl',
          featured ? 'text-white' : 'text-navy',
        )}
      >
        {value.english} <span className="whitespace-nowrap">· {value.transliteration}</span>
      </h3>
      <p
        className={cn(
          'mt-2 text-[15px] leading-[1.65]',
          featured ? 'text-on-navy-muted' : 'text-ink-600',
        )}
      >
        {value.short}
      </p>
    </div>
  );
}
