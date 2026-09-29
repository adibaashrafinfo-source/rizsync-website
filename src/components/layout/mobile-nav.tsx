'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { Logo } from '@/components/layout/logo';
import { siteConfig } from '@/config/site';
import { CTA_HOME_HREF, CTA_HREF, CTA_LABEL, mainNav } from '@/config/nav';
import { services } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** Right-side sheet below 1024px — HOME_REDESIGN.md §4.1. */
export function MobileNav({ isHome }: { isHome: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet once navigation lands.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-btn text-white transition-colors hover:bg-white/10"
        >
          <Menu aria-hidden className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-navy/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[70] flex h-dvh w-[min(90vw,24rem)] flex-col bg-navy shadow-float focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <Logo compact />
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-btn text-white transition-colors hover:bg-white/10"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-3">
            <ul className="flex flex-col">
              {mainNav.map((link) =>
                link.label === 'Services' ? (
                  <li key={link.href}>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="services" className="border-white/10">
                        <AccordionTrigger className="py-4 font-display text-base text-white hover:text-white [&>svg]:text-gold">
                          Services
                        </AccordionTrigger>
                        <AccordionContent className="pr-0 pb-3">
                          <ul className="flex flex-col gap-0.5">
                            {services.map((service) => {
                              const Icon = service.icon;
                              return (
                                <li key={service.slug}>
                                  <Link
                                    href={`/services/${service.slug}`}
                                    className="flex items-center gap-3 rounded-btn py-2 text-[15px] text-on-navy-muted transition-colors hover:text-white"
                                  >
                                    <span
                                      className={cn(
                                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-navy',
                                        pillarTheme[service.color].solid,
                                      )}
                                    >
                                      <Icon aria-hidden className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    {service.title}
                                  </Link>
                                </li>
                              );
                            })}
                            <li>
                              <Link
                                href="/services"
                                className="inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-teal-on-navy"
                              >
                                View all services
                                <ArrowRight aria-hidden className="h-4 w-4" />
                              </Link>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                ) : (
                  <li key={link.href} className="border-b border-white/10">
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={cn(
                        'block py-4 font-display text-base font-semibold transition-colors',
                        isActive(link.href) ? 'text-white' : 'text-on-navy-muted hover:text-white',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-white/[0.08] px-5 py-5">
            <Button asChild variant="whatsapp" size="md" className="w-full">
              <a
                href={siteConfig.contact.whatsappPrefilled}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                WhatsApp Us
              </a>
            </Button>
            <Button asChild size="md" className="w-full">
              <Link href={isHome ? CTA_HOME_HREF : CTA_HREF}>
                {CTA_LABEL}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
