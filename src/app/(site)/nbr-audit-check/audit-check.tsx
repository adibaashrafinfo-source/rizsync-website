'use client';

import { useRef, useState, useTransition } from 'react';
import { AlertTriangle, CheckCircle2, FileSearch, Loader2, Search, ShieldAlert, XCircle } from 'lucide-react';
import { checkAudit } from './actions';
import { formatAuditNumber, type AuditKind, type AuditResult } from '@/lib/audit';
import { cn } from '@/lib/utils';

const copy = {
  tin: {
    label: 'আপনার TIN নম্বর লিখুন / Enter your TIN number',
    placeholder: '000000000000',
    button: 'চেক করুন / Check Audit Status',
    hint: '12 digits',
    maxLength: 12,
  },
  bin: {
    label: 'আপনার BIN নম্বর লিখুন / Enter your BIN (VAT) number',
    placeholder: '000000000-0000',
    button: 'চেক করুন / Check VAT Audit Status',
    hint: '13 digits — the dash is optional',
    maxLength: 14,
  },
} as const;

export function AuditCheck() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [pending, setPending] = useState<AuditKind | null>(null);
  const [, startTransition] = useTransition();
  const resultRef = useRef<HTMLDivElement>(null);

  const run = (kind: AuditKind, value: string) => {
    setPending(kind);
    startTransition(async () => {
      try {
        setResult(await checkAudit(kind, value));
      } catch {
        setResult({ status: 'error', kind });
      } finally {
        setPending(null);
        requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      }
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {(['tin', 'bin'] as const).map((kind) => (
          <SearchCard key={kind} kind={kind} pending={pending === kind} disabled={pending !== null} onSubmit={run} />
        ))}
      </div>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-28">
        {result ? <ResultPanel result={result} /> : null}
      </div>
    </>
  );
}

function SearchCard({
  kind,
  pending,
  disabled,
  onSubmit,
}: {
  kind: AuditKind;
  pending: boolean;
  disabled: boolean;
  onSubmit: (kind: AuditKind, value: string) => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const text = copy[kind];
  const id = `audit-${kind}`;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const digits = value.replace(/\D/g, '');
        if (digits.length !== (kind === 'tin' ? 12 : 13)) {
          setError(kind === 'tin' ? 'TIN must be 12 digits.' : 'BIN must be 13 digits (e.g. 001135838-0503).');
          return;
        }
        setError('');
        onSubmit(kind, digits);
      }}
      className="group relative overflow-hidden rounded-[22px] border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-float md:p-7"
    >
      <span
        aria-hidden
        className={cn('absolute inset-x-0 top-0 h-1', kind === 'tin' ? 'bg-teal' : 'bg-orange')}
      />
      <label htmlFor={id} className="block font-display text-[17px] leading-snug font-bold text-navy md:text-[18px]">
        {text.label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        maxLength={text.maxLength}
        placeholder={text.placeholder}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint`}
        onChange={(event) => {
          setValue(kind === 'bin' ? formatAuditNumber('bin', event.target.value) : event.target.value.replace(/\D/g, '').slice(0, 12));
          if (error) setError('');
        }}
        className={cn(
          'mt-4 h-[52px] w-full rounded-xl border bg-[#FAFBFD] px-4 font-mono text-[16px] tracking-[0.08em] text-navy shadow-[inset_0_1px_2px_rgb(0_32_74/0.06)] transition outline-none placeholder:text-ink-400 focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/15',
          error ? 'border-red-400' : 'border-line',
        )}
      />
      <p id={`${id}-hint`} className={cn('mt-2 text-[13px]', error ? 'font-medium text-red-600' : 'text-muted')}>
        {error || text.hint}
      </p>
      <button
        type="submit"
        disabled={disabled}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white shadow-[0_14px_28px_-16px_rgb(0_32_74/0.9)] transition hover:bg-navy-900 focus-visible:ring-4 focus-visible:ring-teal/30 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Search aria-hidden className="h-4 w-4" />}
        {text.button}
      </button>
    </form>
  );
}

function ResultPanel({ result }: { result: AuditResult }) {
  if (result.status === 'found') {
    // A TIN can be selected in more than one assessment year: one block each.
    const rows: [string, string][] =
      result.kind === 'bin'
        ? [
            ['BIN (VAT)', result.record.bin],
            ['Institution name', result.record.name],
            ['Registered HQ address', result.record.address],
            ['Selection', result.record.list_label],
          ]
        : [
            ['TIN', result.record.tin],
            ...(result.record.name ? ([['Name', result.record.name]] as [string, string][]) : []),
            ...(result.records ?? [result.record]).flatMap((record) => [
              ...(record.assessment_year ? ([['Assessment year', record.assessment_year]] as [string, string][]) : []),
              ...Object.entries(record.details ?? {}).map(
                ([key, value]) => [key, String(value ?? '')] as [string, string],
              ),
            ]),
          ];

    return (
      <section className="mt-8 overflow-hidden rounded-[22px] border border-orange/40 bg-white shadow-float">
        <div className="flex items-start gap-4 bg-gradient-to-r from-orange-50 to-white px-6 py-5 md:px-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-[0_10px_22px_-10px_rgb(242_140_40/0.9)]">
            <ShieldAlert aria-hidden className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[18px] font-bold text-navy md:text-[20px]">
              {result.kind === 'bin' ? 'এই BIN ভ্যাট অডিটের জন্য নির্বাচিত' : 'এই TIN অডিটের জন্য নির্বাচিত'}
            </p>
            <p className="text-[14px] text-ink-600">
              {result.kind === 'bin'
                ? 'This BIN appears in the NBR VAT audit selection list.'
                : 'This TIN appears in the NBR income tax audit selection list.'}
            </p>
          </div>
        </div>
        <dl className="divide-y divide-line">
          {rows.map(([label, value], index) => (
            <div
              key={`${label}-${index}`}
              className={cn(
                'grid gap-1 px-6 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4 md:px-7',
                label === 'Assessment year' && index > 1 && 'border-t-2 border-t-orange/30',
              )}
            >
              <dt className="text-[13px] font-semibold tracking-wide text-muted uppercase">{label}</dt>
              <dd className={cn('text-[15px] text-navy', /BIN|TIN/.test(label) && 'font-mono font-semibold tracking-wider')}>
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3 border-t border-line bg-mist/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <p className="text-[14px] text-ink-600">Selected for audit? Our team can prepare your documents and represent you.</p>
          <a
            href="/contact#consultation-form"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-orange px-4 text-[14px] font-semibold text-white transition hover:brightness-105"
          >
            Get audit support
          </a>
        </div>
      </section>
    );
  }

  const tone =
    result.status === 'not_found'
      ? {
          icon: CheckCircle2,
          box: 'border-emerald-200 bg-emerald-50',
          iconClass: 'text-emerald-600',
          title: result.kind === 'bin' ? 'এই BIN তালিকায় পাওয়া যায়নি' : 'এই TIN তালিকায় পাওয়া যায়নি',
          body: `${formatAuditNumber(result.kind, result.query)} was not found in the published NBR ${
            result.kind === 'bin' ? 'VAT' : 'income tax'
          } audit selection list we hold. Double-check the number — only exact matches are shown.`,
        }
      : result.status === 'invalid'
        ? {
            icon: AlertTriangle,
            box: 'border-amber-200 bg-amber-50',
            iconClass: 'text-amber-600',
            title: 'Invalid number',
            body: result.kind === 'tin' ? 'A TIN has 12 digits.' : 'A BIN has 13 digits, e.g. 001135838-0503.',
          }
        : {
            icon: XCircle,
            box: 'border-red-200 bg-red-50',
            iconClass: 'text-red-600',
            title: 'Search is unavailable right now',
            body: 'Please try again in a moment, or contact us and we will check it for you.',
          };

  return (
    <section className={cn('mt-8 flex items-start gap-4 rounded-[22px] border p-6 md:p-7', tone.box)}>
      <tone.icon aria-hidden className={cn('mt-0.5 h-7 w-7 shrink-0', tone.iconClass)} />
      <div className="min-w-0">
        <p className="font-display text-[18px] font-bold text-navy">{tone.title}</p>
        <p className="mt-1 text-[15px] text-ink-600">{tone.body}</p>
        {result.status === 'not_found' ? (
          <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
            <FileSearch aria-hidden className="h-4 w-4" />
            Not being on this list does not rule out other NBR notices.
          </p>
        ) : null}
      </div>
    </section>
  );
}
