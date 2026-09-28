'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ConsultationForm } from '@/components/forms/consultation-form';
import { clientTypes } from '@/lib/validators';
import { cn } from '@/lib/utils';

/**
 * "Who are you?" tabs above the form — DESIGN.md §6.6.5. Picking a tab sets
 * the client type, which in turn narrows the Subject options.
 */
export function ContactFormPanel({ defaultSubject }: { defaultSubject?: string }) {
  const [clientType, setClientType] = useState<(typeof clientTypes)[number]>(clientTypes[0]);

  return (
    <div>
      <Tabs.Root
        value={clientType}
        onValueChange={(value) => setClientType(value as (typeof clientTypes)[number])}
      >
        <p className="text-sm font-semibold text-navy-900">Who are you?</p>
        <Tabs.List
          aria-label="Choose the pathway that fits you"
          className="mt-3 flex flex-wrap gap-2"
        >
          {clientTypes.map((type) => (
            <Tabs.Trigger
              key={type}
              value={type}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                'border-line bg-paper text-ink-600 hover:border-navy-900/30',
                'data-[state=active]:border-navy-900 data-[state=active]:bg-navy-900 data-[state=active]:text-white',
              )}
            >
              {type}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <div className="mt-5">
        <ConsultationForm defaultSubject={defaultSubject} defaultClientType={clientType} />
      </div>
    </div>
  );
}
