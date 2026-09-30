'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import type { Faq } from '@/lib/cms/types';

/** Card-style accordion for the home page FAQ; the first answer starts open. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="faq-0" className="flex flex-col gap-3">
      {faqs.map((faq, index) => (
        <Accordion.Item
          key={`${faq.question}-${index}`}
          value={`faq-${index}`}
          className="group overflow-hidden rounded-card border border-line bg-white shadow-soft transition-[border-color,box-shadow] duration-300 data-[state=open]:border-teal/40 data-[state=open]:shadow-lift"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist font-display text-[13px] font-bold text-navy transition-colors duration-300 group-data-[state=open]:bg-navy group-data-[state=open]:text-gold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-display text-[16px] leading-snug font-semibold text-navy md:text-[17px]">
                {faq.question}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-teal-ink transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-teal-ink group-data-[state=open]:bg-teal-ink group-data-[state=open]:text-white">
                <Plus aria-hidden className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden">
            <p className="px-5 pb-6 text-[15px] leading-[1.7] text-ink-600 md:pr-16 md:pl-[76px]">{faq.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
