'use client';

import dynamic from 'next/dynamic';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';

/**
 * The slider is client-only and below the fold, so it is loaded lazily to keep
 * it out of the initial bundle (§8 Performance).
 */
const TestimonialSlider = dynamic(
  () =>
    import('@/components/sections/testimonial-slider').then((mod) => mod.TestimonialSlider),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-[320px] max-w-3xl animate-pulse rounded-card border border-line bg-mist" />
    ),
  },
);

export function Testimonials() {
  return (
    <Section className="bg-paper" labelledBy="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Client Voices"
        title="Trust, in Their Words"
        description="Placeholder testimonials — to be replaced with attributed client quotes before launch."
      />
      <div className="mt-12">
        <TestimonialSlider />
      </div>
    </Section>
  );
}
