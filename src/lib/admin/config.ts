import { insightCategories } from '@/lib/categories';
import { defaultTeamPage } from '@/data/team';
import { accentOptions, type Field, type FormSection } from '@/lib/admin/fields';

/** Sections an admin can file a profile under (from the Our Team page doc). */
const teamGroupOptions = defaultTeamPage.groups.map((group) => ({
  value: group.key,
  label: group.title,
}));

/* ------------------------------------------------------------ shared bits */

const visibility = (withOrder = true): FormSection => ({
  title: 'Visibility',
  description: 'Hidden items stay in the admin but disappear from the website.',
  fields: [
    { name: 'published', label: 'Show on website', type: 'toggle', half: true },
    ...(withOrder
      ? [
          {
            name: 'sort_order',
            label: 'Display order',
            type: 'number',
            half: true,
            help: 'Lower numbers appear first. You can also reorder from the list.',
          } satisfies Field,
        ]
      : []),
  ],
});

const markupHelp =
  'Wrap words in {orange:…}, {teal:…} or {gold:…} to colour them, e.g. "RizSync {orange:Service}".';

/* ------------------------------------------------------------ collections */

export type EntityKey = 'services' | 'insights' | 'team_members' | 'testimonials' | 'faqs';

export interface EntityConfig {
  key: EntityKey;
  table: EntityKey;
  singular: string;
  plural: string;
  description: string;
  /** Column shown as the row title. */
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  /** How the list is ordered in the admin. */
  orderBy: { column: string; ascending: boolean };
  sortable: boolean;
  sections: FormSection[];
  defaults: Record<string, unknown>;
  publicPath?: (row: Record<string, unknown>) => string;
}

export const entities: Record<EntityKey, EntityConfig> = {
  services: {
    key: 'services',
    table: 'services',
    singular: 'Service',
    plural: 'Services',
    description:
      'The service pillars shown in the menu, the home page wheel and cards, and each service page.',
    titleField: 'title',
    subtitleField: 'nav_description',
    orderBy: { column: 'sort_order', ascending: true },
    sortable: true,
    publicPath: (row) => `/services/${row.slug}`,
    defaults: {
      title: '',
      short_title: '',
      slug: '',
      nav_description: '',
      icon: 'Briefcase',
      color: 'teal',
      h1: '',
      intro: '',
      bullets: [],
      items: [],
      why_rizsync: [],
      faqs: [],
      hero_card: null,
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
      published: true,
      sort_order: 99,
    },
    sections: [
      {
        title: 'Basics',
        description: 'How the service is named and shown across the site.',
        fields: [
          { name: 'title', label: 'Service name', type: 'text', required: true },
          {
            name: 'short_title',
            label: 'Short name',
            type: 'text',
            required: true,
            half: true,
            help: 'Used in the wheel, quick bar and footer.',
          },
          {
            name: 'slug',
            label: 'URL slug',
            type: 'slug',
            required: true,
            half: true,
            help: 'The page address: /services/your-slug',
          },
          {
            name: 'nav_description',
            label: 'One-line description',
            type: 'textarea',
            rows: 2,
            help: 'Shown in the Services menu and wheel tooltip.',
          },
          { name: 'icon', label: 'Icon', type: 'icon' },
          { name: 'color', label: 'Accent colour', type: 'color' },
        ],
      },
      {
        title: 'Service page',
        fields: [
          { name: 'h1', label: 'Page heading (H1)', type: 'text' },
          { name: 'intro', label: 'Introduction', type: 'textarea', rows: 3 },
          {
            name: 'bullets',
            label: 'Card highlights',
            type: 'list',
            help: 'Short points shown on the home page service card (about 4).',
          },
          {
            name: 'items',
            label: 'What we handle',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              { name: 'title', label: 'Title', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
            ],
          },
          {
            name: 'why_rizsync',
            label: 'Why RizSync for this',
            type: 'repeater',
            itemLabel: 'value',
            help: 'Value names should match the Quranic Business Model values (Adl, Amanah, Shaffafiyyah, Naf’ah).',
            fields: [
              { name: 'value', label: 'Value', type: 'text', required: true },
              { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
          {
            name: 'faqs',
            label: 'Frequently asked questions',
            type: 'repeater',
            itemLabel: 'question',
            fields: [
              { name: 'question', label: 'Question', type: 'text', required: true },
              { name: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
            ],
          },
        ],
      },
      {
        title: 'Home page hero card',
        description:
          'Optional. Services with a card appear beside the service wheel at the top of the home page.',
        fields: [
          {
            name: 'hero_card',
            label: 'Hero card',
            type: 'group',
            optional: true,
            fields: [
              { name: 'title', label: 'Card title', type: 'text', half: true },
              { name: 'subtitle', label: 'Subtitle', type: 'text', half: true },
              { name: 'chips', label: 'Chips', type: 'list' },
            ],
          },
        ],
      },
      {
        title: 'Search engines (SEO)',
        fields: [
          { name: 'seo_title', label: 'SEO title', type: 'text', help: 'About 50–60 characters.' },
          {
            name: 'seo_description',
            label: 'SEO description',
            type: 'textarea',
            rows: 2,
            help: 'About 150–160 characters.',
          },
          { name: 'seo_keywords', label: 'Keywords', type: 'list' },
        ],
      },
      visibility(),
    ],
  },

  insights: {
    key: 'insights',
    table: 'insights',
    singular: 'Article',
    plural: 'Insights',
    description: 'Articles for the Insights blog. Content is written in Markdown.',
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'cover',
    orderBy: { column: 'published_on', ascending: false },
    sortable: false,
    publicPath: (row) => `/insights/${row.slug}`,
    defaults: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: insightCategories[0],
      tags: [],
      author: 'RizSync Advisory Team',
      published_on: new Date().toISOString().slice(0, 10),
      cover: null,
      featured: false,
      published: true,
    },
    sections: [
      {
        title: 'Article',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL slug',
            type: 'slug',
            required: true,
            help: 'The page address: /insights/your-slug',
          },
          {
            name: 'excerpt',
            label: 'Summary',
            type: 'textarea',
            rows: 2,
            help: 'Shown on cards and in search results.',
          },
          {
            name: 'content',
            label: 'Content',
            type: 'markdown',
            rows: 22,
            required: true,
            help: 'Use ## for section headings (they build the table of contents).',
          },
        ],
      },
      {
        title: 'Details',
        fields: [
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            half: true,
            options: insightCategories.map((category) => ({ value: category, label: category })),
          },
          { name: 'published_on', label: 'Publish date', type: 'date', half: true },
          { name: 'author', label: 'Author', type: 'text', half: true },
          { name: 'tags', label: 'Tags', type: 'list', half: true },
          { name: 'cover', label: 'Cover image', type: 'image', folder: 'insights', help: 'Landscape, about 1200 × 630.' },
        ],
      },
      {
        title: 'Visibility',
        fields: [
          { name: 'published', label: 'Published', type: 'toggle', half: true },
          {
            name: 'featured',
            label: 'Featured article',
            type: 'toggle',
            half: true,
            help: 'Shown large at the top of the Insights page.',
          },
        ],
      },
    ],
  },

  team_members: {
    key: 'team_members',
    table: 'team_members',
    singular: 'Team member',
    plural: 'Our Team',
    description: 'Profiles on the Our Team page, grouped by the sections you define in Pages → Our Team page.',
    titleField: 'name',
    subtitleField: 'title',
    imageField: 'photo',
    orderBy: { column: 'sort_order', ascending: true },
    sortable: true,
    publicPath: () => '/our-team',
    defaults: {
      name: '',
      title: '',
      credentials: '',
      group: 'advisory',
      bio: '',
      expertise: [],
      photo: null,
      linkedin: '',
      email: '',
      published: true,
      sort_order: 99,
    },
    sections: [
      {
        title: 'Profile',
        fields: [
          { name: 'name', label: 'Full name', type: 'text', required: true, half: true },
          { name: 'title', label: 'Designation', type: 'text', half: true, help: 'e.g. Consultant — Tax & VAT' },
          {
            name: 'credentials',
            label: 'Qualifications',
            type: 'text',
            help: 'Shown under the designation, e.g. FCA, Advocate, Supreme Court of Bangladesh.',
          },
          {
            name: 'group',
            label: 'Section',
            type: 'select',
            half: true,
            options: teamGroupOptions,
            help: 'Which section of the Our Team page this profile appears in.',
          },
          { name: 'photo', label: 'Photo', type: 'image', folder: 'team', help: 'Portrait, about 800 × 1000.' },
          { name: 'bio', label: 'Short biography', type: 'textarea', rows: 4 },
          { name: 'expertise', label: 'Areas of expertise', type: 'list', help: 'Shown as tags on the profile card.' },
        ],
      },
      {
        title: 'Links',
        fields: [
          { name: 'linkedin', label: 'LinkedIn URL', type: 'url', half: true, placeholder: 'https://www.linkedin.com/in/…' },
          { name: 'email', label: 'Email', type: 'email', half: true },
        ],
      },
      visibility(),
    ],
  },

  testimonials: {
    key: 'testimonials',
    table: 'testimonials',
    singular: 'Testimonial',
    plural: 'Testimonials',
    description: 'Client quotes in the home page carousel.',
    titleField: 'name',
    subtitleField: 'company',
    imageField: 'photo',
    orderBy: { column: 'sort_order', ascending: true },
    sortable: true,
    publicPath: () => '/',
    defaults: {
      quote: '',
      name: '',
      role: '',
      company: '',
      rating: '5',
      photo: null,
      published: true,
      sort_order: 99,
    },
    sections: [
      {
        title: 'Testimonial',
        fields: [
          { name: 'quote', label: 'Quote', type: 'textarea', rows: 4, required: true },
          { name: 'name', label: 'Client name', type: 'text', required: true, half: true },
          { name: 'role', label: 'Role', type: 'text', half: true },
          { name: 'company', label: 'Company', type: 'text', half: true },
          {
            name: 'rating',
            label: 'Rating',
            type: 'select',
            half: true,
            options: ['5', '4', '3', '2', '1'].map((n) => ({ value: n, label: `${n} stars` })),
          },
          { name: 'photo', label: 'Photo (optional)', type: 'image', folder: 'testimonials' },
        ],
      },
      visibility(),
    ],
  },

  faqs: {
    key: 'faqs',
    table: 'faqs',
    singular: 'FAQ',
    plural: 'FAQs',
    description: 'General questions on the home page and the Services page. Service-specific FAQs live in each service.',
    titleField: 'question',
    orderBy: { column: 'sort_order', ascending: true },
    sortable: true,
    publicPath: () => '/services',
    defaults: { question: '', answer: '', published: true, sort_order: 99 },
    sections: [
      {
        title: 'Question',
        fields: [
          { name: 'question', label: 'Question', type: 'text', required: true },
          { name: 'answer', label: 'Answer', type: 'textarea', rows: 5, required: true },
        ],
      },
      visibility(),
    ],
  },
};

export function isEntityKey(value: string): value is EntityKey {
  return value in entities;
}

/* -------------------------------------------------------------- documents */

export type DocKey = 'settings' | 'home' | 'about' | 'ceo' | 'team';

export interface DocConfig {
  key: DocKey;
  title: string;
  description: string;
  publicPath: string;
  sections: FormSection[];
}

const office = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'label', label: 'Office name', type: 'text' },
    { name: 'street', label: 'Street address', type: 'text' },
    { name: 'locality', label: 'Area', type: 'text', half: true },
    { name: 'region', label: 'City', type: 'text', half: true },
    { name: 'country', label: 'Country code', type: 'text', half: true, help: 'e.g. BD' },
  ],
});

const heading = (name: string, label: string, extra: Field[] = []): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
    { name: 'title', label: 'Heading', type: 'text', half: true },
    ...extra,
  ],
});

export const docs: Record<DocKey, DocConfig> = {
  settings: {
    key: 'settings',
    title: 'Site settings',
    description: 'Company details, contact information, addresses and social media — used everywhere on the site.',
    publicPath: '/contact',
    sections: [
      {
        title: 'Logo',
        description:
          'The header and footer sit on a dark navy background, so those logos need light artwork — upload a white or light version there. Leave a field empty to fall back to the built-in mark.',
        fields: [
          {
            name: 'branding',
            label: 'Logos',
            type: 'group',
            fields: [
              {
                name: 'headerLogo',
                label: 'Header logo (for dark background)',
                type: 'image',
                folder: 'brand',
                help: 'PNG or WebP with a transparent background. About 900 px wide.',
              },
              {
                name: 'footerLogo',
                label: 'Footer logo (for dark background)',
                type: 'image',
                folder: 'brand',
                help: 'Leave empty to reuse the header logo.',
              },
              {
                name: 'lightBackgroundLogo',
                label: 'Logo for light backgrounds',
                type: 'image',
                folder: 'brand',
                help: 'Your full-colour logo, used where the background is white.',
              },
              {
                name: 'headerLogoHeight',
                label: 'Header logo height (px)',
                type: 'number',
                half: true,
                help: 'Between 24 and 120. 46 suits a wide logo.',
              },
              {
                name: 'footerLogoHeight',
                label: 'Footer logo height (px)',
                type: 'number',
                half: true,
                help: 'Between 24 and 120.',
              },
              {
                name: 'showWordmark',
                label: 'Also show the "RizSync" text beside the logo',
                type: 'toggle',
                help: 'Turn on only if your logo is just the symbol, with no company name in it.',
              },
            ],
          },
        ],
      },
      {
        title: 'Brand',
        fields: [
          { name: 'name', label: 'Company name', type: 'text', required: true, half: true },
          { name: 'shortName', label: 'Short name', type: 'text', required: true, half: true },
          { name: 'legalName', label: 'Legal name', type: 'text', half: true },
          { name: 'founded', label: 'Founded (year)', type: 'text', half: true },
          { name: 'tagline', label: 'Tagline', type: 'text', help: 'Separate words with • — shown in the footer.' },
          { name: 'description', label: 'Company description', type: 'textarea', rows: 3 },
          { name: 'ethicsStatement', label: 'Ethics statement', type: 'textarea', rows: 3 },
          {
            name: 'copyrightStartYear',
            label: 'Copyright start year',
            type: 'number',
            half: true,
            help: 'Footer shows © start–current year.',
          },
          {
            name: 'heroImage',
            label: 'Home page hero background',
            type: 'image',
            folder: 'site',
            help: 'Wide artwork, dark on the left where the headline sits.',
          },
        ],
      },
      {
        title: 'Contact',
        fields: [
          {
            name: 'contact',
            label: 'Contact',
            type: 'group',
            fields: [
              { name: 'email', label: 'Email address', type: 'email', half: true },
              { name: 'phoneDisplay', label: 'Phone (as displayed)', type: 'text', half: true, placeholder: '+880 1711-504625' },
              { name: 'phoneNumber', label: 'Phone (digits, with country code)', type: 'text', half: true, placeholder: '8801711504625' },
              { name: 'whatsappNumber', label: 'WhatsApp number (digits)', type: 'text', half: true, placeholder: '8801711504625' },
              { name: 'whatsappMessage', label: 'WhatsApp greeting message', type: 'textarea', rows: 2 },
              { name: 'hours', label: 'Opening hours', type: 'text', half: true, placeholder: 'Mon–Sat, 10am–7pm' },
              {
                name: 'openingHoursSchema',
                label: 'Opening hours (for Google)',
                type: 'text',
                half: true,
                placeholder: 'Mo-Sa 10:00-19:00',
              },
            ],
          },
        ],
      },
      {
        title: 'Addresses & map',
        fields: [
          {
            name: 'offices',
            label: 'Offices',
            type: 'group',
            fields: [office('corporate', 'Corporate office'), office('operations', 'Operations office')],
          },
          {
            name: 'mapEmbedSrc',
            label: 'Google Maps embed link',
            type: 'url',
            help: 'Google Maps → Share → Embed a map → copy the src="…" link.',
          },
          { name: 'mapDirectionsUrl', label: 'Directions link', type: 'url' },
        ],
      },
      {
        title: 'Social media',
        description: 'Leave a network empty to hide its icon.',
        fields: [
          {
            name: 'social',
            label: 'Social links',
            type: 'group',
            fields: [
              { name: 'facebook', label: 'Facebook', type: 'url', half: true },
              { name: 'linkedin', label: 'LinkedIn', type: 'url', half: true },
              { name: 'instagram', label: 'Instagram', type: 'url', half: true },
              { name: 'youtube', label: 'YouTube', type: 'url', half: true },
              { name: 'x', label: 'X (Twitter)', type: 'url', half: true },
              { name: 'tiktok', label: 'TikTok', type: 'url', half: true },
            ],
          },
        ],
      },
    ],
  },

  home: {
    key: 'home',
    title: 'Home page',
    description: 'Every heading, paragraph and button on the home page.',
    publicPath: '/',
    sections: [
      {
        title: 'Hero',
        description: 'The first screen. The background image is in Site settings → Brand.',
        fields: [
          {
            name: 'hero',
            label: 'Hero',
            type: 'group',
            fields: [
              {
                name: 'badge',
                label: 'Badge',
                type: 'group',
                fields: [
                  { name: 'pill', label: 'Pill text', type: 'text', half: true },
                  { name: 'text', label: 'Badge text', type: 'text', half: true },
                ],
              },
              { name: 'title', label: 'Headline', type: 'markup', help: markupHelp },
              { name: 'lead', label: 'Introduction', type: 'textarea', rows: 3 },
              {
                name: 'motto',
                label: 'Motto chips',
                type: 'repeater',
                itemLabel: 'word',
                fields: [
                  { name: 'word', label: 'Word', type: 'text', half: true },
                  { name: 'color', label: 'Colour', type: 'color', half: true },
                ],
              },
              { name: 'primaryCta', label: 'Main button', type: 'text', half: true },
              { name: 'whatsappCta', label: 'WhatsApp button', type: 'text', half: true },
              { name: 'socialProof', label: 'Trust line', type: 'text' },
            ],
          },
        ],
      },
      {
        title: 'Who we are',
        fields: [
          {
            name: 'about',
            label: 'Who we are',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'cta', label: 'Button', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'markup', help: markupHelp },
              { name: 'body', label: 'Paragraph', type: 'textarea', rows: 4 },
              {
                name: 'points',
                label: 'Key points',
                type: 'repeater',
                itemLabel: 'label',
                fields: [
                  { name: 'label', label: 'Label', type: 'text', half: true },
                  { name: 'text', label: 'Text', type: 'text', half: true },
                ],
              },
              { name: 'photo', label: 'Photo', type: 'image', folder: 'site' },
              { name: 'photoAlt', label: 'Photo description (alt text)', type: 'text' },
              { name: 'sinceYear', label: 'Badge year', type: 'text', half: true },
              { name: 'sinceLabel', label: 'Badge text', type: 'text', half: true },
              { name: 'confidential', label: 'Floating card text', type: 'text' },
            ],
          },
        ],
      },
      {
        title: 'Section headings',
        description: 'Headings of the sections that list services, testimonials and insights.',
        fields: [
          heading('pillarsSection', 'Services grid', [{ name: 'cta', label: 'Button', type: 'text' }]),
          heading('testimonialsSection', 'Testimonials'),
          heading('insightsSection', 'Insights', [{ name: 'cta', label: 'Link text', type: 'text' }]),
          {
            name: 'faqSection',
            label: 'FAQ section',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'cta', label: 'Button', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'markup', help: markupHelp },
              { name: 'body', label: 'Paragraph', type: 'textarea', rows: 2 },
            ],
          },
          heading('valuesSection', 'Values', [
            { name: 'body', label: 'Paragraph', type: 'textarea', rows: 2 },
            { name: 'link', label: 'Link text', type: 'text' },
          ]),
        ],
      },
      {
        title: 'Benefits',
        fields: [
          {
            name: 'benefitsSection',
            label: 'Benefits heading',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text' },
              { name: 'title', label: 'Heading', type: 'markup', help: markupHelp },
              { name: 'body', label: 'Paragraph', type: 'textarea', rows: 3 },
            ],
          },
          {
            name: 'benefits',
            label: 'Benefit cards',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
              { name: 'icon', label: 'Icon', type: 'icon' },
              { name: 'color', label: 'Colour', type: 'color' },
            ],
          },
        ],
      },
      {
        title: 'Process',
        fields: [
          heading('processSection', 'Process heading'),
          {
            name: 'processSteps',
            label: 'Steps',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              { name: 'title', label: 'Title', type: 'text', half: true },
              {
                name: 'color',
                label: 'Number colour',
                type: 'select',
                half: true,
                options: [{ value: 'navy', label: 'Navy' }, ...accentOptions],
              },
              { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
      {
        title: 'Call to action & form',
        fields: [
          {
            name: 'ctaBanner',
            label: 'Call-to-action banner',
            type: 'group',
            fields: [
              { name: 'title', label: 'Heading', type: 'text' },
              { name: 'body', label: 'Text', type: 'textarea', rows: 2 },
              { name: 'cta', label: 'Button', type: 'text' },
            ],
          },
          {
            name: 'consultationSection',
            label: 'Consultation form section',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'submit', label: 'Submit button', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'text' },
              { name: 'body', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
    ],
  },

  about: {
    key: 'about',
    title: 'About page',
    description: 'Story, vision, mission and the values. Team members are managed in Our Team.',
    publicPath: '/about',
    sections: [
      {
        title: 'Page header',
        fields: [
          {
            name: 'hero',
            label: 'Header',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Title', type: 'text', half: true },
              { name: 'description', label: 'Subtitle', type: 'text' },
              { name: 'image', label: 'Background image', type: 'image', folder: 'site' },
            ],
          },
        ],
      },
      {
        title: 'Our story',
        fields: [
          {
            name: 'story',
            label: 'Story',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'text', half: true },
              {
                name: 'body',
                label: 'Story',
                type: 'textarea',
                rows: 12,
                help: 'Leave an empty line between paragraphs.',
              },
              { name: 'image', label: 'Image', type: 'image', folder: 'site' },
              { name: 'imageAlt', label: 'Image description (alt text)', type: 'text' },
            ],
          },
        ],
      },
      {
        title: 'Vision & mission',
        fields: [
          heading('direction', 'Section heading'),
          {
            name: 'vision',
            label: 'Vision',
            type: 'group',
            fields: [
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
          {
            name: 'mission',
            label: 'Mission',
            type: 'group',
            fields: [
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
        ],
      },
      {
        title: 'Values',
        description: 'The Quranic Business Model — shown on the About page, the home page and service pages.',
        fields: [
          heading('valuesSection', 'Values heading', [
            { name: 'description', label: 'Intro', type: 'textarea', rows: 2 },
          ]),
          {
            name: 'values',
            label: 'Values',
            type: 'repeater',
            itemLabel: 'english',
            fields: [
              { name: 'arabic', label: 'Arabic', type: 'text', half: true },
              { name: 'transliteration', label: 'Transliteration', type: 'text', half: true },
              { name: 'english', label: 'English name', type: 'text', half: true },
              { name: 'accent', label: 'Colour', type: 'color', half: true },
              { name: 'short', label: 'Short text (home page)', type: 'textarea', rows: 2 },
              { name: 'long', label: 'Long text (About page)', type: 'textarea', rows: 4 },
              { name: 'featured', label: 'Highlight on home page', type: 'toggle' },
            ],
          },
        ],
      },
      {
        title: 'Team & call to action',
        fields: [
          heading('teamSection', 'Team heading', [
            { name: 'description', label: 'Intro', type: 'textarea', rows: 2 },
          ]),
          {
            name: 'cta',
            label: 'Call to action',
            type: 'group',
            fields: [
              { name: 'title', label: 'Heading', type: 'text' },
              { name: 'description', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
    ],
  },
  ceo: {
    key: 'ceo',
    title: 'CEO profile',
    description: 'The CEO Profile page — photo, biography, career, achievements and the expertise list.',
    publicPath: '/ceo-profile',
    sections: [
      {
        title: 'Page header',
        fields: [
          {
            name: 'hero',
            label: 'Header',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Title', type: 'text', half: true },
              { name: 'description', label: 'Subtitle', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
      {
        title: 'Profile',
        fields: [
          { name: 'name', label: 'Full name', type: 'text', required: true, half: true },
          { name: 'credentials', label: 'Credentials', type: 'text', half: true, help: 'e.g. MBA (NSU)' },
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'headline', label: 'Headline', type: 'text' },
          { name: 'photo', label: 'Photo', type: 'image', folder: 'team', help: 'Portrait works best.' },
          { name: 'photoAlt', label: 'Photo description (alt text)', type: 'text' },
          { name: 'summary', label: 'Biography', type: 'textarea', rows: 8, help: 'Leave an empty line between paragraphs.' },
          { name: 'location', label: 'Location', type: 'text', half: true },
          { name: 'email', label: 'Public email (optional)', type: 'email', half: true },
          {
            name: 'highlights',
            label: 'Key numbers',
            type: 'repeater',
            itemLabel: 'label',
            fields: [
              { name: 'value', label: 'Number', type: 'text', half: true },
              { name: 'label', label: 'Label', type: 'text', half: true },
            ],
          },
        ],
      },
      {
        title: 'Career',
        fields: [
          heading('experienceSection', 'Section heading'),
          {
            name: 'experience',
            label: 'Experience',
            type: 'repeater',
            itemLabel: 'role',
            fields: [
              { name: 'role', label: 'Role', type: 'text', required: true },
              { name: 'company', label: 'Company', type: 'text', half: true },
              { name: 'period', label: 'Period', type: 'text', half: true, help: 'e.g. 07/2025 – Present' },
              { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
              { name: 'points', label: 'Key points', type: 'list' },
            ],
          },
          {
            name: 'achievements',
            label: 'Achievements',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              { name: 'title', label: 'Title', type: 'text', half: true },
              { name: 'period', label: 'Year / period', type: 'text', half: true },
              { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
        ],
      },
      {
        title: 'Skills & education',
        fields: [
          { name: 'skills', label: 'Skills', type: 'list' },
          { name: 'certifications', label: 'Certifications', type: 'list' },
          {
            name: 'education',
            label: 'Education',
            type: 'repeater',
            itemLabel: 'degree',
            fields: [
              { name: 'degree', label: 'Degree', type: 'text', half: true },
              { name: 'institution', label: 'Institution', type: 'text', half: true },
            ],
          },
        ],
      },
      {
        title: 'Expertise',
        description: '"Expertise Behind Every Solution" — the service list with coloured icons.',
        fields: [
          {
            name: 'expertiseSection',
            label: 'Section heading',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'markup', half: true, help: markupHelp },
              { name: 'body', label: 'Intro', type: 'textarea', rows: 2 },
            ],
          },
          {
            name: 'expertise',
            label: 'Services',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              { name: 'title', label: 'Service', type: 'text', required: true },
              { name: 'note', label: 'Small note (optional)', type: 'text' },
              { name: 'icon', label: 'Icon', type: 'icon', half: true },
              {
                name: 'color',
                label: 'Colour',
                type: 'select',
                half: true,
                options: [
                  { value: 'green', label: 'Green' },
                  { value: 'blue', label: 'Blue' },
                  { value: 'orange', label: 'Orange' },
                  { value: 'purple', label: 'Purple' },
                  { value: 'teal', label: 'Teal' },
                ],
              },
            ],
          },
          {
            name: 'cta',
            label: 'Call to action',
            type: 'group',
            fields: [
              { name: 'title', label: 'Heading', type: 'text' },
              { name: 'description', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
    ],
  },

  team: {
    key: 'team',
    title: 'Our Team page',
    description: 'Page header, intro, the numbers and the section headings. The profiles themselves live in Content → Our Team.',
    publicPath: '/our-team',
    sections: [
      {
        title: 'Page header',
        fields: [
          {
            name: 'hero',
            label: 'Header',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Title', type: 'text', half: true },
              { name: 'description', label: 'Subtitle', type: 'textarea', rows: 2 },
              { name: 'image', label: 'Background image', type: 'image', folder: 'site' },
            ],
          },
        ],
      },
      {
        title: 'Introduction',
        fields: [
          {
            name: 'intro',
            label: 'Intro',
            type: 'group',
            fields: [
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'markup', half: true, help: markupHelp },
              { name: 'body', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
          {
            name: 'stats',
            label: 'Numbers',
            type: 'repeater',
            itemLabel: 'label',
            fields: [
              { name: 'value', label: 'Number', type: 'text', half: true },
              { name: 'label', label: 'Label', type: 'text', half: true },
            ],
          },
        ],
      },
      {
        title: 'Sections',
        description: 'Each section groups the profiles whose "Section" field matches its key.',
        fields: [
          {
            name: 'groups',
            label: 'Sections',
            type: 'repeater',
            itemLabel: 'title',
            fields: [
              {
                name: 'key',
                label: 'Key',
                type: 'slug',
                half: true,
                required: true,
                help: 'Lower-case id used to match profiles, e.g. advisory.',
              },
              { name: 'accent', label: 'Colour', type: 'color', half: true },
              { name: 'eyebrow', label: 'Small label', type: 'text', half: true },
              { name: 'title', label: 'Heading', type: 'text', half: true },
              { name: 'description', label: 'Intro', type: 'textarea', rows: 2 },
            ],
          },
          {
            name: 'cta',
            label: 'Call to action',
            type: 'group',
            fields: [
              { name: 'title', label: 'Heading', type: 'text' },
              { name: 'description', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
    ],
  },
};

export function isDocKey(value: string): value is DocKey {
  return value in docs;
}
