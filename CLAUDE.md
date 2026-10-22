# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js **16.4** (App Router), React 19.3, TypeScript (strict), Tailwind CSS v4, Motion, Recharts, Lucide. Version-specific docs ship in `node_modules/next/dist/docs/`; check them before using any Next.js API. This project relies on:
- `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`. Under Cache Components, server components can't read the current time or other non-deterministic values during prerender. That's why the footer year is rendered client-side (`components/ui/CopyrightYear.tsx`), with a build-time fallback from `NEXT_PUBLIC_BUILD_YEAR`.
- Global route types `PageProps<"/route">` and `LayoutProps<"/">`, plus `params` passed as a Promise (`const { slug } = await params`).
- Tailwind is loaded through a Turbopack loader rule (`@tailwindcss/turbopack`), not PostCSS.

## Commands

```bash
npm run dev          # dev server, http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve build (PORT=3100 npm run start to change port)
npm run lint         # ESLint (next core-web-vitals + typescript)
npx tsc --noEmit     # standalone type check
```

There is no test suite. Verify changes with `npm run lint`, `npx tsc --noEmit` and `npm run build`. Environment variables are documented in `.env.example`; copy it to `.env.local`. `NEXT_PUBLIC_*` values are inlined at build time.

## Architecture

A single-page marketing site for a pre-launch agency, plus `/insights`, `/insights/[slug]`, `/privacy`, `/terms` and one API route. The `@/*` import alias maps to the repo root.

**Content is config-driven.** `config/site.ts` is the single source for brand name, colors, contact details, CTAs, nav, services, industries, proof points, founders and case studies. Shared types live in `types/index.ts`. Articles live in `content/insights.ts` and feed the homepage, `/insights`, the article pages (via `generateStaticParams`) and `app/sitemap.ts`. Homepage sections are composed in order in `app/page.tsx`, one component per section in `components/sections/`, and each section's copy lives in its component.

**Brand colors flow config → CSS vars → Tailwind.** `app/layout.tsx` injects `site.colors` as `--brand-*` custom properties on `<html>`. The `@theme inline` block in `app/globals.css` maps them to Tailwind tokens (`ink-*`, `paper`, `accent`, `violet`, `meta`, `google`, …). Change colors in `config/site.ts`, not in the CSS.

**Credibility rules are enforced in code. Keep them intact.** Nothing on the site may be fabricated:
- Contact and social fields set to `null` are hidden everywhere.
- A proof point renders only if `verified: true` and it has a non-empty `source`.
- Case-study `outcomes` render only when `kind === "verified"` and `publicationApproved === true`. A verified entry without approval is hidden entirely. Non-verified entries always show an "Illustrative scenario" or "Methodology example · Not an actual client engagement" label.
- Founders and proof-point sections appear only when their arrays are non-empty.
- All dashboard data is synthetic and must carry a visible `<SampleDataLabel />`.

**Demo dashboards.** `lib/sample-data.ts` is a seeded, deterministic generator (180 days × 6 campaigns). Each funnel stage is derived from the previous one (impressions → clicks → leads → qualified → opportunities), so numbers stay consistent under any filter. Keep it deterministic: prerendering and hydration depend on that. Aggregations are in `lib/metrics.ts`. `components/dashboard/AnalyticsDemo.tsx` lazy-loads the Recharts `TrendChart` with `next/dynamic`. The chart colors (Meta `#4C7DFF`, Google `#D96A2E`) were validated for color-vision deficiency and contrast against the dark surface.

**Lead capture.** `lib/lead-schema.ts` is a dependency-free schema (options, `validateField`, `validateLead`, `coerceLead`). It is shared by `components/sections/LeadForm.tsx` for instant client-side feedback and by `app/api/lead/route.ts`, which does the authoritative validation. Industry options are derived from `industries` in config. The route:
- runs spam checks: honeypot field `hp`, a minimum 3 s since `startedAt`, a 16 KB body limit, and an in-memory per-IP rate limit (5 per 10 min);
- delivers to every configured destination (webhook via `LEAD_WEBHOOK_URL`, and/or email via Resend);
- returns `ok: true` only if at least one destination accepted the lead. Otherwise it returns 503 `not_configured` or 502 `delivery_failed` and logs the full payload with a `[lead]` prefix so the enquiry can be recovered. Never make the form show success without a confirmed delivery.

Contextual CTAs, such as an industry module, prefill the form without sharing state: they dispatch a `site:prefill-enquiry` window event through `prefillEnquiry()` in `lib/prefill.ts`, and `LeadForm` listens for it. "Book a strategy call" (`BookCallButton`) links to `NEXT_PUBLIC_BOOKING_URL` if it is set, and otherwise scrolls to `#contact`.

**Accessibility and motion.** `MotionProvider` wraps the app in `MotionConfig reducedMotion="user"`, and the CSS also respects `prefers-reduced-motion`. Each page has exactly one `h1`. Interactive widgets (tabs, segmented controls, the sortable table with `aria-sort`, the focus-trapped mobile menu) are keyboard-operable. Preserve this when you edit them.

**SEO.** Each page sets metadata with canonical URLs against `metadataBase` (`site.url`, which comes from `NEXT_PUBLIC_SITE_URL`). Structured data is deliberately limited to Organization (name and URL) and Article. Do not add review or rating schema.

The legal pages (`app/privacy`, `app/terms`) are drafts that contain `[To be confirmed]` items and a `<LegalReviewNotice />`. Don't remove the notice unless you're asked to.
