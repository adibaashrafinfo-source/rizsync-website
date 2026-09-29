'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import {
  ARC_OUTER_RADIUS,
  ServiceWheel,
  WHEEL_ARCS,
  WHEEL_CENTER,
  wheelPoint,
} from '@/components/home/service-wheel';
import { HeroServiceCard } from '@/components/home/hero-service-cards';
import { services, serviceBySlug } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

const DEFAULT_ACTIVE = 'business-corporate';
const CYCLE_MS = 4000;
/** Cycle order: clockwise from the default, so the first step is a neighbour. */
const CYCLE = (() => {
  const start = WHEEL_ARCS.findIndex((arc) => arc.slug === DEFAULT_ACTIVE);
  return [...WHEEL_ARCS.slice(start), ...WHEEL_ARCS.slice(0, start)].map((arc) => arc.slug);
})();

const cardServices = services.filter((service) => service.heroCard);

interface Point {
  x: number;
  y: number;
}

interface Overlay {
  width: number;
  height: number;
  connector: string | null;
  tooltip: { x: number; y: number; side: 'above' | 'below' } | null;
}

/**
 * Wheel + the three hero cards + the connector between them, sharing one
 * `activeId` — HOME_REDESIGN.md §4.3.
 *
 * The connector is measured from the DOM rather than precomputed: the wheel
 * and the cards are laid out by CSS, so the only reliable way to join an arc
 * to a card is to ask both where they ended up. It is recomputed on resize
 * and whenever the active pillar changes.
 */
export function HeroServiceHub() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(DEFAULT_ACTIVE);
  const [interacted, setInteracted] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());

  const activate = useCallback((slug: string) => {
    setActiveId(slug);
  }, []);

  // Stop the idle cycle permanently on the first real interaction.
  const markInteracted = useCallback(() => setInteracted(true), []);

  // Idle auto-cycle every 4s until the visitor touches the hub.
  useEffect(() => {
    if (reduceMotion || interacted) return;
    const timer = window.setInterval(() => {
      setActiveId((current) => CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion, interacted]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const svg = wheelRef.current;
    // Connector and tooltips only exist in the side-by-side layout (≥1024px).
    if (!container || !svg || !window.matchMedia('(min-width: 1024px)').matches) {
      setOverlay(null);
      return;
    }

    const box = container.getBoundingClientRect();
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const toPx = (point: Point): Point => {
      const p = svg.createSVGPoint();
      p.x = point.x;
      p.y = point.y;
      const screen = p.matrixTransform(ctm);
      return { x: screen.x - box.left, y: screen.y - box.top };
    };

    const arc = WHEEL_ARCS.find((candidate) => candidate.slug === activeId);
    if (!arc) return;

    const start = toPx(wheelPoint(arc.angle, ARC_OUTER_RADIUS));
    const centre = toPx(WHEEL_CENTER);
    const card = cardRefs.current.get(activeId);

    let connector: string | null = null;
    let tooltip: Overlay['tooltip'] = null;

    if (card) {
      const rect = card.getBoundingClientRect();
      const end = { x: rect.left - box.left, y: rect.top - box.top + rect.height / 2 };
      // Leave the arc radially, arrive at the card horizontally.
      const dx = start.x - centre.x;
      const dy = start.y - centre.y;
      const len = Math.hypot(dx, dy) || 1;
      const reach = Math.max(60, Math.abs(end.x - start.x) * 0.45);
      const c1 = { x: start.x + (dx / len) * reach, y: start.y + (dy / len) * reach };
      const c2 = { x: end.x - reach, y: end.y };
      connector = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
    } else {
      // Above arcs in the upper half, below the rest, so the tooltip never
      // sits over the hero cards or the arc being pointed at.
      const side = start.y < centre.y - 10 ? 'above' : 'below';
      tooltip = { x: start.x, y: start.y, side };
    }

    setOverlay({ width: box.width, height: box.height, connector, tooltip });
  }, [activeId]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    window.addEventListener('resize', measure);
    // Web fonts change card heights once they load.
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const activeService = serviceBySlug(activeId);
  const activeTheme = activeService ? pillarTheme[activeService.color] : null;

  return (
    <div
      ref={containerRef}
      onPointerEnter={markInteracted}
      onFocusCapture={markInteracted}
      className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-4"
    >
      {/* Connector — drawn under the cards. */}
      {overlay && overlay.connector && activeTheme ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          width={overlay.width}
          height={overlay.height}
          viewBox={`0 0 ${overlay.width} ${overlay.height}`}
        >
          <path
            key={activeId}
            d={overlay.connector}
            fill="none"
            stroke={activeTheme.hex}
            strokeWidth={2}
            strokeDasharray="6 6"
            strokeLinecap="round"
            className={reduceMotion ? undefined : 'animate-dash'}
          />
          <circle
            cx={Number(overlay.connector.split(' ')[1])}
            cy={Number(overlay.connector.split(' ')[2])}
            r={4}
            fill={activeTheme.hex}
          />
        </svg>
      ) : null}

      <div className="relative z-10 w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[380px] lg:flex-1 xl:max-w-[400px]">
        <ServiceWheel
          ref={wheelRef}
          activeId={activeId}
          onActivate={activate}
          className="h-auto w-full overflow-visible"
        />
      </div>

      <ul className="relative z-10 flex w-full flex-col gap-3.5 lg:w-[280px] lg:shrink-0 xl:w-[320px]">
        {cardServices.map((service) => (
          <li key={service.slug}>
            <HeroServiceCard
              ref={(node) => {
                if (node) cardRefs.current.set(service.slug, node);
                else cardRefs.current.delete(service.slug);
              }}
              service={service}
              active={activeId === service.slug}
              onActivate={activate}
            />
          </li>
        ))}
      </ul>

      {/* Tooltip for arcs without a hero card (Finance, Digital, Family). */}
      {overlay?.tooltip && activeService ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 hidden w-[240px] rounded-[14px] border border-white/15 bg-navy/95 p-4 shadow-float backdrop-blur-sm lg:block"
          style={{
            ...(overlay.tooltip.side === 'above'
              ? { bottom: overlay.height - overlay.tooltip.y + 18 }
              : { top: overlay.tooltip.y + 18 }),
            left: Math.min(Math.max(overlay.tooltip.x - 120, 0), overlay.width - 240),
          }}
        >
          <p className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
            <span aria-hidden className={cn('h-2 w-2 shrink-0 rounded-full', activeTheme?.solid)} />
            {activeService.title}
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-on-navy-muted">
            {activeService.navDescription}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold text-gold">
            Learn more <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
