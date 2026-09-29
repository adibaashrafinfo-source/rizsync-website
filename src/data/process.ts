/**
 * The four-step delivery process — HOME_REDESIGN.md §4.9, reused on every
 * service page. Step titles are from the spec; the one-line descriptions
 * follow the reference mockup's wording and tone.
 */

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  /** Number-circle colour (§4.9): 1 navy, 2 teal, 3 orange, 4 gold. */
  color: 'navy' | 'teal' | 'orange' | 'gold';
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Consultation',
    description:
      'A free, confidential conversation to understand your situation and what actually needs to happen.',
    color: 'navy',
  },
  {
    step: 2,
    title: 'Transparent Quote',
    description:
      'A written scope, a fixed fee and a realistic timeline — agreed before any work begins.',
    color: 'teal',
  },
  {
    step: 3,
    title: 'Execution',
    description:
      'Our specialists do the work and prepare every document, updating you at each milestone.',
    color: 'orange',
  },
  {
    step: 4,
    title: 'Ongoing Support',
    description:
      'You receive the completed file with receipts, plus a calendar of what comes due next.',
    color: 'gold',
  },
];
