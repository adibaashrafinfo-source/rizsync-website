'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Floating WhatsApp button — DESIGN.md §5.3.
 * On mobile it hides while a field inside the consultation form has focus, so
 * it never covers the input the visitor is typing into.
 */
export function WhatsAppFab() {
  const [hidden, setHidden] = useState(false);

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
        'fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-all duration-300 hover:scale-105 hover:brightness-95 motion-reduce:hover:scale-100',
        hidden && 'pointer-events-none translate-y-24 opacity-0',
      )}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
