import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { siteConfig } from '@/config/site';

/** Reusable closing banner for inner pages (§6.2.6, §6.3.3, §6.4.7). */
export function CtaBanner({
  title = 'Not sure where to start?',
  description = 'One free conversation is usually enough to tell you what actually needs doing — and in what order.',
  href = '/contact#consultation-form',
  label = 'Request Consultation',
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-14 md:py-16">
      <div aria-hidden className="bg-geometric pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <Eyebrow className="text-gold-500">Next Step</Eyebrow>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[32px]">
              {title}
            </h2>
            <p className="mt-3 text-white/75">{description}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={href}>{label}</Link>
            </Button>
            <Button asChild variant="secondaryDark" size="lg">
              <a
                href={siteConfig.contact.whatsappPrefilled}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
