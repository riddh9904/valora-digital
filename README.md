# Nexora Growth: marketing website

The marketing site for a pre-launch performance marketing agency. It is built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion** (Framer Motion), **Recharts** and **Lucide** icons.

> "Nexora Growth" is a **placeholder brand name**. Its trademark and domain availability have not been checked. You can change it in one place (see [Rebranding](#rebranding)).

The site is built so that nothing on it is fabricated. All dashboards use synthetic sample data and are labelled as illustrative. Proof points, case-study outcomes, founder profiles and contact details stay **hidden until you add real, verified values** to the config.

---

## Quick start

Requirements: **Node.js 20.9+** (developed on Node 26) and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build (`PORT=3100 npm run start` to change port) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npx tsc --noEmit` | Standalone type check |

---

## Environment variables

All variables are documented in [`.env.example`](.env.example). Never commit `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Canonical origin for metadata, Open Graph, sitemap and robots.txt. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_BOOKING_URL` | Optional | Calendly / Cal.com / HubSpot Meetings link. If empty, "Book a strategy call" scrolls to the enquiry form. |
| `LEAD_WEBHOOK_URL` | One destination required | Receives each enquiry as a JSON `POST`. |
| `LEAD_WEBHOOK_SECRET` | Optional | Sent as the `X-Webhook-Secret` header so your endpoint can verify the source. |
| `RESEND_API_KEY` | One destination required | Sends each enquiry by email through [Resend](https://resend.com). |
| `LEAD_EMAIL_TO` | With Resend | Recipient(s), comma-separated. |
| `LEAD_EMAIL_FROM` | With Resend | Sender on a Resend-verified domain, e.g. `Website <enquiries@yourdomain.com>`. |

`NEXT_PUBLIC_*` values are inlined at **build time**, so rebuild after you change them.

---

## Configuring lead capture

The form posts to [`app/api/lead/route.ts`](app/api/lead/route.ts). That route validates the input again on the server and then delivers it to every configured destination:

- **Webhook** (Zapier, Make, n8n, a HubSpot workflow, your own API) receives:
  ```json
  {
    "type": "website_enquiry",
    "source": "Nexora Growth",
    "submittedAt": "2026-10-16T14:38:47.204Z",
    "page": "https://…/",
    "lead": {
      "fullName": "…", "email": "…", "company": "…", "website": "https://…",
      "industry": "education", "market": "india|us|both", "budget": "2k-5k",
      "challenge": "lead-quality", "message": "…", "consent": true
    }
  }
  ```
- **Email via Resend** sends a formatted email, with `reply_to` set to the enquirer.
- **Google Sheets (free)**: [`scripts/google-sheet-inbox.gs`](scripts/google-sheet-inbox.gs) is a Google Apps Script that adds each enquiry to a sheet and emails a notification. Setup steps are at the top of the file. Use the web app URL plus `?key=<SECRET_KEY>` as `LEAD_WEBHOOK_URL`. A webhook that answers with JSON `{ "ok": false }` counts as a failed delivery.
- **Local testing**: `npm run dev:inbox` starts a test inbox on `http://localhost:4000/lead` that prints each enquiry and saves it to `.dev-leads.jsonl`.

How the route responds:

| Situation | HTTP status | What the visitor sees |
| --- | --- | --- |
| At least one destination accepted the lead | 200 `{ ok: true }` | A success message |
| Every destination failed | 502 `delivery_failed` | "Your enquiry wasn't sent…", with their details kept in the form |
| No destination configured | 503 `not_configured` | In development, a configuration notice. In production, a polite "temporarily unavailable" message |
| Invalid input | 400 `validation` | Errors on each field |

The site **never shows success unless delivery succeeded**. When delivery fails or isn't configured, the full enquiry is written to the server log (`[lead] …`) so it can be recovered.

**Spam protection:** a hidden honeypot field, a 3-second minimum fill time, server-side validation, a 16 KB body limit and a best-effort per-IP rate limit (5 per 10 minutes, in memory). For multi-instance hosting, add a shared rate limiter (for example Upstash Redis) or your platform's firewall/bot protection. Turnstile or reCAPTCHA can also be added inside `LeadForm.tsx` and checked in the route.

---

## Updating content

Almost everything lives in **[`config/site.ts`](config/site.ts)**:

| What | Where |
| --- | --- |
| Brand name, tagline, description, colors | `site` |
| Contact email, phone, address, LinkedIn | `site.contact`, `site.social`. Leave as `null` to hide |
| CTA labels | `site.cta` |
| Navigation | `navItems` |
| Services (title, Lucide icon, copy, benefit) | `services` |
| Target industries | `industries` |
| Verified proof points | `proofPoints` |
| Founder profiles | `founders` |
| Projects and case studies | `caseStudies` |

Other content:

- **Insights articles** are in [`content/insights.ts`](content/insights.ts). Add an entry and it appears on the homepage, on `/insights`, on its own page and in the sitemap. Set each article's `published` date to its real publication date before launch.
- **Section copy** (headlines and supporting text) is in [`components/sections/`](components/sections), one file per section in page order (see [`app/page.tsx`](app/page.tsx)).
- **Privacy Policy and Terms** are in [`app/privacy/page.tsx`](app/privacy/page.tsx) and [`app/terms/page.tsx`](app/terms/page.tsx). They are **starter drafts**: complete every **[To be confirmed]** item, have a lawyer review them, then remove `<LegalReviewNotice />`.

### Rebranding

1. Change `site.name`, `site.shortName`, `site.tagline` and `site.description` in `config/site.ts`.
2. Update `site.colors`. These values become CSS variables on `<html>`, and the Tailwind theme in `app/globals.css` reads from them.
3. Replace the logo mark in `components/layout/Wordmark.tsx` and `app/icon.svg`.
4. Rebuild.

### Adding verified proof points

```ts
export const proofPoints: ProofPoint[] = [
  { label: "Campaigns launched", value: "24", source: "Internal campaign log, Jan–Jun 2027", verified: true },
];
```

A proof point renders under the credibility strip **only** if `verified: true` and `source` is not empty. Keep the evidence on file.

### Adding a verified case study

```ts
{
  id: "acme-lead-quality",
  kind: "verified",                // "verified" | "illustrative" | "methodology"
  publicationApproved: true,       // written permission from the client
  category: "Lead quality",
  title: "…",
  context: "…",
  objective: "…",
  work: ["…"],
  tools: ["…"],
  outcomes: [{ metric: "Cost per qualified lead", value: "−18%", source: "HubSpot + Google Ads export" }],
  measurementPeriod: "1 Mar – 31 May 2027",
  dataSource: "Client CRM and ad accounts",
  attribution: "Founder-led analysis; media buying by client's in-house team",
  limitations: "Seasonality not controlled; attribution is last-click.",
}
```

Rules enforced in code:

- `outcomes` render **only** when `kind === "verified"` **and** `publicationApproved === true`.
- Non-verified items always carry the label "Illustrative scenario · Not an actual client engagement" or "Methodology example · Not an actual client engagement".
- Verified entries without `publicationApproved` are hidden entirely.

Before you publish a case study, include only metrics you can support, state the data source and period, separate founders' work from team or third-party work, and get permission for anything confidential.

### Adding founder profiles

Add entries to `founders` (`name`, `role`, `bio`, plus optional `linkedin` and `photo`). Put photos under `public/team/`. The profile grid appears automatically once the array is non-empty.

---

## The demonstration dashboard

The hero composition and the "Clarity Behind Every Campaign" dashboard both read from [`lib/sample-data.ts`](lib/sample-data.ts). That file is a seeded, deterministic generator covering 180 days × 6 campaigns, where each funnel stage is derived from the one before it. The aggregations live in [`lib/metrics.ts`](lib/metrics.ts).

Every view of this data carries a visible disclosure. If you change the generator, keep the labels in place.

Chart colors were validated for color-vision deficiency and contrast against the dark surface: Meta `#4C7DFF`, Google `#D96A2E`, plus a single-hue blue ramp for the funnel.

---

## Project structure

```
app/                 routes: home, /insights, /insights/[slug], /privacy, /terms,
                     /api/lead, sitemap, robots, OG image, icon, 404, error
components/
  layout/            Navbar, Footer, Wordmark, PageHeader, Prose, LegalReviewNotice
  sections/          one component per homepage section + LeadForm
  dashboard/         HeroDashboard, AnalyticsDemo, TrendChart (Recharts, lazy-loaded)
  ui/                Button, BookCallButton, SectionHeading, SampleDataLabel, Reveal, …
config/site.ts       single source for brand, contact, services, proof points, case studies
content/insights.ts  starter articles
lib/                 sample data, metrics, formatting, form schema, SVG helpers
types/               shared TypeScript types
```

**Accessibility:** semantic landmarks, a skip link, a single `h1` per page, keyboard-operable tabs, segmented controls and a sortable table (`aria-sort`). The mobile menu traps focus and closes on Escape. The form has labelled fields, inline errors, a focused error summary and live status messages. Focus rings are visible, and `prefers-reduced-motion` is respected by both the CSS and Motion.

**SEO:** per-page metadata with canonical URLs, Open Graph and Twitter cards, a generated OG image, `sitemap.xml` and `robots.txt`. Structured data is limited to Organization (name and URL only) and Article. There is no review or rating schema.

---

## Deployment

### Vercel (simplest)

1. Push the repository to GitHub, GitLab or Bitbucket and import it in Vercel.
2. Add the environment variables (at least `NEXT_PUBLIC_SITE_URL` and one lead destination).
3. Deploy. The API route runs as a serverless function, and every other page is prerendered.

### Any Node host (Railway, Render, Fly.io, a VM)

```bash
npm ci
npm run build
PORT=3000 npm run start
```

Put the app behind HTTPS (a reverse proxy or the platform's TLS), and make sure `x-forwarded-for` is forwarded so rate limiting works per visitor.

### Pre-launch checklist

- [ ] Final brand name and domain; set `NEXT_PUBLIC_SITE_URL`
- [ ] Configure a lead destination, then submit a test enquiry in production
- [ ] Add `NEXT_PUBLIC_BOOKING_URL` if you use a scheduler
- [ ] Real contact email and LinkedIn in `config/site.ts`, or leave them hidden
- [ ] Founder bios (approved wording only)
- [ ] Complete the legal pages and get them reviewed; set the "last updated" dates
- [ ] Check the article publish dates
- [ ] Optional: privacy-friendly analytics, then update the Privacy Policy and consent wording
