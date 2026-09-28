'use client';

import { useState } from 'react';
import { Check, Link2, Linkedin } from 'lucide-react';
import { FacebookIcon, WhatsAppIcon } from '@/components/ui/social-icons';

const iconClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-600 transition-colors hover:border-navy-900/40 hover:text-navy-900';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the other buttons still work.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-navy-900">Share</span>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={iconClass}
      >
        <Linkedin aria-hidden className="h-4 w-4" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconClass}
      >
        <FacebookIcon className="h-4 w-4" />
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={iconClass}
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>

      <button type="button" onClick={copy} aria-label="Copy link" className={iconClass}>
        {copied ? (
          <Check aria-hidden className="h-4 w-4 text-teal-600" />
        ) : (
          <Link2 aria-hidden className="h-4 w-4" />
        )}
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
