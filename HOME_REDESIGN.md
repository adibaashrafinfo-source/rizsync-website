# RizSync — Home Page Redesign Spec (v2 "Corporate Premium")

> **For Claude Code.** This file replaces the Home page layout AND the visual design tokens in `DESIGN.md` §4 / §6.1.
> Everything else in `DESIGN.md` (sitemap, other pages, SEO, form backend, schema, analytics) still applies.
>
> **Visual reference:** `design/home-reference.html` — an approved static mockup (1440px desktop) with all styles inline.
> Treat it as the pixel source of truth for colors, spacing, sizes, copy and section order.
> It is a *design file*, not production code: do NOT copy its markup as-is. Rebuild it as clean, reusable,
> responsive Next.js + Tailwind components as described below. Ignore its `<x-dc>`, `<helmet>`, `support.js` and
> `DCLogic` script — those belong to the design tool.
>
> _Build note: `design/home-reference.html` was not present in the repository when v2 was built.
> The build follows this spec; copy the spec defers to the reference for was written to match it
> and is marked in the relevant data files. Drop the reference into `design/` to re-check._

---

## 1. What changes vs. the current build

| Area | Old | New (v2) |
|------|-----|----------|
| Display font | Plus Jakarta Sans | **Sora** (600/700/800), tight tracking |
| Body font | Inter | **DM Sans** (400/500/600/700) |
| Arabic accents | Amiri | Amiri (unchanged) |
| Card style | Top-border cards | Rounded 20px cards, 1px border `#E6EBF2`, soft navy shadow, colored icon tile |
| Hero | Photo background | Navy + subtle grid pattern + teal/orange glow circles + circuit lines (photo optional later) |
| New sections | — | Quick Service Bar (overlaps hero), About split, Benefits band, CTA banner with rings |
| Stats strip | Separate section | Removed (placeholder numbers were not real). "Since 2021" lives in the About split |

Update `DESIGN.md` §4 to match §2 below so the rest of the site uses the same system.

---

## 2. Design Tokens

### 2.1 Colors — add to `globals.css` as CSS variables and expose in Tailwind theme

```css
:root {
  /* Brand (from client brief — do not change) */
  --navy:        #00204A;
  --teal:        #0FA3A3;
  --orange:      #F28C28;
  --gold:        #C9A24D;

  /* Accessible text shades (use these for SMALL text on white) */
  --teal-ink:    #0B7A7A;
  --orange-ink:  #B35A0B;
  --orange-icon: #C4650D;
  --gold-ink:    #8E6F24;

  /* Tints (icon tiles, chips) */
  --teal-50:     #E6F6F6;
  --orange-50:   #FEF1E4;
  --orange-25:   #FFF8F1;
  --gold-50:     #F8F1E1;

  /* On-dark text */
  --on-navy:        #FFFFFF;
  --on-navy-muted:  #C7D3E3;
  --on-navy-soft:   #B5C3D6;
  --on-navy-faint:  #9FB3CF;
  --teal-on-navy:   #5FD3D3;   /* eyebrow on navy */
  --teal-chip-text: #7FDADA;
  --orange-chip-text:#F7B877;
  --gold-chip-text: #E4C98A;

  /* Neutrals */
  --ink:     #0F172A;
  --ink-2:   #1E293B;
  --body:    #475569;
  --muted:   #64748B;
  --line:    #E6EBF2;
  --line-2:  #D6DEE8;
  --mist:    #F5F7FA;
  --white:   #FFFFFF;
}
```

**Contrast rules (must follow):**
- Buttons on gold / teal / orange backgrounds use **navy text** (`#00204A`), never white.
- Small text on white uses the `-ink` shades, never raw `#0FA3A3` / `#F28C28`.
- Raw teal/orange/gold are for shapes, icon tiles, arcs, number circles and large display text.

### 2.2 Typography

Load with `next/font/google`: `Sora`, `DM_Sans`, `Amiri` (subsets: latin + arabic for Amiri).

| Token | Font | Size desktop / mobile | Weight | Line-height | Tracking |
|-------|------|----------------------|--------|-------------|----------|
| `display` (Hero H1) | Sora | 70 / 40px | 700 | 1.04 | -0.035em |
| `h2` | Sora | 46 / 30px (some sections 42) | 700 | 1.12 | -0.03em |
| `h3-card` | Sora | 22 / 20px | 700 | 1.25 | normal |
| `h4` | Sora | 17–20px | 700 | 1.2 | normal |
| `lead` | DM Sans | 20 / 17px | 400 | 1.6 | — |
| `body` | DM Sans | 16–18 / 15–16px | 400 | 1.7 | — |
| `eyebrow` | DM Sans | 13px UPPERCASE | 700 | — | 0.16em, color `--teal-ink` (on navy: `--teal-on-navy`) |
| `small` | DM Sans | 13–14px | 500–600 | — | — |
| `arabic` | Amiri | 46px (values) | 400 | 1.2 | — |

### 2.3 Shape, spacing, depth
- Container: max-width 1280px, horizontal padding 80px desktop / 32px tablet / 20px mobile.
- Section padding: 104–128px desktop, 72px tablet, 56px mobile.
- Radius: buttons & inputs **12px**, small chips **6–10px**, cards **20px**, big panels **24–28px**, pills **999px**.
- Shadows:
  - card: `0 30px 60px -24px rgba(0,32,74,0.6)` (only on the featured navy card)
  - floating white: `0 30px 70px -24px rgba(0,32,74,0.35)`
  - gold CTA glow: `0 16px 36px -14px rgba(201,162,77,0.8)`
- Card hover (all clickable cards): `translateY(-4px)` + border becomes `--line-2` + shadow `0 24px 48px -24px rgba(0,32,74,0.25)`, 200ms ease-out.
- Icons: lucide-react, stroke 2, inside square tiles (48px/60px, radius 12–16px) filled with a tint.

### 2.4 Buttons (`<Button variant>`)
| Variant | Style |
|---------|-------|
| `gold` (primary CTA) | bg `--gold`, text `--navy`, 700, h-60 (hero) / h-48 (header), radius 12, gold glow shadow, arrow icon |
| `navy` | bg `--navy`, white text |
| `outline-light` | 1.5px `rgba(255,255,255,.3)` border, white text (on navy) |
| `outline-dark` | 1.5px `--navy` border, navy text |
| `whatsapp` | outline-light with WhatsApp icon in `#25D366` |
All buttons: visible focus ring `2px solid --gold` offset 2px, min height 44px.

---

## 3. Component Map

Create under `src/components/home/` (plus shared ones in `src/components/ui/`):

```
Header.tsx               (global — replace existing)
HeroSection.tsx
  ├─ MottoChips.tsx
  ├─ ServiceWheel.tsx    (interactive SVG)
  └─ HeroServiceCards.tsx
QuickServiceBar.tsx
AboutSplit.tsx
PillarsGrid.tsx          → PillarCard.tsx
BenefitsBand.tsx
ValuesSection.tsx        → ValueCard.tsx
ProcessSteps.tsx
Testimonials.tsx
CtaBanner.tsx
InsightsPreview.tsx      → BlogCard.tsx (shared with /insights)
ConsultationSection.tsx  → ConsultationForm.tsx (shared with /contact)
Footer.tsx               (global — replace existing)
```

All copy comes from data files so it is edited in one place:
`src/data/services.ts` (6 pillars: slug, title, shortTitle, color, icon, bullets, heroCard?), `src/data/values.ts`, `src/data/benefits.ts`, `src/data/process.ts`, `src/data/testimonials.ts`, `src/config/site.ts` (phone, email, addresses, socials).

Pillar → color → icon mapping (use everywhere):

| # | Pillar | slug | Color | lucide icon |
|---|--------|------|-------|-------------|
| 01 | Finance, Accounting & Business Support | `finance-accounting` | teal | `BarChart3` |
| 02 | Business & Corporate Services | `business-corporate` | orange | `Briefcase` |
| 03 | Government Service Assistance | `government-assistance` | teal | `Landmark` |
| 04 | Digital & Business Transformation | `digital-transformation` | orange | `Cpu` |
| 05 | Family Welfare & Services | `family-welfare` | teal | `Home` |
| 06 | Benefits & Value Proposition | `why-rizsync` | gold | `Award` |

---

## 4. Section-by-Section Spec (desktop 1440 → responsive rules after each)

### 4.1 Header (sticky)
- h-88, bg `--navy`, bottom border `rgba(255,255,255,.08)`. On scroll > 40px: h-72, add shadow.
- Left: logo tile (44px white rounded-12 square with teal/orange sync mark) + "RizSync" (Sora 22/700) + "SERVICE SOLUTION" (10.5px, tracking 0.22em, `--on-navy-faint`). Replace the tile with the real logo SVG when provided.
- Right: Home · About Us · Services ▾ (mega-menu per DESIGN.md §5.1) · Insights · Contact · divider · phone `+880 1711-504625` (tel: link, white 600) · **Request Consultation** (gold, h-48).
- Active link white; others `--on-navy-muted`.
- **< 1024px:** logo + phone icon button + hamburger → Sheet menu (services accordion, gold CTA full-width, WhatsApp link).

### 4.2 Hero
- Height ~820px desktop (min-height, content-driven), bg `--navy`.
- Background layers (absolutely positioned SVG, `aria-hidden`):
  1. 48px grid pattern, white stroke at 4.5% opacity.
  2. Teal circle r=420 at 7% opacity centered behind the wheel; orange circle r=260 at 6% bottom-right.
  3. Two thin "circuit" polylines bottom-left (teal 35%, orange 30%) ending in small dots.
  4. Optional later: Dhaka skyline photo at low opacity blended under the grid (keep the navy dominant).
- **Left column (≈580px):**
  - Pill badge: inner teal pill "ETHICAL" (navy text) + "Guided by the Quranic Business Model".
  - H1: `RizSync <span orange>Service</span> <span teal>Solution</span>` (only ONE H1 on the page).
  - Lead (20px, `--on-navy-muted`): "Your unified professional partner for business & family — corporate compliance, government liaison, finance and digital transformation, under one trusted roof."
  - MottoChips: Connect (teal) · Simplify (orange) · Protect (teal) · Transform (orange) · Grow (gold). Chip = h-38, radius 10, 14% tinted bg, 45% border, light text. Stagger fade-up 80ms on load.
  - Buttons: gold "Request Consultation →" + "WhatsApp Us" (whatsapp variant → `https://wa.me/8801711504625?text=...`).
  - Social proof row: 3 overlapping 40px avatar circles (placeholders) + "Trusted by entrepreneurs, SMEs, corporates & families since 2021".
- **Right column (≈700px):** ServiceWheel (left) + 3 HeroServiceCards stacked on the right (see 4.3).
- **Responsive:**
  - 1024–1279: wheel 380px, cards 280px.
  - < 1024: stack — text first, then wheel (max 340px, centered), then the 3 cards as a vertical list (full width).
  - < 640: H1 40px, chips wrap, buttons full-width stacked.

### 4.3 ServiceWheel (interactive SVG) + HeroServiceCards — **key feature**
- SVG `viewBox="-60 -30 640 580"`, center (260,260), arc radius 190, six 54° arcs with 6° gaps, `stroke-linecap: butt`, stroke-width 34 (active arc 46).
- Arc paths (reuse exactly):
  ```
  finance     M 269.9 70.3  A 190 190 0 0 1 419.3 156.5   teal
  business    M 429.3 173.7 A 190 190 0 0 1 429.3 346.3   orange
  government  M 419.3 363.5 A 190 190 0 0 1 269.9 449.7   teal
  digital     M 250.1 449.7 A 190 190 0 0 1 100.7 363.5   orange
  family      M 90.7 346.3  A 190 190 0 0 1 90.7 173.7    teal
  value       M 100.7 156.5 A 190 190 0 0 1 250.1 70.3    gold
  ```
- Center: white circle r=118, "RizSync" (Sora 40/700 navy) + "SERVICE PLATFORM" (12px teal-ink, letter-spacing 3). Dashed ring r=150 at 15% white.
- Labels outside the ring (DM Sans 16/600, `#DCE5F0`).
- HeroServiceCards (320px wide, radius 18):
  1. **Business & Corporate** — sub "Trust (Amanah)-based support" — chips: RJSC / Tax & VAT · Bangladesh Bank Filings · Corporate Docs · Compliance
  2. **Government Assistance** — "Ethical bureau-navigation" — BRTA · DNCC / City Corp · Passport & Renewal · Land Fees & Tax
  3. **Benefits & Value** — "Just value delivery" — Time Savings · Economy Saving · Expert Documentation · Tech Back-Office
- **States:**
  - Card *inactive*: glass style `bg rgba(255,255,255,.08)`, border `rgba(255,255,255,.16)`, white text.
  - Card *active*: solid white bg, dark text, `box-shadow: 0 0 0 3px <pillar color>, 0 30px 60px -20px rgba(0,0,0,.6)`, content switches to chip style (as in the reference Business card).
  - Arc *active*: stroke-width 46; other arcs opacity 0.45.
  - A dashed curved connector (2px, pillar color) animates from the active arc to its card (stroke-dashoffset animation).
- **Behaviour:**
  - Default active = `business` (as in the mockup).
  - Hover/focus an arc ↔ highlights its card, and hover/focus a card ↔ highlights its arc (shared `activeId` state).
  - Arcs without a hero card (finance, digital, family) show a small tooltip card near the arc: title + one line + "Learn more →".
  - Idle: auto-cycle active pillar every 4s until the user interacts; stop permanently after first interaction.
  - Click arc or card → `/services/[slug]`.
  - Each arc is wrapped in `<a href>` with `aria-label`, `tabIndex=0`, visible focus (gold outline). Respect `prefers-reduced-motion` (no auto-cycle, no dash animation).
- Implement with Framer Motion for stroke-width/opacity transitions (200ms).

### 4.4 QuickServiceBar
- Overlaps the hero: `-mt-[84px]`, `relative z-10`, container padding 80px.
- White panel, radius 20, floating shadow, 6-column grid; columns separated by 1px `--line` right borders.
- Each column: 48px icon tile (tint bg + ink icon) + Sora 16/600 title; link to service page. Business column shown highlighted (bg `--orange-25`, solid orange tile) — on the live site the highlight follows **hover** instead of being fixed.
- **Responsive:** 3×2 grid at < 1280; horizontal scroll-snap row of 6 at < 768 (each 160px min).

### 4.5 AboutSplit
- 2 columns, gap 88, padding-top 128.
- Left visual (520px tall):
  - 470×470 navy panel radius 24 with a subtle gold 8-point geometric pattern (14% opacity) → will hold the team/office photo (`next/image`, object-cover; pattern overlays photo at low opacity).
  - Floating teal card bottom-right: "2021" (Sora 44/800 navy) + "Serving Dhaka's businesses & families since".
  - Floating white card top-right: orange shield icon + "100% Confidential".
- Right: eyebrow WHO WE ARE · H2 "One partner for every professional matter — handled with <orange>integrity</orange>." · paragraph · 3 check rows (Vision / Mission / Values, bold label) · navy button "More About RizSync →" (`/about`).
- **Responsive:** stack; visual first at max 420px height; floating cards scale down.

### 4.6 PillarsGrid
- Section bg `--mist`. Header row: eyebrow OUR SERVICES + H2 "Six pillars of expertise. One seamless experience." (left) + outline-dark "All Services" button (right).
- 3×2 grid, gap 24. PillarCard: padding 36, radius 20, 60px icon tile, number "01"…"06" top-right (Sora 15/700 `#94A3B8`), title, bullets joined with " · ", "Learn more →" in pillar ink color.
- Card 02 (Business) is the **featured** navy variant (navy bg, orange tile, light text). Keep this featured style fixed on the homepage.
- **Responsive:** 2 cols < 1024, 1 col < 640.

### 4.7 BenefitsBand
- Navy bg, grid 4fr / 8fr.
- Left: eyebrow WHY RIZSYNC (teal-on-navy) + H2 "Less paperwork. Less waiting. <gold>More growth.</gold>" + paragraph.
- Right: 2×2 benefit cards (glass: 5% white bg, 10% border, radius 18): solid colored 52px icon tile (navy icon) + title + one line.
  Significant Time Savings (teal, Clock) · Economy Saving (orange, Wallet) · Expert Documentation (gold, FileCheck) · Tech Back-Office (teal, Server).
- **Responsive:** stack; cards 1 col < 640.

### 4.8 ValuesSection
- Centered header: eyebrow OUR ETHICAL FOUNDATION · H2 "The Quranic Business Model" · sub.
- 4 cards: Arabic word (Amiri 46px) + "Justice · Adl" etc. + one line.
  عدل teal-ink · **أمانة on a navy card with gold Arabic** (featured) · شفافية orange-icon · نفع gold-ink.
- Link to `/about#values` below (optional).
- Arabic words: wrap in `<span lang="ar" dir="rtl">`.
- **Responsive:** 2×2 < 1024, 1 col < 640.

### 4.9 ProcessSteps
- bg `--mist`. H2 "From first call to finished file — in 4 steps".
- 4 columns joined by a 2px `--line-2` horizontal line behind 64px number circles (6px mist border so the line appears to pass behind).
- Circle colors: 1 navy (white text), 2 teal, 3 orange, 4 gold (navy text).
- Steps: Consultation · Transparent Quote · Execution · Ongoing Support (copy in reference).
- **Responsive:** vertical timeline < 768 (line runs vertically on the left).

### 4.10 Testimonials
- Header: eyebrow CLIENT VOICES + H2 "What our clients say" + prev/next round buttons (52px).
- 3 cards, middle one navy (featured). Gold ★★★★★, quote, avatar + name + title.
- Use Embla (shadcn Carousel): 3 visible desktop, 1.1 visible mobile with snap. Placeholder data until real testimonials arrive.

### 4.11 CtaBanner
- Container-width navy panel, radius 28, padding 64/72.
- Decorative rings (`aria-hidden`): orange ring (380px, 56px border) top-right, teal ring (300px, 44px border) bottom, both clipped by `overflow-hidden`.
- H2 "Ready for an ethical partnership?" + sub + gold button "Request Consultation".
- **Responsive:** stack, center text, rings smaller.

### 4.12 InsightsPreview
- bg `--mist`. H2 "Latest updates & guidance" + "View all insights →".
- 3 BlogCards from the latest 3 MDX posts (white, radius 20, 220px cover via `next/image`, category chip with pillar tint, title Sora 20/700, date · read time).
- Fallback cover = solid pillar-colored block when a post has no image.

### 4.13 ConsultationSection (`id="consultation"`)
- Grid 5fr / 7fr.
- Left: eyebrow · H2 "Let's simplify your business & family matters." · sub · 3 contact tiles (mist bg, radius 16, 48px colored icon tile): Call/WhatsApp (navy), Email (teal), Corporate Office (orange).
- Right: white form card (radius 24, border, floating shadow):
  - Segmented control: **Business / Corporate / Individual & Family** (navy active) → sets `clientType` and filters Subject options.
  - Fields (2-col grid): Full name, Company/Family name, Email, Phone; then Subject (select), Message (textarea), consent checkbox.
  - Inputs: h-52, radius 12, 1.5px `--line-2` border; focus border `--teal-ink` + 3px teal 15% ring.
  - Bottom row: Cloudflare Turnstile widget (left) + gold "Send Request →" (right).
  - Validation, API route, email, success/error states: as in `DESIGN.md` §7.
- **Responsive:** stack (info first); form fields 1 col < 640; Turnstile + button stack.

### 4.14 Footer
- Navy, padding 88/80/36. Grid 4fr 2fr 2fr 3fr.
- Col 1: "RizSync" (Sora 28/700) · motto (teal-on-navy) · italic ethics statement · LinkedIn/Facebook 44px icon buttons (`aria-label`).
- Col 2 Services (6 links) · Col 3 Company (About, Insights, Contact, Privacy, Terms) · Col 4 Contact (phone, email, both office addresses with bold labels).
- Bottom bar: `© 2021–{year} RizSync Service Solution. All rights reserved.` + Privacy · Terms.
- **Responsive:** 2 cols < 1024, 1 col < 640.

### 4.15 Floating WhatsApp button
Keep from DESIGN.md §5.3 (56px, `#25D366`, bottom-right).

---

## 5. Motion (subtle, premium)
- Section content: fade-up 16px, 500ms, once, when 20% in view (Framer Motion `whileInView`).
- Cards: hover lift as in §2.3.
- Hero: chips stagger; wheel arcs draw in once on load (pathLength 0→1, 900ms, staggered 80ms).
- Everything disabled under `prefers-reduced-motion`.

---

## 6. Placeholders still pending from client
Client email · real logo SVG · team/office photo · testimonials · blog covers & posts · LinkedIn URL · office hours.
Keep them in `src/config/site.ts` / data files and render clearly marked placeholders — **no invented statistics**.

---

## 7. Acceptance Checklist
- [ ] Fonts switched to Sora + DM Sans (+ Amiri) site-wide via `next/font`; tokens in `globals.css` & Tailwind theme.
- [ ] Home page sections in this exact order: Header → Hero → QuickServiceBar → AboutSplit → PillarsGrid → BenefitsBand → ValuesSection → ProcessSteps → Testimonials → CtaBanner → InsightsPreview → ConsultationSection → Footer.
- [ ] Desktop 1440 visually matches `design/home-reference.html` (colors, spacing, sizes, copy).
- [ ] ServiceWheel: two-way hover, keyboard focus, auto-cycle, click-through, reduced-motion.
- [ ] Responsive checked at 360, 390, 768, 1024, 1280, 1440 — no horizontal scroll.
- [ ] Only one H1; all icons `aria-hidden` or labelled; WCAG AA contrast (see §2.1 rules).
- [ ] Lighthouse mobile ≥ 95 (Performance, Accessibility, Best Practices, SEO).
- [ ] Header/Footer changes applied globally on all pages.
- [ ] `DESIGN.md` §4 updated to these tokens.
