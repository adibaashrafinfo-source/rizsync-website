'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Clock, Mail, Phone } from 'lucide-react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { siteConfig } from '@/config/site';
import { CTA_HOME_HREF, CTA_HREF, CTA_LABEL, mainNav } from '@/config/nav';
import { services } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const isHome = pathname === '/';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Utility bar — desktop only, scrolls away with the page (§5.1). */}
      <div className="hidden h-9 items-center bg-navy-950 text-white/70 lg:flex">
        <Container className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-500"
            >
              <Phone aria-hidden className="h-3.5 w-3.5" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-500"
            >
              <Mail aria-hidden className="h-3.5 w-3.5" />
              {siteConfig.contact.email}
            </a>
          </div>
          <p className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {siteConfig.contact.hours}
          </p>
        </Container>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-navy-900/92 shadow-lift backdrop-blur-md'
            : 'bg-navy-900 shadow-none',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-[68px]' : 'h-20',
          )}
        >
          <Logo variant="light" className="shrink-0" />

          {/* Desktop navigation */}
          <NavigationMenu.Root
            delayDuration={80}
            className="relative hidden lg:flex"
            aria-label="Main"
          >
            <NavigationMenu.List className="flex items-center gap-1">
              {mainNav.map((link) =>
                link.label === 'Services' ? (
                  <NavigationMenu.Item key={link.href}>
                    <NavigationMenu.Trigger
                      className={cn(
                        'group inline-flex h-10 items-center gap-1 rounded-btn px-3 text-sm font-medium text-white/85 transition-colors hover:text-white data-[state=open]:text-white',
                        isActive(link.href) && 'text-white',
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        aria-hidden
                        className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gold-500 transition-opacity',
                          isActive(link.href) ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content className="absolute top-full left-0 w-full">
                      <MegaMenu />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={link.href}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'relative inline-flex h-10 items-center rounded-btn px-3 text-sm font-medium transition-colors',
                          isActive(link.href)
                            ? 'text-white'
                            : 'text-white/85 hover:text-white',
                        )}
                      >
                        {link.label}
                        <span
                          aria-hidden
                          className={cn(
                            'absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gold-500 transition-opacity',
                            isActive(link.href) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ),
              )}
            </NavigationMenu.List>

            {/*
              Mega-menu viewport, anchored under the nav row. The width is
              clamped to the viewport rather than set to 100vw: this wrapper is
              centred on the nav (which sits right of centre in the header), so
              a full-width box would hang off the right edge at 1024px.
            */}
            <div className="absolute top-full left-1/2 flex w-[min(92vw,56rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 justify-center pt-3">
              <NavigationMenu.Viewport className="origin-top overflow-hidden rounded-card border border-line bg-paper shadow-lift data-[state=closed]:hidden" />
            </div>
          </NavigationMenu.Root>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href={isHome ? CTA_HOME_HREF : CTA_HREF}>{CTA_LABEL}</Link>
            </Button>
            <MobileNav isHome={isHome} />
          </div>
        </Container>
      </header>
    </>
  );
}

/** 2 columns × 3 rows of pillars, with a "view all" footer row (§5.1). */
function MegaMenu() {
  return (
    <div className="w-[min(92vw,56rem)] p-3">
      <ul className="grid gap-1 md:grid-cols-2">
        {services.map((service) => {
          const theme = pillarTheme[service.color];
          const Icon = service.icon;
          return (
            <li key={service.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-3 rounded-[12px] p-3 transition-colors hover:bg-mist"
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      theme.iconWrap,
                    )}
                  >
                    <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', theme.dot)}
                      />
                      <span className="text-sm font-semibold text-navy-900 group-hover:text-teal-600">
                        {service.title}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-600">
                      {service.navDescription}
                    </span>
                  </span>
                </Link>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-line pt-2">
        <NavigationMenu.Link asChild>
          <Link
            href="/services"
            className="group flex items-center justify-between rounded-[12px] px-3 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-mist"
          >
            View all services
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </NavigationMenu.Link>
      </div>
    </div>
  );
}
