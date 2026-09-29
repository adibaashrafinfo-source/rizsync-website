import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from '@/components/ui/social-icons';
import { siteConfig, copyrightRange } from '@/config/site';
import { companyNav } from '@/config/nav';
import { services } from '@/data/services';

const headingClass =
  'font-display text-[15px] font-semibold tracking-[0.02em] text-white';
const linkClass = 'text-[15px] text-on-navy-soft transition-colors hover:text-white';
const socialClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-btn border border-white/15 text-on-navy-muted transition-colors hover:border-gold hover:text-gold';

/** Global footer — HOME_REDESIGN.md §4.14. */
export function Footer() {
  const offices = [siteConfig.offices.corporate, siteConfig.offices.operations];

  return (
    <footer className="relative overflow-hidden bg-navy text-on-navy-soft">
      <div aria-hidden className="pattern-star pointer-events-none absolute inset-0 opacity-[0.04]" />

      <Container className="relative pt-16 pb-9 md:pt-20 xl:pt-[88px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[4fr_2fr_2fr_3fr] lg:gap-10">
          {/* 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-10">
            <p className="font-display text-[28px] leading-none font-bold tracking-[-0.02em] text-white">
              RizSync
            </p>
            <p className="mt-4 text-sm font-semibold tracking-wide text-teal-on-navy">
              {siteConfig.tagline}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-navy-faint italic">
              {siteConfig.ethicsStatement}
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={siteConfig.social.linkedin}
                aria-label={`${siteConfig.shortName} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
              >
                <LinkedInIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={siteConfig.social.facebook}
                aria-label={`${siteConfig.shortName} on Facebook`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* 2 — Services */}
          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={headingClass}>
              Services
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={linkClass}>
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3 — Company */}
          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className={headingClass}>
              Company
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 4 — Contact */}
          <div>
            <h2 className={headingClass}>Contact</h2>
            <ul className="mt-5 flex flex-col gap-4 text-[15px]">
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold" />
                <span className="flex flex-col gap-1">
                  <a
                    href={siteConfig.contact.phoneHref}
                    className="font-semibold text-white transition-colors hover:text-gold"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <a
                    href={siteConfig.contact.whatsappPrefilled}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 text-whatsapp" />
                    WhatsApp
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              {offices.map((office) => (
                <li key={office.label} className="flex items-start gap-3">
                  <MapPin aria-hidden className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold" />
                  <span>
                    <span className="block text-sm font-bold text-white">{office.label}</span>
                    <span className="block text-sm leading-relaxed">{office.full}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-on-navy-faint sm:flex-row sm:items-center">
          <p>
            &copy; {copyrightRange()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <span aria-hidden>&middot;</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
