import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { ConsultationFormBoundary } from '@/components/forms/consultation-form-boundary';
import { consultationSection } from '@/data/home';
import { siteConfig } from '@/config/site';

const tileBase =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-btn';

/**
 * Contact details + consultation form — HOME_REDESIGN.md §4.13 (5fr / 7fr).
 * `id="consultation"` is the target of every "Request Consultation" on the
 * home page. Also used at the foot of each service page.
 */
export function ConsultationSection({ defaultSubject }: { defaultSubject?: string }) {
  const office = siteConfig.offices.corporate;

  return (
    <section
      id="consultation"
      aria-labelledby="consultation-heading"
      className="bg-white py-14 md:py-[72px] xl:py-28"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-14 xl:gap-20">
          <Reveal>
            <Eyebrow>{consultationSection.eyebrow}</Eyebrow>
            <h2
              id="consultation-heading"
              className="mt-4 font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-navy md:text-[38px] xl:text-[42px]"
            >
              {consultationSection.title}
            </h2>
            <p className="mt-5 text-base leading-[1.7] text-ink-600 md:text-[17px]">
              {consultationSection.body}
            </p>

            <ul className="mt-9 flex flex-col gap-4">
              <li className="flex items-center gap-4 rounded-2xl bg-mist p-4 sm:p-5">
                <span className={`${tileBase} bg-navy text-white`}>
                  <Phone aria-hidden className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-muted">Call / WhatsApp</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={siteConfig.contact.phoneHref}
                      className="font-display text-base font-bold text-navy hover:text-teal-ink"
                    >
                      {siteConfig.contact.phoneDisplay}
                    </a>
                    <a
                      href={siteConfig.contact.whatsappPrefilled}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-teal-ink hover:underline"
                    >
                      <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                      WhatsApp
                    </a>
                  </span>
                </span>
              </li>

              <li className="flex items-center gap-4 rounded-2xl bg-mist p-4 sm:p-5">
                <span className={`${tileBase} bg-teal text-navy`}>
                  <Mail aria-hidden className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-muted">Email</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-0.5 block font-display text-[15px] font-bold break-all sm:text-base text-navy hover:text-teal-ink"
                  >
                    {siteConfig.contact.email}
                  </a>
                </span>
              </li>

              <li className="flex items-center gap-4 rounded-2xl bg-mist p-4 sm:p-5">
                <span className={`${tileBase} bg-orange text-navy`}>
                  <MapPin aria-hidden className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-muted">{office.label}</span>
                  <span className="mt-0.5 block font-display text-base font-bold text-navy">
                    {office.full}
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <ConsultationFormBoundary defaultSubject={defaultSubject} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
