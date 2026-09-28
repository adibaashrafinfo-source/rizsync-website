import type { ConsultationInput } from '@/lib/validators';
import { subjectLabel } from '@/lib/validators';

/**
 * Optional Supabase backup of every submission (DESIGN.md §2) so a lead is
 * never lost if the email provider fails. Disabled unless both env vars are
 * set. Uses the REST endpoint directly rather than pulling in the Supabase
 * client for one insert.
 *
 * Expected table:
 *   create table public.leads (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz not null default now(),
 *     name text not null,
 *     company text,
 *     email text not null,
 *     phone text not null,
 *     client_type text not null,
 *     subject text not null,
 *     subject_label text not null,
 *     message text not null,
 *     preferred_contact text,
 *     source text,
 *     ip text
 *   );
 *   alter table public.leads enable row level security;   -- service role only
 */
export async function storeLead(
  data: ConsultationInput,
  meta: { ip: string; source: string },
): Promise<{ stored: boolean; error?: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return { stored: false, error: 'supabase-not-configured' };

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone,
        client_type: data.clientType,
        subject: data.subject,
        subject_label: subjectLabel(data.subject),
        message: data.message,
        preferred_contact: data.preferredContact || null,
        source: meta.source,
        ip: meta.ip,
      }),
    });

    if (!response.ok) {
      return { stored: false, error: `supabase-${response.status}` };
    }
    return { stored: true };
  } catch {
    return { stored: false, error: 'supabase-unreachable' };
  }
}
