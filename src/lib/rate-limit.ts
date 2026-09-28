/**
 * In-memory fixed-window rate limiter — DESIGN.md §7 (5 submissions per IP
 * per hour).
 *
 * Deliberately dependency-free. On Vercel each serverless instance keeps its
 * own map, so this throttles abuse from a single client without pretending to
 * be a distributed limiter; Turnstile and the honeypot are the real spam
 * defences. Move to Upstash/Redis if a strict global limit is ever required.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
/** Stop the map growing without bound on a long-lived instance. */
const MAX_ENTRIES = 5000;

interface Entry {
  count: number;
  resetAt: number;
}

const hits = new Map<string, Entry>();

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function rateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();

  if (hits.size > MAX_ENTRIES) sweep(now);

  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP behind Vercel's proxy. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return headers.get('x-real-ip') || 'unknown';
}
