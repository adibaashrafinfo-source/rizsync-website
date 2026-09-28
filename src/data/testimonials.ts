/**
 * DESIGN.md §6.1 ⑧ — TODO(client): replace with real, attributable testimonials.
 * Do not publish these placeholders; they describe no real client.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'We had three separate people handling tax, RJSC filings and licence renewals, and none of them spoke to each other. RizSync took all of it. The first thing they did was show us a calendar of every deadline we had been missing.',
    name: 'Placeholder Name',
    role: 'Managing Director',
    company: 'Placeholder Trading Ltd.',
    rating: 5,
  },
  {
    quote:
      'What I value most is being told plainly when something is not worth doing. They talked us out of a software purchase we had already budgeted for, and fixed the process instead.',
    name: 'Placeholder Name',
    role: 'Founder',
    company: 'Placeholder Apparel',
    rating: 5,
  },
  {
    quote:
      'They handled my father’s land mutation and my company’s annual return in the same month, and I only had to explain our family situation once. Every fee came with the government receipt attached.',
    name: 'Placeholder Name',
    role: 'Director',
    company: 'Placeholder Group',
    rating: 5,
  },
];
