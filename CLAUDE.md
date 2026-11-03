# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js **16.4** (App Router), React 19.3, TypeScript (strict), Tailwind CSS v4, Motion, Recharts, Lucide. Version-specific docs ship in `node_modules/next/dist/docs/`; check them before using any Next.js API. This project relies on:
- `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`. Under Cache Components, server components can't read the current time or other non-deterministic values during prerender. That's why the footer year is rendered client-side (`components/ui/CopyrightYear.tsx`), with a build-time fallback from `NEXT_PUBLIC_BUILD_YEAR`.
- Global route types `PageProps<"/route">` and `LayoutProps<"/">`, plus `params` passed as a Promise (`const { slug } = await params`). Call `notFound()` before any `<Suspense>` or streaming boundary so unknown slugs return a real 404 (a `notFound()` inside Suspense fires after the 200 status is sent). `app/insights/[slug]/page.tsx` therefore awaits `params` at the top and sets two route-level options. `export const ensureStatic = "navigation"` makes a request for an unlisted slug wait for the full render; without it, partial prefetching streams the route's fallback App Shell with a 200 before `notFound()` runs. `export const instant = false` allows the blocking read and silences the dev-only "instant-shell-url-data" insight. (`dynamicParams` is not available under Cache Components.) Because of `ensureStatic = "navigation"`, the build fails if request-time data (cookies, headers, an uncached fetch) is added to that route or its `generateMetadata`.
- After deleting a route, run `next build` (or `rm -rf .next/types`) before `npx tsc --noEmit`; the generated `.next/types` still reference the old route until they are regenerated.
- Tailwind is loaded through a Turbopack loader rule (`@tailwindcss/turbopack`), not PostCSS.

## Commands

```bash
npm run dev          # dev server, http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve build (PORT=3100 npm run start to change port)
npm run lint         # ESLint (next core-web-vitals + typescript)
npx tsc --noEmit     # standalone type check
npm test             # node:test unit tests in tests/*.test.ts (lead schema, metrics)
npm run dev:inbox    # local webhook inbox on :4000 for testing the form (scripts/dev-lead-inbox.mjs)
```

Verify changes with `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build`. The tests run TypeScript directly with Node's type stripping; `tests/alias.mjs` resolves the `@/` alias, so keep tested modules (`lib/lead-schema.ts`, `lib/metrics.ts`, `lib/sample-data.ts`) free of JSX and Next.js imports, and likewise `config/site.ts` and `types/index.ts`, which `lib/lead-schema.ts` imports transitively. To try the form without reaching real destinations, run `npm run dev:inbox` and start the dev server with `LEAD_WEBHOOK_URL=http://localhost:4000/lead RESEND_API_KEY= npm run dev` (shell variables override `.env.local`). Environment variables are documented in `.env.example`; copy it to `.env.local`. `NEXT_PUBLIC_*` values are inlined at build time.

## Architecture

A single-page marketing site for a pre-launch agency, plus `/insights`, `/insights/[slug]`, `/privacy`, `/terms` and one API route. The `@/*` import alias maps to the repo root.

**Content is config-driven.** `config/site.ts` is the single source for brand name, colours, contact details (email, WhatsApp, `locations`), CTAs, nav, services (the three practices, each with its method panel: lead generation, conversion optimisation, performance & profitability), the `positioning` line, industries, proof points, founders and case studies. Shared types live in `types/index.ts`. Articles live in `content/insights.ts` and feed the homepage, `/insights`, the article pages (via `generateStaticParams`) and `app/sitemap.ts`. Homepage sections are composed in order in `app/page.tsx`, one component per section in `components/sections/`, and each section's copy lives in its component: `Hero` (`#hero`, with the light `HeroDemoCard`) → `Services` (`#services`, "What we do": the three services with expandable method panels) → `Industries` (`#industries`) → `Measurement` (`#measurement`, the dark section with `AnalyticsDemo`) → `Methodology` (`#approach`, "How we work") → `Projects` (`#work`, "Client work", hidden until approved entries exist) → `Founders` (`#about`) → `Insights` (`#insights`) → `Contact` (`#contact`, with `LeadForm`). The nav links point at these ids. Each service is a `Disclosure` (`id="service-<id>"`); `components/ui/DetailsEnhancer.tsx` opens the item named by a `#service-<id>` deep link (and scrolls to it), and otherwise opens the first item at ≥1024px only. Each panel ends with a `PrefillCta` (`components/ui/PrefillCta.tsx`, shared with Industries) that prefills the form's challenge.

**The look ("Signal").** White and mist grounds, ink text with one green accent, hairline rules instead of cards, and only two dark areas: the measurement section and the footer. Only real interfaces get a card (the demos and the form). No gradients, glows, stock imagery or decorative icons; Lucide icons are used only where they carry function. Buttons, inputs and cards use a 6px radius; the chamfer (`.stamp`) is reserved for the logo tile and stamps.
- Type: Instrument Sans for all text (`font-sans`; headlines weight 500 with tight tracking, wordmark 600) and Geist Mono (`font-mono`) for numbers, labels and stamps, both loaded with `next/font/google` in `app/layout.tsx`. Use `.display-xl` / `.display-lg` for headline sizes and `.kicker` (via `<Kicker>` / `<SectionHeading>`) for mono labels above headings.
- Brand colours flow config → CSS vars → Tailwind. `app/layout.tsx` injects `site.colors` as `--brand-*` custom properties on `<html>`. The `@theme inline` block in `app/globals.css` maps them to Tailwind tokens: `ink-*` (`#0B0C0E`; `ink-850`/`ink-700` are fixed dark-surface shades), `mist` (`#F4F5F4`), `graphite` (`#5E6368`, secondary text), `line` (`#E1E3E1`, hairlines), `signal` (`#0B7A5A`, primary CTA, links, live states) and `signal-bright` (`#12B886`, live dot and accents on dark). `meta` and `google` are chart-only. Change colours in `config/site.ts`, not in the CSS. Wrap dark areas in `.surface-ink` so focus rings switch to `signal-bright`.
- Stamps: `components/ui/Stamp.tsx` renders the chamfered mono label (tones `ink`, `soft`, `quiet`, `signal`; `live` adds the pulsing dot). `<SampleDataLabel />` is a thin wrapper that renders "Live demo · Sample data".

**Credibility rules are enforced in code. Keep them intact.** Nothing on the site may be fabricated:
- Contact and social fields set to `null` are hidden everywhere.
- A proof point renders only if `verified: true` and it has a non-empty `source`.
- `caseStudies` holds verified client work only. `Projects` renders an entry only when `publicationApproved === true` and every outcome has a non-empty `source`; with no such entries the section is not rendered.
- Service methodology content (`services` in config) never names or implies a client and never shows numeric results. Each `scenario` names no city or brand and renders with exactly one "Illustrative scenario" stamp.
- Founders and proof-point sections appear only when their arrays are non-empty.
- All dashboard data is synthetic and must carry a visible `<SampleDataLabel />` ("Live demo · Sample data"), in both `HeroDemoCard` and `AnalyticsDemo`.

**Demo dashboards.** `lib/sample-data.ts` is a seeded, deterministic generator (180 days × 6 campaigns). Each funnel stage is derived from the previous one (impressions → clicks → leads → qualified → opportunities), so numbers stay consistent under any filter. Keep it deterministic: prerendering and hydration depend on that. Aggregations are in `lib/metrics.ts`. `components/dashboard/HeroDemoCard.tsx` is the compact light card in the hero (hand-drawn SVG, 30D/90D toggle). `components/dashboard/AnalyticsDemo.tsx` is the full demo in the dark measurement section; its default metric is cost per qualified lead, and it lazy-loads the Recharts `TrendChart` with `next/dynamic`. Figures tween through `components/ui/AnimatedNumber.tsx` (300 ms, instant under reduced motion). The chart colours (Meta `#4C7DFF`, Google `#D96A2E`) were validated for colour-vision deficiency and contrast against both surfaces.

**Lead capture.** `lib/lead-schema.ts` is a dependency-free schema (options, `validateField`, `validateLead`, `coerceLead`). It is shared by `components/sections/LeadForm.tsx` for instant client-side feedback and by `app/api/lead/route.ts`, which does the authoritative validation. Industry options are derived from `industries` in config.
- The form has two steps but posts one `LeadInput`. Step 1 (`STEP_ONE_FIELDS`): name, email, company, optional website; "Continue" validates these before step 2 is shown. Step 2 (`STEP_TWO_FIELDS`): market, industry, budget, challenge, optional message, consent. The honeypot and `startedAt` are set once for the whole form.
- Budget bands follow the market's currency: `india` → INR (₹ lakh bands), `uae-gcc` → AED, `other` and `multiple` → USD; every market also has `not-sure`. `currencyForMarket()` and `budgetOptionsFor()` drive the select, and the schema rejects a budget from another currency. Changing the market clears a budget that no longer applies. Budget values are stored raw (e.g. `inr-1l-3l`) by the Google Sheet inbox; the email uses labels.

The route:
- runs spam checks: honeypot field `hp`, a minimum 3 s since `startedAt`, a 16 KB body limit, and an in-memory per-IP rate limit (5 per 10 min);
- delivers to every configured destination (webhook via `LEAD_WEBHOOK_URL`, and/or email via Resend);
- returns `ok: true` only if at least one destination accepted the lead. Otherwise it returns 503 `not_configured` or 502 `delivery_failed` and logs the full payload with a `[lead]` prefix so the enquiry can be recovered. Never make the form show success without a confirmed delivery.

Contextual CTAs prefill the form without sharing state, through `prefillEnquiry()` in `lib/prefill.ts`. On the homepage (industry links and the service panels' CTAs) it dispatches a `site:prefill-enquiry` window event that `LeadForm` listens for, then scrolls to `#contact`. On pages without the form (an article's "Talk to us about this", which prefills the message with the article title) it stores the prefill in `sessionStorage` under `site:prefill` and navigates to `/#contact`; `LeadForm` reads and removes that key on mount. A prefill holds industry/challenge/message for step 2 and never changes the step or replaces a success screen. The primary CTA (`BookCallButton`, label from `site.cta.primary`) reads "Book a call" and opens `NEXT_PUBLIC_BOOKING_URL` when it is set, and otherwise reads "Start a conversation" and scrolls to `#contact`.

**Accessibility and motion.** `MotionProvider` wraps the app in `MotionConfig reducedMotion="user"`, and the reduced-motion block in `app/globals.css` stops transitions and keyframes and forces `<Reveal>` content (`[data-reveal]`) visible, so nothing waits for a scroll to appear. Each page has exactly one `h1`. Interactive widgets (the radio-pattern segmented controls with arrow keys, the sortable table with `aria-sort`, `Disclosure` rows built on `<details>`, the focus-trapped mobile menu) are keyboard-operable. Preserve this when you edit them.

**SEO.** Each page sets metadata with canonical URLs against `metadataBase` (`site.url`, which comes from `NEXT_PUBLIC_SITE_URL`). Structured data is deliberately limited to Organization (name and URL) and Article. Do not add review or rating schema.

The legal pages (`app/privacy`, `app/terms`) are drafts that contain `[To be confirmed]` items and a `<LegalReviewNotice />`. Don't remove the notice unless you're asked to.
