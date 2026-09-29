'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, Input, Label, Select, Textarea } from '@/components/ui/field';
import { Turnstile } from '@/components/forms/turnstile';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { clientTypes, consultationSchema, type ConsultationInput } from '@/lib/validators';
import { services, subjectOptions } from '@/data/services';
import { consultationSection } from '@/data/home';
import { siteConfig } from '@/config/site';
import { trackLead } from '@/lib/events';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type ClientType = (typeof clientTypes)[number];

/**
 * Individuals and families see only the pathways that apply to them — the
 * "clear pathways for different customer types" in DESIGN.md §6.6.5.
 */
const INDIVIDUAL_SUBJECTS = new Set(['family-welfare', 'government-assistance', 'why-rizsync']);

/**
 * Consultation form — HOME_REDESIGN.md §4.13 layout, DESIGN.md §7 behaviour.
 * Shared by the home page, every service page and /contact.
 */
export function ConsultationForm({
  /** Pre-selects the Subject, e.g. from a service page. */
  defaultSubject,
  className,
}: {
  defaultSubject?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  // ?service=finance-accounting pre-selects that pillar (§7).
  const queryService = searchParams.get('service');
  const initialSubject = useMemo(() => {
    const candidate = queryService || defaultSubject;
    return candidate && services.some((service) => service.slug === candidate) ? candidate : '';
  }, [queryService, defaultSubject]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      clientType: 'Business',
      subject: (initialSubject || '') as never,
      message: '',
      consent: false as never,
      website: '',
    },
  });

  useEffect(() => {
    if (initialSubject) setValue('subject', initialSubject as never);
  }, [initialSubject, setValue]);

  const clientType = watch('clientType') as ClientType;
  const visibleSubjects =
    clientType === 'Individual & Family'
      ? subjectOptions.filter(
          (option) => INDIVIDUAL_SUBJECTS.has(option.value) || option.value === 'other',
        )
      : subjectOptions;

  // Switching to Individual & Family can hide the chosen subject; clear it
  // rather than submit a value the visitor can no longer see.
  const subject = watch('subject');
  useEffect(() => {
    if (subject && !visibleSubjects.some((option) => option.value === subject)) {
      setValue('subject', '' as never);
    }
  }, [subject, visibleSubjects, setValue]);

  /** Validation failed — never let the button look inert (see §7 notes). */
  const onInvalid = (invalid: Record<string, unknown>) => {
    const first = Object.keys(invalid)[0] as keyof ConsultationInput | undefined;
    setServerError('Please check the highlighted fields and try again.');
    if (first) {
      try {
        setFocus(first);
      } catch {
        // Hidden or unregistered field — the banner is enough.
      }
    }
  };

  const onSubmit = async (values: ConsultationInput) => {
    setStatus('submitting');
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, turnstileToken }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setServerError(
          payload.error ||
            'We could not send your message just now. Please try again, or call us directly.',
        );
        setStatus('error');
        setTurnstileReset((count) => count + 1);
        return;
      }

      trackLead({ service: values.subject, clientType: values.clientType });
      setStatus('success');
      reset();
      setTurnstileToken('');
      setTurnstileReset((count) => count + 1);
    } catch {
      setServerError('We could not reach our server. Please check your connection, or call us directly.');
      setStatus('error');
      setTurnstileReset((count) => count + 1);
    }
  };

  const cardClass = cn(
    'rounded-panel border border-line bg-white p-6 shadow-float sm:p-8 xl:p-10',
    className,
  );

  if (status === 'success') {
    return (
      <div className={cn(cardClass, 'text-center')} role="status">
        <CheckCircle2 aria-hidden className="mx-auto h-14 w-14 text-teal-ink" strokeWidth={1.75} />
        <h3 className="mt-5 font-display text-xl font-bold text-navy">
          Thank you — your request is with us.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-600">
          We&rsquo;ll contact you within 1 business day, In sh&#257;&rsquo; All&#257;h. If your matter
          is urgent, WhatsApp is the fastest way to reach us.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="navy">
            <a href={siteConfig.contact.whatsappPrefilled} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Continue on WhatsApp
            </a>
          </Button>
          <Button variant="outline-dark" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form data-consultation-form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className={cardClass}>
      {/* Segmented control — a native radio group, so arrow keys work. */}
      <fieldset>
        <legend className="text-sm font-semibold text-navy">I am enquiring as</legend>
        <div className="mt-3 grid grid-cols-1 gap-1 rounded-[14px] bg-mist p-1 sm:grid-cols-3">
          {clientTypes.map((type) => (
            <label key={type} className="relative">
              <input
                type="radio"
                value={type}
                className="peer sr-only"
                {...register('clientType')}
              />
              <span className="flex h-11 cursor-pointer items-center justify-center rounded-[10px] px-3 text-center text-sm font-semibold text-ink-600 transition-colors peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold hover:text-navy peer-checked:hover:text-white">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="cf-name" required>
            Full name
          </Label>
          <Input
            id="cf-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="cf-name-error">{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <Label htmlFor="cf-company">Company / Family name</Label>
          <Input id="cf-company" autoComplete="organization" {...register('company')} />
        </Field>

        <Field>
          <Label htmlFor="cf-email" required>
            Email
          </Label>
          <Input
            id="cf-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="cf-email-error">{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <Label htmlFor="cf-phone" required>
            Phone
          </Label>
          <Input
            id="cf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01711504625"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'cf-phone-error' : undefined}
            {...register('phone')}
          />
          <FieldError id="cf-phone-error">{errors.phone?.message}</FieldError>
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="cf-subject" required>
            Subject
          </Label>
          <Select
            id="cf-subject"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'cf-subject-error' : undefined}
            {...register('subject')}
          >
            <option value="">Please choose…</option>
            {visibleSubjects.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FieldError id="cf-subject-error">{errors.subject?.message}</FieldError>
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="cf-message" required>
            Message
          </Label>
          <Textarea
            id="cf-message"
            rows={5}
            placeholder="Tell us briefly what you need and any deadline you are working to."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'cf-message-error' : undefined}
            {...register('message')}
          />
          <FieldError id="cf-message-error">{errors.message?.message}</FieldError>
        </Field>

        <Field className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-600">
            <input
              type="checkbox"
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--teal-ink)]"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'cf-consent-error' : undefined}
              {...register('consent')}
            />
            <span>
              I agree that RizSync may contact me regarding my inquiry.
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </span>
          </label>
          <FieldError id="cf-consent-error">{errors.consent?.message}</FieldError>
        </Field>

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div aria-hidden className="hidden">
          <label htmlFor="cf-website">Website</label>
          <input id="cf-website" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>
      </div>

      {serverError ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-btn border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {serverError}
            {/* The phone fallback only helps when it was our end that failed. */}
            {status === 'error' ? (
              <>
                {' '}
                <a href={siteConfig.contact.phoneHref} className="font-semibold whitespace-nowrap underline">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </>
            ) : null}
          </span>
        </div>
      ) : null}

      {/* Turnstile (left) + submit (right); stacked on small screens. */}
      <div className="mt-7 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[1px]">
          {siteKey ? (
            <Turnstile siteKey={siteKey} onToken={setTurnstileToken} resetSignal={turnstileReset} />
          ) : null}
        </div>
        <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full sm:w-auto">
          {status === 'submitting' ? (
            <>
              <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              {consultationSection.submit}
              <ArrowRight aria-hidden className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
