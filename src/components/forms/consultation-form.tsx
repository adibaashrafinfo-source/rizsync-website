'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, Input, Label, Select, Textarea } from '@/components/ui/field';
import { Turnstile } from '@/components/forms/turnstile';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import {
  clientTypes,
  consultationSchema,
  preferredContacts,
  type ConsultationInput,
} from '@/lib/validators';
import { services, subjectOptions } from '@/data/services';
import { siteConfig } from '@/config/site';
import { trackLead } from '@/lib/events';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Subject options narrow to the pathways that make sense for the selected
 * client type — the "clear pathways for different customer types" in §6.6.5.
 */
const INDIVIDUAL_SUBJECTS = new Set(['family-welfare', 'government-assistance', 'why-rizsync']);

export function ConsultationForm({
  /** Pre-selects the Subject, e.g. from a service sub-page. */
  defaultSubject,
  defaultClientType,
  className,
}: {
  defaultSubject?: string;
  defaultClientType?: (typeof clientTypes)[number];
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
    return candidate && services.some((service) => service.slug === candidate)
      ? candidate
      : '';
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
      clientType: defaultClientType ?? ('' as never),
      subject: (initialSubject || '') as never,
      message: '',
      preferredContact: undefined,
      consent: false as never,
      website: '',
    },
  });

  useEffect(() => {
    if (initialSubject) setValue('subject', initialSubject as never);
  }, [initialSubject, setValue]);

  useEffect(() => {
    if (defaultClientType) setValue('clientType', defaultClientType);
  }, [defaultClientType, setValue]);

  const clientType = watch('clientType');
  const visibleSubjects =
    clientType === 'Individual & Family'
      ? subjectOptions.filter(
          (option) => INDIVIDUAL_SUBJECTS.has(option.value) || option.value === 'other',
        )
      : subjectOptions;

  /**
   * Runs when client-side validation rejects the form. Without this a field
   * that renders no inline error would make the submit button look inert.
   */
  const onInvalid = (invalid: Record<string, unknown>) => {
    const first = Object.keys(invalid)[0] as keyof ConsultationInput | undefined;
    setServerError('Please check the highlighted fields and try again.');
    if (first) {
      try {
        setFocus(first);
      } catch {
        // Hidden or unregistered field — the banner above is enough.
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
      setServerError(
        'We could not reach our server. Please check your connection, or call us directly.',
      );
      setStatus('error');
      setTurnstileReset((count) => count + 1);
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-card border border-line bg-paper p-8 text-center shadow-soft',
          className,
        )}
        role="status"
      >
        <CheckCircle2
          aria-hidden
          className="mx-auto h-14 w-14 text-teal-600"
          strokeWidth={1.5}
        />
        <h3 className="mt-5 text-xl font-semibold text-navy-900">
          Thank you — your request is with us.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-600">
          We&rsquo;ll contact you within 1 business day, In sh&#257;&rsquo; All&#257;h. If your
          matter is urgent, WhatsApp is the fastest way to reach us.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="whatsapp">
            <a
              href={siteConfig.contact.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Continue on WhatsApp
            </a>
          </Button>
          <Button variant="secondaryLight" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      data-consultation-form
      noValidate
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={cn(
        'rounded-card border border-line bg-paper p-6 shadow-soft md:p-8',
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="cf-name" required>
            Name
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
          <Label htmlFor="cf-company">Company / Family Name</Label>
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

        <Field>
          <Label htmlFor="cf-client-type" required>
            I am a
          </Label>
          <Select
            id="cf-client-type"
            aria-invalid={Boolean(errors.clientType)}
            aria-describedby={errors.clientType ? 'cf-client-type-error' : undefined}
            {...register('clientType')}
          >
            <option value="">Please choose…</option>
            {clientTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <FieldError id="cf-client-type-error">{errors.clientType?.message}</FieldError>
        </Field>

        <Field>
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
            How can we help?
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

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-navy-900">
            Preferred way to reach you
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-4">
            {preferredContacts.map((option) => (
              <label
                key={option}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-600"
              >
                <input
                  type="radio"
                  value={option}
                  className="h-4 w-4 accent-[var(--color-teal-600)]"
                  {...register('preferredContact')}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <Field className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-teal-600)]"
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

        {siteKey ? (
          <div className="sm:col-span-2">
            <Turnstile
              siteKey={siteKey}
              onToken={setTurnstileToken}
              resetSignal={turnstileReset}
            />
          </div>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-btn border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {serverError}
            {/* The phone fallback only helps when it was our end that failed. */}
            {status === 'error' ? (
              <>
                {' '}
                <a
                  href={siteConfig.contact.phoneHref}
                  className="font-semibold whitespace-nowrap underline"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </>
            ) : null}
          </span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
              Sending…
            </>
          ) : (
            'Request Consultation'
          )}
        </Button>
        <p className="inline-flex items-center gap-1.5 text-[13px] text-ink-600">
          <Phone aria-hidden className="h-3.5 w-3.5 text-gold-600" />
          Prefer to talk? Call {siteConfig.contact.phoneDisplay}
        </p>
      </div>
    </form>
  );
}
