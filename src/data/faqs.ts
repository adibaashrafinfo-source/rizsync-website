import type { Faq } from '@/data/services';

/** General FAQs shown on the Services hub — DESIGN.md §6.3.4. */
export const generalFaqs: Faq[] = [
  {
    question: 'How does an engagement with RizSync start?',
    answer:
      'With a free consultation of about forty-five minutes, in person at our Mirpur office, by phone or over WhatsApp. We listen to the situation, tell you honestly what needs doing, and follow up with a written scope and fixed quote. Nothing begins until you accept it.',
  },
  {
    question: 'Do you work with individuals as well as companies?',
    answer:
      'Yes. Roughly half of our work is for businesses — accounting, RJSC, compliance, digital operations — and the rest is personal and family: government services, documentation and financial planning. Many clients use us for both.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'One-off work is a fixed fee quoted before we start. Ongoing support is a monthly retainer sized to the agreed scope. Government fees are never marked up: they are passed through at the published rate with the original receipt attached to your invoice.',
  },
  {
    question: 'What does the Quranic Business Model mean in practice?',
    answer:
      'Four commitments: Adl (justice) — fair dealing and fair fees; Amanah (trust) — your documents held in confidence; Shaffafiyyah (transparency) — scope, fee and timeline in writing before work begins; and Naf’ah (benefit) — the smallest intervention that solves the problem. It also means we decline work that can only succeed through unofficial payments.',
  },
  {
    question: 'How quickly can you start?',
    answer:
      'Consultations are usually available within one to two working days. For time-critical matters such as an expiring licence or a filing deadline, tell us when you call and we will prioritise the assessment accordingly.',
  },
];

/** The four-step delivery process — §6.1 ⑥, reused on service sub-pages. */
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Consultation',
    description:
      'A free, confidential conversation to understand your situation and what actually needs to happen — with no obligation to proceed.',
  },
  {
    step: 2,
    title: 'Assessment & Transparent Quote',
    description:
      'We assess the work, confirm the documents required and send a written scope with a fixed fee and a realistic timeline.',
  },
  {
    step: 3,
    title: 'Execution & Documentation',
    description:
      'Our specialists carry out the work and prepare every supporting document, keeping you updated at each milestone rather than only at the end.',
  },
  {
    step: 4,
    title: 'Delivery & Ongoing Support',
    description:
      'You receive the completed file with all receipts and records, plus a calendar of the deadlines that follow — and we stay available for what comes next.',
  },
];

/** "Who We Serve" — §6.1 ⑦. */
export interface Audience {
  title: string;
  benefit: string;
}

export const audiences: Audience[] = [
  {
    title: 'Entrepreneurs',
    benefit:
      'Get incorporated, compliant and operating without losing your first year to paperwork.',
  },
  {
    title: 'SMEs',
    benefit:
      'A full finance and compliance function at a fraction of the cost of building one in-house.',
  },
  {
    title: 'Corporate Organizations',
    benefit:
      'Specialist capacity for regulatory filings, secretarial work and back-office operations at scale.',
  },
  {
    title: 'High-Net-Worth Individuals & Families',
    benefit:
      'One discreet adviser for wealth planning, property documentation and personal government matters.',
  },
];

/** Trust micro-row under the hero CTAs — §6.1 ①. */
export const heroTrustPoints = [
  'Confidential (Amanah)',
  'Transparent Pricing',
  'Mirpur, Dhaka',
];
