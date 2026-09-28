import { z } from 'zod';
import { services } from '@/data/services';

/** Bangladeshi mobile numbers, with or without the country code (§7). */
export const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

export const clientTypes = ['Business', 'Corporate', 'Individual & Family'] as const;
export const preferredContacts = ['Phone', 'WhatsApp', 'Email'] as const;

const subjectValues = [...services.map((service) => service.slug), 'other'] as const;

export const consultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(100, 'Please keep your name under 100 characters.'),

  company: z
    .string()
    .trim()
    .max(120, 'Please keep this under 120 characters.')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.')
    .max(160),

  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .refine(
      (value) => bdPhoneRegex.test(value.replace(/[\s-]/g, '')),
      'Please enter a valid Bangladeshi number, for example 01711504625.',
    ),

  clientType: z.enum(clientTypes, { message: 'Please choose which best describes you.' }),

  subject: z.enum(subjectValues, { message: 'Please choose a subject.' }),

  message: z
    .string()
    .trim()
    .min(20, 'Please give us at least 20 characters so we can prepare properly.')
    .max(4000, 'Please keep your message under 4000 characters.'),

  /**
   * Optional radio group. React Hook Form reports an unselected group as
   * `null` (and a cleared one as ''), so both have to be valid — otherwise the
   * form fails validation on a field that renders no error message, and the
   * submit button appears to do nothing.
   */
  preferredContact: z.enum(preferredContacts).or(z.literal('')).nullish(),

  consent: z.literal(true, {
    message: 'Please confirm we may contact you about your enquiry.',
  }),

  /**
   * Spam trap. Real people never see this field, so it is always empty.
   * The schema deliberately *accepts* a filled value: the route checks it
   * separately and answers 200 without doing anything, so a bot gets no signal
   * that it was caught. Rejecting it here would leak the trap.
   */
  website: z.string().max(500).optional(),

  /** Cloudflare Turnstile token; optional so local dev works without keys. */
  turnstileToken: z.string().optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/** Human-readable subject for the notification email and the auto-reply. */
export function subjectLabel(value: string): string {
  return services.find((service) => service.slug === value)?.title ?? 'Other';
}
