import type { AboutContent } from '@/lib/cms/types';
import { defaultValues } from '@/data/values';

/** Default About page copy — seeded into Supabase, edited in the admin panel. */
export const defaultAbout: AboutContent = {
  hero: {
    eyebrow: 'About Us',
    title: 'About RizSync',
    description: 'Simplifying complexity, ethically.',
    image: '/images/page-heroes/about.webp',
  },
  story: {
    eyebrow: 'Our Story',
    title: 'Founded in Mirpur, Built on One Observation',
    body: [
      'RizSync began in 2021 with a simple observation about doing business in Bangladesh: the hard part is rarely the work itself. It is the number of separate people you have to hold together to get anything finished — one for the books, another for the filings, a third for the licence, and nobody with the whole picture.',
      'Our founders had spent years on the other side of that: watching capable businesses lose weeks to resubmissions, and families lose months to documentation nobody had explained. The gap was not expertise. It was coordination, and a standard of conduct you could rely on when you were not in the room.',
      'So we built one practice across six disciplines — finance, corporate, government liaison, digital operations and family welfare — under a single ethical framework. From our offices on Mazar Road in Mirpur, we now act for entrepreneurs, SMEs, corporate groups and families across Dhaka and beyond.',
    ].join('\n\n'),
    image: '/images/about-story.webp',
    imageAlt: 'The RizSync mark set within a circuit and geometric lattice motif',
  },
  direction: { eyebrow: 'Direction', title: 'Where We Are Going, and How' },
  vision: {
    title: 'Our Vision',
    text: 'To be Bangladesh’s most trusted platform connecting professional business support with personal welfare.',
  },
  mission: {
    title: 'Our Mission',
    text: 'To empower organizations and individuals by simplifying regulatory, financial, and digital complexities through expert, human-centric, and ethical advisory.',
  },
  valuesSection: {
    eyebrow: 'Our Values',
    title: 'The Quranic Business Model',
    description: 'Our operations are guided by principles of Islamic business ethics, ensuring:',
  },
  values: defaultValues,
  teamSection: {
    eyebrow: 'Leadership',
    title: 'The People Accountable for Your File',
    description:
      'The specialists who lead each practice area — and who answer for the work done on your behalf.',
  },
  cta: {
    title: 'Work with a partner you can hold to a standard',
    description:
      'Start with a free consultation. You will leave it knowing what needs doing — and whether you need us to do it.',
  },
};
