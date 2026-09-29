'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { testimonials } from '@/data/testimonials';
import { testimonialsSection } from '@/data/home';
import { cn } from '@/lib/utils';

/** Middle card is the featured navy card (§4.10). */
const FEATURED_INDEX = 1;

const navButton =
  'inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-navy text-navy transition-colors hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-30';

/**
 * Client voices — HOME_REDESIGN.md §4.10. Embla carousel: three cards visible
 * on desktop, ~1.1 on mobile with snap.
 * TODO(client): placeholder quotes until real, attributable testimonials arrive.
 */
export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi, update]);

  return (
    <section aria-labelledby="testimonials-heading" className="bg-white py-14 md:py-[72px] xl:py-28">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>{testimonialsSection.eyebrow}</Eyebrow>
            <h2
              id="testimonials-heading"
              className="mt-4 font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-navy md:text-[40px] xl:text-h2"
            >
              {testimonialsSection.title}
            </h2>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              className={navButton}
            >
              <ArrowLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              className={navButton}
            >
              <ArrowRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <ul className="-ml-6 flex touch-pan-y">
            {testimonials.map((item, index) => {
              const featured = index === FEATURED_INDEX;
              const initials = item.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('');
              return (
                <li
                  key={`${item.name}-${index}`}
                  className="min-w-0 shrink-0 grow-0 basis-[88%] pl-6 sm:basis-[60%] lg:basis-1/3"
                >
                  <figure
                    className={cn(
                      'flex h-full flex-col rounded-card border p-7 md:p-8',
                      featured
                        ? 'border-navy bg-navy shadow-featured'
                        : 'border-line bg-white shadow-soft',
                    )}
                  >
                    <div
                      className="flex gap-1 text-gold"
                      role="img"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star
                          key={star}
                          aria-hidden
                          className={cn('h-[18px] w-[18px]', star < item.rating && 'fill-gold')}
                        />
                      ))}
                    </div>
                    <blockquote
                      className={cn(
                        'mt-5 flex-1 text-base leading-[1.7]',
                        featured ? 'text-on-navy-muted' : 'text-ink-600',
                      )}
                    >
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-7 flex items-center gap-3.5">
                      <span
                        aria-hidden
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold',
                          featured ? 'bg-gold text-navy' : 'bg-teal-50 text-teal-ink',
                        )}
                      >
                        {initials}
                      </span>
                      <span>
                        <span
                          className={cn(
                            'block font-display text-base font-bold',
                            featured ? 'text-white' : 'text-navy',
                          )}
                        >
                          {item.name}
                        </span>
                        <span
                          className={cn(
                            'block text-sm',
                            featured ? 'text-on-navy-faint' : 'text-muted',
                          )}
                        >
                          {item.role}, {item.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
