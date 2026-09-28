import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ConsultationFormBoundary } from '@/components/forms/consultation-form-boundary';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { siteConfig } from '@/config/site';

/** DESIGN.md §6.1 ⑩ — navy info panel + white form card. */
export function ConsultationCta({ defaultSubject }: { defaultSubject?: string }) {
  return (
    <section
      id="consultation"
      aria-labelledby="consultation-heading"
      className="relative overflow-hidden bg-navy-900 py-16 md:py-24"
    >
      <div aria-hidden className="bg-circuit pointer-events-none absolute inset-0" />

      <Container className="relative">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-gold-500">Request Consultation</Eyebrow>
            <h2
              id="consultation-heading"
              className="mt-3 text-[28px] leading-tight font-bold text-white md:text-h2"
            >
              Let&rsquo;s Simplify Your Business &amp; Family Matters
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              Tell us what you need. The first consultation is free and carries no
              obligation — you will leave it with our honest view of what has to happen,
              even when the answer is that you do not need us.
            </p>

            <ul className="mt-8 flex flex-col gap-5 text-sm">
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] text-white/55">Call us</span>
                  <a
                    href={siteConfig.contact.phoneHref}
                    className="text-base font-semibold text-white transition-colors hover:text-gold-500"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] text-white/55">WhatsApp</span>
                  <a
                    href={siteConfig.contact.whatsappPrefilled}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-white transition-colors hover:text-gold-500"
                  >
                    Start a chat
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] text-white/55">Email</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-base font-semibold break-all text-white transition-colors hover:text-gold-500"
                  >
                    {siteConfig.contact.email}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span>
                  <span className="block text-[13px] text-white/55">
                    {siteConfig.offices.corporate.label}
                  </span>
                  <span className="text-base font-semibold text-white">
                    {siteConfig.offices.corporate.full}
                  </span>
                  <span className="mt-1 block text-[13px] text-white/60">
                    {siteConfig.contact.hours}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ConsultationFormBoundary defaultSubject={defaultSubject} />
          </div>
        </div>
      </Container>
    </section>
  );
}
