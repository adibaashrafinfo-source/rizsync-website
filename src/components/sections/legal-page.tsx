import { Container } from '@/components/ui/container';
import { PageHero } from '@/components/sections/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/schema';
import type { Crumb } from '@/components/ui/breadcrumbs';

/** Shared shell for the two placeholder legal pages (§3). */
export function LegalPage({
  title,
  description,
  crumbs,
  updated,
  children,
}: {
  title: string;
  description: string;
  crumbs: Crumb[];
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={description} crumbs={crumbs} />

      <Container className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-card border border-gold-500/40 bg-gold-50 p-5 text-sm text-ink-900">
            <strong className="font-semibold">Placeholder document.</strong> This text is a
            structural draft only. It has not been reviewed by a lawyer and must be replaced
            with a version prepared for {`RizSync`} before launch.
          </div>

          <p className="mt-8 text-sm text-ink-600">Last updated: {updated}</p>

          <article className="prose prose-rizsync mt-4 max-w-none prose-headings:font-display prose-h2:mt-10 prose-h2:text-[22px]">
            {children}
          </article>
        </div>
      </Container>

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
