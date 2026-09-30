import type { CeoContent } from '@/lib/cms/types';

/** CEO profile — from the CV supplied by the client. Editable in the admin panel. */
export const defaultCeo: CeoContent = {
  hero: {
    eyebrow: 'Leadership',
    title: 'CEO Profile',
    description:
      'Meet the finance leader behind RizSync — 25+ years across treasury, collections, tax and business transformation.',
  },
  name: 'Mohammed Mohsunud Dayan',
  credentials: 'MBA (NSU)',
  role: 'Chief Financial Officer (CFO) & Managing Director, RizSync',
  headline: 'Strategic Finance Leader | CFO | Treasury & Business Transformation Expert',
  photo: '/images/ceo/mohsunud-dayan.webp',
  photoAlt: 'Mohammed Mohsunud Dayan, CFO & Managing Director of RizSync',
  summary:
    'Visionary CFO and finance-treasury executive with 25+ years of experience leading financial operations across large corporates and high-growth startups. Proven expertise in capital structuring, treasury optimisation and financial transformation, with a track record of securing BDT 2.9B+ in institutional financing, enhancing liquidity and driving operational efficiency through technology (RPA, Power BI).\n\nRecognised for transforming treasury and collection functions at leading organisations and delivering data-driven financial strategies that support sustainable growth, governance and stakeholder value creation.',
  location: 'Dhaka 1218, Bangladesh',
  email: '',
  highlights: [
    { value: '25+', label: 'Years in finance & treasury' },
    { value: 'BDT 2.9B+', label: 'Institutional financing secured' },
    { value: 'USD 500M+', label: 'Annual collections managed' },
    { value: '6+', label: 'ERP implementations led' },
  ],
  experienceSection: { eyebrow: 'Career', title: 'Professional experience' },
  experience: [
    {
      role: 'Chief Financial Officer (CFO) & Managing Director',
      company: 'RizSync — Dhaka, Bangladesh',
      period: '07/2025 – Present',
      summary:
        'Driving multi-million-dollar growth in the Bangladesh market, spearheading digital transformation initiatives that increased annual revenue by 50% while reducing operational overhead by 20%.',
      points: [
        'Fosters high-performance cultures that prioritise innovation and stakeholder value, integrating food safety, a green environment and zero-poverty initiatives into core operations.',
        'Developed successful strategies and policies, meeting organisational needs and implementing improvements.',
        'Spearheaded strategic planning and implementation to drive company growth and profitability.',
        'Monitors operations to keep processes aligned with targets and forecasts.',
        'Built a business culture focused on performance optimisation and goal attainment.',
      ],
    },
    {
      role: 'Group Head of Treasury, Deputy Director',
      company: 'Shopfront Ltd (ShopUp)',
      period: '10/2021 – Present',
      summary:
        "Manages treasury operations for Bangladesh's largest B2B commerce platform (USD 1.5B GMV).",
      points: [
        'Negotiated BDT 2.9B credit lines at 1.5% below market rates, enhancing liquidity by 30%.',
        'Automated 80% of cash management processes.',
        'Managed USD 500M+ annual collections across 450+ distribution centres.',
        'Reduced delinquency rates from 5.2% to 0.8% through predictive analytics.',
        'Leads group-wide treasury operations, cash-flow strategy and funding for growth.',
        'Oversees tax computations for individuals and the company; manages RJSC, Bangladesh Bank and work-permit processes.',
      ],
    },
    {
      role: 'Head of Channel Collection & Receivable Operations',
      company: 'Grameenphone Ltd. (Telenor)',
      period: '04/2016 – 09/2021',
      summary: 'Oversaw prepaid collection operations to ensure timely revenue collection.',
      points: [
        'Developed and implemented strategies to improve collection efficiency and monitored performance metrics.',
        'Oversaw cash management solutions for payables and receivables with financial institutions.',
        'Structured, calculated and managed collections for distributors and retailers.',
        'Managed petty cash and collection/payment functions for 45 Grameenphone Distribution Centres (GPDCs), including operational audits.',
      ],
    },
    {
      role: 'Senior Executive',
      company: 'The Team Work Ltd',
      period: '01/2004 – 01/2005',
      summary: 'Collaborated with team members to achieve target results.',
      points: [
        'Managed complaints with calm, clear communication and problem-solving.',
        'Achieved service time and quality targets.',
      ],
    },
  ],
  achievements: [
    {
      title: 'Capital raising',
      text: 'Structured and secured BDT 2,928 million in debt facilities from BRAC Bank, City Bank, EBL, Meghna, IPDC and IDLC.',
      period: '2022 – 2024',
    },
    {
      title: 'Digital transformation',
      text: 'Led 6+ ERP implementations (Fusion, BPRS, DMS/RMS), reducing financial close time by 40%.',
      period: '',
    },
    {
      title: 'Process innovation',
      text: "Pioneered Bangladesh's first Touch-Free & Cashless Distribution system at Grameenphone.",
      period: '2019',
    },
  ],
  skills: [
    'Strategic planning',
    'Financial modelling',
    'Treasury & liquidity',
    'RPA expert',
    'Power BI expert',
    'Market analysis',
    'Stakeholder engagement',
    'New business generation',
    'Strong networking',
    'Inclusive leadership',
    'Process control',
    'Collaboration',
  ],
  certifications: [
    'CA Course (2001 – 2004)',
    'Foundation Examination — Passed (2nd Batch), 2000',
    'Partial Level 1',
  ],
  education: [
    { degree: 'MBA, Finance', institution: 'North South University, Dhaka' },
    { degree: 'MCom, Management', institution: 'Jagannath University, Dhaka' },
    { degree: 'BCom, Commerce', institution: 'National University, Dhaka' },
  ],
  expertiseSection: {
    eyebrow: 'What we deliver',
    title: 'Expertise Behind {orange:Every Solution}',
    body: 'Tax, VAT, compliance, accounting and finance services — led personally by our CFO & Managing Director.',
  },
  expertise: [
    { title: 'Tax Return Submission (Personal)', note: '', icon: 'Receipt', color: 'green' },
    { title: 'Tax Return Submission (Corporate)', note: '', icon: 'Building2', color: 'blue' },
    { title: 'Quarterly Withholding Tax Return', note: '', icon: 'Percent', color: 'orange' },
    { title: 'Monthly VAT Return Submission', note: '', icon: 'FileCheck', color: 'purple' },
    { title: 'Annual Return Submission to RJSC', note: '', icon: 'FileText', color: 'teal' },
    { title: 'Company Formation Process', note: '', icon: 'Users', color: 'green' },
    { title: 'Internal Audit Service', note: '', icon: 'Search', color: 'blue' },
    { title: 'Monthly Accounting Services', note: '', icon: 'Calculator', color: 'orange' },
    { title: 'Financial Reporting', note: '', icon: 'BarChart3', color: 'purple' },
    { title: 'Budgeting & Forecasting', note: '', icon: 'LineChart', color: 'teal' },
    { title: 'Accounting Software Service', note: '', icon: 'Monitor', color: 'blue' },
    { title: 'Yearly Audit Report Process (DVC)', note: '', icon: 'FolderCheck', color: 'orange' },
    { title: 'Finance Arrangement', note: '', icon: 'HandCoins', color: 'purple' },
    { title: 'IPO Process', note: '', icon: 'TrendingUp', color: 'green' },
    {
      title: 'License Renewal & Processing',
      note: 'IRC, ERC, BIDA, Trade License etc.',
      icon: 'ClipboardCheck',
      color: 'blue',
    },
  ],
  cta: {
    title: 'Talk to our CFO about your business',
    description: 'Book a confidential consultation on tax, VAT, audit, financing or finance transformation.',
  },
};
