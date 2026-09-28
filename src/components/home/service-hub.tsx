'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  ServiceWheel,
  arcAngle,
  arcEdgePoint,
  polar,
} from '@/components/home/service-wheel';
import { ServiceBubbleCard } from '@/components/home/service-bubble-card';
import { serviceBubbles, wheelOrder } from '@/data/bubbles';
import { serviceBySlug } from '@/data/services';
import { pillarTheme } from '@/lib/pillar';
import { cn } from '@/lib/utils';

/* --------------------------------------------------------------------------
   Hub coordinate space. The wheel keeps its own 400 × 400 viewBox; here it is
   placed inside a 700 × 560 box, so converting a wheel point to a hub point is
   a constant vertical offset. That lets the connector overlay be drawn in the
   same units as the wheel without any DOM measurement.
   -------------------------------------------------------------------------- */
const HUB_W = 700;
const HUB_H = 620;
const WHEEL_SIZE = 400;
const WHEEL_TOP = (HUB_H - WHEEL_SIZE) / 2;

const BUBBLE_LEFT_PCT = 55;
const BUBBLE_WIDTH_PCT = 43;
/**
 * Vertical centre of each bubble, as a percentage of the hub height. Spread
 * wide enough that the tallest bubble (five items) clears its neighbours at the
 * narrowest width this layout runs at.
 */
const BUBBLE_TOP_PCT = [16, 50, 84];

const toHub = (point: { x: number; y: number }) => ({
  x: point.x,
  y: point.y + WHEEL_TOP,
});

/** Slugs whose arc has no bubble and therefore gets a hover tooltip instead. */
const TOOLTIP_SLUGS = wheelOrder.filter(
  (slug) => !serviceBubbles.some((bubble) => bubble.slug === slug),
);

export function ServiceHub() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* ---------------- Desktop: wheel + bubbles side by side ------------- */}
      <div className="relative hidden aspect-[700/620] w-full xl:block">
        {/* Dotted connectors, drawn underneath the bubbles. */}
        <svg
          viewBox={`0 0 ${HUB_W} ${HUB_H}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {serviceBubbles.map((bubble, bubbleIndex) => {
            const arcIndex = wheelOrder.indexOf(
              bubble.slug as (typeof wheelOrder)[number],
            );
            const start = toHub(arcEdgePoint(arcIndex));
            const end = {
              x: (BUBBLE_LEFT_PCT / 100) * HUB_W,
              y: (BUBBLE_TOP_PCT[bubbleIndex] / 100) * HUB_H,
            };
            // Bow the curve away from the wheel centre so the three
            // connectors fan out instead of converging.
            const control = {
              x: (start.x + end.x) / 2 + 14,
              y: start.y + (end.y - start.y) * 0.25,
            };
            const active = activeSlug === bubble.slug;
            const theme = pillarTheme[bubble.accent ?? bubble.color];

            return (
              <path
                key={bubble.slug}
                d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
                fill="none"
                stroke={theme.hex}
                strokeOpacity={active ? 0.95 : 0.4}
                strokeWidth={active ? 1.8 : 1.2}
                strokeDasharray="2 6"
                strokeLinecap="round"
                className={active ? 'animate-dash' : undefined}
                style={{ transition: 'stroke-opacity .3s, stroke-width .3s' }}
              />
            );
          })}
        </svg>

        {/* Wheel */}
        <div
          className="absolute left-0"
          style={{
            top: `${(WHEEL_TOP / HUB_H) * 100}%`,
            width: `${(WHEEL_SIZE / HUB_W) * 100}%`,
            height: `${(WHEEL_SIZE / HUB_H) * 100}%`,
          }}
        >
          <ServiceWheel
            activeSlug={activeSlug}
            onActivate={setActiveSlug}
            className="h-full w-full overflow-visible"
            labelClassName=""
          />
        </div>

        {/* Tooltip cards for the three arcs that have no bubble. */}
        {TOOLTIP_SLUGS.map((slug) => {
          const service = serviceBySlug(slug);
          if (!service) return null;
          const arcIndex = wheelOrder.indexOf(slug);
          const anchor = toHub(polar(arcAngle(arcIndex), 150));
          const theme = pillarTheme[service.color];
          const visible = activeSlug === slug;

          return (
            <div
              key={slug}
              aria-hidden
              className={cn(
                'pointer-events-none absolute z-20 w-[46%] rounded-card border border-white/15 bg-navy-950/95 p-4 shadow-lift backdrop-blur-sm transition-all duration-200',
                visible ? 'opacity-100' : 'invisible opacity-0',
              )}
              style={{
                left: '0%',
                top: `${(anchor.y / HUB_H) * 100}%`,
                transform: `translateY(-50%) translateX(${visible ? '0' : '-8px'})`,
              }}
            >
              <p className="flex items-center gap-2 text-[15px] font-bold text-white">
                <span
                  aria-hidden
                  className={cn('h-2 w-2 shrink-0 rounded-full', theme.dot)}
                />
                {service.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-white/70">
                {service.navDescription}
              </p>
              <span
                className={cn(
                  'mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold',
                  theme.text,
                )}
              >
                Learn more
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </span>
            </div>
          );
        })}

        {/* Bubbles */}
        {serviceBubbles.map((bubble, index) => (
          <ServiceBubbleCard
            key={bubble.slug}
            bubble={bubble}
            active={activeSlug === bubble.slug}
            onActivate={setActiveSlug}
            className="absolute z-10"
            style={{
              left: `${BUBBLE_LEFT_PCT}%`,
              top: `${BUBBLE_TOP_PCT[index]}%`,
              width: `${BUBBLE_WIDTH_PCT}%`,
              transform: 'translateY(-50%)',
            }}
          />
        ))}
      </div>

      {/* ---------------- Mobile / tablet: wheel, then stacked bubbles ------ */}
      <div className="xl:hidden">
        <ServiceWheel
          activeSlug={activeSlug}
          onActivate={setActiveSlug}
          className="mx-auto w-full max-w-[320px] md:max-w-[380px]"
          labelClassName="hidden"
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {serviceBubbles.map((bubble) => (
            <li key={bubble.slug} className="sm:last:col-span-2 md:last:col-span-1">
              <ServiceBubbleCard
                bubble={bubble}
                active={activeSlug === bubble.slug}
                onActivate={setActiveSlug}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
