# RizSync Service Solution — Website

Corporate website and lead-generation platform for **RizSync Service Solution**
(Mirpur, Dhaka), built to the specification in [`DESIGN.md`](./DESIGN.md).

> `DESIGN.md` is the source of truth. Section references in the code comments
> (`§4.1`, `§6.1 ②`, …) point back to it.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + TypeScript, fully statically generated |
| Styling | Tailwind CSS v4, design tokens as CSS variables in `src/styles/globals.css` |
| UI primitives | Radix (Navigation Menu, Dialog, Accordion, Tabs) + local components |
| Icons | lucide-react, plus hand-rolled WhatsApp / LinkedIn / Facebook marks |
| Animation | Framer Motion — subtle reveals only, `prefers-reduced-motion` honoured |
| Blog | MDX files in `content/insights/`, rendered with `next-mdx-remote/rsc` |
| Forms | React Hook Form + Zod (one schema shared by client and server) |
| Form backend | Route Handler `/api/contact` → Resend, with optional Supabase backup |
| Anti-spam | Cloudflare Turnstile + honeypot + per-IP rate limit |
| Analytics | GA4 via Google Tag Manager; Meta Pixel behind an env flag |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in what you have; everything is optional locally
npm run dev                    # http://localhost:3000
```

Useful scripts:

```bash
npm run build      # production build (all routes prerendered)
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

## Environment variables

Every variable is optional for local development — the site degrades cleanly
when one is missing.

| Variable | Required in production | Effect when empty |
|----------|------------------------|-------------------|
| `NEXT_PUBLIC_SITE_URL` | yes | Falls back to `https://www.rizsync.com` for canonicals, schema and sitemap |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | yes | The form returns a `502` and shows the phone fallback, rather than pretending to succeed |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | yes | The widget is not rendered and verification is skipped (the honeypot and rate limit still apply) |
| `NEXT_PUBLIC_GTM_ID` | yes | No analytics tag is injected at all |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Pixel is not loaded |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | no | Lead backup is skipped |

The `leads` table DDL for the optional Supabase backup is in the doc comment at
the top of `src/lib/leads.ts`.

## Project structure

```
content/insights/*.mdx          Blog posts (frontmatter documented in src/lib/mdx.ts)
public/images/                  Hero, insights covers, about artwork, team photos
src/app/                        Routes, route handlers, sitemap/robots/manifest/OG image
src/components/
  layout/                       Header (mega-menu + mobile sheet), Footer, WhatsApp FAB
  home/                         Hero, ServiceWheel, ServiceHub, bubbles, motto strip
  sections/                     Reusable page sections (pillars, values, process, CTA…)
  insights/                     MDX components, table of contents, share buttons
  forms/                        ConsultationForm, client-type tabs, Turnstile
  ui/                           Primitives: Button, Card, Section, fields, accordion…
  seo/                          JsonLd, analytics
src/config/site.ts              ← every client-editable value lives here
src/config/nav.ts               Navigation structure
src/data/                       services, values, testimonials, team, faqs, stats, bubbles
src/lib/                        mdx, schema, seo, validators, email, leads, rate-limit…
src/styles/globals.css          Design tokens (§4) and motifs
```

### Where to change things

- **Phone, email, addresses, socials, hours, logo, hero image** →
  `src/config/site.ts`. Nothing else hard-codes them.
- **Service copy, bullets, FAQs, per-page SEO** → `src/data/services.ts`. The
  services hub, all six sub-pages, the wheel, the mega-menu, the footer and the
  form's Subject list are all generated from it.
- **Colours, type scale, radii, shadows** → the `@theme` block in
  `src/styles/globals.css`.
- **Blog posts** → add an `.mdx` file to `content/insights/`. Category must be
  one of the six in `insightCategories` (`src/lib/mdx.ts`).

## The interactive hub (§6.1 ②)

`ServiceWheel` draws six arcs in its own `400 × 400` viewBox. `ServiceHub`
places that wheel inside a `700 × 620` box, so converting a point on an arc to a
point in the hub is a constant offset — which is how the dotted connectors are
drawn in the same coordinate space as the wheel without measuring the DOM.

Hovering or focusing an arc highlights its bubble and vice versa; arcs without a
bubble show a tooltip card instead. Arcs are real links, so the wheel is
keyboard-navigable and crawlable. Below `xl` the hub stacks: wheel first, then
the three bubbles as cards.

## Outstanding client decisions

Ten items from `DESIGN.md` §0 are still open. All of them are marked
`TODO(client)` in `src/config/site.ts` or in the relevant data file — search the
repo for `TODO(client)` to list them. In short: the email address, the LinkedIn
URL, the vector logo, the hero photograph, both office addresses, the business
hours, the trust-strip figures, the leadership profiles and the testimonials.

The placeholder artwork in `public/images/` was generated for layout purposes
and should be replaced with real photography before launch.

## Accessibility & performance notes

- One `<h1>` per page, logical heading order, skip-to-content link, `lang="en"`.
- Visible gold focus ring on every interactive element; the wheel, mega-menu,
  mobile sheet and testimonial slider are all keyboard-operable.
- `prefers-reduced-motion` disables the idle wheel rotation, reveals and the
  testimonial auto-advance.
- Every route is prerendered; the map iframe and testimonial slider are lazy,
  fonts are self-hosted via `next/font`, and images go through `next/image`.
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) are set in
  `next.config.ts` — extend the CSP if you add another third-party script.
