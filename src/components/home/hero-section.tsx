import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Segments } from '@/components/ui/segments';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { MottoChips } from '@/components/home/motto-chips';
import { HeroServiceHub } from '@/components/home/hero-service-hub';
import { hero } from '@/data/home';
import { siteConfig } from '@/config/site';

/** Placeholder avatars for the social-proof row — TODO(client) real photos. */
const avatars = ['bg-teal', 'bg-orange', 'bg-gold'];

/** Decorative background — HOME_REDESIGN.md §4.2 layers 1–3. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 0 — photo: the artwork is dark on its left, so the copy sits there.
          Overlays keep text contrast AA and stop it competing with the wheel. */}
      <Image
        src={siteConfig.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] opacity-50 xl:object-right xl:opacity-70"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--navy)_0%,var(--navy)_38%,rgb(0_32_74/0.55)_68%,rgb(0_32_74/0.3)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />

      {/* 1 — 48px grid, white at 4.5% */}
      <div className="pattern-grid absolute inset-0" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        {/* 2 — glow circles: teal behind the wheel, orange bottom-right */}
        <circle cx="1010" cy="400" r="420" fill="#0FA3A3" fillOpacity="0.07" />
        <circle cx="1380" cy="760" r="260" fill="#F28C28" fillOpacity="0.06" />

        {/* 3 — circuit lines, bottom-left */}
        <g fill="none" strokeWidth="1.5" strokeLinejoin="round">
          <polyline
            points="0,772 140,772 176,752 330,752 360,730"
            stroke="#0FA3A3"
            strokeOpacity="0.35"
          />
          <polyline
            points="0,800 96,800 122,818 300,818 330,796 430,796"
            stroke="#F28C28"
            strokeOpacity="0.3"
          />
        </g>
        <circle cx="360" cy="730" r="4" fill="#0FA3A3" fillOpacity="0.6" />
        <circle cx="430" cy="796" r="4" fill="#F28C28" fillOpacity="0.55" />
      </svg>
    </div>
  );
}

/** Home hero — HOME_REDESIGN.md §4.2. The page's only H1 lives here. */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-navy pt-12 pb-[120px] md:pt-16 xl:min-h-[820px] xl:pt-[72px] xl:pb-[152px]"
    >
      <HeroBackdrop />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:gap-14 xl:grid-cols-[580px_1fr] xl:gap-0">
          {/* Left column */}
          <div className="flex min-w-0 flex-col items-start lg:max-w-[640px] xl:pr-10">
            <p className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-on-navy-muted">
              <span className="rounded-full bg-teal px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-navy uppercase">
                {hero.badge.pill}
              </span>
              <span className="truncate">{hero.badge.text}</span>
            </p>

            <h1
              id="hero-heading"
              className="mt-7 font-display text-[40px] leading-[1.04] font-bold tracking-[-0.035em] text-white sm:text-[52px] md:text-[60px] xl:text-display"
            >
              <Segments segments={hero.title} onDark />
            </h1>

            <p className="mt-6 text-[17px] leading-[1.6] text-on-navy-muted md:text-lead">
              {hero.lead}
            </p>

            <div className="mt-8">
              <MottoChips />
            </div>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#consultation">
                  {hero.primaryCta}
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <a
                  href={siteConfig.contact.whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  {hero.whatsappCta}
                </a>
              </Button>
            </div>

            <div className="mt-9 flex items-center gap-4">
              <div aria-hidden className="flex -space-x-3">
                {avatars.map((tone) => (
                  <span
                    key={tone}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-navy ${tone}`}
                  >
                    <User className="h-5 w-5" strokeWidth={2} />
                  </span>
                ))}
              </div>
              <p className="text-sm leading-snug text-on-navy-soft">{hero.socialProof}</p>
            </div>
          </div>

          {/* Right column — the interactive hub */}
          <div className="min-w-0">
            <HeroServiceHub />
          </div>
        </div>
      </Container>
    </section>
  );
}
