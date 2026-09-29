import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { PageHero } from '@/components/sections/page-hero';
import { OfficeMap } from '@/components/sections/office-map';
import { ConsultationFormBoundary } from '@/components/forms/consultation-form-boundary';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/config/site';
import { breadcrumbSchema } from '@/lib/schema';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Request a Consultation | Contact RizSync Business Solution in Dhaka',
  description:
    'Contact our expert team at RizSync for a consultation. Reach us by phone, email, or visit our corporate office in Mirpur, Dhaka. We are ready to assist your business and family needs.',
  path: '/contact',
});

const quickContacts = [
  {
    label: 'Call us',
    value: siteConfig.contact.phoneDisplay,
    href: siteConfig.contact.phoneHref,
    icon: Phone,
    note: siteConfig.contact.hours,
    external: false,
  },
  {
    label: 'WhatsApp',
    value: 'Start a chat',
    href: siteConfig.contact.whatsappPrefilled,
    icon: WhatsAppIcon,
    note: 'Usually the fastest reply',
    external: true,
  },
  {
    label: 'Email',
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    note: 'We reply within 1 business day',
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a Consultation"
        description="Tell us what you need. The first conversation is free, confidential and carries no obligation."
        crumbs={crumbs}
      />

      {/* 2 — Quick contact cards */}
      <Section className="bg-paper pb-0 md:pb-0">
        <ul className="grid gap-5 md:grid-cols-3">
          {quickContacts.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="min-w-0">
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex h-full items-start gap-4 rounded-card border border-line bg-paper p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-500">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold tracking-[0.1em] text-gold-600 uppercase">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-base font-semibold break-all text-navy-900 transition-colors group-hover:text-teal-600">
                      {item.value}
                    </span>
                    <span className="mt-1 block text-[13px] text-ink-600">{item.note}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 3 — Form + office info */}
      <Section className="bg-paper" labelledBy="contact-form-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" id="consultation-form">
            <h2
              id="contact-form-heading"
              className="text-[26px] leading-tight font-bold text-navy-900 md:text-[32px]"
            >
              Send us your request
            </h2>
            <p className="mt-3 max-w-xl text-ink-600">
              Choose the pathway that fits you — the subject list adjusts to match.
            </p>

            <div className="mt-8">
              <ConsultationFormBoundary />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Card className="p-7">
              <h3 className="text-lg font-semibold text-navy-900">Our offices</h3>

              <ul className="mt-5 flex flex-col gap-6">
                {[siteConfig.offices.corporate, siteConfig.offices.operations].map(
                  (office) => (
                    <li key={office.label} className="flex items-start gap-3">
                      <MapPin
                        aria-hidden
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                        strokeWidth={1.5}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-navy-900">
                          {office.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink-600">
                          {office.full}
                        </span>
                      </span>
                    </li>
                  ),
                )}

                <li className="flex items-start gap-3">
                  <Clock
                    aria-hidden
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                    strokeWidth={1.5}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">
                      Opening hours
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-600">
                      {siteConfig.contact.hours}
                    </span>
                  </span>
                </li>
              </ul>

              <div className="mt-7 border-t border-line pt-6">
                <p className="text-[13px] leading-relaxed text-ink-600 italic">
                  &ldquo;{siteConfig.ethicsStatement}&rdquo;
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </Section>

      {/* 4 — Map */}
      <Section className="bg-mist pt-0 md:pt-0">
        <div className="pt-16 md:pt-24">
          <OfficeMap />
        </div>
      </Section>

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
