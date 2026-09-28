import { NextResponse } from 'next/server';
import { consultationSchema } from '@/lib/validators';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendConsultationEmails } from '@/lib/email';
import { storeLead } from '@/lib/leads';

export const runtime = 'nodejs';
/** Never cached: every request must go through validation and rate limiting. */
export const dynamic = 'force-dynamic';

const GENERIC_ERROR =
  'We could not send your message just now. Please try again in a moment, or call us directly.';

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  // 1 — Rate limit before doing any work (§7: 5 per IP per hour).
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error:
          'You have sent several messages already. Please wait a little while, or call us directly so we can help straight away.',
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // 2 — Parse the body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  // 3 — Re-validate server-side; the client check is convenience, not security.
  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || 'Some details were not valid. Please check the form.' },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // 4 — Honeypot. Bots fill it; people never see it. Answer 200 so the bot
  //     has no signal that it was caught.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // 5 — CAPTCHA.
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      {
        error:
          'We could not verify that you are human. Please complete the check and try again.',
      },
      { status: 400 },
    );
  }

  // 6 — Store a backup copy first, so a lead survives an email outage.
  const stored = await storeLead(data, { ip, source: 'consultation-form' });

  // 7 — Notify the team and acknowledge the sender.
  const email = await sendConsultationEmails(data);

  if (!email.sent) {
    // If neither channel worked, the submission is genuinely lost — say so,
    // rather than showing a success screen for a message nobody received.
    if (!stored.stored) {
      console.error('[contact] delivery failed', {
        email: email.error,
        supabase: stored.error,
      });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }
    console.warn('[contact] email failed but lead stored', { email: email.error });
  }

  return NextResponse.json({ ok: true });
}
