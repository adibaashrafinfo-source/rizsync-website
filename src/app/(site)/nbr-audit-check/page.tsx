import type { Metadata } from 'next';
import { Building2, FileText, ShieldCheck } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { PageHero } from '@/components/sections/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/schema';
import { getAuditStats } from '@/lib/audit-stats';
import { getSiteConfig } from '@/lib/cms/queries';
import { AuditCheck } from './audit-check';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'NBR Audit Check', href: '/nbr-audit-check' },
];

export const metadata: Metadata = pageMetadata({
  title: 'NBR Audit Check — Is Your TIN or BIN Selected for Audit? | RizSync',
  description:
    'Check whether your TIN (income tax) or BIN (VAT) is on the NBR audit selection list. Free exact-match lookup based on published NBR notices.',
  path: '/nbr-audit-check',
  keywords: ['NBR audit check', 'VAT audit list', 'BIN audit', 'TIN audit', 'NBR audit selection 2024', 'e-VAT audit'],
});

const nf = new Intl.NumberFormat('en-US');

export default async function NbrAuditCheckPage() {
  const [stats, siteConfig] = await Promise.all([getAuditStats(), getSiteConfig()]);

  return (
    <>
      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
      <PageHero
        eyebrow="Free tool"
        title="NBR Audit Check"
        description="আপনার প্রতিষ্ঠান কি NBR অডিটের জন্য নির্বাচিত? Enter your TIN or BIN to check the published NBR audit selection lists in seconds."
        crumbs={crumbs}
      />

      <Section className="bg-paper" labelledBy="audit-check-heading">
        <h2 id="audit-check-heading" className="sr-only">
          Check your audit status
        </h2>
        <AuditCheck />
      </Section>

      <section className="bg-mist py-14 md:py-20" aria-label="About the lists">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              icon={FileText}
              value={stats.tin ? nf.format(stats.tin) : 'Updating'}
              label={stats.tin ? 'TIN records selected (income tax audit)' : 'TIN list is being added'}
            />
            <StatCard icon={Building2} value={nf.format(stats.bin || 600)} label="BIN records selected (VAT audit)" />
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-line bg-white p-7 text-center shadow-soft">
              <ShieldCheck aria-hidden className="h-7 w-7 text-emerald-600" />
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                Exact-match lookup only. Searches are counted for abuse monitoring; no personal details are stored.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-[13px] leading-relaxed text-muted">
            {siteConfig.name} is not the National Board of Revenue (NBR). Results are based on published NBR audit
            selection notices — including the 600 institutions selected through the NBR e-VAT Risk Management Module —
            and are provided for guidance only. Please confirm with your VAT Commissionerate or tax circle.
          </p>
        </Container>
      </section>
    </>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: typeof FileText; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-line bg-white p-7 text-center shadow-soft">
      <Icon aria-hidden className="h-6 w-6 text-teal-ink" />
      <p className="mt-3 font-mono text-[34px] leading-none font-bold tracking-tight text-navy">{value}</p>
      <p className="mt-2 text-[15px] text-ink-600">{label}</p>
    </div>
  );
}
