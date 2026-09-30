'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Phone } from 'lucide-react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { CTA_HOME_HREF, CTA_HREF, CTA_LABEL, mainNav } from '@/config/nav';
import { useSiteData } from '@/components/providers/site-data';
import { getIcon } from '@/lib/cms/icons';
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

const linkBase =
  'relative inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-btn px-2.5 text-[15px] font-medium transition-colors';

/** Global sticky header — HOME_REDESIGN.md §4.1. */
export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const { config: siteConfig } = useSiteData();
  const isHome = pathname === '/';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-white/[0.08] bg-navy transition-[box-shadow] duration-300',
        scrolled && 'shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)]',
      )}
    >
      <Container
        className={cn(
          'flex items-center justify-between gap-6 transition-[height] duration-300',
          scrolled ? 'h-[72px]' : 'h-[88px]',
        )}
      >
        <Logo className="shrink-0" />

        <div className="hidden items-center gap-2 xl:flex">
          <NavigationMenu.Root delayDuration={80} className="relative" aria-label="Main">
            <NavigationMenu.List className="flex items-center gap-0.5">
              {mainNav.map((link) => {
                const active = isActive(link.href);
                const color = active ? 'text-white' : 'text-on-navy-muted hover:text-white';

                if (link.label === 'Services') {
                  return (
                    <NavigationMenu.Item key={link.href}>
                      <NavigationMenu.Trigger
                        className={cn(linkBase, color, 'group data-[state=open]:text-white')}
                      >
                        {link.label}
                        <ChevronDown
                          aria-hidden
                          className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute top-0 left-0">
                        <MegaMenu />
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  );
                }

                return (
                  <NavigationMenu.Item key={link.href}>
                    <NavigationMenu.Link asChild active={active}>
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(linkBase, color)}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>

            {/*
              Viewport is clamped rather than 100vw: it is centred on the nav,
              which sits right of centre, so a full-width box would overflow.
            */}
            <div className="absolute top-full left-1/2 flex w-[min(92vw,56rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 justify-center pt-4">
              {/* Sized from the Radix CSS vars so the white panel wraps the absolutely
                positioned menu content instead of collapsing to zero height. */}
            <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top overflow-hidden rounded-card border border-line bg-white shadow-float transition-[width,height] duration-200 data-[state=closed]:hidden" />
            </div>
          </NavigationMenu.Root>

          <span aria-hidden className="mx-2 hidden h-6 w-px bg-white/15 2xl:block" />

          <a
            href={siteConfig.contact.phoneHref}
            className="hidden items-center gap-2 rounded-btn px-1 text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:text-gold 2xl:inline-flex"
          >
            <Phone aria-hidden className="h-4 w-4 text-gold" strokeWidth={2} />
            {siteConfig.contact.phoneDisplay}
          </a>

          <Button asChild size="md" className="ml-2 whitespace-nowrap">
            <Link href={isHome ? CTA_HOME_HREF : CTA_HREF}>{CTA_LABEL}</Link>
          </Button>
        </div>

        {/* < 1280px: phone icon + hamburger */}
        <div className="flex items-center gap-1 xl:hidden">
          <a
            href={siteConfig.contact.phoneHref}
            aria-label={`Call ${siteConfig.contact.phoneDisplay}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-btn text-white transition-colors hover:bg-white/10"
          >
            <Phone aria-hidden className="h-5 w-5" strokeWidth={2} />
          </a>
          <MobileNav isHome={isHome} />
        </div>
      </Container>
    </header>
  );
}

/** 2 × 3 pillar grid with a "View all" footer row (DESIGN.md §5.1). */
function MegaMenu() {
  const { services } = useSiteData();
  return (
    <div className="w-[min(92vw,56rem)] p-3">
      <ul className="grid gap-1 md:grid-cols-2">
        {services.map((service) => {
          const theme = pillarTheme[service.color];
          const Icon = getIcon(service.icon);
          return (
            <li key={service.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-3.5 rounded-[14px] p-3 transition-colors hover:bg-mist"
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-btn',
                      theme.tile,
                      theme.tileIcon,
                    )}
                  >
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] font-semibold text-navy group-hover:text-teal-ink">
                      {service.title}
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
            className="group flex items-center justify-between rounded-[14px] px-3 py-2.5 text-sm font-semibold text-teal-ink transition-colors hover:bg-mist"
          >
            View all services
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </NavigationMenu.Link>
      </div>
    </div>
  );
}
