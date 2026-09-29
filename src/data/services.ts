import {
  Award,
  BarChart3,
  Briefcase,
  Cpu,
  Home,
  Landmark,
  type LucideIcon,
} from 'lucide-react';
import type { PillarColor } from '@/lib/pillar';

export interface ServiceContentItem {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/** The three pillars that get a card beside the hero wheel (HOME_REDESIGN.md §4.3). */
export interface HeroCard {
  title: string;
  subtitle: string;
  chips: string[];
}

export interface Service {
  slug: string;
  /** "01"–"06", shown on the pillar cards. */
  number: string;
  /** Full name — navigation, footer and the consultation Subject list. */
  title: string;
  /** Compact name — wheel labels and the quick service bar. */
  shortTitle: string;
  /** Present only for the pillars with a card beside the hero wheel. */
  heroCard?: HeroCard;
  /** Page heading — DESIGN.md §6.4 table. */
  h1: string;
  /** One-liner shown in the header mega-menu and wheel tooltips. */
  navDescription: string;
  /** Two-line introduction under the sub-page H1. */
  intro: string;
  color: PillarColor;
  icon: LucideIcon;
  /** Four bullets on the home-page pillar card, joined with " · ". */
  bullets: string[];
  /** "What We Handle" — icon cards on the sub-page. */
  items: ServiceContentItem[];
  /** "Why RizSync for this" — three bullets tied to the ethics values. */
  whyRizsync: { value: string; text: string }[];
  faqs: Faq[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const services: Service[] = [
  {
    slug: 'finance-accounting',
    number: '01',
    title: 'Finance, Accounting & Business Support',
    shortTitle: 'Finance & Accounting',
    h1: 'Professional Finance, Accounting & Business Support',
    navDescription: 'Tax, VAT, treasury and reporting handled by qualified specialists.',
    intro:
      'Accurate books, compliant filings and clear numbers you can actually make decisions on. We run the finance function so you can run the business.',
    color: 'teal',
    icon: BarChart3,
    bullets: [
      'Tax & VAT Compliance',
      'Treasury Operations',
      'Cash Flow Management',
      'Financial Reporting & Advisory',
    ],
    items: [
      {
        title: 'Tax & VAT Compliance',
        description:
          'Monthly VAT returns, withholding schedules and annual income tax filings prepared, reconciled and submitted on time — with every supporting document retained.',
      },
      {
        title: 'Treasury Operations',
        description:
          'Day-to-day banking, payment runs, bank reconciliations and Bangladesh Bank correspondence, managed under clear approval limits you set.',
      },
      {
        title: 'Cash Flow Management',
        description:
          'Rolling 13-week cash forecasts, receivable follow-up and payable scheduling so you always know what is landing and when.',
      },
      {
        title: 'Financial Reporting & Advisory',
        description:
          'Monthly management accounts, variance commentary and year-end statements prepared to a standard your bank and auditor will accept.',
      },
      {
        title: 'Expert Documentation',
        description:
          'Vouchers, ledgers, schedules and audit files kept complete and indexed, so an inspection or due-diligence request is never a scramble.',
      },
    ],
    whyRizsync: [
      {
        value: 'Amanah',
        text: 'Your financial records are treated as a trust. Access is limited to the named specialists on your engagement and every file is held under NDA-level confidentiality.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'Fees are quoted before work begins and itemised on every invoice. No percentage-of-savings arrangements, no surprise line items.',
      },
      {
        value: 'Adl',
        text: 'We will tell you when a filing position is aggressive, even when a more aggressive position is what you asked for. Compliance first, always.',
      },
    ],
    faqs: [
      {
        question: 'Can you take over bookkeeping that is already behind?',
        answer:
          'Yes. We begin with a catch-up assessment covering the open periods, quantify the work and quote it separately from ongoing monthly support, so you can see exactly what the backlog costs before committing.',
      },
      {
        question: 'Which accounting software do you work with?',
        answer:
          'We work in Tally, QuickBooks, Xero, Zoho Books and most locally deployed ERP systems. If you have no system yet we will recommend one that matches your transaction volume rather than the most expensive option.',
      },
      {
        question: 'Do you handle VAT registration as well as returns?',
        answer:
          'We do. That includes BIN registration, VAT 6.3 and 6.1 record-keeping setup, and training one of your staff to maintain the daily registers correctly.',
      },
      {
        question: 'Will we still need an external auditor?',
        answer:
          'Yes, where an audit is statutorily required. We prepare the books and the audit file; the statutory audit itself must be performed by an independent firm. We coordinate with your auditor throughout.',
      },
    ],
    seo: {
      title: 'Professional Finance, Accounting & Business Support | RizSync',
      description:
        'Expert accounting services in Bangladesh: VAT and corporate tax compliance in Dhaka, treasury, cash flow and financial advisory from Mirpur specialists.',
      keywords: [
        'Accounting services Bangladesh',
        'Corporate tax Dhaka',
        'Financial advisory Mirpur',
        'VAT compliance Bangladesh',
      ],
    },
  },
  {
    slug: 'business-corporate',
    number: '02',
    title: 'Business & Corporate Services',
    shortTitle: 'Business & Corporate',
    heroCard: {
      title: 'Business & Corporate',
      subtitle: 'Trust (Amanah)-based support',
      chips: ['RJSC / Tax & VAT', 'Bangladesh Bank Filings', 'Corporate Docs', 'Compliance'],
    },
    h1: 'Strategic Business & Corporate Services',
    navDescription: 'RJSC, company formation, secretarial work and regulatory compliance.',
    intro:
      'From incorporation to annual returns, we keep your company legally sound and your statutory records current — without you queuing at a single counter.',
    color: 'orange',
    icon: Briefcase,
    bullets: [
      'RJSC Registration & Filings',
      'Corporate Documentation',
      'Compliance & Regulatory Services',
      'Company Secretarial',
    ],
    items: [
      {
        title: 'RJSC Registration & Filings',
        description:
          'Name clearance, memorandum and articles drafting, incorporation, share transfers, director changes and the annual return — filed correctly the first time.',
      },
      {
        title: 'Corporate Documentation & Support',
        description:
          'Board and shareholder resolutions, statutory registers, minute books and certified copies, drafted to match what the receiving authority actually asks for.',
      },
      {
        title: 'Compliance & Regulatory Services',
        description:
          'Trade licence, TIN and BIN registration and renewal, fire and environment clearances, and the compliance calendar that keeps every deadline visible.',
      },
      {
        title: 'Company Secretarial',
        description:
          'Ongoing secretarial retainer: meeting notices, agendas, minutes and filing deadlines managed so the board can focus on decisions rather than paperwork.',
      },
      {
        title: 'Bangladesh Bank Filings',
        description:
          'Foreign investment reporting, remittance and encashment documentation, and the supporting file the authorised dealer bank will want to see.',
      },
    ],
    whyRizsync: [
      {
        value: 'Amanah',
        text: 'Incorporation documents, share registers and director identity papers are among the most sensitive files a business owns. Ours never leave a controlled chain of custody.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'Government fees are passed through at cost with the original receipt attached. Our service fee is separate and stated up front.',
      },
      {
        value: 'Adl',
        text: 'We advise the structure that actually fits your business — not the one with the largest engagement attached to it.',
      },
    ],
    faqs: [
      {
        question: 'How long does a private limited company registration take?',
        answer:
          'Typically two to three weeks from receipt of complete documents: a few days for name clearance, then RJSC submission and certificate issuance. Delays almost always come from incomplete director documentation, which we check before filing.',
      },
      {
        question: 'Can a foreign national be a director or shareholder?',
        answer:
          'Yes. Foreign shareholding of up to 100% is permitted in most sectors. The additional requirements are passport-based documentation, an encashment certificate for inbound capital, and Bangladesh Bank reporting — all of which we handle.',
      },
      {
        question: 'What happens if our annual return is overdue?',
        answer:
          'RJSC applies escalating late fees and the company can be flagged as non-compliant, which affects bank facilities and tenders. We can file overdue returns retrospectively and quantify the penalty before you commit.',
      },
      {
        question: 'Do you also register partnerships and sole proprietorships?',
        answer:
          'We do, including partnership deed drafting and registration, and trade licence applications for proprietorships. We will also tell you plainly when a company structure would serve you better.',
      },
    ],
    seo: {
      title: 'Strategic Business & Corporate Services | RizSync',
      description:
        'Company formation in Bangladesh with expert RJSC assistance: registration, annual filings, documentation and corporate compliance services in Mirpur, Dhaka.',
      keywords: [
        'Company formation Bangladesh',
        'RJSC assistance',
        'Corporate compliance services',
        'Company registration Dhaka',
      ],
    },
  },
  {
    slug: 'government-assistance',
    number: '03',
    title: 'Government Service Assistance',
    shortTitle: 'Government Assistance',
    heroCard: {
      title: 'Government Assistance',
      subtitle: 'Ethical bureau-navigation',
      chips: ['BRTA', 'DNCC / City Corp', 'Passport & Renewal', 'Land Fees & Tax'],
    },
    h1: 'Efficient Government Service Assistance & Liaison',
    navDescription: 'BRTA, city corporation, passport and land matters, navigated ethically.',
    intro:
      'Public offices have rules, queues and paperwork. We know all three — and we work inside them, never around them.',
    color: 'teal',
    icon: Landmark,
    bullets: [
      'BRTA Services (Vehicle, License)',
      'DNCC & DSCC Matters',
      'Passport Application & Renewal',
      'Land Fee & Tax Payments',
    ],
    items: [
      {
        title: 'BRTA Services',
        description:
          'Driving licence issue and renewal, vehicle registration, ownership transfer, fitness and tax token renewal — with the document set checked before the appointment.',
      },
      {
        title: 'DNCC & DSCC Matters',
        description:
          'City corporation trade licence issue and renewal, holding tax assessment and payment, and signage or occupancy permissions.',
      },
      {
        title: 'Passport Application & Renewal',
        description:
          'E-passport applications, renewals and reissues: form preparation, fee payment, appointment booking and a checked document file before you attend.',
      },
      {
        title: 'Land Fee & Tax Payments',
        description:
          'Mutation (namjari) applications, land development tax payment, khatian and porcha collection, and registry office documentation support.',
      },
      {
        title: 'Certificate & Attestation Support',
        description:
          'Birth and death registration, certificate corrections and notarial attestation, prepared so the receiving office accepts the file on first submission.',
      },
    ],
    whyRizsync: [
      {
        value: 'Adl',
        text: 'We navigate the official process. We do not offer, arrange or facilitate unofficial payments of any kind, and we will decline work that only succeeds if we do.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'Every government fee is quoted at the published rate and receipted to you. What you pay us for is the preparation, the queuing and the follow-up — nothing else.',
      },
      {
        value: 'Amanah',
        text: 'Passports, NIDs and land documents are handed over under written acknowledgement and returned the same way.',
      },
    ],
    faqs: [
      {
        question: 'Do I have to attend in person for BRTA or passport services?',
        answer:
          'For biometric enrolment and the driving test, yes — those cannot be delegated. Everything around them (forms, fees, appointment booking, document verification, collection) we handle, so your one visit is short and successful.',
      },
      {
        question: 'How do you speed things up if you do not use unofficial channels?',
        answer:
          'By removing the two things that actually cause delay: incomplete files and missed steps. Most rejections are documentation errors. We check the file against the current requirement list before submission and follow up on schedule.',
      },
      {
        question: 'Can you handle a land mutation for property outside Dhaka?',
        answer:
          'In many districts, yes, though timelines vary by AC Land office. Tell us the district and mouza at the consultation and we will confirm coverage and a realistic timeline before quoting.',
      },
      {
        question: 'What if an application is rejected?',
        answer:
          'We obtain the written reason, correct the file and resubmit. Where the rejection was caused by our preparation error, the resubmission is at our cost.',
      },
    ],
    seo: {
      title: 'Efficient Government Service Assistance & Liaison | RizSync',
      description:
        'BRTA licence renewal in Dhaka, DNCC services, trade licence assistance and land mutation in Bangladesh — ethical government liaison from RizSync, Mirpur.',
      keywords: [
        'BRTA license renewal Dhaka',
        'DNCC services',
        'Land mutation Bangladesh',
        'Trade license assistance',
      ],
    },
  },
  {
    slug: 'digital-transformation',
    number: '04',
    title: 'Digital & Business Transformation',
    shortTitle: 'Digital Transformation',
    h1: 'Digital Transformation & Business Process Outsourcing (BPO)',
    navDescription: 'Automation, ERP support, cloud and AI, and a reliable back office.',
    intro:
      'Technology should remove work, not add a second system to maintain. We automate the repetitive parts of your operation and run what is left.',
    color: 'orange',
    icon: Cpu,
    bullets: [
      'Digital Process Automation',
      'ERP & Accounting System Support',
      'Cloud Services & AI Integration',
      'Back-Office Optimization',
    ],
    items: [
      {
        title: 'Digital Process Automation',
        description:
          'We map the process first, remove the steps that exist only out of habit, then automate what remains — approvals, reminders, reconciliations and reporting.',
      },
      {
        title: 'ERP & Accounting System Support',
        description:
          'Selection, implementation, chart-of-accounts design, data migration and staff training for Tally, Zoho, QuickBooks, Xero and mainstream ERP platforms.',
      },
      {
        title: 'Cloud Services & AI Integration',
        description:
          'Migration to managed cloud storage and email, secure document workflows, and practical AI assistance for document handling, drafting and customer response.',
      },
      {
        title: 'Back-Office Optimization',
        description:
          'Dedicated offshore-standard back-office support for data entry, invoice processing, reconciliation and customer administration, on your systems and your controls.',
      },
      {
        title: 'Tech Back-Office as a Service',
        description:
          'A named team, agreed service levels and monthly reporting — the capability of an in-house operations department without the fixed headcount.',
      },
    ],
    whyRizsync: [
      {
        value: 'Naf’ah',
        text: 'We recommend the smallest change that produces the benefit. If a spreadsheet and a clear process solve it, we will not sell you a platform.',
      },
      {
        value: 'Amanah',
        text: 'Your data stays yours. Credentials are held in a managed vault, access is role-based and revoked on staff change, and exports are available on request at any time.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'Licence costs, one-off implementation fees and the monthly retainer are quoted as three separate numbers, so you can see what is software and what is us.',
      },
    ],
    faqs: [
      {
        question: 'We already have software nobody uses. Can that be fixed?',
        answer:
          'Usually, yes — and more cheaply than replacing it. Low adoption is normally a configuration and training problem, not a product problem. We start with a two-week review before recommending any change of platform.',
      },
      {
        question: 'Is our data safe if the back office is outsourced?',
        answer:
          'Access is role-based and logged, staff sign individual confidentiality undertakings, and work is performed on your systems wherever possible so the data never leaves your control.',
      },
      {
        question: 'How quickly does automation pay for itself?',
        answer:
          'For document-heavy processes such as invoice handling and reconciliation, most clients see the implementation cost recovered within six to twelve months. We put that estimate in writing in the quote, with the assumptions shown.',
      },
      {
        question: 'Do you build custom software?',
        answer:
          'We integrate and configure established platforms, and build light custom tooling where no product fits. We will say clearly when a requirement needs a full development partner rather than us.',
      },
    ],
    seo: {
      title: 'Digital Transformation & Business Process Outsourcing (BPO) | RizSync',
      description:
        'BPO services in Dhaka and digital transformation in Bangladesh: process automation, cloud integration and accounting software support from RizSync, Mirpur.',
      keywords: [
        'BPO services Dhaka',
        'Digital transformation Bangladesh',
        'Cloud integration for business',
        'Accounting software support',
      ],
    },
  },
  {
    slug: 'family-welfare',
    number: '05',
    title: 'Family Welfare & Services',
    shortTitle: 'Family Welfare',
    h1: 'Holistic Family Welfare & Financial Planning',
    navDescription: 'Family financial planning, wealth advisory and long-term security.',
    intro:
      'The same discipline we bring to a balance sheet, applied to a household: what you own, what it must provide for, and how to protect it.',
    color: 'teal',
    icon: Home,
    bullets: [
      'Family Financial Planning',
      'Wealth Assessment & Advisory',
      'Education & Retirement Planning',
      'Long-Term Security Solutions',
    ],
    items: [
      {
        title: 'Family Financial Planning',
        description:
          'A clear picture of household income, commitments and savings, turned into a written plan with priorities you and your family have agreed on.',
      },
      {
        title: 'Wealth Assessment & Advisory',
        description:
          'Consolidation of assets across property, deposits, business interests and savings instruments, with an honest view of concentration and liquidity risk.',
      },
      {
        title: 'Education & Retirement Planning',
        description:
          'Costing education milestones and retirement income needs in today’s money, then working back to what must be set aside and when.',
      },
      {
        title: 'Long-Term Security Solutions',
        description:
          'Emergency reserves, protection cover and succession documentation, structured so a family is not left searching for papers at the worst possible time.',
      },
      {
        title: 'Family Documentation Support',
        description:
          'Wills, nominee records, property papers and the personal government services in our Government Assistance pillar, coordinated in one place.',
      },
    ],
    whyRizsync: [
      {
        value: 'Amanah',
        text: 'Family financial information is the most private thing a client shares with us. It is held by a named adviser, never pooled, and never used for anything but your plan.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'We are paid by you, in fees you agreed in advance. We take no commission from any product provider, so nothing we recommend earns us more than anything else.',
      },
      {
        value: 'Naf’ah',
        text: 'Plans are written to serve the family, including the members who are not in the room — spouses, children and dependent parents.',
      },
    ],
    faqs: [
      {
        question: 'Do you sell insurance or investment products?',
        answer:
          'No. We are fee-only advisers. We will help you evaluate a product and negotiate terms, but we receive nothing from any provider, which is what keeps the advice honest.',
      },
      {
        question: 'Can planning be structured on Shariah-compliant principles?',
        answer:
          'Yes, and for many clients this is the starting point. We can build plans that avoid interest-bearing instruments and work within Islamic finance structures available in Bangladesh, and we will be clear about where options are limited.',
      },
      {
        question: 'Is there a minimum level of wealth to work with you?',
        answer:
          'No. A first consultation and a written plan are useful at any level, and are often most valuable to families who are still building. Ongoing advisory retainers are sized to the work involved.',
      },
      {
        question: 'Will you work with our whole family?',
        answer:
          'We encourage it. Plans that only one family member understands tend to fail exactly when they are needed, so we prefer at least two adults in the review meetings.',
      },
    ],
    seo: {
      title: 'Holistic Family Welfare & Financial Planning | RizSync',
      description:
        'Personal financial planning in Dhaka and wealth advisory in Bangladesh: education, retirement and family security solutions from fee-only RizSync advisers.',
      keywords: [
        'Personal financial planning Dhaka',
        'Wealth advisory Bangladesh',
        'Family security solutions',
        'Islamic financial planning Bangladesh',
      ],
    },
  },
  {
    slug: 'why-rizsync',
    number: '06',
    title: 'Benefits & Value Proposition',
    shortTitle: 'Benefits & Value',
    heroCard: {
      title: 'Benefits & Value',
      subtitle: 'Just value delivery',
      chips: ['Time Savings', 'Economy Saving', 'Expert Documentation', 'Tech Back-Office'],
    },
    h1: 'Why Choose RizSync? Our Value Proposition',
    navDescription: 'What changes for you when one ethical partner holds it all.',
    intro:
      'Six specialisms, one relationship, one standard of conduct. Here is what that is actually worth to a business or a family.',
    color: 'gold',
    icon: Award,
    bullets: [
      'Significant Time Savings',
      'Expert Documentation',
      'Trusted Partner for Business & Family',
      'Integrated & Seamless Service',
    ],
    items: [
      {
        title: 'Significant Time Savings',
        description:
          'The hours a founder loses to queues, resubmissions and chasing status updates are the most expensive hours in the business. We absorb them.',
      },
      {
        title: 'Economy Saving',
        description:
          'One integrated retainer instead of separate accountant, agent and consultant fees — and far fewer penalties, because deadlines are tracked rather than remembered.',
      },
      {
        title: 'Expert Documentation',
        description:
          'Files prepared to the standard the receiving office, bank or auditor expects, which is the single biggest determinant of whether something is accepted first time.',
      },
      {
        title: 'Trusted Partner for Business & Family',
        description:
          'The same team that files your company return can help with a passport renewal or a family plan. You explain your situation once.',
      },
      {
        title: 'Integrated & Seamless Service',
        description:
          'One point of contact, one file, one set of standards across all six pillars — no handoffs where information gets lost.',
      },
      {
        title: 'Tech-Enabled Back Office',
        description:
          'Digital document handling and tracked workflows mean you can see where something stands without having to ask.',
      },
    ],
    whyRizsync: [
      {
        value: 'Adl',
        text: 'Just value delivery: what you are charged reflects the work performed, and we will tell you when a service you have asked for is not worth buying.',
      },
      {
        value: 'Amanah',
        text: 'One partner holding business and family matters means one place where confidentiality has to hold. We treat that as the core of the relationship.',
      },
      {
        value: 'Shaffafiyyah',
        text: 'Scope, fee and timeline are agreed in writing before work begins, and changes to any of the three are agreed the same way.',
      },
    ],
    faqs: [
      {
        question: 'What makes RizSync different from a regular consultancy?',
        answer:
          'Two things: the range — finance, corporate, government, digital and family matters under one roof — and the conduct standard behind it. We operate on a stated ethical framework and decline work that requires us to depart from it.',
      },
      {
        question: 'Do I have to use all six pillars?',
        answer:
          'Not at all. Most clients start with one pressing problem. The integration matters when the second need appears, because we already know your situation.',
      },
      {
        question: 'How is pricing structured?',
        answer:
          'One-off work is quoted as a fixed fee after a free consultation. Ongoing support is a monthly retainer sized to scope. Government fees are always passed through at cost with receipts.',
      },
      {
        question: 'What does the first consultation involve?',
        answer:
          'A conversation of about forty-five minutes, at no cost and with no obligation, to understand the situation. You leave it with our honest view of what needs doing — including when the answer is that you do not need us.',
      },
    ],
    seo: {
      title: 'Why Choose RizSync? Our Value Proposition | RizSync',
      description:
        'A professional services platform in Dhaka built on ethics: real time savings, expert documentation and one trusted business partner in Bangladesh, Mirpur.',
      keywords: [
        'Professional services platform Dhaka',
        'Trusted business partner Bangladesh',
        'Integrated business services Dhaka',
      ],
    },
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug);

/** Subject options for the consultation form (§7). */
export const subjectOptions = [
  ...services.map((service) => ({ value: service.slug, label: service.title })),
  { value: 'other', label: 'Other' },
];
