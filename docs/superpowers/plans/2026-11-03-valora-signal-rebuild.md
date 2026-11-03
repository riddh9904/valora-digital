# Valora Signal Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild valoradigital.co in the Signal identity (white, Instrument Sans, ink + signal green, live demo in the hero) with the 10-section homepage, the AI-led copy and a two-step enquiry form, without changing routes, lead delivery or credibility rules.

**Architecture:**
- Tokens: colour still flows `config/site.ts` → `--brand-*` on `<html>` → the Tailwind `@theme inline` block. The `ink-*` scale is remapped to the new neutrals, so the existing dark demo keeps working, and every `paper`/`accent`/`violet`/`slate-*` usage is replaced.
- Components: the `/preview` components become the real Wordmark, Stamp and HeroDemoCard, and `/preview` is deleted at the end.
- Form logic: market-dependent budgets live in `lib/lead-schema.ts`, the single schema shared by the form and the API route, and get the repo's first unit tests (Node's built-in runner, no new dependencies).

**Tech Stack:** Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript strict, Tailwind v4 via `@tailwindcss/turbopack`, Motion, Recharts, `next/font/google` (Instrument Sans, Geist Mono), Node 26 `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-02-valora-rebrand-design.md`

## Global Constraints

- **Nothing fabricated.**
  - Null contact fields stay hidden.
  - Proof points render only when `verified: true` and a `source` is given.
  - Case-study outcomes render only when `kind === "verified" && publicationApproved === true`.
  - Non-verified case studies keep the exact labels "Illustrative scenario · Not an actual client engagement" or "Methodology example · Not an actual client engagement".
  - Every chart and dashboard carries a visible "Live demo · Sample data" stamp.
- **Lead route behaviour unchanged:** honeypot `hp`, 3-second minimum since `startedAt`, 16 KB body limit, 5 submissions per 10 minutes per IP, `ok: true` only on confirmed delivery, 503 `not_configured`, 502 `delivery_failed`, and `[lead]` payload logging.
- **No test lead may reach the real destinations.** Before Task 1, stop the existing dev server on port 3200, which reads the real `.env.local`. Every dev server used during this plan is started as `LEAD_WEBHOOK_URL=http://localhost:4000 RESEND_API_KEY= npx next dev -p 3300`, with `npm run dev:inbox` running.
- **No route is added, removed or renamed.** `/preview` is deleted in Task 11.
- **Brand names:** "Valora Digital" in titles, copyright and consent text; "valora" (lowercase) in the wordmark; never "The Valora".
- **Contact details:**
  - Email: `inquiry@valoradigital.co`
  - WhatsApp: E.164 `+918368526041`, displayed as `+91 83685 26041`, linked as `https://wa.me/918368526041`
  - Locations: "Dubai (headquarters)" and "Gurugram (office)"
- **British spelling in all user-visible copy:** optimisation, optimise, analyse, prioritise, organisation, behaviour, colour, centre, enrolment, programme. Leave code identifiers, CSS properties and the schema type `"Organization"` unchanged.
- **Colours:** ink `#0B0C0E`, white `#FFFFFF`, mist `#F4F5F4`, graphite `#5E6368`, line `#E1E3E1`, signal `#0B7A5A`, signal-bright `#12B886`. Chart series stay Meta `#4C7DFF` and Google `#D96A2E`.
- **Type:** Instrument Sans for all text (headlines 500 with tight tracking, wordmark 600); Geist Mono for numbers, labels and stamps.
- **Shapes:** 6px radius on buttons, inputs and cards. The chamfer is used only on the logo tile and stamps.
- **No decoration:** no gradients, glows, particles, stock imagery or decorative Lucide icon tiles.
- **Accessibility:** exactly one `h1` per page. Reduced motion is respected through `MotionConfig reducedMotion="user"` and the CSS block in `globals.css`.
- **Structured data:** Organization (name, URL) and Article only.
- **Every task ends green** on `npx tsc --noEmit` and `npm run lint`. From Task 1 on, `npm test` must also pass.

## Review Focus

These five failure modes are implied by the spec but not covered by unit tests. Each has a test step in the task that owns it.

1. **Changing the market after choosing a budget.** The stale budget from the other currency must be cleared, not submitted or shown as a confusing error. (Task 9, Step 4)
2. **Server-side errors for step-1 fields.** If the API rejects the email or name while the user is on step 2, the form must return to step 1 with the error shown and focused, not leave the user stuck on step 2. (Task 9, Step 4)
3. **Prefill arriving from another page.** "Talk to us about this" on an article must land on `/#contact` with the message filled in. The homepage form isn't mounted on the article page, so the event alone would be lost. (Task 9, Step 4)
4. **Focus on step change.** "Continue" must move focus to the market select, and "Back" must move it to the name input. Keyboard and screen-reader users must not be left on a removed button. (Task 9, Step 4)
5. **Very narrow screens (320px).** Long labels such as "AED 55,000–185,000 / month", the industry journeys and the KPI figures must not cause horizontal scrolling on any page. (Task 11, Step 3)

---

### Task 1: Unit test harness and market-aware lead schema

**Files:**
- Create: `tests/alias.mjs`
- Create: `tests/lead-schema.test.ts`
- Modify: `lib/lead-schema.ts`
- Modify: `lib/prefill.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces, in `lib/lead-schema.ts`:
  - `type Currency = "INR" | "AED" | "USD"`
  - `MARKET_OPTIONS` with values `india` | `uae-gcc` | `other` | `multiple`
  - `currencyForMarket(market: string): Currency`
  - `BUDGET_OPTIONS_BY_CURRENCY: Record<Currency, readonly Option[]>`
  - `budgetOptionsFor(market: string): readonly Option[]`
  - `BUDGET_OPTIONS` (the union of all bands, used by the route's `labelFor`)
  - `STEP_ONE_FIELDS: readonly LeadField[]` and `STEP_TWO_FIELDS: readonly LeadField[]`
  - `FIELD_ORDER` is now `[...STEP_ONE_FIELDS, ...STEP_TWO_FIELDS]`.
- Produces, in `lib/prefill.ts`: `PrefillDetail` gains `message?: string`. `prefillEnquiry(detail)` works from any page (see Step 6).

- [ ] **Step 1: Add the harness**

  `tests/alias.mjs` uses `registerHooks` from `node:module` to resolve `@/x` to `<repo>/x`, `<repo>/x.ts` or `<repo>/x/index.ts`. The repo root is `new URL("../", import.meta.url)`.

  Add this script to `package.json`:

  ```json
  "test": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./tests/alias.mjs --test tests/*.test.ts"
  ```

- [ ] **Step 2: Write the failing tests in `tests/lead-schema.test.ts`**

  ```ts
  test("market maps to currency", () => {
    assert.equal(currencyForMarket("india"), "INR");
    assert.equal(currencyForMarket("uae-gcc"), "AED");
    assert.equal(currencyForMarket("other"), "USD");
    assert.equal(currencyForMarket("multiple"), "USD");
    assert.equal(currencyForMarket(""), "USD");
  });

  test("market options", () =>
    assert.deepEqual(MARKET_OPTIONS.map((o) => o.value), ["india", "uae-gcc", "other", "multiple"]));

  test("INR bands", () =>
    assert.deepEqual(budgetOptionsFor("india").map((o) => o.value), [
      "inr-under-1l", "inr-1l-3l", "inr-3l-10l", "inr-10l-30l", "inr-30l-plus", "not-sure",
    ]));

  test("AED bands", () =>
    assert.deepEqual(budgetOptionsFor("uae-gcc").map((o) => o.value), [
      "aed-under-7500", "aed-7500-20k", "aed-20k-55k", "aed-55k-185k", "aed-185k-plus", "not-sure",
    ]));

  test("USD bands keep existing values", () =>
    assert.deepEqual(budgetOptionsFor("other").map((o) => o.value), [
      "under-2k", "2k-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure",
    ]));

  test("INR label", () =>
    assert.equal(budgetOptionsFor("india")[1].label, "₹1–3 lakh / month"));

  test("budget must match market currency", () => {
    assert.equal(validateField("budget", { ...valid, market: "india", budget: "under-2k" }), "Please select a budget range.");
    assert.equal(validateField("budget", { ...valid, market: "india", budget: "inr-1l-3l" }), undefined);
    assert.equal(validateField("budget", { ...valid, market: "uae-gcc", budget: "not-sure" }), undefined);
  });

  test("old market values rejected", () =>
    assert.ok(validateField("market", { ...valid, market: "us" })));

  test("valid lead has no errors", () => assert.deepEqual(validateLead(valid), {}));

  test("step fields", () => {
    assert.deepEqual(STEP_ONE_FIELDS, ["fullName", "email", "company", "website"]);
    assert.deepEqual(STEP_TWO_FIELDS, ["market", "industry", "budget", "challenge", "message", "consent"]);
  });

  test("labelFor knows every band", () => {
    assert.equal(labelFor(BUDGET_OPTIONS, "aed-185k-plus"), "AED 185,000+ / month");
    assert.equal(labelFor(BUDGET_OPTIONS, "50k-plus"), "$50,000+ / month");
  });

  test("every value fits coerceLead limits", () => {
    for (const o of BUDGET_OPTIONS) assert.ok(o.value.length <= 20);
    for (const o of MARKET_OPTIONS) assert.ok(o.value.length <= 20);
  });
  ```

  `valid` is a complete `LeadInput`: `{ fullName: "Asha Rao", email: "asha@example.com", company: "Acme", website: "", industry: "education", market: "india", budget: "inr-1l-3l", challenge: "lead-quality", message: "", consent: true }`.

- [ ] **Step 3: Run the tests and confirm they fail**

  Run: `npm test`

  Expected: FAIL. `currencyForMarket` and `budgetOptionsFor` are not exported, and the market and budget values differ.

- [ ] **Step 4: Implement the schema changes in `lib/lead-schema.ts`**

  - Market labels: "India", "UAE & GCC", "Other countries", "More than one market".
  - INR labels: "Under ₹1 lakh / month", "₹1–3 lakh / month", "₹3–10 lakh / month", "₹10–30 lakh / month", "₹30 lakh+ / month".
  - AED labels: "Under AED 7,500 / month", "AED 7,500–20,000 / month", "AED 20,000–55,000 / month", "AED 55,000–185,000 / month", "AED 185,000+ / month".
  - USD labels: unchanged.
  - Every currency ends with `{ value: "not-sure", label: "Not sure yet" }`.
  - `BUDGET_OPTIONS` is the de-duplicated concatenation of all three lists.
  - `validateField("budget")` checks the value against `budgetOptionsFor(input.market)`.

- [ ] **Step 5: Run the tests and confirm they pass**

  Run: `npm test && npx tsc --noEmit && npm run lint`

  Expected: all tests pass, with no type or lint errors. `LeadForm` and the route still compile because the names they import are unchanged.

- [ ] **Step 6: Cross-page prefill in `lib/prefill.ts`**

  - Add `message?: string` to `PrefillDetail`.
  - Export `PREFILL_STORAGE_KEY = "site:prefill"`.
  - If `document.getElementById("contact")` is missing, `prefillEnquiry` stores `JSON.stringify(detail)` in `sessionStorage` (inside try/catch), then calls `window.location.assign("/#contact")`.
  - Otherwise it behaves exactly as now.

  Run: `npx tsc --noEmit`

  Expected: PASS.

- [ ] **Step 7: Commit**

  `git add tests package.json lib/lead-schema.ts lib/prefill.ts && git commit -m "Add market-aware budget bands and unit tests for the lead schema"`

---

### Task 2: Tokens, fonts and site config

**Files:**
- Modify: `config/site.ts` (colours, contact, locations, cta, tagline, description)
- Modify: `types/index.ts` (`Location`)
- Modify: `app/layout.tsx` (fonts, brand vars, metadata, viewport)
- Modify: `app/globals.css` (tokens and component classes)

**Interfaces:**
- Produces:
  - `site.colors`: `{ ink, mist, graphite, line, signal, signalBright }`
  - `site.contact`: `{ email: "inquiry@valoradigital.co", phone: null, whatsapp: { e164: "+918368526041", display: "+91 83685 26041" } | null, address: null }`
  - `locations: Location[]`, exported from `config/site.ts`, where `interface Location { city: string; role: "Headquarters" | "Office" }`. Values: Dubai / Headquarters, then Gurugram / Office.
  - `site.cta.primary`: `bookingUrl ? "Book a call" : "Start a conversation"`
  - Tailwind tokens: `ink-950`…`ink-600`, `mist`, `graphite`, `line`, `signal`, `signal-bright`, `meta`, `google`, `good`, `warn`. `--font-sans` and `--font-display` point to Instrument Sans; `--font-mono` points to Geist Mono.
  - CSS classes `.kicker`, `.display-xl`, `.display-lg`, `.display-md`, `.stamp` (the chamfer), `.live-dot` and `.link-underline`.

- [ ] **Step 1: Update `config/site.ts`**

  - Tagline: "AI-driven performance marketing, measured to the sale."
  - Description: "Valora Digital runs AI-driven Meta and Google Ads for businesses in India, the UAE and beyond, trains the platforms on qualified leads and sales, and reports what every customer cost."
  - Remove `accent`, `accentBright` and `violet` from `colors`.

- [ ] **Step 2: Update `app/layout.tsx`**

  - Load `Instrument_Sans` (`--font-instrument`) and `Geist_Mono` (`--font-geist-mono`). Drop Inter, Inter Tight and JetBrains Mono.
  - Map `site.colors` to `--brand-ink`, `--brand-mist`, `--brand-graphite`, `--brand-line`, `--brand-signal` and `--brand-signal-bright`.
  - Default title: "Valora Digital · AI-driven Meta and Google Ads, measured to the sale".
  - Set `viewport.themeColor` to `#FFFFFF`.
  - The skip link uses `bg-ink-950 text-white`.

- [ ] **Step 3: Rewrite the tokens in `app/globals.css`**

  - `ink-950` and `ink-900` are `var(--brand-ink)`. `ink-850` is `#121417`, `ink-800` is `#16181B`, `ink-700` is `#202327` and `ink-600` is `#2A2E32`.
  - `html` and `body` backgrounds are white; text is ink.
  - Drop `body`'s `font-feature-settings`.
  - Radius tokens: `sm` 4px, `md` 6px, `lg` 8px.
  - Move the chamfer `clip-path`, the `vp-live-dot` animation and the `vp-link` underline from `app/preview/preview.css` into `@layer components`, named `.stamp`, `.live-dot` and `.link-underline`.
  - `.field-input` becomes light: white background, `line` border, ink text, a `signal` focus ring at 25% opacity, and an ink chevron on `select`.
  - `.kicker` is Geist Mono, 0.7rem, 0.08em tracking, uppercase.
  - `.display-xl` is `clamp(2.6rem,6.4vw,4.6rem)` / 1.02 / -0.042em / 500.
  - `.display-lg` is `clamp(2rem,4vw,2.9rem)` / 1.06 / -0.035em / 500.
  - Keep the reduced-motion block.

- [ ] **Step 4: Verify**

  Run: `npx tsc --noEmit && npm run lint && npm test`

  Expected: PASS. Pages will look half-migrated until Task 11, which is expected on this branch.

- [ ] **Step 5: Commit**

  `git commit -am "Switch to Signal tokens, fonts and contact config"`

---

### Task 3: Brand primitives and icons

**Files:**
- Create: `components/ui/Stamp.tsx` (from `app/preview/_components/Stamp.tsx`)
- Create: `components/ui/ContactChannels.tsx`
- Create: `components/ui/Disclosure.tsx`
- Create: `components/ui/AnimatedNumber.tsx`
- Create: `app/apple-icon.tsx`
- Modify: `components/layout/Wordmark.tsx` (Signal mark, from the preview `Logo.tsx`)
- Modify: `components/ui/Button.tsx`
- Modify: `components/ui/BookCallButton.tsx`
- Modify: `components/ui/SectionHeading.tsx`
- Modify: `components/ui/SampleDataLabel.tsx`
- Modify: `app/icon.svg`
- Modify: `app/opengraph-image.tsx`

**Interfaces:**
- Produces:
  - `LogoMark({ className?, tone?: "light" | "dark" })` and `Wordmark({ tone?: "light" | "dark", className? })`. `tone` names the background it sits on. `light` is the default: an ink tile, a white V and ink text. `dark` is a white tile, an ink V and white text.
  - `Stamp({ children, tone?: "ink" | "soft" | "quiet" | "signal", live?: boolean })` uses the `.stamp` and `.live-dot` classes and `font-mono tabular`. Tones:
    - `ink`: ink background, white text
    - `soft`: `#E3F1EB` background, signal text
    - `quiet`: mist background, ink text, `line` outline
    - `signal`: signal background, white text
  - `SampleDataLabel({ children = "Live demo · Sample data" })` renders `<Stamp live>`.
  - `ButtonLink` and `buttonClasses(variant, size, extra)`, where `variant` is `"primary" | "ink" | "ghost" | "light" | "text"` and `size` is `"md" | "lg"`. The `secondary` variant is removed; replace every call site.
    - `primary`: signal background, white text
    - `ink`: ink background, white text
    - `ghost`: `line` border, ink text
    - `light`: white background, ink text, for dark surfaces
    - `text`: underlined link
    - `BookCallButton`'s `variant` prop takes the same union.
  - `SectionHeading({ kicker?, title, intro?, layout?: "split" | "stacked", id, tone?: "light" | "dark" })`. `Eyebrow` is renamed `Kicker({ children, tone? })`.
  - `ContactChannels({ tone?: "light" | "dark" })` lists the email (`mailto:`), WhatsApp ("WhatsApp +91 83685 26041", opening in a new tab with an sr-only note) and locations. A null field renders nothing.
  - `Disclosure({ summary: ReactNode, children, id })` is built on `<details>`/`<summary>` with a +/− indicator, and is keyboard-operable by default.
  - `AnimatedNumber({ value: number, format: (n: number) => string })` tweens from the previous value to the new one over 300ms using Motion's `animate`. Under `useReducedMotion()` it renders the final value at once. It renders `format(value)` on the server and on first paint, so prerender and hydration match.

- [ ] **Step 1: Build the components to the interfaces above**

  Tile and V paths come from the preview:
  - Tile: `M11 2h42l9 9v42l-9 9H11l-9-9V11z`
  - V: `M15 16h9l8 17.9L40 16h9L36 45h-8z`

  `app/icon.svg` is the ink tile with a white V. `app/apple-icon.tsx` (180×180, `ImageResponse` from `next/og`) is the same on a white background with 24px padding.

  `opengraph-image.tsx`:
  - White background, the mark at 72px, "valora".
  - Headline "Ad platforms run on AI. We teach it what a customer is." in ink at 64px / 500.
  - The footer line "valoradigital.co · Dubai · Gurugram" in graphite.
  - `alt`: "Valora Digital: AI-driven performance marketing, measured to the sale".

- [ ] **Step 2: Update every call site**

  Run: `grep -rn '"secondary"\|eyebrow=\|Eyebrow' components app`.
  - Replace each `secondary` with `ghost`, or with `light` on dark surfaces.
  - Rename the `eyebrow` prop to `kicker`, and `Eyebrow` to `Kicker`.

- [ ] **Step 3: Verify**

  Run: `npx tsc --noEmit && npm run lint && npm test`

  Expected: PASS.

  With the isolated dev server running, `curl -sI http://localhost:3300/apple-icon` returns `200` with `content-type: image/png`, and `/opengraph-image` returns `200`.

- [ ] **Step 4: Commit**

  `git commit -am "Add Signal logo, stamp, disclosure and contact primitives"`

---

### Task 4: Navbar and footer

**Files:**
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `config/site.ts` (`navItems`)

**Interfaces:**
- Consumes: `Wordmark`, `buttonClasses`, `ContactChannels` and `locations` (Tasks 2–3).
- Produces: `navItems` is Services `/#services`, Industries `/#industries`, How we work `/#approach`, Insights `/#insights`, About `/#about`.

- [ ] **Step 1: Navbar**

  - White background. A `line` bottom border appears once scrolled past 12px, with `backdrop-blur` and `bg-white/90`.
  - Links are graphite, turning ink on hover and when active. Keep the active-section `IntersectionObserver` and `aria-current`.
  - The CTA uses `buttonClasses("ink", "md")` with the label `site.cta.primary`.
  - The mobile menu is a white panel. Keep the dialog role, focus trap, scroll lock, Escape and auto-close at 1024px exactly as they are.

- [ ] **Step 2: Footer**

  - Dark (`bg-ink-950`) with the `dark` wordmark and the description.
  - Three columns:
    - "Company": the `navItems`.
    - "Contact": `<ContactChannels tone="dark" />`.
    - "Legal": Privacy Policy and Terms of Service.
  - Copyright: `© <CopyrightYear/> Valora Digital. All rights reserved.`
  - Remove the ghost watermark and the per-service and per-industry link lists.

- [ ] **Step 3: Verify**

  Run: `npx tsc --noEmit && npm run lint`

  Then run a Playwright check at 390px: open the menu, press Tab 8 times and confirm focus never leaves `#mobile-menu`, press Escape and confirm focus returns to the toggle. Expected: all three hold.

- [ ] **Step 4: Commit**

  `git commit -am "Restyle navigation and footer for Signal"`

---

### Task 5: Hero, commitments and problem

**Files:**
- Create: `components/dashboard/HeroDemoCard.tsx` (moved from `app/preview/_components/HeroDemoCard.tsx`; use `Stamp` from `components/ui`)
- Modify: `components/sections/Hero.tsx`
- Modify: `components/sections/Problem.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/CredibilityStrip.tsx`
- Delete: `components/dashboard/HeroDashboard.tsx`

**Interfaces:**
- Consumes: `SampleDataLabel`/`Stamp`, `BookCallButton`, `lib/metrics` `selectPeriods`, `totals`, `relativeChange` and `dailyByChannel`.
- Produces: `<Hero />` renders the hero, `#hero-demo` and the commitments row. The verified proof-point `<dl>` from `CredibilityStrip`, with its unchanged filter, moves under the commitments.

- [ ] **Step 1: Hero copy and layout**

  Use spec §5 "Hero" verbatim.
  - Layout: left-aligned below 640px and centred from 640px up, with the kicker's live dot. Port this from the preview's `PreviewHero` and `.vp-demo-band`, using `white → mist` at 42%.
  - The first button is `BookCallButton` with size `lg`.
  - The second is a text link "See the live report →" to `/#measurement`.

  - The KPI values in `HeroDemoCard` render through `AnimatedNumber`, with the existing `formatCurrency` and `formatNumber`.
  - Change `components/ui/Reveal.tsx` so it starts at `y: 8` instead of its current offset, runs once, and keeps working with reduced motion.

- [ ] **Step 2: Problem section**

  - Kicker: "The problem".
  - H2: "Most ad accounts report activity. Few report customers."
  - Keep the first four challenges and their responses, and drop "Campaigns keep spending…".
  - Rows are ruled, with columns "Common challenge" and "How we approach it". Remove the arrow glyph column and the 0x numbers.

- [ ] **Step 3: Update `app/page.tsx`** to import the new Hero, without `CredibilityStrip`. Leave the other sections in place for now.

- [ ] **Step 4: Verify**

  Run: `npx tsc --noEmit && npm run lint`

  Then run a Playwright check of `/`:
  - Clicking "90D" changes the "Qualified leads" KPI from `1,599` to `4,466`.
  - `document.querySelectorAll('h1').length === 1`.

  Expected: both hold.

- [ ] **Step 5: Commit**

  `git commit -am "Rebuild hero with live demo card and tighten problem section"`

---

### Task 6: Practices and industries

**Files:**
- Modify: `types/index.ts` (`Service`)
- Modify: `config/site.ts` (`services`, plus one-line `industries[].summary`)
- Modify: `components/sections/Services.tsx`
- Modify: `components/sections/Industries.tsx`

**Interfaces:**
- Produces:
  - `interface Service { id: "acquire" | "convert" | "measure"; title: string; summary: string; includes: string[] }`. The icon, description, benefit and capabilities fields are removed.
  - `Industry` gains `summary: string`. The fields `problem`, `focus` and `services` stay, for the disclosure body.

- [ ] **Step 1: Config**

  - `services`: use the spec §5 "Services" text for each `summary`.
  - `includes`:
    - Acquire: Meta Ads, Google Ads, Creative testing, Catalogue campaigns
    - Convert: Landing pages, A/B testing, Lead scoring, CRM routing
    - Measure: GA4 & Tag Manager, Offline conversions, Dashboards, CAC & payback
  - Industry `summary` values are the four preview `INDUSTRY_LINES`.
  - Industry `services` strings are renamed to practice titles:
    - real-estate: Acquire, Convert, Measure
    - education: Acquire, Convert, Measure
    - ecommerce: Acquire, Convert, Measure
    - services: Acquire, Convert

- [ ] **Step 2: Services section**

  Port `PreviewPractices`. Use `id="services"`, a `SectionHeading` with layout `split`, and the "Where AI fits" split exactly as in spec §5.

- [ ] **Step 3: Industries section**

  - Replace the tabs with four visible columns from 1024px up, and two from 640px.
  - Below 640px, each industry is a `Disclosure`. The summary shows the label and the one-line `summary`; the body shows the journey and the CTA.
  - Each column has a `label` H3, the `summary`, the mono journey from `funnel` and a CTA button.
  - The CTA calls `prefillEnquiry({ industry: ind.id })`, with the text "Talk to us about real estate", "Talk to us about education", "Talk to us about e-commerce" or "Talk to us about professional services".
  - Small print below the grid: "The sectors we focus on."

- [ ] **Step 4: Verify**

  Run: `npx tsc --noEmit && npm run lint`

  Then run a Playwright check of `/`: click "Talk to us about education" and read `#contact select[name=industry]`. Expected: `education`.

- [ ] **Step 5: Commit**

  `git commit -am "Replace six services with three practices and show all industries"`

---

### Task 7: Measurement section

**Files:**
- Create: `components/sections/Measurement.tsx` (replaces `AnalyticsShowcase`)
- Modify: `lib/metrics.ts` (`TrendMetric` gains `"cpql"`)
- Modify: `components/dashboard/AnalyticsDemo.tsx`
- Modify: `components/dashboard/TrendChart.tsx`
- Modify: `app/page.tsx`
- Delete: `components/sections/AnalyticsShowcase.tsx`, `FullFunnel.tsx`, `FunnelBand.tsx` and `BeyondClick.tsx`
- Test: `tests/metrics.test.ts`

**Interfaces:**
- Produces: `dailyByChannel(rows, dates, "cpql")` returns spend divided by qualified leads per channel per day, rounded to 2 decimals, or `undefined` when there are no qualified leads.

- [ ] **Step 1: Write the failing test**

  ```ts
  test("cpql series matches totals for a single day", () => {
    const { current, dates } = selectPeriods({ range: 7, channel: "meta", campaignId: "all" });
    const day = dates.at(-1)!;
    const rows = current.filter((r) => r.date === day);
    const expected = Math.round((totals(rows).spend / totals(rows).qualified) * 100) / 100;
    assert.equal(dailyByChannel(current, dates, "cpql").at(-1)!.meta, expected);
  });
  ```

- [ ] **Step 2: Run the test and confirm it fails**

  Run: `npm test`

  Expected: FAIL. `"cpql"` isn't handled, so it falls back to `cpl`.

- [ ] **Step 3: Implement** `"cpql"` in `dailyByChannel`, tracking `qualified` in the day bucket.

- [ ] **Step 4: Run the test and confirm it passes**

  Run: `npm test`

  Expected: PASS.

- [ ] **Step 5: Measurement section**

  - `id="measurement"`, dark (`bg-ink-950`), kicker "How we measure", H2 "What your weekly report looks like."
  - Intro, verbatim: "Spend, leads, qualified leads and opportunities in one view, by campaign. This demo runs on generated data. We build the same kind of report in Looker Studio, GA4 or your CRM."
  - Two ruled columns:
    - "What ad platforms report": Impressions · Clicks · Form fills · Platform conversions
    - "What we report": Qualified leads · Cost per qualified lead · Customers · Acquisition cost and payback
  - A caveat line: "Attribution is never perfect. Privacy rules, offline sales and multi-device journeys leave gaps, and the report labels them."
  - Then `<AnalyticsDemo />`.

- [ ] **Step 6: AnalyticsDemo restyle**

  - Add the `cpql` option "Cost per qualified lead" to `METRICS` and make it the initial metric.
  - Replace `accent`/`violet`/`slate-*` with `ink-*`, `graphite` and `signal-bright`.
  - Put `<SampleDataLabel />` on the frame's top edge.
  - Use Geist Mono for figures, rendered through `AnimatedNumber`, and 6px radii on segmented controls.
  - Keep the radiogroups, `aria-sort` and keyboard behaviour unchanged.
  - In `TrendChart`, format `cpql` values as currency like `cpl`.

- [ ] **Step 7: Verify**

  Run: `npm test && npx tsc --noEmit && npm run lint`

  Then run a Playwright check: on `/#measurement`, the trend metric radio "Cost per qualified lead" has `aria-checked="true"`, and clicking the table's "Leads" header sets `aria-sort` on that header. Expected: both hold.

- [ ] **Step 8: Commit**

  `git commit -am "Merge funnel and analytics sections into one measurement section"`

---

### Task 8: Approach, working examples and about

**Files:**
- Modify: `components/sections/Methodology.tsx` (becomes "How an engagement runs", `id="approach"`)
- Modify: `components/sections/Projects.tsx` (becomes "Working examples", `id="examples"`)
- Modify: `components/sections/Founders.tsx` (`id="about"`)
- Modify: `app/page.tsx`
- Delete: `components/sections/Principles.tsx`

- [ ] **Step 1: Approach section**

  - Kicker "How we work", H2 "How an engagement runs."
  - Stages are a ruled 4-column list, with one column per row on phones. Stage text is from spec §5. Outputs are mono text separated by middle dots, not chips:

    | Stage | Outputs |
    |---|---|
    | Discover | Goals and unit economics · Tracking audit · Funnel baseline |
    | Plan | Channel and budget plan · Measurement plan · First test hypotheses |
    | Launch | Live campaigns · Verified conversion tracking · First creative and landing-page tests |
    | Review | Performance review · Documented test results · Updated priorities |

  - Then "Working rules" with the four rules from spec §5.

- [ ] **Step 2: Working examples section**

  - Kicker "Working examples", H2 "How we approach three common problems.", and the intro from spec §5.
  - Each case study is a `Disclosure` row: the category (kicker), the title, and the kind stamp, with the exact existing label text. `methodology` uses tone `soft`; `illustrative` uses tone `quiet`.
  - The body is the existing `Row` list.
  - Keep `items` filtering and `showOutcomes` exactly as they are.

- [ ] **Step 3: About section**

  - Kicker "About", H2 "Who you'll work with.", body from spec §5.
  - A three-item ruled list keeps the current strengths text, without icons.
  - Then `<ContactChannels />` with the locations.
  - The founder grid keeps the `founders.length > 0` guard and the existing fields.

- [ ] **Step 4: Verify**

  Run: `npx tsc --noEmit && npm run lint`

  Then run a Playwright check: open each `Disclosure` with Enter. Expected: its content is visible and the stamp text equals the exact label.

- [ ] **Step 5: Commit**

  `git commit -am "Merge process and principles, reframe projects as working examples"`

---

### Task 9: Contact section and two-step form

**Files:**
- Modify: `components/sections/Contact.tsx`
- Modify: `components/sections/LeadForm.tsx`

**Interfaces:**
- Consumes: `STEP_ONE_FIELDS`, `STEP_TWO_FIELDS`, `budgetOptionsFor`, `currencyForMarket`, `PREFILL_STORAGE_KEY` and `PrefillDetail.message` (Task 1), plus `ContactChannels`.

- [ ] **Step 1: Contact section**

  - `id="contact"`, mist background, kicker "Start a conversation", H2 "Tell us what you're trying to grow.", and the subhead from spec §5.
  - Left column: `ContactChannels` and the existing three "what happens next" steps.
  - Right column: the form card (white, `line` border, 6px radius).
  - Remove the duplicate "Tell us about your business" button.

- [ ] **Step 2: LeadForm state**

  - Add `step: 1 | 2`.
  - The step label reads "Step 1 of 2 · About you" or "Step 2 of 2 · About the work", and is announced in `aria-live="polite"`.
  - Step 1 renders the `STEP_ONE_FIELDS` and a "Continue" button. It validates only those fields; with errors, it focuses the first invalid one, and otherwise it goes to step 2 and focuses `select[name=market]`.
  - Step 2 renders the `STEP_TWO_FIELDS`, a "Back" button (which focuses `input[name=fullName]`) and "Send enquiry".
  - The budget `<select>` lists `budgetOptionsFor(values.market)`. Its hint reads "Shown in ₹", "Shown in AED" or "Shown in US $", following `currencyForMarket`.
  - `update("market", v)` clears `budget` when the current budget isn't in `budgetOptionsFor(v)`.
  - On a server `validation` response, if any error key is in `STEP_ONE_FIELDS`, set step 1 and focus the summary.
  - Prefill (event or `sessionStorage` key read on mount, then removed, inside try/catch) applies `industry`, `challenge` and `message`. It never changes `step` or a `success` status.
  - The honeypot, `startedAt`, payload, status UI and error copy stay unchanged.
  - Restyle for the light card: `.field-input`, ink text, graphite hints, and `buttonClasses("primary","lg")` for submit.

- [ ] **Step 3: Start an isolated server for the submission tests**

  Run, in two terminals: `npm run dev:inbox`, and `LEAD_WEBHOOK_URL=http://localhost:4000 RESEND_API_KEY= npx next dev -p 3300`

  Expected: the inbox listens on 4000 and Next starts on 3300.

- [ ] **Step 4: Review Focus checks (Playwright against `:3300`)**

  1. Choose market India and budget "₹1–3 lakh / month", then switch the market to "Other countries". Expected: the budget value is `""` and the options start with "Under $2,000 / month".
  2. Intercept `POST /api/lead` with a fulfilled response `{ status: 400, body: { ok: false, code: "validation", errors: { email: "Please enter a valid email address, like name@company.com." } } }` and submit from step 2. Expected: the step-1 email input is visible and its error text is shown.
  3. On `/insights/lead-quality-over-lead-volume`, click "Talk to us about this". Expected: the URL ends `/#contact` and `textarea[name=message]` (on step 2) contains the article title.
  4. Press Continue with valid step-1 values. Expected: `document.activeElement.name === "market"`. Press Back. Expected: `"fullName"`.
  5. Fill a valid lead, wait 3.5 seconds and submit. Expected: the success state is shown, and `.dev-leads.jsonl` gains one line whose `lead.budget` is `inr-1l-3l`.

- [ ] **Step 5: API checks (curl against `:3300`)**

  - With a mismatched budget (`"market":"india","budget":"under-2k"`, `startedAt` 10 seconds in the past): expect HTTP `400` and `"code":"validation"`.
  - With `"hp":"x"`: expect `400` and `"code":"rejected"`.
  - With the inbox stopped and a valid lead: expect `502` and `"code":"delivery_failed"`.
  - Restart Next with `LEAD_WEBHOOK_URL= RESEND_API_KEY= npx next dev -p 3300` and send a valid lead: expect `503` and `"code":"not_configured"`. Then restart with the inbox URL again.

- [ ] **Step 6: Verify and commit**

  Run: `npm test && npx tsc --noEmit && npm run lint`

  Then: `git commit -am "Two-step enquiry form with market-based budget currency"`

---

### Task 10: Insights, inner pages and copy pass

**Files:**
- Modify: `components/sections/Insights.tsx`
- Modify: `app/insights/page.tsx`
- Modify: `app/insights/[slug]/page.tsx`
- Modify: `components/layout/PageHeader.tsx`
- Modify: `components/layout/Prose.tsx`
- Modify: `components/layout/LegalReviewNotice.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/not-found.tsx`
- Modify: `app/error.tsx`
- Modify: `content/insights.ts` (spelling only; slugs and dates unchanged)
- Modify: `app/page.tsx` (final order)

- [ ] **Step 1: Insights**

  - Homepage `id="insights"`, kicker "Insights", H2 "Notes on measurement."
  - Show three entries as an editorial list: date · category · title · one-line summary · read time, with a "All articles →" link.
  - `/insights` uses the same list, with the intro "Short, practical pieces on lead quality, tracking and acquisition costs, for the people who sign off ad budgets."
  - The article page:
    - White `PageHeader`.
    - A 680px `Prose` column.
    - "← All insights".
    - A closing ruled block: "Talk to us about this →" calls `prefillEnquiry({ message: \`About “${article.title}”: \` })`.
  - Keep `generateStaticParams`, the metadata and the Article JSON-LD unchanged.

- [ ] **Step 2: Shared layout pieces**

  - `PageHeader` becomes white: kicker, `display-lg` h1, graphite intro, top padding `calc(var(--header-h)+56px)`.
  - `Prose` uses ink and graphite, with `signal` links.
  - The legal pages keep `<LegalReviewNotice />` and every "[To be confirmed]" item. Restyle the notice to a `line`-bordered mist box.
  - `not-found` and `error` use the white style with `ButtonLink`.

- [ ] **Step 3: Final homepage order**

  Hero, Problem, Services, Industries, Measurement, Methodology (approach), Projects (examples), Founders (about), Insights, Contact.

- [ ] **Step 4: Spelling pass**

  Run: `grep -rniE 'optimiz|analyz|prioritiz|organiz|behavior|enroll' config content components app lib`

  Expected: only code identifiers remain. Fix every user-visible string, and leave `"@type": "Organization"` alone.

  Then run: `grep -rnE '"[^"]*\b(color|center|program)\b[^"]*"' config content components app`

  Check each match by hand: copy changes to British spelling, Tailwind classes and CSS stay.

- [ ] **Step 5: Verify and commit**

  Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`

  Expected: the build succeeds and lists `/`, `/insights`, three article pages, `/privacy` and `/terms`.

  Then: `git commit -am "Restyle insights and inner pages, British spelling throughout"`

---

### Task 11: Cleanup, docs and full browser review

**Files:**
- Delete: `app/preview/` (the whole folder)
- Delete: unused components found in Step 1
- Modify: `CLAUDE.md` (fonts, tokens, `npm test`, two-step form, budget bands, the Signal look)

- [ ] **Step 1: Remove leftovers**

  Run: `grep -rnE '\b(paper|accent|violet|slate-[0-9]+|dark-surface|bg-grid|eyebrow|font-display)\b' app components` and `grep -rln 'HeroDashboard\|CredibilityStrip\|FullFunnel\|FunnelBand\|BeyondClick\|Principles\|AnalyticsShowcase' app components`

  Expected: no matches after the fixes.

  Delete `app/preview`. Then confirm `curl -s -o /dev/null -w '%{http_code}' localhost:3300/preview` returns `404`.

- [ ] **Step 2: Production build and checks**

  Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`

  Expected: everything passes. Then `PORT=3100 npm run start`. Expected: every route returns `200`, and `/sitemap.xml` doesn't contain `preview`.

- [ ] **Step 3: Browser review loop (Playwright, Chrome)**

  For `/`, `/insights`, `/insights/lead-quality-over-lead-volume`, `/privacy`, `/terms` and `/does-not-exist`, at 1440, 1024, 768, 390 and **320**px:
  - Full-page and first-viewport screenshots.
  - Assert `document.documentElement.scrollWidth === innerWidth`.
  - Assert no console errors.
  - Assert exactly one `h1`.

  Repeat `/` with `reducedMotion: "reduce"`, and assert that all content is visible with no element at `opacity: 0`.

  Review every screenshot for spacing, alignment, wrapping, contrast and hierarchy. Fix the issues and repeat until a full pass shows none.

- [ ] **Step 4: Update `CLAUDE.md`**

  - Replace the fonts and colour description with the Signal tokens.
  - Add `npm test` to Commands, and remove the line saying there is no test suite.
  - Document the two-step form, market-based budget currencies, the `sessionStorage` prefill handoff and the stamp labels.

- [ ] **Step 5: Commit**

  `git add -A && git commit -m "Remove preview route, update docs after full browser review"`
