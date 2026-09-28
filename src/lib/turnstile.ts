/** Cloudflare Turnstile server-side verification — DESIGN.md §7. */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // No secret configured: the widget is not rendered either, so there is
  // nothing to verify. This keeps local development and preview deploys
  // working while production sets both halves of the pair.
  if (!secret) return { ok: true };

  if (!token) return { ok: false, reason: 'missing-token' };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp);

  try {
    const response = await fetch(VERIFY_URL, { method: 'POST', body });
    const result = (await response.json()) as {
      success: boolean;
      'error-codes'?: string[];
    };

    return result.success
      ? { ok: true }
      : { ok: false, reason: result['error-codes']?.join(', ') || 'verification-failed' };
  } catch {
    return { ok: false, reason: 'verification-unreachable' };
  }
}
