'use client';

import { forwardRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useSiteData } from '@/components/providers/site-data';
import type { Service } from '@/lib/cms/types';
import { pillarTheme } from '@/lib/pillar';

/* --------------------------------------------------------------------------
   Geometry — HOME_REDESIGN.md §4.3. The arc paths are the spec's, verbatim:
   centre (260,260), radius 190, six 54° arcs separated by 6° gaps, starting
   with Finance at the top right and running clockwise.
   -------------------------------------------------------------------------- */

export const WHEEL_VIEWBOX = { x: -60, y: -30, width: 640, height: 580 };
export const WHEEL_CENTER = { x: 260, y: 260 };
const RADIUS = 190;

export interface WheelArc {
  slug: string;
  path: string;
  /** Mid-angle in degrees, 0 = 3 o'clock, clockwise. */
  angle: number;
  /** Two-line label drawn outside the ring. */
  label: [string, string];
  service: Service;
}

/** The six fixed arc positions, clockwise from the top right. */
const ARC_SLOTS: { path: string; angle: number }[] = [
  { path: 'M 269.9 70.3 A 190 190 0 0 1 419.3 156.5', angle: -60 },
  { path: 'M 429.3 173.7 A 190 190 0 0 1 429.3 346.3', angle: 0 },
  { path: 'M 419.3 363.5 A 190 190 0 0 1 269.9 449.7', angle: 60 },
  { path: 'M 250.1 449.7 A 190 190 0 0 1 100.7 363.5', angle: 120 },
  { path: 'M 90.7 346.3 A 190 190 0 0 1 90.7 173.7', angle: 180 },
  { path: 'M 100.7 156.5 A 190 190 0 0 1 250.1 70.3', angle: 240 },
];

/** "Finance & Accounting" → ["Finance &", "Accounting"]. */
function splitLabel(text: string): [string, string] {
  const amp = text.indexOf(' & ');
  if (amp > 0) return [text.slice(0, amp + 2), text.slice(amp + 3)];
  const words = text.split(' ');
  if (words.length < 2) return [text, ''];
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
}

/** The first six services (in admin display order) fill the six arcs. */
export function buildWheelArcs(services: Service[]): WheelArc[] {
  return services.slice(0, ARC_SLOTS.length).map((service, index) => ({
    ...ARC_SLOTS[index],
    slug: service.slug,
    label: splitLabel(service.shortTitle),
    service,
  }));
}

export function useWheelArcs(): WheelArc[] {
  const { services } = useSiteData();
  return useMemo(() => buildWheelArcs(services), [services]);
}

const STROKE = 34;
const STROKE_ACTIVE = 46;

/** Point on a circle around the wheel centre, in viewBox units. */
export function wheelPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: WHEEL_CENTER.x + radius * Math.cos(rad),
    y: WHEEL_CENTER.y + radius * Math.sin(rad),
  };
}

/** Where a connector or tooltip attaches: just outside the active arc. */
export const ARC_OUTER_RADIUS = RADIUS + STROKE_ACTIVE / 2 + 4;

export interface ServiceWheelProps {
  activeId: string | null;
  /** Hover or keyboard focus on an arc. */
  onActivate?: (slug: string) => void;
  /** Plain decorative wheel (the /services hero) — no links, no focus stops. */
  interactive?: boolean;
  className?: string;
  /** Accessible name for the whole graphic. */
  label?: string;
}

export const ServiceWheel = forwardRef<SVGSVGElement, ServiceWheelProps>(function ServiceWheel(
  { activeId, onActivate, interactive = true, className, label = 'RizSync service pillars' },
  ref,
) {
  const reduceMotion = useReducedMotion();
  // Tracks keyboard focus so the gold focus outline can be drawn in SVG —
  // CSS `outline` is not reliably painted on SVG children.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const arcs = useWheelArcs();

  return (
    <svg
      ref={ref}
      viewBox={`${WHEEL_VIEWBOX.x} ${WHEEL_VIEWBOX.y} ${WHEEL_VIEWBOX.width} ${WHEEL_VIEWBOX.height}`}
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={label}
    >
      {/* Dashed inner ring, 15% white. */}
      <circle
        cx={WHEEL_CENTER.x}
        cy={WHEEL_CENTER.y}
        r={150}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.15}
        strokeWidth={1.5}
        strokeDasharray="4 7"
      />

      {arcs.map((arc, index) => {
        const service = arc.service;

        const theme = pillarTheme[service.color];
        const active = activeId === arc.slug;
        const dimmed = activeId !== null && !active;
        const labelAt = wheelPoint(arc.angle, 236);
        const onRight = Math.cos((arc.angle * Math.PI) / 180) > 0.1;
        const onLeft = Math.cos((arc.angle * Math.PI) / 180) < -0.1;
        const anchor = onRight ? 'start' : onLeft ? 'end' : 'middle';

        const body = (
          <>
            {/* Gold focus outline, drawn behind the arc. */}
            {focusedId === arc.slug ? (
              <>
                <path
                  d={arc.path}
                  fill="none"
                  stroke="#C9A24D"
                  strokeWidth={STROKE_ACTIVE + 20}
                  strokeLinecap="butt"
                />
                {/* Navy gap between the ring and the arc, like outline-offset. */}
                <path
                  d={arc.path}
                  fill="none"
                  stroke="#00204A"
                  strokeWidth={STROKE_ACTIVE + 10}
                  strokeLinecap="butt"
                />
              </>
            ) : null}
            <motion.path
              d={arc.path}
              fill="none"
              stroke={theme.hex}
              strokeLinecap="butt"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{
                pathLength: 1,
                strokeWidth: active ? STROKE_ACTIVE : STROKE,
                opacity: dimmed ? 0.45 : 1,
              }}
              transition={{
                pathLength: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                strokeWidth: { duration: 0.2, ease: 'easeOut' },
                opacity: { duration: 0.2, ease: 'easeOut' },
              }}
            />
            <text
              x={labelAt.x}
              y={labelAt.y}
              textAnchor={anchor}
              fontWeight={600}
              // Larger in user units on small screens so labels stay legible
              // once the whole SVG is scaled down.
              className="text-[21px] sm:text-[18px] lg:text-[16px]"
              fill={active ? '#FFFFFF' : '#DCE5F0'}
              fillOpacity={dimmed ? 0.7 : 1}
              style={{ fontFamily: 'var(--font-sans)', transition: 'fill .2s, fill-opacity .2s' }}
            >
              <tspan x={labelAt.x} dy="-0.2em">
                {arc.label[0]}
              </tspan>
              <tspan x={labelAt.x} dy="1.2em">
                {arc.label[1]}
              </tspan>
            </text>
          </>
        );

        if (!interactive) return <g key={arc.slug}>{body}</g>;

        return (
          <Link
            key={arc.slug}
            href={`/services/${arc.slug}`}
            aria-label={`${service.title} — ${service.navDescription}`}
            tabIndex={0}
            className="cursor-pointer outline-none"
            onMouseEnter={() => onActivate?.(arc.slug)}
            onFocus={(event) => {
              onActivate?.(arc.slug);
              if ((event.currentTarget as Element).matches(':focus-visible')) {
                setFocusedId(arc.slug);
              }
            }}
            onBlur={() => setFocusedId(null)}
          >
            {body}
          </Link>
        );
      })}

      {/* Centre — HOME_REDESIGN.md §4.3. */}
      <circle cx={WHEEL_CENTER.x} cy={WHEEL_CENTER.y} r={118} fill="#FFFFFF" />
      <text
        x={WHEEL_CENTER.x}
        y={WHEEL_CENTER.y + 6}
        textAnchor="middle"
        fill="#00204A"
        fontSize={40}
        fontWeight={700}
        letterSpacing="-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        RizSync
      </text>
      <text
        x={WHEEL_CENTER.x}
        y={WHEEL_CENTER.y + 34}
        textAnchor="middle"
        fill="#0B7A7A"
        fontSize={12}
        fontWeight={700}
        letterSpacing={3}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        SERVICE PLATFORM
      </text>
    </svg>
  );
});
