import type { Metadata, Viewport } from 'next';
import { Sora, DM_Sans, Amiri } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { Analytics } from '@/components/seo/analytics';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';

/* Self-hosted through next/font — no layout shift, no third-party request.
   HOME_REDESIGN.md §2.2: Sora for display, DM Sans for body. */
const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

/* Used only for the Arabic ethics terms in the Values sections (§4.2). */
const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      'RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh',
    template: '%s | RizSync',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title:
      'RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh',
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh',
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#00204A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-paper antialiased">
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

        <JsonLd graph={[organizationSchema(), websiteSchema()]} />
        <Analytics />
      </body>
    </html>
  );
}
