'use client';

import Link from 'next/link';
import { serviceBySlug } from '@/data/services';
import { wheelLabels, wheelOrder } from '@/data/bubbles';
import { pillarTheme } from '@/lib/pillar';

/* --------------------------------------------------------------------------
   Geometry. The wheel lives in its own 400 × 400 viewBox so it can be reused
   at any size; the hub places it inside a larger coordinate space and only
   has to offset by a constant (see service-hub.tsx).
   -------------------------------------------------------------------------- */

export const WHEEL_VIEWBOX = 400;
const CX = 200;
const CY = 200;
const R_OUTER = 130;
const R_INNER = 96;
const R_CENTER = 78;
const R_LABEL = 143;
const R_ICON = (R_OUTER + R_INNER) / 2;
/** Degrees of blank space between neighbouring arcs. */
const GAP = 7;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function polar(angleDeg: number, radius: number, cx = CX, cy = CY) {
  return {
    x: cx + radius * Math.cos(toRad(angleDeg)),
    y: cy + radius * Math.sin(toRad(angleDeg)),
  };
}

/** Mid-angle of the arc at `index`, starting at the upper right (−60°). */
export const arcAngle = (index: number) => -60 + index * 60;

/** Annulus segment between two radii. */
function arcPath(midAngle: number) {
  const half = 30 - GAP / 2;
  const a1 = midAngle - half;
  const a2 = midAngle + half;
  const o1 = polar(a1, R_OUTER);
  const o2 = polar(a2, R_OUTER);
  const i1 = polar(a1, R_INNER);
  const i2 = polar(a2, R_INNER);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 0 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${R_INNER} ${R_INNER} 0 0 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');
}

/** Where a bubble connector should meet the wheel, in wheel coordinates. */
export function arcEdgePoint(index: number) {
  return polar(arcAngle(index), R_OUTER + 2);
}

export interface WheelProps {
  /** Slug of the arc currently hovered or focused, anywhere in the hub. */
  activeSlug: string | null;
  onActivate: (slug: string | null) => void;
  /** Services hub page renders a static wheel with every label shown. */
  showAllLabels?: boolean;
  /** Labels are hidden below `md` where the wheel is only ~320px wide. */
  labelClassName?: string;
  className?: string;
  /** Static variant drops the links and the idle animation. */
  interactive?: boolean;
}

export function ServiceWheel({
  activeSlug,
  onActivate,
  showAllLabels = false,
  labelClassName = 'hidden md:block',
  className,
  interactive = true,
}: WheelProps) {
  return (
    <svg
      /*
        With every pillar labelled, the text extends past the ring on both
        sides, so the box is widened symmetrically about the wheel's centre
        rather than letting the labels clip.
      */
      viewBox={
        showAllLabels
          ? `-80 0 ${WHEEL_VIEWBOX + 160} ${WHEEL_VIEWBOX}`
          : `0 0 ${WHEEL_VIEWBOX} ${WHEEL_VIEWBOX}`
      }
      className={className}
      role={interactive ? 'navigation' : 'img'}
      aria-label="RizSync service pillars"
    >
      <defs>
        <radialGradient id="rz-hub-glow">
          <stop offset="55%" stopColor="#C9A24D" stopOpacity="0" />
          <stop offset="88%" stopColor="#C9A24D" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Idle state: only this outer dotted ring rotates (§6.1 ②). */}
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER + 22}
        fill="none"
        stroke="#C9A24D"
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeDasharray="2 10"
        strokeLinecap="round"
        className={interactive ? 'animate-spin-slow' : undefined}
        style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: 'view-box' }}
      />

      {/* Soft gold glow behind the hub. */}
      <circle cx={CX} cy={CY} r={R_CENTER + 14} fill="url(#rz-hub-glow)" />

      {wheelOrder.map((slug, index) => {
        const service = serviceBySlug(slug);
        if (!service) return null;

        const theme = pillarTheme[service.color];
        const Icon = service.icon;
        const angle = arcAngle(index);
        const icon = polar(angle, R_ICON);
        const label = polar(angle, R_LABEL);
        const onRight = Math.cos(toRad(angle)) > 0.01;
        const dimmed = activeSlug !== null && activeSlug !== slug;
        const active = activeSlug === slug;
        const [line1, line2] = wheelLabels[slug];

        const arcBody = (
          <g
            style={{
              transform: active ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: `${CX}px ${CY}px`,
              transformBox: 'view-box',
              transition: 'transform .3s var(--ease-out-soft), opacity .3s',
              opacity: dimmed ? 0.5 : 1,
            }}
          >
            <path
              d={arcPath(angle)}
              fill={theme.hex}
              fillOpacity={active ? 1 : 0.9}
              stroke="#FFFFFF"
              strokeOpacity={0.14}
              strokeWidth={1}
            />
            <Icon
              x={icon.x - 13}
              y={icon.y - 13}
              width={26}
              height={26}
              strokeWidth={1.5}
              color="#FFFFFF"
              aria-hidden
            />
          </g>
        );

        const labelNode =
          showAllLabels || !onRight ? (
            <text
              x={label.x}
              y={label.y}
              textAnchor={onRight ? 'start' : 'end'}
              className={labelClassName}
              fill={active ? theme.hex : '#FFFFFF'}
              fillOpacity={dimmed ? 0.45 : 0.95}
              fontSize={13}
              fontWeight={600}
              style={{ transition: 'fill .3s, fill-opacity .3s' }}
            >
              <tspan x={label.x} dy="-2">
                {line1}
              </tspan>
              <tspan x={label.x} dy="15">
                {line2}
              </tspan>
            </text>
          ) : null;

        if (!interactive) {
          return (
            <g key={slug}>
              {arcBody}
              {labelNode}
            </g>
          );
        }

        return (
          <Link
            key={slug}
            href={`/services/${service.slug}`}
            aria-label={`${service.title} — ${service.navDescription}`}
            className="cursor-pointer outline-none focus-visible:[&>g>path]:stroke-gold-500"
            onMouseEnter={() => onActivate(slug)}
            onMouseLeave={() => onActivate(null)}
            onFocus={() => onActivate(slug)}
            onBlur={() => onActivate(null)}
          >
            {arcBody}
            {labelNode}
          </Link>
        );
      })}

      {/* Centre hub — logo mark (§6.1 ②). */}
      <g>
        <circle cx={CX} cy={CY} r={R_CENTER} fill="#00204A" />
        <circle
          cx={CX}
          cy={CY}
          r={R_CENTER}
          fill="none"
          stroke="#C9A24D"
          strokeOpacity={0.55}
          strokeWidth={1.5}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R_CENTER - 11}
          fill="none"
          stroke="#0FA3A3"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={26}
          fontWeight={700}
          letterSpacing="-0.5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          RizSync
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          fill="#C9A24D"
          fontSize={8.5}
          fontWeight={600}
          letterSpacing="2.4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          SERVICE SOLUTION
        </text>
        <circle cx={CX} cy={CY + 32} r={3} fill="#C9A24D" />
      </g>
    </svg>
  );
}
