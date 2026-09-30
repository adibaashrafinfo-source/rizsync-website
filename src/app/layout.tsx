import type { Metadata, Viewport } from 'next';
import { Sora, DM_Sans, Amiri } from 'next/font/google';
import { staticSite as siteConfig } from '@/config/site';
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
      <body className="flex min-h-dvh flex-col bg-paper antialiased">{children}</body>
    </html>
  );
}
