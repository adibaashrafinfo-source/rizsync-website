import { siteConfig, absoluteUrl } from '@/config/site';
import type { Faq } from '@/data/services';
import type { Crumb } from '@/components/ui/breadcrumbs';

/** JSON-LD graph IDs so nodes can reference each other rather than repeat. */
const ORG_ID = absoluteUrl('/#organization');
const SITE_ID = absoluteUrl('/#website');

function postalAddress(office: {
  street: string;
  locality: string;
  region: string;
  country: string;
}) {
  return {
    '@type': 'PostalAddress',
    streetAddress: office.street,
    addressLocality: office.locality,
    addressRegion: office.region,
    addressCountry: office.country,
  };
}

/**
 * Site-wide Organization + ProfessionalService node (DESIGN.md §8).
 * ProfessionalService is a subtype of LocalBusiness, so one node carries both
 * the corporate identity and the local-business signals.
 */
export function organizationSchema() {
  const sameAs = [siteConfig.social.facebook, siteConfig.social.linkedin].filter(
    (url) => url && url !== '#',
  );

  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(siteConfig.logo),
    },
    image: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: siteConfig.founded,
    telephone: siteConfig.contact.phoneDisplay,
    email: siteConfig.contact.email,
    address: postalAddress(siteConfig.offices.corporate),
    location: [
      {
        '@type': 'Place',
        name: siteConfig.offices.corporate.label,
        address: postalAddress(siteConfig.offices.corporate),
      },
      {
        '@type': 'Place',
        name: siteConfig.offices.operations.label,
        address: postalAddress(siteConfig.offices.operations),
      },
    ],
    openingHours: siteConfig.contact.openingHoursSchema,
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: siteConfig.contact.phoneDisplay,
      email: siteConfig.contact.email,
      areaServed: 'BD',
      availableLanguage: ['en', 'bn'],
    },
  };
}

/** WebSite node with the /insights search action (§8). */
export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: absoluteUrl('/'),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/insights?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  url: string;
  items: { title: string; description: string }[];
}) {
  return {
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    serviceType: input.name,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: input.name,
      itemListElement: input.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
        },
      })),
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  author: string;
  category?: string;
}) {
  return {
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.url) },
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    author: { '@type': 'Organization', name: input.author, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(input.category ? { articleSection: input.category } : {}),
    inLanguage: 'en',
  };
}
