import type { Benefit } from '@/lib/cms/types';

/** Benefits band — HOME_REDESIGN.md §4.7. */
export const defaultBenefits: Benefit[] = [
  {
    title: 'Significant Time Savings',
    description: 'We take on the queues, follow-ups and resubmissions so you do not have to.',
    icon: 'Clock',
    color: 'teal',
  },
  {
    title: 'Economy Saving',
    description: 'One integrated partner instead of separate agents — and far fewer penalties.',
    icon: 'Wallet',
    color: 'orange',
  },
  {
    title: 'Expert Documentation',
    description: 'Files prepared to the standard the office, bank or auditor actually expects.',
    icon: 'FileCheck',
    color: 'gold',
  },
  {
    title: 'Tech Back-Office',
    description: 'Digital records and tracked workflows, so you always know where a matter stands.',
    icon: 'Server',
    color: 'teal',
  },
];
