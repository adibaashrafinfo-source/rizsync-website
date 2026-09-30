'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { useSiteData } from '@/components/providers/site-data';
import { cn } from '@/lib/utils';

/**
 * Floating WhatsApp button — DESIGN.md §5.3.
 * On mobile it hides while a field inside the consultation form has focus, so
 * it never covers the input the visitor is typing into.
 */
export function WhatsAppFab() {
  const [hidden, setHidden] = useState(false);
  const { config: siteConfig } = useSiteData();

  useEffect(() => {
    const isFormField = (node: EventTarget | null) =>
      node instanceof HTMLElement &&
      Boolean(node.closest('form[data-consultation-form]')) &&
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName);

    const onFocusIn = (event: FocusEvent) => {
      if (window.matchMedia('(max-width: 767px)').matches && isFormField(event.target)) {
        setHidden(true);
      }
    };
    const onFocusOut = () => setHidden(false);

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <a
      href={siteConfig.contact.whatsappPrefilled}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with RizSync on WhatsApp"
      className={cn(
        'group fixed right-5 bottom-5 z-40 transition-all duration-300',
        hidden && 'pointer-events-none translate-y-24 opacity-0',
      )}
    >
      {/* Hover label */}
      <span className="pointer-events-none absolute top-1/2 right-[calc(100%+12px)] hidden -translate-y-1/2 translate-x-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-lift transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat with us
      </span>

      <span className="animate-float relative flex h-14 w-14 items-center justify-center">
        {/* Pulse rings */}
        <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-whatsapp" />
        <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-whatsapp [animation-delay:1.2s]" />

        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2be374] to-whatsapp text-white shadow-[0_14px_30px_-10px_rgb(37_211_102/0.7)] ring-4 ring-white/70 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
          <WhatsAppIcon className="animate-wiggle h-7 w-7" />
        </span>

        {/* Online dot */}
        <span aria-hidden className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-gold" />
      </span>
    </a>
  );
}
