'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

const INTERVAL = 6000;

/** DESIGN.md §6.1 ⑧ — auto-advance 6s, pause on hover/focus, dots + arrows. */
export function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => setIndex((next + testimonials.length) % testimonials.length),
    [],
  );

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused]);

  const active = testimonials[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="rounded-card border border-line bg-paper p-8 shadow-soft md:p-10"
      >
        <Quote aria-hidden className="h-8 w-8 text-gold-500/70" strokeWidth={1.5} />

        <div
          className="mt-1 flex items-center gap-0.5"
          role="img"
          aria-label={`${active.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, star) => (
            <Star
              key={star}
              aria-hidden
              className={cn(
                'h-4 w-4',
                star < active.rating ? 'fill-gold-500 text-gold-500' : 'text-line',
              )}
            />
          ))}
        </div>

        <blockquote className="mt-4 text-lg leading-relaxed text-ink-900 text-pretty">
          &ldquo;{active.quote}&rdquo;
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-gold-500"
          >
            {active.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </span>
          <span>
            <span className="block text-sm font-semibold text-navy-900">{active.name}</span>
            <span className="block text-[13px] text-ink-600">
              {active.role}, {active.company}
            </span>
          </span>
        </figcaption>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => go(index - 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-navy-900 shadow-soft transition-colors hover:border-navy-900/40"
        >
          <ChevronLeft aria-hidden className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((testimonial, dot) => (
            <button
              key={testimonial.quote}
              type="button"
              aria-label={`Show testimonial ${dot + 1}`}
              aria-current={dot === index}
              onClick={() => go(dot)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                dot === index ? 'w-6 bg-gold-500' : 'w-2 bg-line hover:bg-ink-600/40',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => go(index + 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-navy-900 shadow-soft transition-colors hover:border-navy-900/40"
        >
          <ChevronRight aria-hidden className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
