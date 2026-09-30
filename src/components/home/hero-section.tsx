import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Segments } from '@/components/ui/segments';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { MottoChips } from '@/components/home/motto-chips';
import { HeroServiceHub } from '@/components/home/hero-service-hub';
import { getHomeContent, getSiteConfig } from '@/lib/cms/queries';

/** Placeholder avatars for the social-proof row — TODO(client) real photos. */
const avatars = ['bg-teal', 'bg-orange', 'bg-gold'];

/** Rising light particles — fixed positions so server and client markup match. */
const particles = [
  { left: '6%', bottom: '8%', size: 3, d: 14, delay: 0, dx: 18, o: 0.55, c: 'bg-teal' },
  { left: '14%', bottom: '22%', size: 2, d: 11, delay: 3, dx: -12, o: 0.45, c: 'bg-gold' },
  { left: '23%', bottom: '4%', size: 2, d: 16, delay: 6, dx: 10, o: 0.4, c: 'bg-white' },
  { left: '34%', bottom: '14%', size: 3, d: 13, delay: 1.5, dx: -16, o: 0.5, c: 'bg-orange' },
  { left: '47%', bottom: '6%', size: 2, d: 15, delay: 8, dx: 14, o: 0.4, c: 'bg-teal' },
  { left: '56%', bottom: '30%', size: 2, d: 12, delay: 4.5, dx: -8, o: 0.45, c: 'bg-white' },
  { left: '64%', bottom: '10%', size: 3, d: 17, delay: 2, dx: 20, o: 0.5, c: 'bg-gold' },
  { left: '73%', bottom: '24%', size: 2, d: 13, delay: 9, dx: -14, o: 0.4, c: 'bg-teal' },
  { left: '82%', bottom: '8%', size: 3, d: 15, delay: 5, dx: 12, o: 0.5, c: 'bg-orange' },
  { left: '91%', bottom: '18%', size: 2, d: 11, delay: 7, dx: -10, o: 0.45, c: 'bg-white' },
];

/**
 * Decorative background — HOME_REDESIGN.md §4.2, with ambient motion:
 * a slow Ken Burns drift on the photo, two aurora glows, a panning grid, a
 * light sweep, rising particles, an orbiting ring and pulses along the
 * circuit lines. Everything animates transform/opacity only, and the global
 * reduced-motion rule freezes it all.
 */
function HeroBackdrop({ image }: { image: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 0 — photo: the artwork is dark on its left, so the copy sits there. */}
      <div className="animate-kenburns absolute inset-0 will-change-transform">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-50 xl:object-right xl:opacity-70"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--navy)_0%,var(--navy)_38%,rgb(0_32_74/0.55)_68%,rgb(0_32_74/0.3)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />

      {/* 1 — aurora glows */}
      <div className="animate-aurora-a absolute top-[-20%] right-[8%] h-[70%] w-[48%] rounded-full bg-[radial-gradient(closest-side,rgb(15_163_163/0.28),transparent)] blur-2xl will-change-transform" />
      <div className="animate-aurora-b absolute right-[-10%] bottom-[-25%] h-[65%] w-[42%] rounded-full bg-[radial-gradient(closest-side,rgb(242_140_40/0.2),transparent)] blur-2xl will-change-transform" />
      <div className="animate-aurora-b absolute top-[10%] left-[-12%] h-[55%] w-[36%] rounded-full bg-[radial-gradient(closest-side,rgb(201_162_77/0.12),transparent)] blur-2xl will-change-transform [animation-delay:-8s]" />

      {/* 2 — 48px grid, slowly panning, faded towards the edges */}
      <div className="pattern-grid animate-grid-pan absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_45%,black_35%,transparent_80%)]" />

      {/* 3 — light sweep across the whole hero */}
      <div className="animate-sweep absolute inset-y-0 left-0 w-[35%] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.06),transparent)]" />

      {/* 4 — rising particles */}
      {particles.map((p, index) => (
        <span
          key={index}
          className={`animate-rise absolute rounded-full ${p.c} shadow-[0_0_8px_currentColor]`}
          style={
            {
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              '--rz-d': `${p.d}s`,
              '--rz-delay': `-${p.delay}s`,
              '--rz-dx': `${p.dx}px`,
              '--rz-o': p.o,
            } as React.CSSProperties
          }
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        {/* 5 — orbit rings behind the wheel */}
        <g className="animate-orbit">
          <circle cx="1010" cy="400" r="330" fill="none" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="2 10" />
          <circle cx="1010" cy="70" r="4" fill="#C9A24D" fillOpacity="0.8" />
          <circle cx="1340" cy="400" r="3" fill="#0FA3A3" fillOpacity="0.8" />
        </g>
        <circle cx="1010" cy="400" r="420" fill="none" stroke="#0FA3A3" strokeOpacity="0.06" strokeWidth="1" />

        {/* 6 — circuit lines, bottom-left, with travelling light pulses */}
        <g fill="none" strokeWidth="1.5" strokeLinejoin="round">
          <polyline points="0,772 140,772 176,752 330,752 360,730" stroke="#0FA3A3" strokeOpacity="0.35" />
          <polyline points="0,800 96,800 122,818 300,818 330,796 430,796" stroke="#F28C28" strokeOpacity="0.3" />
          <polyline
            points="0,772 140,772 176,752 330,752 360,730"
            stroke="#5EEAD4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="28 972"
            className="animate-travel"
          />
          <polyline
            points="0,800 96,800 122,818 300,818 330,796 430,796"
            stroke="#FDBA74"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="24 976"
            className="animate-travel [animation-delay:-3.5s]"
          />
        </g>
        <circle cx="360" cy="730" r="4" fill="#0FA3A3" fillOpacity="0.6" />
        <circle cx="430" cy="796" r="4" fill="#F28C28" fillOpacity="0.55" />
      </svg>
    </div>
  );
}

/** Home hero — HOME_REDESIGN.md §4.2. The page's only H1 lives here. */
export async function HeroSection() {
  const [{ hero }, siteConfig] = await Promise.all([getHomeContent(), getSiteConfig()]);
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-navy pt-12 pb-[120px] md:pt-16 xl:min-h-[820px] xl:pt-[72px] xl:pb-[152px]"
    >
      <HeroBackdrop image={siteConfig.heroImage} />

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
              <MottoChips motto={hero.motto} />
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
