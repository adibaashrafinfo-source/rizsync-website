import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/sections/legal-page';
import { siteConfig } from '@/config/site';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy | RizSync',
  description:
    'How RizSync Service Solution collects, uses and protects the personal information you share through this website and during an engagement.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use and protect your information."
      crumbs={crumbs}
      updated="TODO(client) — set on approval"
    >
      <h2>Who we are</h2>
      <p>
        {siteConfig.name}, {siteConfig.offices.corporate.full}, is the controller of the
        personal information described in this policy. You can reach us at{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{' '}
        {siteConfig.contact.phoneDisplay}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Information you give us.</strong> Your name, company or family name, email
          address, phone number, client type, chosen subject and the content of your message
          when you submit the consultation form.
        </li>
        <li>
          <strong>Engagement information.</strong> Documents and details you provide during a
          service engagement, which are handled under the confidentiality commitment described
          on our About page.
        </li>
        <li>
          <strong>Technical information.</strong> Standard web analytics collected through
          Google Analytics 4 (via Google Tag Manager), and the IP address attached to a form
          submission, which we use to rate-limit abuse.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and provide the services you ask for.</li>
        <li>To meet our legal, regulatory and record-keeping obligations.</li>
        <li>To protect the website from automated abuse.</li>
        <li>To understand, in aggregate, how the website is used and improve it.</li>
      </ul>

      <h2>Anti-spam</h2>
      <p>
        Form submissions are protected by Cloudflare Turnstile. Turnstile processes limited
        technical data to confirm that a submission is made by a person rather than a bot.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell your information. We share it only with service providers who help us
        operate the site and communicate with you — currently our email delivery provider and
        our analytics provider — and with government authorities where you have engaged us to
        act on your behalf, or where the law requires it.
      </p>

      <h2>Retention</h2>
      <p>
        Enquiry records are kept only as long as needed to respond and to meet our record
        keeping obligations. Engagement files are retained for the period required by
        applicable law and professional practice.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us for a copy of the information we hold about you, ask us to correct it,
        or ask us to delete it where we are not required to keep it. Write to{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        This site uses cookies set by Google Analytics through Google Tag Manager, and, where
        enabled, the Meta Pixel. You can block cookies through your browser settings; the site
        will continue to work.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes we will update this page and the &ldquo;last updated&rdquo; date
        above.
      </p>
    </LegalPage>
  );
}
