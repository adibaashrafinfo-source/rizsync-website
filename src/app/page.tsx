import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/home/hero-section';
import { QuickServiceBar } from '@/components/home/quick-service-bar';
import { AboutSplit } from '@/components/home/about-split';
import { PillarsGrid } from '@/components/home/pillars-grid';
import { BenefitsBand } from '@/components/home/benefits-band';
import { ValuesSection } from '@/components/home/values-section';
import { ProcessSteps } from '@/components/home/process-steps';
import { Testimonials } from '@/components/home/testimonials';
import { CtaBanner } from '@/components/home/cta-banner';
import { InsightsPreview } from '@/components/home/insights-preview';
import { ConsultationSection } from '@/components/home/consultation-section';

export const metadata: Metadata = pageMetadata({
  title: 'RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh',
  description:
    'RizSync is a multi-disciplinary platform providing expert corporate services, government assistance, and digital transformation, guided by the Quranic business model of trust and integrity.',
  path: '/',
});

/** Section order is fixed by HOME_REDESIGN.md §7. Header and Footer come from the root layout. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickServiceBar />
      <AboutSplit />
      <PillarsGrid />
      <BenefitsBand />
      <ValuesSection />
      <ProcessSteps />
      <Testimonials />
      <CtaBanner className="pt-0 md:pt-0 xl:pt-0" />
      <InsightsPreview />
      <ConsultationSection />
    </>
  );
}
