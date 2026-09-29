# RizSync Service Solution — Website Design & Build Spec (DESIGN.md)

> This file is the single source of truth for building the RizSync corporate website with Claude Code.
> Put it in the project root as `DESIGN.md` and tell Claude Code: *"Read DESIGN.md fully before writing any code, and follow it section by section."*
> The Home page visual reference (`/design/home-reference.png`) will be added later — when present, it overrides layout details in §6.1 but NOT the design tokens in §4.

---

## 0. Open Items (confirm with client before launch)

| # | Item | Current value in brief | Action |
|---|------|------------------------|--------|
| 1 | Brand name is used 3 ways | "RizSync Service Solution", "RizSync Business Solution", "RizSync Service Platform" | Use **RizSync Service Solution** as the official name everywhere (H1, footer, schema). Confirm. |
| 2 | Email address | `PalzaPast.service@gmail.com` | Looks unrelated to the brand — confirm. Keep in a single config constant. |
| 3 | Copyright year | `© [2021]` | Render as `© 2021–{currentYear}` unless client says otherwise. |
| 4 | Facebook URL | Two URLs given | Use `https://www.facebook.com/RizSync.BD.Official/` as primary. Confirm. |
| 5 | LinkedIn URL | "Required" but not provided | Placeholder `#` + TODO comment. |
| 6 | Logo | Not in the docx | Placeholder SVG wordmark until the vector logo arrives. |
| 7 | Hero background (Dhaka cityscape + circuitry) | "Provided" but not in the docx | Use a placeholder image path `/images/hero-dhaka.webp`. |
| 8 | Business Operation Office address | "8E/A 1st Coloney Mazar Road Mirpur Dhaka" | Normalize to "8E/A, 1st Colony, Mazar Road, Mirpur, Dhaka". Confirm spelling. |
| 9 | Leadership team | Placeholder | Build component with placeholder data. |
| 10 | Testimonials | Placeholder | Build component with placeholder data. |

All of these must live in **one** file: `src/config/site.ts`, so the client can change them in one place.

---

## 1. Project Summary

- **Client:** RizSync Service Solution, Mirpur, Dhaka, Bangladesh
- **Type:** Professional corporate website + lead generation
- **Core values:** Expertise, Trust, Ethics (Quranic Business Model), Efficiency
- **Tagline / Motto:** Connect • Simplify • Protect • Transform • Grow
- **Audience:** Entrepreneurs, SMEs, Corporate organizations, High-Net-Worth Individuals (HNWIs)
- **Primary goal:** Build absolute trust → drive "Request Consultation" form submissions and WhatsApp/phone calls.
- **Tone:** Calm, premium, institutional, ethical. Think "private bank + modern consultancy" — NOT a flashy tech startup. No gimmicky animations, no stock-photo clichés of handshakes.

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/SSG is required for real SEO (a Vite SPA is weak for Google/Bing indexing) |
| Styling | **Tailwind CSS v4** + CSS variables for tokens | Fast, consistent, tokenized |
| UI primitives | shadcn/ui (Button, Input, Textarea, Select, Dropdown/NavigationMenu, Sheet, Accordion, Carousel) | Accessible defaults |
| Icons | lucide-react (+ custom SVG for WhatsApp, LinkedIn, Facebook) | |
| Animation | Framer Motion (subtle only) | Wheel hover, section fade-ins |
| Blog | MDX files in `/content/insights/*.mdx` (via `next-mdx-remote` or `@next/mdx`) | No CMS cost; can move to a CMS later |
| Forms | React Hook Form + Zod | Validation |
| Form backend | Next.js Route Handler `/api/contact` → **Resend** email to RizSync team | Simple, reliable |
| Anti-spam | **Cloudflare Turnstile** (free CAPTCHA) + honeypot field | Brief requires CAPTCHA |
| Optional storage | Supabase `leads` table (store every submission as backup) | Never lose a lead if email fails |
| Analytics | GA4 via Google Tag Manager (`@next/third-parties`) ; Meta Pixel optional behind env flag | |
| Hosting | Vercel (HTTPS/SSL automatic) | |
| Images | `next/image`, WebP/AVIF, explicit sizes | Core Web Vitals |
| Fonts | `next/font` (self-hosted, no layout shift) | |

### Environment variables (`.env.example`)
```
NEXT_PUBLIC_SITE_URL=https://www.rizsync.com
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=        # optional; if empty, pixel is not loaded
SUPABASE_URL=                     # optional
SUPABASE_SERVICE_ROLE_KEY=        # optional, server only
```

---

## 3. Sitemap & Routes

```
/                                   Home
/about                              About Us
/services                           Services Hub
/services/finance-accounting        Finance, Accounting & Business Support
/services/business-corporate        Business & Corporate Services
/services/government-assistance     Government Service Assistance
/services/digital-transformation    Digital & Business Transformation
/services/family-welfare            Family Welfare & Services
/services/why-rizsync               Benefits & Value Proposition
/insights                           Blog listing (search + categories)
/insights/[slug]                    Blog article
/insights/category/[category]       Category listing
/contact                            Contact / Request Consultation
/privacy-policy                     Privacy Policy (placeholder)
/terms                              Terms (placeholder)
404                                 Custom not-found page
```

Also generate: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, dynamic OG images (`opengraph-image.tsx`).

---

## 4. Design System (Tokens) — v2 "Corporate Premium"

> Updated to `HOME_REDESIGN.md` §2. The v2 system applies site-wide; the full
> token list lives in `src/styles/globals.css` (plain CSS variables with the
> spec names, plus the same values in the Tailwind `@theme`).

### 4.1 Color palette

**Brand (client brief — do not change)**

| Token | Hex | Use |
|-------|-----|-----|
| `--navy` | `#00204A` | Header, footer, hero, featured cards, navy buttons |
| `--teal` | `#0FA3A3` | Finance / Government / Family pillar — shapes, tiles, arcs |
| `--orange` | `#F28C28` | Business / Digital pillar — shapes, tiles, arcs |
| `--gold` | `#C9A24D` | Primary CTA background, Benefits pillar, accents |

**Accessible ink shades — the only teal/orange/gold allowed for small text on white**

| Token | Hex | | Token | Hex |
|-------|-----|-|-------|-----|
| `--teal-ink` | `#0B7A7A` | | `--orange-icon` | `#C4650D` |
| `--orange-ink` | `#B35A0B` | | `--gold-ink` | `#8E6F24` |

**Tints** — `--teal-50 #E6F6F6` · `--orange-50 #FEF1E4` · `--orange-25 #FFF8F1` · `--gold-50 #F8F1E1`

**On navy** — `--on-navy #FFFFFF` · `--on-navy-muted #C7D3E3` · `--on-navy-soft #B5C3D6` ·
`--on-navy-faint #9FB3CF` · `--teal-on-navy #5FD3D3` (eyebrows) · chip text
`--teal-chip-text #7FDADA`, `--orange-chip-text #F7B877`, `--gold-chip-text #E4C98A`

**Neutrals** — `--ink #0F172A` · `--ink-2 #1E293B` · `--body #475569` · `--muted #64748B` ·
`--line #E6EBF2` · `--line-2 #D6DEE8` · `--mist #F5F7FA` · `--white #FFFFFF`

**Contrast rules:** buttons on gold / teal / orange use **navy text**, never white. Small
text on white uses the `-ink` shades, never raw teal/orange. Raw teal/orange/gold are for
shapes, icon tiles, arcs, number circles and large display text.

**Pillar mapping (used everywhere):**

| # | Pillar | Color | lucide icon |
|---|--------|-------|-------------|
| 01 | Finance, Accounting & Business Support | Teal | `BarChart3` |
| 02 | Business & Corporate Services | Orange | `Briefcase` |
| 03 | Government Service Assistance | Teal | `Landmark` |
| 04 | Digital & Business Transformation | Orange | `Cpu` |
| 05 | Family Welfare & Services | Teal | `Home` |
| 06 | Benefits & Value Proposition | Gold | `Award` |

### 4.2 Typography

Loaded with `next/font/google`: **Sora** (display, 600/700/800), **DM Sans** (body,
400–700), **Amiri** (Arabic ethics terms, latin + arabic subsets).

| Token | Font | Desktop / mobile | Weight | Line-height | Tracking |
|-------|------|------------------|--------|-------------|----------|
| `display` (Hero H1) | Sora | 70 / 40px | 700 | 1.04 | -0.035em |
| `h2` | Sora | 46 / 30px (some sections 42) | 700 | 1.12 | -0.03em |
| `h3-card` | Sora | 22 / 20px | 700 | 1.25 | — |
| `h4` | Sora | 17–20px | 700 | 1.2 | — |
| `lead` | DM Sans | 20 / 17px | 400 | 1.6 | — |
| `body` | DM Sans | 16–18 / 15–16px | 400 | 1.7 | — |
| `eyebrow` | DM Sans | 13px UPPERCASE | 700 | — | 0.16em, `--teal-ink` (on navy `--teal-on-navy`) |
| `small` | DM Sans | 13–14px | 500–600 | — | — |
| `arabic` | Amiri | 46px (values) | 400 | 1.2 | — |

### 4.3 Shape, spacing, depth
- Container: max content 1280px; side padding 80px desktop / 32px tablet / 20px mobile.
- Section padding: 104–128px desktop, 72px tablet, 56px mobile.
- Radius: buttons & inputs **12px**, chips **6–10px**, cards **20px**, panels **24–28px**, pills **999px**.
- Shadows: floating white `0 30px 70px -24px rgba(0,32,74,.35)`; featured navy card
  `0 30px 60px -24px rgba(0,32,74,.6)`; gold CTA glow `0 16px 36px -14px rgba(201,162,77,.8)`.
- Card hover (all clickable cards): `translateY(-4px)`, border → `--line-2`, shadow
  `0 24px 48px -24px rgba(0,32,74,.25)`, 200ms ease-out.
- Cards: 20px radius, 1px `--line` border, soft navy shadow, coloured icon tile.

### 4.4 Motifs & imagery
- Hero: navy with a 48px white grid at 4.5%, teal/orange glow circles, thin circuit lines.
- 8-point star lattice (gold) at low opacity on the About visual, Values and footer.
- Icons: lucide-react, stroke 2, inside square tiles (48/60px, radius 12–16px) on a tint.
- Photography: real Dhaka / professionals / documents only. No cartoon illustrations.

### 4.5 Buttons
| Variant | Style |
|---------|-------|
| `gold` (primary CTA) | gold bg, navy text, 700, h-60 hero / h-48 header, radius 12, gold glow, arrow icon |
| `navy` | navy bg, white text |
| `outline-light` | 1.5px `rgba(255,255,255,.3)` border, white text (on navy) |
| `outline-dark` | 1.5px navy border, navy text |
| `whatsapp` | outline-light with the WhatsApp icon in `#25D366` |

All buttons: 2px gold focus ring offset 2px, minimum height 44px.

---

## 5. Global Components

### 5.1 Header (sticky)
- Background `--navy-900`; becomes slightly translucent + blur + shadow after 40px scroll. Height 80px → 68px on scroll.
- **Left:** Logo (SVG). Links to `/`.
- **Right:** Home · About Us · Services ▾ · Insights · Contact · **[Request Consultation]** (gold button).
- **Services dropdown (mega-menu, desktop):** 2 columns × 3 rows, each item = pillar color dot + icon + title + one-line description. Footer row inside dropdown: "View all services →".
- **Mobile (<1024px):** hamburger → right-side Sheet with accordion for Services, CTA button full-width at the bottom, phone & WhatsApp quick links.
- Active link: gold underline 2px.
- CTA: links to `/contact#consultation-form` (on the Home page, scroll to the in-page form section `#consultation`).
- Optional top utility bar (desktop only, 36px, navy-950): phone · email · "Mon–Sat, 10am–7pm" (confirm hours).

### 5.2 Footer
Background `--navy-900` with faint geometric pattern. 4 columns desktop, stacked on mobile.

1. **Brand column:** Logo, tagline "Connect • Simplify • Protect • Transform • Grow", **Ethics Statement** (italic, small):
   *"RizSync operates on principles of transparency, integrity, and justice, guided by ethical business practices and the Quranic Business Model."*
2. **Services:** links to all 6 sub-pages.
3. **Company:** About, Insights, Contact, Privacy Policy, Terms.
4. **Contact:**
   - 📞 Call / WhatsApp: **+880 1711-504625** → `tel:+8801711504625` and `https://wa.me/8801711504625`
   - ✉️ Email: from config → `mailto:`
   - 📍 Corporate Office: 137/10, Mazar Road, Mirpur, Dhaka
   - 📍 Business Operation Office: 8E/A, 1st Colony, Mazar Road, Mirpur, Dhaka
   - Social: LinkedIn, Facebook (icon buttons, `aria-label`, `rel="noopener"`)
- Bottom bar: `© 2021–{year} RizSync Service Solution. All Rights Reserved.` + Privacy · Terms.

### 5.3 Floating WhatsApp button
Bottom-right, 56px circle, WhatsApp green, pre-filled message: "Assalamu Alaikum, I'd like to request a consultation with RizSync." Hidden on `/contact` form focus on mobile to avoid overlap.

### 5.4 Reusable components list
`Container`, `Section`, `Eyebrow`, `SectionHeading`, `Button`, `PillarCard`, `ServiceBubble`, `ServiceWheel`, `ValueCard`, `StatCounter`, `TestimonialSlider`, `CTABanner`, `ConsultationForm`, `Breadcrumbs`, `FAQAccordion`, `BlogCard`, `JsonLd`, `WhatsAppFab`.

---

## 6. Page Specifications

### 6.1 Home Page — `/`

> **Superseded by `HOME_REDESIGN.md` §4 (v2).** The layout below is the v1 home page and is kept for history only.
**Meta title:** RizSync Business Solution | Unified Ethical Partner for Growth in Bangladesh
**Meta description:** RizSync is a multi-disciplinary platform providing expert corporate services, government assistance, and digital transformation, guided by the Quranic business model of trust and integrity.

Sections in order:

#### ① Hero (full viewport, min-height 92vh)
- Background: Dhaka cityscape photo + glowing circuitry overlay, with a navy gradient overlay (`from-navy-950/90 via-navy-900/75 to-navy-900/40`, left → right) so text stays readable.
- **Layout desktop:** 2 columns (5/12 text, 7/12 hub).
- **Left column:**
  - Eyebrow: "ETHICAL • PROFESSIONAL • INTEGRATED"
  - **H1:** RizSync Service Solution
  - Sub-heading: Your Unified Professional Partner for Business & Family.
  - **Motto strip:** Connect • Simplify • Protect • Transform • Grow — rendered as 5 pill chips with thin gold borders, words animate in one by one (stagger 80ms).
  - Primary CTA: **Request Consultation — An Ethical Partnership** (gold)
  - Secondary: "Explore Services" (outline white) → `#pillars`
  - Trust micro-row: small icons + text: "Confidential (Amanah)" · "Transparent Pricing" · "Mirpur, Dhaka"
- **Right column — Interactive Hub + Service Bubbles** (see ②)
- **Mobile:** text first, then wheel (max 320px wide), then bubbles stacked as cards.

#### ② Central Interactive Hub (The Wheel) + Service Bubbles
- Built as **inline SVG** component `ServiceWheel`.
- Center: circle with RizSync logo (sharp SVG), soft gold ring glow.
- Around it: **6 arc segments** (one per pillar) with pillar colors, small gap between arcs, pillar icon on each arc; labels outside the ring on desktop.
- Right side (desktop, overlapping the wheel's right edge): **3 Service Bubbles** as stacked rounded cards, connected to the wheel with thin dotted curved lines:
  1. **Orange — Business & Corporate Services** *(Trust (Amanah)-based support)* — RJSC/Tax & VAT · Bangladesh Bank Filings · Corporate Documentation · Regulatory Compliance
  2. **Teal — Government Service Assistance** *(Ethical bureau-navigation)* — BRTA Services · DNCC/City Corp Matters · Passport & Renewal · Land Fees & Tax
  3. **Teal/Gold — Benefits & Value: Transformation** *(Just value delivery)* — Significant Time Savings · Economy Saving · Expert Documentation · Partner for Business & Family · Tech Back-Office
- **Interaction:**
  - Hover/focus an arc → arc scales 1.04 + brightens; matching bubble gets a colored ring + lifts; the dotted connector animates (stroke-dashoffset). Other arcs dim to 50%.
  - Hover a bubble → the matching arc highlights (two-way).
  - Arcs without a bubble (Finance, Digital, Family) show a tooltip card with title + 1 line + "Learn more →".
  - Click arc or bubble → navigates to the service sub-page.
  - Keyboard accessible: arcs are `<a>` elements with `tabIndex`, `aria-label`, visible focus ring.
  - Idle state: very slow rotation of an outer dotted ring only (not the arcs). Respect `prefers-reduced-motion`.
- Responsive: the SVG uses `viewBox` and scales; below 768px the bubbles become a horizontal swipeable row or stacked cards under the wheel.

#### ③ Trust Strip (white)
4 stat counters (count-up on view): e.g. "500+ Clients Served", "6 Service Pillars", "100% Confidential", "Since 2021". **Placeholder numbers — confirm with client.**

#### ④ Core Pillars — 6-Card Grid (`#pillars`, background `--mist`)
- Eyebrow "OUR SERVICES", H2 "Six Pillars. One Trusted Partner."
- Grid: 3×2 desktop, 2×3 tablet, 1×6 mobile.
- Each `PillarCard`: 3px top border in pillar color, tinted icon circle, title, 4 bullet items, "Learn more →" link. Hover lift.

#### ⑤ The Ethical Difference (navy section, geometric pattern)
- H2 "Business Guided by Timeless Values"
- 4 value cards: **Justice (Adl) عدل · Trust (Amanah) أمانة · Transparency (Shaffafiyyah) شفافية · Benefit (Naf'ah) نفع** — Arabic word in Amiri gold, English title, one-line explanation.
- Link: "Read about our Quranic Business Model →" `/about#values`

#### ⑥ How We Work (4 steps, horizontal timeline)
1. Consultation → 2. Assessment & Transparent Quote → 3. Execution & Documentation → 4. Delivery & Ongoing Support

#### ⑦ Who We Serve
4 audience cards: Entrepreneurs · SMEs · Corporate Organizations · High-Net-Worth Individuals & Families — each with 1-line benefit.

#### ⑧ Testimonials Slider
3 placeholder testimonials (name, role, company, quote, 5 stars). Auto-advance 6s, pause on hover, dots + arrows.

#### ⑨ Latest Insights
3 latest blog cards from MDX. "View all insights →".

#### ⑩ Consultation CTA + Form (`#consultation`)
Split section: left navy panel with heading "Let's Simplify Your Business & Family Matters", phone, WhatsApp, email, office; right white card with the `ConsultationForm` (see §7).

#### ⑪ Footer

---

### 6.2 About Us — `/about`
**Meta title:** About RizSync | Our Vision, Mission & Ethical Foundation
**Meta description:** Learn about RizSync's mission to simplify complexity in Bangladesh. We operate on a Quranic business model, prioritizing Justice, Trust, and Transparency in all client engagements.

1. **Page hero** (navy, 45vh): Breadcrumb, H1 "About RizSync", sub "Simplifying complexity, ethically."
2. **Our Story** — 2 columns: text (placeholder story, founded 2021, Mirpur) + image.
3. **Vision & Mission** — 2 large cards side-by-side:
   - Vision: *To be Bangladesh's most trusted platform connecting professional business support with personal welfare.*
   - Mission: *To empower organizations and individuals by simplifying regulatory, financial, and digital complexities through expert, human-centric, and ethical advisory.*
4. **Our Values & The Quranic Business Model** (`#values`, key differentiator, navy + geometric pattern):
   - Intro: "Our operations are guided by principles of Islamic business ethics, ensuring:"
   - 4 large value cards (Adl, Amanah, Shaffafiyyah, Naf'ah) with Arabic term, English meaning, and a 2–3 line explanation of how it shows up in client work (e.g., Amanah → NDA-level confidentiality on all documents).
5. **Leadership Team** — grid of 3–4 cards (photo placeholder, name, title, short bio, LinkedIn icon).
6. **CTA Banner** → Request Consultation.

### 6.3 Services Hub — `/services`
**Meta title:** Comprehensive Professional Services | RizSync Service Solution
**Meta description:** Explore RizSync's six core pillars of service, from Finance & Accounting to Digital Transformation and Family Welfare. Tailored for SMEs, Corporates, and Individuals in Bangladesh.

1. Page hero with a smaller static version of the wheel.
2. 6 large pillar cards (alternating left/right image-text rows on desktop).
3. "Not sure where to start?" CTA → consultation.
4. FAQ accordion (5 general FAQs, placeholders) + FAQPage schema.

### 6.4 Service Sub-page Template — `/services/[slug]`
All 6 pages share one template driven by `src/data/services.ts`:

1. Hero: breadcrumb, pillar-color eyebrow, H1, 2-line intro, CTA.
2. "What We Handle" — the content items as icon cards (each with a 1–2 line description, written by developer as placeholder).
3. "Why RizSync for this" — 3 bullets tying to ethics values.
4. Process (4 steps, reused).
5. Service-specific FAQ (3–5 Q&A) + FAQPage schema.
6. Related services (other pillars, 3 cards).
7. CTA + inline consultation form with **Subject pre-selected** to this service.

| Slug | H1 | Content items | SEO keywords |
|------|----|---------------|--------------|
| `finance-accounting` | Professional Finance, Accounting & Business Support | Tax & VAT Compliance; Treasury Operations; Cash Flow Management; Financial Reporting & Advisory; Expert Documentation | Accounting services Bangladesh, Corporate tax Dhaka, Financial advisory Mirpur |
| `business-corporate` | Strategic Business & Corporate Services | RJSC Registration & Filings; Corporate Documentation & Support; Compliance & Regulatory Services; Company Secretarial | Company formation Bangladesh, RJSC assistance, Corporate compliance services |
| `government-assistance` | Efficient Government Service Assistance & Liaison | BRTA Services (Vehicle, License); DNCC & DSCC Matters; Passport Application & Renewal; Land Fee & Tax Payments | BRTA license renewal Dhaka, DNCC services, Land mutation Bangladesh, Trade license assistance |
| `digital-transformation` | Digital Transformation & Business Process Outsourcing (BPO) | Digital Process Automation; ERP & Accounting System Support; Cloud Services & AI Integration; Back-Office Optimization | BPO services Dhaka, Digital transformation Bangladesh, Cloud integration for business, Accounting software support |
| `family-welfare` | Holistic Family Welfare & Financial Planning | Family Financial Planning; Wealth Assessment & Advisory; Education & Retirement Planning; Long-Term Security Solutions | Personal financial planning Dhaka, Wealth advisory Bangladesh, Family security solutions |
| `why-rizsync` | Why Choose RizSync? Our Value Proposition | Significant Time Savings; Expert Documentation; Trusted Partner for Business & Family; Integrated & Seamless Service | Professional services platform Dhaka, Trusted business partner Bangladesh |

Each page gets a unique meta title (`{H1} | RizSync`) and a unique 150–160 char meta description containing its keywords.

### 6.5 Insights — `/insights`
**Meta title:** Business Insights, Regulatory Updates & Islamic Finance | RizSync Blog
**Meta description:** Stay updated on changes in Bangladesh Tax law, RJSC regulations, ESG standards, and Islamic business practices. Expert analysis from RizSync advisors.

- Hero + search bar (client-side filter by title/excerpt/tags).
- Category pills: Tax & VAT · RJSC & Compliance · Government Services · Digital Transformation · Islamic Finance · Family Planning.
- Featured post (large card) + grid of posts (3 cols), pagination (9 per page).
- Article page: title, author, date, reading time, category, cover image, table of contents (sticky on desktop), prose styling (`@tailwindcss/typography`), share buttons, related posts, CTA box. `Article` + `BreadcrumbList` schema.
- Seed **3 sample MDX posts** (placeholder content) so the layout is testable.

MDX frontmatter:
```yaml
title: ""
slug: ""
excerpt: ""
category: ""
tags: []
author: ""
date: "2026-01-01"
cover: "/images/insights/xxx.webp"
featured: false
```

### 6.6 Contact — `/contact`
**Meta title:** Request a Consultation | Contact RizSync Business Solution in Dhaka
**Meta description:** Contact our expert team at RizSync for a consultation. Reach us by phone, email, or visit our corporate office in Mirpur, Dhaka. We are ready to assist your business and family needs.

1. Hero: "Request a Consultation".
2. 3 quick-contact cards: Call · WhatsApp · Email (large, clickable).
3. Main: form (left 7/12, `id="consultation-form"`) + office info card (right 5/12) with both addresses and hours.
4. Google Map embed (lazy-loaded iframe, Corporate Office) + "Get Directions" button.
5. "Who are you?" tabs above the form — **Business / Corporate / Individual & Family** — selecting a tab adjusts the Subject options (clear pathways for different customer types).

---

## 7. Consultation Form

Fields (from brief) + practical additions:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | ✔ | |
| Company / Family Name | text | — | |
| Email | email | ✔ | |
| Phone | tel | ✔ | Validate BD format `^(?:\+?88)?01[3-9]\d{8}$` |
| Client type | select | ✔ | Business / Corporate / Individual & Family |
| Subject | select | ✔ | 6 pillars + "Other" (pre-select from query `?service=slug`) |
| Message | textarea | ✔ | min 20 chars |
| Preferred contact | radio | — | Phone / WhatsApp / Email |
| Consent | checkbox | ✔ | "I agree that RizSync may contact me regarding my inquiry." |
| Honeypot | hidden | — | spam trap |
| Turnstile | widget | ✔ | CAPTCHA |

Flow: client validation (Zod) → POST `/api/contact` → server validates again + verifies Turnstile + rate-limits by IP (5/hour) → sends branded HTML email to `CONTACT_TO_EMAIL` via Resend + auto-reply to the user → (optional) inserts into Supabase `leads` → returns success.
UI states: idle, submitting (spinner, disabled), success (checkmark + "We'll contact you within 1 business day, In shā' Allāh." + WhatsApp link), error (friendly message + phone fallback).
Fire GA4 event `generate_lead` (and Meta Pixel `Lead` if enabled) on success.

---

## 8. SEO & Technical Requirements

- Use Next.js `generateMetadata` on every page: title, description, canonical, Open Graph, Twitter card.
- Title template: `%s | RizSync` ; default = Home title.
- **JSON-LD schema** (`JsonLd` component):
  - Site-wide: `Organization` + `ProfessionalService`/`LocalBusiness` (name, logo, url, telephone, email, both addresses as `PostalAddress` with `addressLocality: Mirpur`, `addressRegion: Dhaka`, `addressCountry: BD`, `sameAs` social links, `openingHours`, `areaServed: Bangladesh`).
  - `WebSite` with `SearchAction` → `/insights?q=`.
  - `Service` on each sub-page, `FAQPage` where FAQs exist, `BreadcrumbList` on all inner pages, `Article` on blog posts.
- One H1 per page; logical H2/H3 hierarchy.
- `sitemap.ts` (all static pages + blog posts, `lastModified`), `robots.ts` (allow all, link sitemap).
- Descriptive `alt` on every image; file names keyword-friendly.
- `lang="en"`; add `hreflang` only if a Bangla version is added later.
- Internal linking: every service page links to 3 related services + contact.

### Performance (Core Web Vitals targets)
- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO (mobile).
- LCP < 2.5s: hero image via `next/image` with `priority`, AVIF/WebP, `sizes`, ≤ 200KB.
- CLS < 0.1: fixed dimensions for images, `next/font`.
- Map iframe and testimonial slider lazy-loaded; GTM loaded `afterInteractive`.
- Static generation for all pages (SSG); blog uses SSG with `generateStaticParams`.

### Accessibility
- WCAG 2.1 AA contrast, visible focus states (gold 2px ring), skip-to-content link, keyboard-operable menu/wheel/slider, `prefers-reduced-motion` honored, form labels + error messages linked with `aria-describedby`.

### Security
- HTTPS (Vercel), security headers in `next.config` (CSP allowing GTM/Turnstile/Maps, X-Frame-Options, Referrer-Policy), secrets only server-side, rate-limited API.

---

## 9. Suggested Folder Structure

```
rizsync-website/
├─ DESIGN.md
├─ design/home-reference.png          # added later (ChatGPT mockup)
├─ content/insights/*.mdx
├─ public/images/{hero, services, team, insights}/
├─ public/logo.svg
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx  page.tsx  not-found.tsx  sitemap.ts  robots.ts
│  │  ├─ about/page.tsx
│  │  ├─ services/page.tsx
│  │  ├─ services/[slug]/page.tsx
│  │  ├─ insights/page.tsx  insights/[slug]/page.tsx  insights/category/[category]/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ privacy-policy/page.tsx  terms/page.tsx
│  │  └─ api/contact/route.ts
│  ├─ components/{layout, home, sections, ui, forms, seo}/
│  ├─ config/site.ts                   # name, phone, email, addresses, socials, hours
│  ├─ data/{services.ts, values.ts, testimonials.ts, team.ts, faqs.ts, stats.ts}
│  ├─ lib/{mdx.ts, schema.ts, validators.ts, email.ts}
│  └─ styles/globals.css               # tokens as CSS variables
└─ .env.example
```

---

## 10. Build Order for Claude Code (phases)

1. **Setup:** Next.js + TS + Tailwind + shadcn, fonts, tokens in `globals.css`, `site.ts` config, folder structure.
2. **Global layout:** Header (desktop mega-menu + mobile sheet), Footer, WhatsApp FAB, base UI components.
3. **Home page** (match `design/home-reference.png` if present), including the `ServiceWheel` SVG with two-way hover.
4. **Data files** (`services.ts` etc.) → Services hub + dynamic sub-page template (all 6 pages).
5. **About page** with Values section.
6. **Contact page + ConsultationForm + `/api/contact`** (Resend, Turnstile, rate limit, optional Supabase).
7. **Insights** (MDX, listing, search, categories, article page, 3 sample posts).
8. **SEO layer:** metadata, JSON-LD, sitemap, robots, OG images.
9. **Analytics:** GTM/GA4, optional Meta Pixel, `generate_lead` event.
10. **QA:** responsive check (360, 768, 1024, 1440px), Lighthouse, accessibility, broken links, form end-to-end test, then deploy to Vercel.

---

## 11. Deliverables Checklist
- [x] Header navigation (links, Services dropdown, CTA)
- [x] Hero (Dhaka background, interactive hub, primary CTA)
- [x] 3 Service Bubbles with ethical sub-titles
- [x] 6-card Core Pillars grid (teal/orange scheme)
- [x] About page with Quranic Business Model section
- [x] 6 service sub-pages with unique SEO metadata
- [x] Testimonials slider (placeholder)
- [x] Insights/Blog structure + 3 sample posts
- [x] Footer (contact, both addresses, ethics statement, socials)
- [x] Working consultation form (email + CAPTCHA + anti-spam)
- [x] Schema, GA4/GTM, sitemap for Search Console, SSL
- [x] Fully responsive, Lighthouse ≥ 95

---

## Implementation notes (added during the build)

These are the places where the build had to make a decision the spec did not
cover, or deliberately departed from it. Everything else follows the sections
above as written.

1. **shadcn/ui primitives.** The project uses the same Radix primitives shadcn
   is built on (Navigation Menu, Dialog, Accordion, Tabs) with local styled
   components, rather than the shadcn CLI. Selects, radios and checkboxes are
   native elements: they are keyboard- and screen-reader-correct for free and
   use the platform picker on mobile.
2. **Service bubbles at 1024px.** The side-by-side hub in §6.1 ② needs about
   1280px to hold three bubbles beside the wheel without them colliding. Below
   `xl` the hub stacks — wheel first, bubbles as cards underneath — which is the
   mobile arrangement the spec already describes, applied one breakpoint higher.
3. **Meta description length.** The descriptions given verbatim in §6.1, §6.2,
   §6.3 and §6.6 are 180–189 characters, so Google will truncate them at around
   160. They are used exactly as written; shortening them is a client decision.
   The six service sub-page descriptions are within the 150–160 range §6.4 asks
   for.
4. **Hero artwork and photography.** `public/images/hero/hero-dhaka.webp` and
   the blog covers are generated placeholders in the brand palette, not
   photographs. They exist so the layout is testable and nothing renders broken;
   replace them per §0.7 and §4.4.
5. **Rate limiting.** The 5/hour per-IP limit in §7 is enforced in memory per
   server instance. That throttles a single abusive client; Turnstile and the
   honeypot are the real spam defences. Move to a shared store if a strict global
   limit is ever needed.
6. **Form delivery honesty.** If neither Resend nor the optional Supabase backup
   is configured, `/api/contact` returns 502 and the form shows its error state
   with the phone fallback, rather than showing a success screen for a message
   nobody received.
