import type { Accent } from '@/lib/cms/types';

export interface Segment {
  text: string;
  accent?: Accent;
}

const TOKEN = /\{(teal|orange|gold):([^}]*)\}/g;

/**
 * Parses heading markup into coloured segments:
 * "RizSync {orange:Service} {teal:Solution}".
 */
export function parseSegments(markup: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of markup.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: markup.slice(last, index) });
    segments.push({ text: match[2], accent: match[1] as Accent });
    last = index + match[0].length;
  }
  if (last < markup.length) segments.push({ text: markup.slice(last) });
  return segments;
}

/** Plain text of a markup heading, for aria labels and metadata. */
export function stripSegments(markup: string): string {
  return markup.replace(TOKEN, '$2');
}
