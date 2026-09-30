import Link from 'next/link';
import { ArrowRight, MessageCircleQuestion, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Segments } from '@/components/ui/segments';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { FaqList } from '@/components/home/faq-list';
import { JsonLd } from '@/components/seo/json-ld';
import { getFaqs, getHomeContent, getSiteConfig } from '@/lib/cms/queries';
import { faqSchema } from '@/lib/schema';

/** Home page FAQ — questions come from Admin → FAQs, copy from Admin → Home page. */
export async function FaqSection() {
  const [{ faqSection }, faqs, siteConfig] = await Promise.all([
    getHomeContent(),
    getFaqs(),
    getSiteConfig(),
  ]);
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="relative overflow-hidden bg-mist py-14 md:py-[72px] xl:py-28">
      <div aria-hidden className="pattern-star pointer-events-none absolute inset-0 opacity-[0.035]" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[4fr_7fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>{faqSection.eyebrow}</Eyebrow>
            <h2
              id="faq-heading"
              className="mt-4 font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-navy md:text-[40px] xl:text-h2"
            >
              <Segments segments={faqSection.title} />
            </h2>
            <p className="mt-5 text-base leading-[1.7] text-ink-600 md:text-[17px]">{faqSection.body}</p>

            <div className="mt-8 overflow-hidden rounded-card bg-navy p-6 text-white shadow-featured">
              <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-white/10 text-gold">
                <MessageCircleQuestion aria-hidden className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-lg font-bold">Still have a question?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-on-navy-muted">
                Talk to an advisor — the first conversation is free and confidential.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button asChild size="md">
                  <Link href="#consultation">
                    {faqSection.cta}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
                <a
                  href={siteConfig.contact.whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ask on WhatsApp"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-btn border border-white/20 transition-colors hover:border-whatsapp hover:bg-whatsapp/10"
                >
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                </a>
                <a
                  href={siteConfig.contact.phoneHref}
                  aria-label={`Call ${siteConfig.contact.phoneDisplay}`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-btn border border-white/20 text-gold transition-colors hover:border-gold hover:bg-gold/10"
                >
                  <Phone aria-hidden className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <FaqList faqs={faqs} />
        </div>
      </Container>
      <JsonLd graph={[faqSchema(faqs)]} />
    </section>
  );
}
