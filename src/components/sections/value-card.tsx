import type { EthicalValue } from '@/data/values';
import { cn } from '@/lib/utils';

/**
 * One of the four Quranic Business Model values — DESIGN.md §6.1 ⑤ / §6.2.4.
 * `compact` is the home-page treatment (one line); the About page uses the
 * full explanation and leads with the English name.
 */
export function ValueCard({
  value,
  variant = 'compact',
  className,
}: {
  value: EthicalValue;
  variant?: 'compact' | 'detailed';
  className?: string;
}) {
  const detailed = variant === 'detailed';

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-card border border-white/12 bg-white/[0.04] transition-colors duration-300 hover:border-gold-500/50',
        detailed ? 'p-7' : 'p-6',
        className,
      )}
    >
      {detailed ? (
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">
            {value.english}{' '}
            <span className="text-base text-white/45">({value.transliteration})</span>
          </h3>
          <span lang="ar" className="font-arabic text-[40px] leading-none text-gold-500">
            {value.arabic}
          </span>
        </div>
      ) : (
        <>
          <span
            lang="ar"
            className="font-arabic self-start text-[34px] leading-none text-gold-500"
          >
            {value.arabic}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-white">
            {value.english}{' '}
            <span className="text-white/45">({value.transliteration})</span>
          </h3>
        </>
      )}

      <p
        className={cn(
          'leading-relaxed text-white/75',
          detailed ? 'mt-4' : 'mt-2 text-sm text-white/70',
        )}
      >
        {detailed ? value.long : value.short}
      </p>
    </div>
  );
}
