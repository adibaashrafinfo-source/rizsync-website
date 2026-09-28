'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { siteConfig } from '@/config/site';
import { CTA_HOME_HREF, CTA_HREF, CTA_LABEL, mainNav } from '@/config/nav';
import { services } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/** Right-side sheet for < 1024px — DESIGN.md §5.1. */
export function MobileNav({ isHome }: { isHome: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet whenever navigation completes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-btn text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Menu aria-hidden className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-navy-950/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[70] flex h-dvh w-[min(88vw,22rem)] flex-col bg-navy-900 shadow-lift focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-[0.12em] text-gold-500 uppercase">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-white transition-colors hover:bg-white/10"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {mainNav.map((link) =>
                link.label === 'Services' ? (
                  <li key={link.href}>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="services" className="border-white/10">
                        <AccordionTrigger className="py-3.5 text-white hover:text-gold-500">
                          Services
                        </AccordionTrigger>
                        <AccordionContent className="pr-0 pb-3">
                          <ul className="flex flex-col gap-0.5">
                            {services.map((service) => (
                              <li key={service.slug}>
                                <Link
                                  href={`/services/${service.slug}`}
                                  className="flex items-center gap-2.5 rounded-btn py-2.5 pl-1 text-[15px] text-white/80 transition-colors hover:text-white"
                                >
                                  <span
                                    aria-hidden
                                    className={cn(
                                      'h-1.5 w-1.5 shrink-0 rounded-full',
                                      pillarTheme[service.color].dot,
                                    )}
                                  />
                                  {service.title}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href="/services"
                                className="inline-block py-2.5 pl-[18px] text-sm font-semibold text-gold-500"
                              >
                                View all services &rarr;
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
                      className={cn(
                        'block py-4 text-base font-semibold transition-colors',
                        isActive(link.href)
                          ? 'text-gold-500'
                          : 'text-white hover:text-gold-500',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-5 py-5">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-btn border-[1.5px] border-white/30 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone aria-hidden className="h-4 w-4" />
                Call
              </a>
              <a
                href={siteConfig.contact.whatsappPrefilled}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-whatsapp text-sm font-semibold text-white transition-[filter] hover:brightness-95"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
            <Button asChild className="w-full">
              <Link href={isHome ? CTA_HOME_HREF : CTA_HREF}>{CTA_LABEL}</Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
