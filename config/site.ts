/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION: the single place to change brand, contact details,
 *  services, industries, CTAs, proof points and case studies.
 *
 *  Credibility rules (please keep them):
 *  • Leave contact/social fields as `null` until they are real. Empty values are
 *    hidden automatically; nothing is invented to fill the gap.
 *  • Proof points render only when `verified: true` AND a `source` is given.
 *  • `caseStudies` holds verified client work only: written permission to
 *    publish (`publicationApproved: true`), plus a source on every outcome and a
 *    measurement period. Until then the Client work section is not rendered.
 *  • `services` describes our method. It never names or implies a client and
 *    never shows numeric results; each `scenario` is hypothetical and renders
 *    with one "Illustrative scenario" stamp.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type {
  CaseStudy,
  Founder,
  Industry,
  Location,
  NavItem,
  ProofPoint,
  Service,
} from "@/types";

const env = (value: string | undefined) =>
  value && value.trim().length > 0 ? value.trim() : null;

export const site = {
  name: "Valora Digital",
  shortName: "Valora",
  tagline: "AI-driven performance marketing, measured to the sale.",
  // Must stay ≤165 characters, so it says "other ad platforms" rather than "other paid ad platforms".
  description:
    "Valora Digital manages Meta, Google and other ad platforms for businesses in India, the UAE and the US, with AI optimisation steered by qualified leads and sales.",
  /** Positioning line, shown in the What we do intro and the footer. */
  positioning: "Performance marketing built around business outcomes, not vanity metrics.",
  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL in each environment. */
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  locale: "en_IN",

  /**
   * Brand palette. These are injected as CSS custom properties in app/layout.tsx
   * and consumed by the Tailwind theme in app/globals.css.
   */
  colors: {
    ink: "#0B0C0E",
    mist: "#F4F5F4",
    graphite: "#5E6368",
    line: "#E1E3E1",
    signal: "#0B7A5A",
    signalBright: "#12B886",
  },

  /** Contact details. `null` = not shown anywhere on the site. */
  contact: {
    email: "inquiry@valoradigital.co" as string | null,
    phone: null as string | null,
    whatsapp: { e164: "+918368526041", display: "+91 83685 26041" } as {
      e164: string;
      display: string;
    } | null,
    address: null as string | null,
  },

  social: {
    linkedin: null as string | null,
  },

  /**
   * External scheduling link (Calendly, Cal.com, HubSpot meetings…).
   * When null, "Book a strategy call" scrolls to the enquiry form instead.
   */
  bookingUrl: env(process.env.NEXT_PUBLIC_BOOKING_URL),

  cta: {
    primary: env(process.env.NEXT_PUBLIC_BOOKING_URL) ? "Book a call" : "Start a conversation",
    secondary: "Explore our approach",
    form: "Tell us about your business",
  },
} as const;

export const locations: Location[] = [
  { city: "Dubai", role: "Headquarters" },
  { city: "Gurugram", role: "Office" },
];

export const navItems: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Industries", href: "/#industries" },
  { label: "How we work", href: "/#approach" },
  { label: "Insights", href: "/#insights" },
  { label: "About", href: "/#about" },
];

export const services: Service[] = [
  {
    id: "lead-generation",
    label: "Lead generation",
    headline: "More qualified leads. Less wasted ad spend.",
    summary:
      "We agree with your sales team what counts as a qualified lead, send that signal to Meta’s and Google’s AI bidding, and move budget to the campaigns that produce it.",
    includes: ["Meta Ads", "Google Ads", "LinkedIn, TikTok & Snapchat", "AI creative testing", "In-house creative studio", "Catalogue campaigns"],
    problem:
      "Cost per lead looks healthy in the ad platform, but the sales team says many enquiries are unreachable, out of area or not ready to buy.",
    scenario:
      "A residential developer runs lead-form campaigns. The campaigns with the cheapest leads produce almost no site visits. Their budget moves to the campaign whose leads the sales team rates highest, and the platform is sent site-visit bookings, not form fills, as the result to optimise for.",
    approach: [
      "Write down the qualified-lead definition and the CRM status that marks it",
      "Pass campaign and ad IDs into the CRM with every lead",
      "Report cost per qualified lead next to platform cost per lead",
      "Send qualified-lead events back through Meta’s Conversions API and Google’s offline conversion import, so bidding optimises for them",
    ],
    metrics: [
      "Cost per qualified lead",
      "Qualified-lead rate",
      "Lead-to-opportunity rate",
      "Spend on campaigns with no qualified leads",
    ],
    tools: ["Conversions API", "Offline conversion import", "CRM field mapping", "UTM governance"],
    watchOut: "Only as good as the CRM data: the sales team needs to update lead status consistently.",
    cta: { label: "Talk to us about lead quality", challenge: "lead-quality" },
  },
  {
    id: "conversion",
    label: "Conversion optimisation",
    headline: "Fewer prospects lost between the click and the sale.",
    summary:
      "We trace every step from ad click to booked appointment or completed order, find where people drop out, and fix the biggest leak first.",
    includes: ["Landing pages", "A/B testing", "AI lead scoring", "AI qualification calls", "WhatsApp follow-up", "CRM routing"],
    problem:
      "Enquiries and carts get started, but few become appointments or orders, and nobody can say whether the page, the checkout or the follow-up is to blame.",
    scenario:
      "Most of a clinic’s enquiries arrive in the evening, but calls go out the next morning, and by then many people have booked elsewhere. An instant reply by message and a choice of callback time are tested first, before anyone touches the landing page.",
    approach: [
      "Map every step from ad click to appointment or order",
      "Track form and checkout starts, submissions and follow-up",
      "Break drop-off down by device, channel and campaign",
      "Turn the findings into a ranked test plan for the page and the follow-up",
    ],
    metrics: [
      "Landing-page conversion rate",
      "Form or checkout completion rate",
      "Enquiry-to-appointment rate",
      "Time to first response",
    ],
    tools: ["GA4", "Google Tag Manager", "Funnel reports", "A/B testing"],
    watchOut: "Needs enough traffic and tracking coverage to tell a real drop-off from noise.",
    cta: { label: "Talk to us about your funnel", challenge: "conversion" },
  },
  {
    id: "profitability",
    label: "Performance & profitability",
    headline: "What each new customer costs, measured against margin.",
    summary: "We connect ad spend to leads, sales and margin, so budget goes to the campaigns that pay.",
    includes: ["GA4 & Tag Manager", "Offline conversions", "Dashboards", "CAC & payback"],
    problem:
      "Campaigns are optimised on platform-reported ROAS, while finance judges the business on margin or booked sales from a separate system.",
    scenario:
      "A skincare brand’s best-ROAS campaign sells mostly discounted bundles to people who have bought before. Scaling decisions move to first-order margin and new-customer share, and that campaign’s budget is capped until it brings in new customers.",
    approach: [
      "Reconcile platform conversions with your CRM or store orders",
      "Add margin, discount or booking-value data",
      "Build a weekly acquisition-cost report by channel",
      "Agree scale and pause thresholds before spend goes up",
    ],
    metrics: ["Customer acquisition cost", "First-order margin", "New-customer share", "Payback period"],
    tools: ["Store or CRM export", "Meta and Google Ads data", "Looker Studio", "Python"],
    watchOut: "Attribution across platforms is directional, not exact, and the report marks where it is least reliable.",
    cta: { label: "Talk to us about acquisition cost", challenge: "rising-costs" },
  },
];

export const industries: Industry[] = [
  {
    id: "real-estate",
    label: "Real estate",
    title: "Real estate & property",
    problem:
      "Property campaigns can produce plenty of enquiries, but only a fraction become site visits. Without tracking past the form, it is hard to tell which campaigns bring serious buyers.",
    focus: [
      "Qualified property enquiries",
      "Lead-to-site-visit funnel",
      "Campaign and project-level tracking",
      "Lead follow-up measurement",
    ],
    summary: "Enquiries are cheap. Site visits are what count.",
    funnel: ["Enquiries", "Qualified", "Site visits", "Bookings"],
  },
  {
    id: "education",
    label: "Education",
    title: "Education & professional training",
    problem:
      "Admissions teams often juggle enquiries from many sources with long decision cycles. The question is not just cost per enquiry, but which sources lead to applications and enrolments.",
    focus: [
      "Enquiry generation",
      "Lead qualification",
      "Application funnel visibility",
      "Admission conversion measurement",
    ],
    summary: "Long decisions, many sources. We track which ones lead to applications.",
    funnel: ["Enquiries", "Counselled", "Applications", "Enrolments"],
  },
  {
    id: "ecommerce",
    label: "E-commerce & D2C",
    title: "E-commerce & D2C",
    problem:
      "Rising acquisition costs make it essential to know which creatives, audiences and products drive profitable first orders and repeat purchases.",
    focus: [
      "Paid customer acquisition",
      "Creative testing frameworks",
      "Purchase conversion",
      "Acquisition economics",
    ],
    summary: "Acquisition judged against first-order margin, not platform ROAS alone.",
    funnel: ["Sessions", "Add to cart", "Checkout", "Orders"],
  },
  {
    id: "services",
    label: "Professional services",
    title: "Professional & home services",
    problem:
      "Local service businesses depend on enquiries turning into booked appointments. Missed calls and slow follow-up can quietly erase the value of a campaign.",
    focus: [
      "Local lead generation",
      "Appointment bookings",
      "Enquiry-to-customer conversion",
      "Campaign profitability measurement",
    ],
    summary: "Missed calls quietly erase a campaign’s value.",
    funnel: ["Enquiries", "Contacted", "Appointments", "Customers"],
  },
];

/**
 * Verified proof points. All hidden until `verified: true` with a real source.
 * Example of a future entry:
 *   { label: "Campaigns launched", value: "24", source: "Internal campaign log, Jan–Jun 2027", verified: true }
 */
export const proofPoints: ProofPoint[] = [];

/** Founder profiles. The section shows team copy only until real, approved bios are added. */
export const founders: Founder[] = [];

/** Verified client work only. Rendered only with publicationApproved: true and a source on every outcome. */
export const caseStudies: CaseStudy[] = [];
