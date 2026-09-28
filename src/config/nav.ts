export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation — DESIGN.md §5.1. */
export const mainNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

/** Footer "Company" column — §5.2.3. */
export const companyNav: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
];

/**
 * Where the header CTA points. On the home page the consultation form is
 * in-page (§5.1), everywhere else it lives on /contact.
 */
export const CTA_HREF = '/contact#consultation-form';
export const CTA_HOME_HREF = '#consultation';
export const CTA_LABEL = 'Request Consultation';
