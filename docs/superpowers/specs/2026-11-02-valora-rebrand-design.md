# Valora rebrand and website redesign: design spec

- **Date:** 2 November 2026
- **Status:** Complete, awaiting approval. Logo: Signal. Background: white (chosen after reviewing `/preview` on branch `preview/signal-homepage`).
- **Source review:** https://claude.ai/artifact/1iHmBFZAN3FLXhq7xK6QMx (audit, three logo directions, copy rewrites, conversion plan)

## 1. Goal and success criteria

Rebuild valoradigital.co as a premium, credible, art-directed agency site with one consistent identity across every page, without breaking the existing functionality, integrations, routes, SEO or accessibility.

The site succeeds when:

1. A first-time visitor can tell from the first two screens what Valora does, who it serves, what problem it solves, and how to start.
2. The homepage has 10 sections, no section is longer than two phone screens, and total scroll length is about half today's (16,952px desktop / 28,844px at 390px).
3. Nothing on the site is fabricated, and every rule in `CLAUDE.md` under "Credibility rules" still holds.
4. Every page passes `npm run lint`, `npx tsc --noEmit` and `npm run build`, and has been reviewed in Chrome at 1440, 1024, 768 and 390px.
5. An enquiry submitted through the new form reaches the configured destinations with the same API behaviour as today.

## 2. Decisions

| Topic | Decision |
|---|---|
| Brand name | Logo and speech: **Valora**. Legal and descriptive name: **Valora Digital** (page titles, footer copyright, consent text). Never "The Valora". |
| Overall look | "Modern AI company", calm and minimal: white ground, precise sans type, ink plus one accent, and the live demo as the main visual. No glows, gradients or particles. |
| Logo direction | **Direction D, Signal** (confirmed 2 November 2026). |
| Background | **White.** White and mist grounds throughout. The only dark areas are the full measurement demo section and the footer. The hero is white, as in `/preview`. |
| AI claims | Allowed, because Valora uses them in client work: platform AI bidding (Advantage+, Performance Max, Smart Bidding), AI creative production, and AI analytics and lead scoring. No other AI claims. |
| Founders | Deferred. `founders` stays empty, and About shows team copy only. Adding founders later must be a config-only change. |
| Email | `inquiry@valoradigital.co` |
| Locations | Headquartered in Dubai, with an office in Gurugram. |
| WhatsApp | +91 83685 26041, linked as `https://wa.me/918368526041`. |
| Booking link | None yet. The primary CTA reads "Start a conversation" and opens the enquiry form. When `NEXT_PUBLIC_BOOKING_URL` is set, it reads "Book a call" and opens the link. |
| Reply time | "We reply within one working day." |
| Ad accounts | Clients own their Meta and Google Ads accounts and data. Valora works through partner access. |
| Certifications | None shown. |
| First step | A free initial review of the prospect's tracking and campaigns. No paid audit on the site. |
| Markets | India, the UAE and beyond. Form options: India · UAE & GCC · Other countries · More than one market. |
| Spelling | British/Indian English throughout (optimisation, colour, enrolment, programme). |
| Currency | Budget bands follow the selected market: ₹ for India, AED for UAE & GCC, $ otherwise. |

## 3. Visual identity: Signal

### 3.1 Signal

- **Idea:** "Teach the algorithm what a customer is." The look follows today's leading AI companies, and the AI claim is a true one.
- **Logo:** a flat-cut geometric V knocked out of a solid chamfered tile, next to the wordmark "valora" in lowercase Instrument Sans 600.
  - Variants: tile + wordmark (ink on white), reversed (white tile on ink), app icon (ink or signal tile), and the V alone for circular avatars.
  - The tile reads at 16px.
- **Colour tokens**, set in `site.colors` and injected as `--brand-*` like today:

  | Token | Value | Use |
  |---|---|---|
  | ink | `#0B0C0E` | Text, logo tile, header CTA, the dark demo section |
  | white | `#FFFFFF` | Page ground |
  | mist | `#F4F5F4` | Alternate section ground, segmented controls |
  | graphite | `#5E6368` | Secondary text |
  | line | `#E1E3E1` | Hairlines and card borders |
  | signal | `#0B7A5A` | Primary CTA, links, live states (5.3:1 on white) |
  | signal-bright | `#12B886` | Live dot and accents on dark surfaces |

  The chart series colours (Meta `#4C7DFF`, Google `#D96A2E`) stay unchanged and are used only for data.
- **Type**, loaded through `next/font/google`:
  - Instrument Sans for all text: headlines at 500 with tight tracking, body at 400, wordmark at 600.
  - Geist Mono for numbers, labels and stamps, with tabular figures.
  - These replace Inter, Inter Tight and JetBrains Mono.
- **Type scale:**

  | Role | Size / line height | Notes |
  |---|---|---|
  | Display | 72/74 desktop, 40/42 phone | −3.5% tracking |
  | H2 | 44/48 | −3% tracking |
  | H3 | 24/30 | |
  | Body | 17/28 | |
  | Small | 14/22 | |
  | Label | 12 Geist Mono | uppercase, 0.08em tracking |

- **Layout:**
  - A 12-column grid with wide margins and hairline dividers, and a max content width of 1240px.
  - The hero is centred: kicker, headline, one sentence, CTAs, then a light interactive demo card stamped "Live demo · Sample data" on its top edge.
  - Only real interfaces get a card: the demo and the form.
  - One dark section, for the full demo.
- **Radius:** 6px on buttons, inputs and cards. The chamfer is reserved for the logo tile and stamps.
- **Motion:**
  - Numbers tween when demo filters change.
  - A slow-pulsing live dot on the demo stamp.
  - Link underlines draw on hover.
  - Sections rise 8px once on entry.
  - Under reduced motion, all of it stops. `MotionConfig reducedMotion="user"` and the CSS reduced-motion block stay.
- **Imagery:** none. No stock photography and no abstract "AI" art (orbs, neural networks, robot hands). Founder photography will be added when founders are added.

## 4. Information architecture

### 4.1 Navigation

Services · Industries · How we work · Insights · About, plus the primary CTA. Every item scrolls to a homepage section whose heading answers its label. The mobile menu stays a focus-trapped dialog.

### 4.2 Homepage, in order

| # | Section (id) | Replaces |
|---|---|---|
| 1 | Hero with three commitments (`hero`) | `Hero`, `CredibilityStrip` |
| 2 | The problem (`problem`) | `Problem`, cut from 5 rows to 4 |
| 3 | Acquire, convert, measure (`services`) | `Services` |
| 4 | Industries, all four visible (`industries`) | `Industries` |
| 5 | How we measure, with the demo (`measurement`) | `FullFunnel`, `BeyondClick`, `AnalyticsShowcase` |
| 6 | How an engagement runs (`approach`) | `Methodology`, `Principles` |
| 7 | Working examples (`examples`) | `Projects` |
| 8 | Who you'll work with (`about`) | `Founders` |
| 9 | Notes on measurement (`insights`) | `Insights` |
| 10 | Contact (`contact`) | `Contact`, `LeadForm` |

Components that are removed after the merge: `CredibilityStrip`, `FullFunnel`, `FunnelBand`, `BeyondClick`, `Principles`, `HeroDashboard` (replaced by `HeroDemoCard`). `AnalyticsDemo` and `TrendChart` stay.

### 4.3 Other routes

`/insights`, `/insights/[slug]`, `/privacy`, `/terms`, the 404 page and the error page are restyled in the same system. No route is added, removed or renamed. Dedicated practice and industry pages are out of scope (§10).

## 5. Content

All copy follows the review artifact's Phase 4 rewrites, updated with the decisions in §2. Key strings:

- **Hero.**
  - Kicker: "AI-driven performance marketing · Dubai and Gurugram", with a live dot.
  - H1: "Ad platforms run on AI. We teach it what a customer is."
  - Subhead: "Valora manages Meta, Google and other paid advertising platforms for businesses across India, the UAE and beyond. We feed each platform's AI your qualified leads and sales instead of raw form fills, test AI-generated creative at speed, and report what each customer costs to acquire."
  - CTAs: the primary CTA, plus "See the live report →", which goes to the measurement section.
  - Below the CTAs: a compact, light, interactive demo card (KPIs: spend, qualified leads, cost per qualified lead, opportunities; a 30D/90D toggle; trend lines), stamped "Live demo · Sample data". It reuses `lib/sample-data.ts` and `lib/metrics.ts`.
  - Under the card: three commitments, Cost per qualified lead · Reconciled with your CRM · Caveats in writing.
- **Services, H2 "Acquire, convert, measure."** E-commerce moves to Industries. Lead generation is described as an outcome across Acquire and Convert.
  - Acquire: Meta and Google Ads with Advantage+, Performance Max and Smart Bidding, steered by qualified-lead and sales signals. AI-generated copy, image and video variations, tested against each other.
  - Convert: landing pages, structured A/B tests, AI lead scoring and CRM routing, so the best leads get the fastest reply.
  - Measure: tracking set up properly, platform numbers reconciled with the CRM, AI-assisted summaries of what changed, and a weekly report on cost per qualified lead, acquisition cost and payback.
  - The section closes with a two-column "Where AI fits" split:
    - **AI does the volume:** bidding and budget allocation, creative variations for testing, lead scoring, spotting changes in the data.
    - **People make the calls:** what counts as a qualified lead, which signals the AI learns from, budget and strategy, reading the caveats.
- **Industries, H2 "For businesses where the sale happens after the click."** Four rows, each with a one-line problem, the journey we measure, and a contextual CTA. The CTA keeps `prefillEnquiry()`.
- **Measurement, H2 "What your weekly report looks like."** One short explanation of reported versus real, then the full demo inside the dark section, stamped "Live demo · Sample data". The demo's default metric is cost per qualified lead.
- **Approach, H2 "How an engagement runs."**
  - Stages: Discover · Plan · Launch · Review, each with its outputs.
  - Working rules: you see the numbers we see; every test starts as a written hypothesis; failed tests are recorded; you own your ad accounts and data, and we work through partner access.
- **Examples, H2 "How we approach three common problems."**
  - Intro: "We're a new agency, so there are no client logos here yet. These examples show how we work. Verified results will appear here once clients approve them."
  - Each example is a ruled row with a disclosure for details. Stamps stay.
- **About, H2 "Who you'll work with."**
  - Body: "Valora brings together performance marketing, engineering and data analysis. Headquartered in Dubai, with an office in Gurugram, we work with businesses in India, the UAE and beyond."
  - The founder grid renders only when `founders` is non-empty (unchanged logic).
- **Insights, H2 "Notes on measurement."** An editorial list on the homepage and on `/insights`. No author byline until founders exist. Articles end with "Talk to us about this", which prefills the form's message with the article title.
- **Contact, H2 "Tell us what you're trying to grow."**
  - Subhead: "We reply within one working day. Your first review of tracking and campaigns is free: you'll get our view on where to focus first, and whether we're the right fit."
  - Beside the form: the email, WhatsApp, both locations, and the existing three "what happens next" steps.
- **Spelling:** all copy, including `content/insights.ts`, config labels and legal drafts, is converted to British spelling.

## 6. Design system components

New components go in `components/ui/`. Existing ones are restyled in place.

| Component | Purpose |
|---|---|
| `LogoMark`, `Wordmark` | Logo artwork from §3. Props: tone (`light`/`dark`), variant (`mark`, `lockup`). |
| `HeroDemoCard` | A compact light demo card for the hero, built from the same data and metrics as `AnalyticsDemo`. It replaces `HeroDashboard`. |
| `AnimatedNumber` | Tweens a figure over 300ms when demo filters change. Renders the final value immediately under reduced motion. |
| `Stamp` | A chamfered label. Kinds: `sample`, `method`, `illustrative`, `verified`. It replaces the styling of `SampleDataLabel` (kept as a thin wrapper so existing imports work) and the case-study badges. `verified` renders only where the existing verification and approval rules allow it. |
| `Kicker` | Mono label above headings. Replaces `Eyebrow` and drops the leading line. |
| `SectionHeading` | Variants: `split` (5/7) and `stacked`. Headline at the H2 scale. |
| `Disclosure` | An accessible expand/collapse built on `<details>`/`<summary>`, or a button with `aria-expanded`. Used for examples and for practices and industries on mobile. |
| `Button`, `ButtonLink` | Variants `primary` (signal), `ink`, `ghost`, `text` (underlined link). Radius from §3. |
| `ContactChannels` | Email, WhatsApp and locations from config. Each field renders only when it is non-null. |

Removed: pill chips, icon tiles and Lucide icons used as decoration. Icons remain only where they carry function: menu, close, external link, form status.

## 7. Config, types and data

- **`config/site.ts`**
  - `name: "Valora Digital"`, `shortName: "Valora"`, a new tagline and description.
  - New colours (§3).
  - `contact.email`, a new `contact.whatsapp` (E.164 `+918368526041` plus a display string), and a new `locations` array (Dubai HQ, Gurugram office).
  - `services` becomes three practices, each with `id`, `title`, `summary`, `includes[]` and the `formerly[]` mapping kept in comments only. The `Service` type is updated to match, and the icon field is removed.
  - `cta.primary` is derived from `bookingUrl`.
- **`types/index.ts`:** the `Service` type changes, `ContactInfo` gains `whatsapp`, and a `Location` type is added.
- **`content/insights.ts`:** spelling pass only. Slugs and dates are unchanged.
- **`lib/sample-data.ts`, `lib/metrics.ts`:** unchanged and deterministic.

## 8. Enquiry flow

- **Two steps, same payload.**
  - Step 1: name, email, company, website (optional).
  - Step 2: market, industry, budget, challenge, message (optional), consent.
  - "Continue" runs `validateField` on the step 1 fields before step 2 is shown.
  - The honeypot `hp` and `startedAt` are set exactly as now.
  - Submission still posts the full `LeadInput` to `/api/lead`.
- **Market options:** `india`, `uae-gcc`, `other`, `multiple`.
- **Budget options**, keyed by currency and filtered by market. The schema rejects a budget that doesn't belong to the chosen market's currency.

  | Market | Currency | Bands |
  |---|---|---|
  | `india` | INR | under ₹1 lakh · ₹1–3 lakh · ₹3–10 lakh · ₹10–30 lakh · ₹30 lakh+ |
  | `uae-gcc` | AED | under AED 7,500 · AED 7,500–20,000 · AED 20,000–55,000 · AED 55,000–185,000 · AED 185,000+ |
  | `other`, `multiple` | USD | the existing five bands |

  All markets also have `not-sure`.
- **`app/api/lead/route.ts`:** unchanged apart from the options it imports. Spam checks, the 16 KB limit, the rate limit, delivery to webhook and/or Resend, `ok: true` only on confirmed delivery, and `[lead]` payload logging all stay as they are.
- **Downstream:** the Google Sheet inbox (`scripts/google-sheet-inbox.gs`) stores raw values, so new rows will show the new value strings (for example `inr-1l-3l`). Old rows are untouched. The email notification uses labels and needs no change.
- **Prefill:** the `site:prefill-enquiry` event and `prefillEnquiry()` keep their contract. A prefilled industry or message opens step 1 with those values held for step 2.

## 9. SEO, accessibility and performance

- **Metadata:**
  - Default title: "Valora Digital · AI-driven performance marketing, measured to the sale".
  - The description is rewritten.
  - Canonicals, sitemap and robots are unchanged.
  - The Open Graph image is redesigned in the new identity.
  - Structured data stays limited to Organization (name, URL) and Article.
- **Icons:** `app/icon.svg` is replaced, and `app/apple-icon.png` is added.
- **Accessibility:**
  - Exactly one h1 per page, and skip link kept.
  - The keyboard-operable demo tabs, segmented controls and `aria-sort` table, and the mobile-menu focus trap, all stay.
  - Disclosures are keyboard-operable and expose their state.
  - Colour contrast is at least 4.5:1 for body text, on both light and dark grounds.
- **Performance:**
  - Three font families with explicit subsets and `display: swap`.
  - The Recharts chart stays lazy-loaded with `next/dynamic`.
  - No new client-side libraries.
- **Cache Components:** the footer year stays client-rendered (`CopyrightYear`). No current-time reads during prerender.

## 10. Out of scope

- Founder profiles and photography (deferred; the slot exists).
- The booking link (works automatically once the env var is set).
- Dedicated practice and industry pages.
- Paid audit offer.
- Certifications.
- Content changes to the legal drafts beyond spelling. The legal drafts keep `<LegalReviewNotice />`. A Dubai headquarters may affect their governing-law clause, which a lawyer should confirm.

## 11. Verification

1. `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
2. Playwright and Chrome full-page and viewport screenshots of `/`, `/insights`, one article, `/privacy`, `/terms` and the 404 page at 1440, 1024, 768 and 390px. Review them, fix issues, and repeat until no issues remain.
3. Interaction checks:
   - mobile menu open and close, including focus trap and Escape;
   - demo filters and table sort;
   - industry CTA prefill;
   - form step 1 validation, the currency switch on market change, and successful submission to `scripts/dev-lead-inbox.mjs`;
   - the 503 path when no destination is configured.
4. Reduced-motion run: no animation, and all content visible.

## 12. Open items

1. Founder details, whenever ready.
2. A booking link, whenever ready.
