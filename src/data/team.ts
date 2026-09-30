import type { TeamContent, TeamMember } from '@/lib/cms/types';

/**
 * The people behind RizSync — from the profiles supplied by the client.
 * Everything here is editable in the admin panel (Our Team, and Pages →
 * Our Team page for the section headings).
 */
export const defaultTeam: TeamMember[] = [
  {
    name: 'Dr. Ahsanul Hadi',
    title: 'Advisor — Governance & Ethics',
    credentials: 'Professor, University of Dhaka',
    group: 'advisory',
    bio: 'Chairman of the Bangladesh Tariqa-e-Mohammadiya Foundation and a professor at the University of Dhaka. He guides the ethical framework RizSync works within, so every engagement is measured against principle as well as profit.',
    expertise: ['Governance & ethical oversight', 'Academic research', 'Institutional leadership'],
    photo: '/images/team/ahsanul-hadi.webp',
    linkedin: null,
    email: null,
  },
  {
    name: 'Md. Moahadul Mowla',
    title: 'Legal & Assurance Counsel',
    credentials: 'FCA, Advocate, Supreme Court of Bangladesh',
    group: 'advisory',
    bio: 'A Fellow Chartered Accountant who also practises as an Advocate of the Supreme Court of Bangladesh. He brings audit assurance and legal representation together, which matters when a compliance question turns into a legal one.',
    expertise: ['Statutory audit & assurance', 'Corporate law', 'Supreme Court representation', 'Regulatory matters'],
    photo: '/images/team/moahadul-mowla.webp',
    linkedin: null,
    email: null,
  },
  {
    name: 'Md. Rubayet Rahman',
    title: 'Financial Modelling & Audit Lead',
    credentials: 'CA Final Level · BBA in Accounting (University of Dhaka)',
    group: 'finance',
    bio: 'Leads financial modelling, budgeting and audit preparation. He turns raw ledgers into forecasts a board can act on, and keeps the underlying records ready for any auditor who asks.',
    expertise: ['Financial modelling', 'Budgeting & forecasting', 'Accounting & bookkeeping', 'Audit preparation'],
    photo: '/images/team/rubayet-rahman.webp',
    linkedin: null,
    email: null,
  },
  {
    name: 'Abu Naser',
    title: 'Consultant — Tax & VAT',
    credentials: 'Associate · CMA (ANZ), CA (PL), ITP',
    group: 'finance',
    bio: 'An Income Tax Practitioner with management and chartered accountancy credentials across two jurisdictions. He handles income tax and VAT returns, assessments and correspondence with the NBR.',
    expertise: ['Income tax returns & assessment', 'VAT registration & returns', 'NBR representation', 'Withholding tax compliance'],
    photo: '/images/team/abu-naser.webp',
    linkedin: null,
    email: null,
  },
  {
    name: 'Md. Mosaraf Ali',
    title: 'Specialist — Family Welfare & Protection',
    credentials: 'Insurance & Protection Solutions',
    group: 'specialist',
    bio: 'Advises families and business owners on welfare, insurance and protection planning, so that a household or a company is not left exposed when something goes wrong.',
    expertise: ['Family welfare planning', 'Insurance advisory', 'Protection solutions', 'Risk assessment'],
    photo: '/images/team/mosaraf-ali.webp',
    linkedin: null,
    email: null,
  },
  {
    name: 'Consultant — AI & Machine Learning',
    title: 'Consultant — AI & Machine Learning',
    credentials: '',
    group: 'specialist',
    bio: 'Builds the automation and analytics behind our digital transformation work — from conversational AI to cloud deployments and the security around them.',
    expertise: [
      'NLP & conversational AI',
      'Intelligent automation',
      'Enterprise integration',
      'Cloud solutions',
      'Data analytics',
      'Cyber security',
    ],
    photo: '/images/team/ai-consultant.webp',
    linkedin: null,
    email: null,
  },
];

export const defaultTeamPage: TeamContent = {
  hero: {
    eyebrow: 'Our Team',
    title: 'The People Behind RizSync',
    description:
      'Chartered accountants, an advocate of the Supreme Court, tax practitioners and technologists — working to one ethical standard.',
    image: '',
  },
  intro: {
    eyebrow: 'Who we are',
    title: 'Specialists, Not {orange:Generalists}',
    body: 'Every engagement is led by someone qualified in that specific field — audit, tax, law, protection or technology — rather than passed to whoever is free. That is why our advice holds up when a regulator, a bank or a court looks at it.',
  },
  stats: [
    { value: '06', label: 'Specialists across five disciplines' },
    { value: '25+', label: 'Years of leadership experience' },
    { value: '100%', label: 'Work led by a qualified professional' },
  ],
  groups: [
    {
      key: 'advisory',
      eyebrow: 'Governance',
      title: 'Advisory & Legal',
      description:
        'Ethical oversight, assurance and legal standing — the people who make sure the advice you act on is defensible.',
      accent: 'gold',
    },
    {
      key: 'finance',
      eyebrow: 'Core practice',
      title: 'Finance, Tax & Audit',
      description:
        'The day-to-day practice: accounts, returns, assessments and the financial models behind your decisions.',
      accent: 'teal',
    },
    {
      key: 'specialist',
      eyebrow: 'Specialists',
      title: 'Protection & Technology',
      description:
        'Family welfare and insurance planning, plus the automation and analytics that modernise how a business runs.',
      accent: 'orange',
    },
  ],
  cta: {
    title: 'Work with the specialist you actually need',
    description:
      'Tell us what you are facing and we will put the right person from this team in front of you.',
  },
};
