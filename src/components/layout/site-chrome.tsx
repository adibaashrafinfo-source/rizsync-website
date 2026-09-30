import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { Analytics } from '@/components/seo/analytics';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import type { SiteConfig } from '@/lib/cms/types';

/** Shared with the root not-found page, which renders outside this group. */
export function SiteChrome({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-btn focus:bg-gold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-900"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />
      <WhatsAppFab />

      <JsonLd graph={[organizationSchema(config), websiteSchema(config)]} />
      <Analytics />
    </>
  );
}
