import type { ProcessStep } from '@/lib/cms/types';

/**
 * The four-step delivery process — HOME_REDESIGN.md §4.9, reused on every
 * service page. Step titles are from the spec; the one-line descriptions
 * follow the reference mockup's wording and tone.
 */

export const defaultProcessSteps: ProcessStep[] = [
  {
    title: 'Consultation',
    description:
      'A free, confidential conversation to understand your situation and what actually needs to happen.',
    color: 'navy',
  },
  {
    title: 'Transparent Quote',
    description:
      'A written scope, a fixed fee and a realistic timeline — agreed before any work begins.',
    color: 'teal',
  },
  {
    title: 'Execution',
    description:
      'Our specialists do the work and prepare every document, updating you at each milestone.',
    color: 'orange',
  },
  {
    title: 'Ongoing Support',
    description:
      'You receive the completed file with receipts, plus a calendar of what comes due next.',
    color: 'gold',
  },
];
