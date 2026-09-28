/**
 * Conversion events — DESIGN.md §7.
 * Both destinations are optional: if GTM or the Pixel was never loaded the
 * calls are no-ops rather than errors.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead(payload: { service?: string; clientType?: string } = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    form_name: 'consultation',
    service: payload.service,
    client_type: payload.clientType,
  });

  window.fbq?.('track', 'Lead', {
    content_name: payload.service,
    content_category: payload.clientType,
  });
}
