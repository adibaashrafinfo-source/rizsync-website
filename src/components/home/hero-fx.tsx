'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { services } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/**
 * Ambient depth layer for the hero — three kinds of motion stacked so the
 * section reads as a lit, layered space rather than a flat photo:
 *
 *  1. Two large, very soft gradient "orbs" that drift slowly (pure CSS-driven
 *     via Framer keyframes) — the light source the rest sits inside.
 *  2. A handful of glassmorphic cards, one per pillar, each floating on its
 *     own gentle loop and nudged by cursor position (desktop only) so nearer
 *     ones move more than distant ones — the cheapest approximation of
 *     parallax depth without a 3D engine.
 *  3. A light scatter of static-but-twinkling points for texture.
 *
 * Everything here is `aria-hidden` and `pointer-events-none`: it never
 * competes with the wheel or the CTAs for input, and screen readers skip it
 * entirely. `prefers-reduced-motion` collapses all of it to a static, still
 * layout — no loops, no parallax.
 */

interface FloatingIcon {
  slug: string;
  top: string;
  left: string;
  size: number;
  depth: number; // 0–1, how strongly this card reacts to cursor parallax
  duration: number; // seconds per float loop
  delay: number;
  hiddenOnMobile?: boolean;
}

const FLOATING: FloatingIcon[] = [
  { slug: 'finance-accounting', top: '9%', left: '5%', size: 46, depth: 0.4, duration: 9, delay: 0, hiddenOnMobile: true },
  { slug: 'digital-transformation', top: '6%', left: '47%', size: 38, depth: 0.3, duration: 8, delay: 1.8, hiddenOnMobile: true },
  { slug: 'business-corporate', top: '16%', left: '87%', size: 54, depth: 0.85, duration: 11, delay: 1.1, hiddenOnMobile: true },
  { slug: 'why-rizsync', top: '40%', left: '2.5%', size: 32, depth: 0.25, duration: 9.5, delay: 0.5, hiddenOnMobile: true },
  { slug: 'government-assistance', top: '78%', left: '96%', size: 42, depth: 0.6, duration: 10, delay: 2.3, hiddenOnMobile: true },
  { slug: 'family-welfare', top: '87%', left: '38%', size: 44, depth: 0.55, duration: 12, delay: 1.4, hiddenOnMobile: true },
];

/** Small fixed scatter — twinkling points for texture, no motion cost to speak of. */
const SPARKLES = [
  { top: '14%', left: '30%', delay: 0 },
  { top: '24%', left: '64%', delay: 0.8 },
  { top: '52%', left: '9%', delay: 1.6 },
  { top: '61%', left: '79%', delay: 0.4 },
  { top: '33%', left: '93%', delay: 2.1 },
  { top: '70%', left: '52%', delay: 1.2 },
  { top: '11%', left: '78%', delay: 2.6 },
  { top: '90%', left: '18%', delay: 0.9 },
];

function FloatingCard({ item, parallaxX, parallaxY }: {
  item: FloatingIcon;
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  const service = services.find((candidate) => candidate.slug === item.slug);
  if (!service) return null;

  const Icon = service.icon;
  const theme = pillarTheme[service.color];

  const x = useTransform(parallaxX, (value) => value * item.depth);
  const y = useTransform(parallaxY, (value) => value * item.depth);

  return (
    <motion.div
      aria-hidden
      className={cn(
        'absolute',
        item.hiddenOnMobile && 'hidden lg:block',
      )}
      style={{ top: item.top, left: item.left, x, y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -16, 0],
        rotate: [0, item.depth > 0.5 ? 3 : -2.5, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: item.delay * 0.3 },
        scale: { duration: 0.8, delay: item.delay * 0.3 },
        y: {
          duration: item.duration,
          delay: item.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: item.duration * 1.15,
          delay: item.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div
        className="flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
        style={{
          width: item.size,
          height: item.size,
          boxShadow: `0 8px 28px -6px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 24px -4px ${theme.hex}55`,
        }}
      >
        <Icon
          aria-hidden
          style={{ width: item.size * 0.46, height: item.size * 0.46 }}
          className={theme.icon}
          strokeWidth={1.5}
        />
      </div>
    </motion.div>
  );
}

export function HeroFX() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw pointer position → smoothed spring, small range so it reads as a
  // subtle tilt rather than the layer chasing the cursor.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const parallaxX = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.6 });
  const parallaxY = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion) return;
    const node = containerRef.current;
    if (!node || !window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      rawX.set(relX * 28);
      rawY.set(relY * 20);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduceMotion, rawX, rawY]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Ambient light — two large soft blobs drifting on independent loops. */}
      <motion.div
        aria-hidden
        className="absolute -top-[10%] left-[8%] h-[46vw] w-[46vw] max-h-[560px] max-w-[560px] rounded-full opacity-[0.22] blur-[90px]"
        style={{ background: 'radial-gradient(circle, #C9A24D 0%, transparent 70%)' }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 40, -20, 0], y: [0, 30, -10, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[20%] right-[2%] h-[38vw] w-[38vw] max-h-[480px] max-w-[480px] rounded-full opacity-[0.20] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #0FA3A3 0%, transparent 72%)' }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -30, 20, 0], y: [0, -24, 16, 0] }
        }
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating pillar cards — the "3D" layer. */}
      {!reduceMotion &&
        FLOATING.map((item) => (
          <FloatingCard key={item.slug} item={item} parallaxX={parallaxX} parallaxY={parallaxY} />
        ))}

      {/* Twinkling texture. */}
      {!reduceMotion &&
        SPARKLES.map((s, index) => (
          <motion.span
            key={`${s.top}-${s.left}`}
            aria-hidden
            className="absolute hidden h-1 w-1 rounded-full bg-gold-500 md:block"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0.15, 0.9, 0.15] }}
            transition={{
              duration: 3.2 + (index % 3) * 0.6,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
}
