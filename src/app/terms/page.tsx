import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/sections/legal-page';
import { siteConfig } from '@/config/site';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Terms', href: '/terms' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use | RizSync',
  description:
    'The terms on which RizSync Service Solution makes this website available, and the basis on which engagements are agreed.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="The basis on which this website and our services are provided."
      crumbs={crumbs}
      updated="TODO(client) — set on approval"
    >
      <h2>About these terms</h2>
      <p>
        These terms govern your use of this website, operated by {siteConfig.name} of{' '}
        {siteConfig.offices.corporate.full}. By using the site you accept them.
      </p>

      <h2>Information on this site is general</h2>
      <p>
        Everything published here — including the articles in our Insights section — is general
        information about regulatory and business practice in Bangladesh. It is not advice on
        your specific circumstances, rules change, and you should not act on it without
        confirming the current position. Nothing on this site creates a client relationship.
      </p>

      <h2>Engagements</h2>
      <p>
        We act only under a written scope that sets out the work, the fee and the timeline, and
        that you have accepted. Government fees are passed through at the published rate with
        receipts. An enquiry through this website is a request for a consultation, not an
        engagement.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>
          To give us accurate and complete information and documents. Much of what we do
          depends on documentation we cannot independently verify.
        </li>
        <li>To tell us promptly when circumstances change during an engagement.</li>
        <li>To use this site lawfully, and not to attempt to disrupt or misuse it.</li>
      </ul>

      <h2>What we will not do</h2>
      <p>
        We do not offer, arrange or facilitate unofficial payments to any official or
        institution, and we will decline or discontinue work that can only be completed that
        way.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content, design and marks on this site belong to {siteConfig.name} unless stated
        otherwise. You may read, print and share it for your own non-commercial use with
        attribution.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for loss arising from
        reliance on the general information published on this site. Liability arising from an
        engagement is governed by the engagement letter for that work.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the People&rsquo;s Republic of Bangladesh, and
        the courts of Dhaka have exclusive jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{' '}
        {siteConfig.contact.phoneDisplay}.
      </p>
    </LegalPage>
  );
}
