import { SiteChrome } from '@/components/layout/site-chrome';
import { SiteDataProvider } from '@/components/providers/site-data';
import { getServices, getSiteConfig } from '@/lib/cms/queries';

/** Public website chrome. Settings and services come from the CMS. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [config, services] = await Promise.all([getSiteConfig(), getServices()]);

  return (
    <SiteDataProvider value={{ config, services }}>
      <SiteChrome config={config}>{children}</SiteChrome>
    </SiteDataProvider>
  );
}
