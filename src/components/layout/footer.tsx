import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from '@/components/ui/social-icons';
import { siteConfig, copyrightRange } from '@/config/site';
import { companyNav } from '@/config/nav';
import { services } from '@/data/services';

/** DESIGN.md §5.2 — 4 columns on desktop, stacked on mobile. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white/75">
      <div aria-hidden className="bg-geometric pointer-events-none absolute inset-0" />

      <Container className="relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* 1 — Brand */}
          <div className="lg:pr-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={siteConfig.name}
              width={220}
              height={48}
              className="h-11 w-auto"
            />
            <p className="mt-5 text-sm font-semibold tracking-wide text-gold-500">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed italic text-white/60">
              &ldquo;{siteConfig.ethicsStatement}&rdquo;
            </p>
          </div>

          {/* 2 — Services */}
          <div>
            <h2 className="text-sm font-semibold tracking-[0.12em] text-white uppercase">
              Services
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-gold-500"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — Company */}
          <div>
            <h2 className="text-sm font-semibold tracking-[0.12em] text-white uppercase">
              Company
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-gold-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 — Contact */}
          <div>
            <h2 className="text-sm font-semibold tracking-[0.12em] text-white uppercase">
              Contact
            </h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span className="flex flex-col gap-1">
                  <a
                    href={siteConfig.contact.phoneHref}
                    className="font-semibold text-white transition-colors hover:text-gold-500"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <a
                    href={siteConfig.contact.whatsappPrefilled}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] transition-colors hover:text-gold-500"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    Chat on WhatsApp
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all transition-colors hover:text-gold-500"
                >
                  {siteConfig.contact.email}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] font-semibold text-white">
                    {siteConfig.offices.corporate.label}
                  </span>
                  <span className="block text-[13px]">{siteConfig.offices.corporate.full}</span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] font-semibold text-white">
                    {siteConfig.offices.operations.label}
                  </span>
                  <span className="block text-[13px]">
                    {siteConfig.offices.operations.full}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={siteConfig.social.linkedin}
                aria-label={`${siteConfig.shortName} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                aria-label={`${siteConfig.shortName} on Facebook`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] sm:flex-row">
          <p>
            &copy; {copyrightRange()} {siteConfig.name}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-gold-500">
              Privacy
            </Link>
            <span aria-hidden className="text-white/25">
              &middot;
            </span>
            <Link href="/terms" className="transition-colors hover:text-gold-500">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
