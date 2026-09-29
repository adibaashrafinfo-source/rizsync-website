import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { services } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/**
 * White panel of all six pillars overlapping the hero's bottom edge —
 * HOME_REDESIGN.md §4.4. The highlighted state (orange-25 background, solid
 * tile) follows hover/focus rather than being fixed on Business.
 *
 * Layout: 6 columns from 1280px, 3 × 2 from 768px, and a horizontal
 * scroll-snap row below 768px.
 */
export function QuickServiceBar() {
  return (
    <div className="relative z-10 -mt-[84px]">
      <Container>
        <nav
          aria-label="Our services"
          className="overflow-hidden rounded-card bg-white shadow-float"
        >
          <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-6">
            {services.map((service) => {
              const theme = pillarTheme[service.color];
              const Icon = service.icon;
              return (
                <li
                  key={service.slug}
                  className="min-w-[160px] shrink-0 snap-start border-r border-line last:border-r-0 md:min-w-0 md:border-b md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(n+4)]:border-b-0 xl:border-b-0 xl:[&:nth-child(3n)]:border-r xl:last:border-r-0"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col gap-4 px-5 py-6 transition-colors duration-200 hover:bg-orange-25 focus-visible:bg-orange-25 xl:px-6 xl:py-7"
                  >
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-btn transition-colors duration-200',
                        theme.tile,
                        theme.tileIcon,
                        // Hover swaps the tint for a solid pillar tile (§4.4).
                        service.color === 'teal' && 'group-hover:bg-teal group-hover:text-navy',
                        service.color === 'orange' && 'group-hover:bg-orange group-hover:text-navy',
                        service.color === 'gold' && 'group-hover:bg-gold group-hover:text-navy',
                      )}
                    >
                      <Icon aria-hidden className="h-[22px] w-[22px]" strokeWidth={2} />
                    </span>
                    <span className="font-display text-base leading-snug font-semibold text-navy">
                      {service.shortTitle}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
