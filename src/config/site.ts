import type { SiteConfig, SiteSettings } from '@/lib/cms/types';

/**
 * Static site constants — the parts that are not edited in the admin panel
 * (domain, logo, analytics IDs) — plus the default editable settings.
 *
 * Live values for everything in `defaultSettings` come from Supabase via
 * `getSiteConfig()` in `src/lib/cms/queries.ts`; these defaults are what the
 * site falls back to when the database is unreachable.
 */
export const staticSite = {
  /** Falls back to the production domain so metadataBase is always valid. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rizsync.com',
  name: 'RizSync Service Solution',
  shortName: 'RizSync',
  description:
    'RizSync is a multi-disciplinary platform providing expert corporate services, government assistance, and digital transformation, guided by the Quranic business model of trust and integrity.',
  logo: '/logo.svg',
  ogImage: '/opengraph-image',
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  },
} as const;

export const defaultSettings: SiteSettings = {
  branding: {
    headerLogo: '/images/logo-light.webp',
    footerLogo: '/images/logo-light.webp',
    lightBackgroundLogo: '/images/logo.webp',
    headerLogoHeight: 46,
    footerLogoHeight: 54,
    showWordmark: false,
  },
  name: staticSite.name,
  shortName: staticSite.shortName,
  legalName: staticSite.name,
  tagline: 'Connect • Simplify • Protect • Transform • Grow',
  description: staticSite.description,
  founded: '2021',
  copyrightStartYear: 2021,
  ethicsStatement:
    'RizSync operates on principles of transparency, integrity, and justice, guided by ethical business practices and the Quranic Business Model.',
  heroImage: '/images/hero/hero-bg.webp',
  contact: {
    email: 'PalzaPast.service@gmail.com',
    phoneDisplay: '+880 1711-504625',
    phoneNumber: '8801711504625',
    whatsappNumber: '8801711504625',
    whatsappMessage: "Assalamu Alaikum, I'd like to request a consultation with RizSync.",
    hours: 'Mon–Sat, 10am–7pm',
    openingHoursSchema: 'Mo-Sa 10:00-19:00',
  },
  offices: {
    corporate: {
      label: 'Corporate Office',
      street: '137/10, Mazar Road',
      locality: 'Mirpur',
      region: 'Dhaka',
      country: 'BD',
    },
    operations: {
      label: 'Business Operation Office',
      street: '8E/A, 1st Colony, Mazar Road',
      locality: 'Mirpur',
      region: 'Dhaka',
      country: 'BD',
    },
  },
  mapEmbedSrc:
    'https://www.google.com/maps?q=137/10%20Mazar%20Road,%20Mirpur,%20Dhaka,%20Bangladesh&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=137%2F10%20Mazar%20Road%2C%20Mirpur%2C%20Dhaka%2C%20Bangladesh',
  social: {
    facebook: 'https://www.facebook.com/RizSync.BD.Official/',
    linkedin: '',
    instagram: '',
    youtube: '',
    x: '',
    tiktok: '',
  },
};

const digits = (value: string) => value.replace(/\D/g, '');

/** Adds the values derived from the editable settings (links, full addresses). */
export function resolveSiteConfig(settings: SiteSettings): SiteConfig {
  const phone = digits(settings.contact.phoneNumber);
  const whatsapp = digits(settings.contact.whatsappNumber) || phone;
  const withFull = (office: SiteSettings['offices']['corporate']) => ({
    ...office,
    full: [office.street, office.locality, office.region].filter(Boolean).join(', '),
  });

  return {
    ...settings,
    url: staticSite.url,
    // Search engines want the full-colour mark on a light background.
    logo: settings.branding?.lightBackgroundLogo || staticSite.logo,
    ogImage: staticSite.ogImage,
    analytics: staticSite.analytics,
    mottoWords: settings.tagline
      .split(/[•·|]/)
      .map((word) => word.trim())
      .filter(Boolean),
    contact: {
      ...settings.contact,
      phoneHref: `tel:+${phone}`,
      whatsappHref: `https://wa.me/${whatsapp}`,
      whatsappPrefilled: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        settings.contact.whatsappMessage,
      )}`,
    },
    offices: {
      corporate: withFull(settings.offices.corporate),
      operations: withFull(settings.offices.operations),
    },
  };
}

/** Default resolved config — for code paths with no database (e.g. metadata). */
export const siteConfig = resolveSiteConfig(defaultSettings);

/** "© 2021–2026". */
export function copyrightRange(startYear: number, now: Date = new Date()): string {
  const year = now.getFullYear();
  return year > startYear ? `${startYear}–${year}` : `${startYear}`;
}

/** Absolute URL helper — schema and metadata need fully-qualified links. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, staticSite.url).toString();
}
