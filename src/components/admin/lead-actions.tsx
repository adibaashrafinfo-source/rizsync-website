'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { deleteLead, updateLead } from '@/app/admin/actions';
import { inputClass } from '@/components/admin/form/fields';
import { ToastView } from '@/components/admin/editor';
import { btn } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

const statuses = [
  { value: 'new', label: 'New', dot: 'bg-orange' },
  { value: 'contacted', label: 'Contacted', dot: 'bg-sky-500' },
  { value: 'closed', label: 'Closed', dot: 'bg-emerald-500' },
];

export function LeadActions({ id, status, notes }: { id: string; status: string; notes: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [text, setText] = useState(notes);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  const apply = (patch: { status?: string; notes?: string }) =>
    startTransition(async () => {
      const result = await updateLead(id, patch);
      setToast(result.ok ? { tone: 'success', message: 'Lead updated.' } : { tone: 'error', message: result.error });
      window.setTimeout(() => setToast(null), 3000);
      router.refresh();
    });

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-24px_rgb(0_32_74/0.25)]">
      <ToastView toast={toast} />
      <h2 className="font-display text-[16px] font-bold text-navy">Follow-up</h2>

      <p className="mt-4 mb-2 text-[13px] font-semibold text-navy">Status</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-mist p-1">
        {statuses.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={pending}
            onClick={() => {
              setCurrent(option.value);
              apply({ status: option.value });
            }}
            className={cn(
              'flex h-9 items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold transition-colors',
              current === option.value ? 'bg-white text-navy shadow' : 'text-ink-600 hover:text-navy',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', option.dot)} />
            {option.label}
          </button>
        ))}
      </div>

      <label htmlFor="lead-notes" className="mt-5 mb-2 block text-[13px] font-semibold text-navy">
        Internal notes
      </label>
      <textarea
        id="lead-notes"
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Called on…, documents requested…"
        className={cn(inputClass, 'py-3')}
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!window.confirm('Delete this request permanently?')) return;
            startTransition(async () => {
              const result = await deleteLead(id);
              if (result.ok) router.replace('/admin/leads');
              else setToast({ tone: 'error', message: result.error });
            });
          }}
          className={cn(btn.base, btn.danger)}
        >
          <Trash2 aria-hidden className="h-4 w-4" /> Delete
        </button>
        <button type="button" disabled={pending} onClick={() => apply({ notes: text })} className={cn(btn.base, btn.primary)}>
          {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Save aria-hidden className="h-4 w-4" />}
          Save notes
        </button>
      </div>
    </section>
  );
}
