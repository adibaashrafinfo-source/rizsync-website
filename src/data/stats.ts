/**
 * Trust strip — DESIGN.md §6.1 ③.
 * TODO(client): all four figures are placeholders and need confirming.
 */
export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 500, suffix: '+', label: 'Clients Served' },
  { value: 6, label: 'Service Pillars' },
  { value: 100, suffix: '%', label: 'Confidential' },
  { value: 2021, label: 'Serving Since', prefix: '' },
];
