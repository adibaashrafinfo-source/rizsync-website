/**
 * Single source of truth for everything the client may want to change.
 *
 * DESIGN.md §0 lists ten "Open Items" that still need client confirmation.
 * Each one lives here and nowhere else, so confirming a value is a one-line
 * edit in this file. Items still awaiting confirmation are marked TODO(client).
 */

const phoneDigits = '8801711504625';

export const siteConfig = {
  /** §0.1 — official name. Used in H1, footer, schema, metadata. */
  name: 'RizSync Service Solution',
  shortName: 'RizSync',
  legalName: 'RizSync Service Solution',

  tagline: 'Connect • Simplify • Protect • Transform • Grow',
  /** The tagline split into chips for the hero motto strip. */
  mottoWords: ['Connect', 'Simplify', 'Protect', 'Transform', 'Grow'] as const,

  description:
    'RizSync is a multi-disciplinary platform providing expert corporate services, government assistance, and digital transformation, guided by the Quranic business model of trust and integrity.',

  /** Falls back to the production domain so metadataBase is always valid. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rizsync.com',

  /** §0.6 — placeholder wordmark until the vector logo arrives. */
  logo: '/logo.svg',
  ogImage: '/opengraph-image',

  /** §0.7 — TODO(client): supply the Dhaka cityscape + circuitry artwork. */
  heroImage: '/images/hero/hero-dhaka.webp',

  founded: '2021',
  /** §0.3 — rendered as "© 2021–{currentYear}". */
  copyrightStartYear: 2021,

  contact: {
    /** §0.2 — TODO(client): confirm; this address looks unrelated to the brand. */
    email: 'PalzaPast.service@gmail.com',
    phoneDisplay: '+880 1711-504625',
    phoneHref: `tel:+${phoneDigits}`,
    whatsappNumber: phoneDigits,
    whatsappHref: `https://wa.me/${phoneDigits}`,
    whatsappPrefilled: `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
      "Assalamu Alaikum, I'd like to request a consultation with RizSync.",
    )}`,
    /** TODO(client): confirm business hours. */
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
      full: '137/10, Mazar Road, Mirpur, Dhaka',
    },
    /** §0.8 — normalised spelling. TODO(client): confirm. */
    operations: {
      label: 'Business Operation Office',
      street: '8E/A, 1st Colony, Mazar Road',
      locality: 'Mirpur',
      region: 'Dhaka',
      country: 'BD',
      full: '8E/A, 1st Colony, Mazar Road, Mirpur, Dhaka',
    },
  },

  social: {
    /** §0.4 — primary of the two Facebook URLs supplied. TODO(client): confirm. */
    facebook: 'https://www.facebook.com/RizSync.BD.Official/',
    /** §0.5 — TODO(client): LinkedIn company page URL not yet provided. */
    linkedin: '#',
  },

  /** Google Maps embed for the Corporate Office (§6.6.4). */
  mapEmbedSrc:
    'https://www.google.com/maps?q=137/10%20Mazar%20Road,%20Mirpur,%20Dhaka,%20Bangladesh&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=137%2F10%20Mazar%20Road%2C%20Mirpur%2C%20Dhaka%2C%20Bangladesh',

  ethicsStatement:
    'RizSync operates on principles of transparency, integrity, and justice, guided by ethical business practices and the Quranic Business Model.',

  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** "© 2021–2026" — §0.3. */
export function copyrightRange(now: Date = new Date()): string {
  const year = now.getFullYear();
  return year > siteConfig.copyrightStartYear
    ? `${siteConfig.copyrightStartYear}–${year}`
    : `${siteConfig.copyrightStartYear}`;
}

/** Absolute URL helper — schema and metadata need fully-qualified links. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, siteConfig.url).toString();
}
