import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Hero } from '@/components/home/hero';
import { TrustStrip } from '@/components/sections/trust-strip';
import { Pillars } from '@/components/sections/pillars';
import { EthicalDifference } from '@/components/sections/ethical-difference';
import { Process } from '@/components/sections/process';
import { WhoWeServe } from '@/components/sections/who-we-serve';
import { Testimonials } from '@/components/sections/testimonials';
import { LatestInsights } from '@/components/sections/latest-insights';
import { ConsultationCta } from '@/components/sections/consultation-cta';

export const metadata: Metadata = pageMetadata({
  title: 'RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh',
  description:
    'RizSync is a multi-disciplinary platform providing expert corporate services, government assistance, and digital transformation, guided by the Quranic business model of trust and integrity.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Pillars />
      <EthicalDifference />
      <Process />
      <WhoWeServe />
      <Testimonials />
      <LatestInsights />
      <ConsultationCta />
    </>
  );
}
