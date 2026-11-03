/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION: the single place to change brand, contact details,
 *  services, industries, CTAs, proof points and case studies.
 *
 *  Credibility rules (please keep them):
 *  • Leave contact/social fields as `null` until they are real. Empty values are
 *    hidden automatically; nothing is invented to fill the gap.
 *  • Proof points render only when `verified: true` AND a `source` is given.
 *  • Case studies with kind "verified" must have permission to publish and a
 *    stated data source + measurement period. Everything else is labelled as
 *    illustrative on the page.
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
  description:
    "Valora Digital runs AI-driven Meta and Google Ads for businesses in India, the UAE and beyond, trains the platforms on qualified leads and sales, and reports what every customer cost.",
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
    id: "acquire",
    title: "Acquire",
    summary:
      "Meta and Google Ads with Advantage+, Performance Max and Smart Bidding, steered by qualified-lead and sales signals. AI-generated copy, image and video variations, tested against each other.",
    includes: ["Meta Ads", "Google Ads", "Creative testing", "Catalogue campaigns"],
  },
  {
    id: "convert",
    title: "Convert",
    summary:
      "Landing pages, structured A/B tests, AI lead scoring and CRM routing, so the best leads get the fastest reply.",
    includes: ["Landing pages", "A/B testing", "Lead scoring", "CRM routing"],
  },
  {
    id: "measure",
    title: "Measure",
    summary:
      "Tracking set up properly, platform numbers reconciled with the CRM, AI-assisted summaries of what changed, and a weekly report on cost per qualified lead, acquisition cost and payback.",
    includes: ["GA4 & Tag Manager", "Offline conversions", "Dashboards", "CAC & payback"],
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
    services: ["Acquire", "Convert", "Measure"],
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
    services: ["Acquire", "Convert", "Measure"],
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
    services: ["Acquire", "Convert", "Measure"],
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
    services: ["Acquire", "Convert"],
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

/**
 * Selected projects & demonstrations.
 * Non-verified entries are always labelled "Illustrative scenario · Not an actual client engagement".
 */
export const caseStudies: CaseStudy[] = [
  {
    id: "lead-quality-scoring",
    kind: "methodology",
    category: "Lead quality",
    title: "Separating lead volume from lead quality",
    context:
      "A business running lead-generation campaigns sees a healthy cost per lead in the ad platform, while the sales team reports that many enquiries are unreachable or out of scope.",
    objective:
      "Define what a qualified lead means for the business and report campaign performance on that basis.",
    work: [
      "Agree qualification criteria with the sales team",
      "Pass campaign and ad identifiers into the CRM with every lead",
      "Report cost per qualified lead by campaign alongside platform CPL",
      "Feed qualified-lead signals back to the ad platforms where supported",
    ],
    tools: ["UTM governance", "CRM field mapping", "Offline conversion import", "SQL / spreadsheets"],
    limitations:
      "Requires consistent lead status updates from the sales team; results depend on CRM data quality.",
  },
  {
    id: "funnel-diagnostic",
    kind: "illustrative",
    category: "Conversion diagnostics",
    title: "Finding where an enquiry funnel leaks",
    context:
      "A services business generates steady landing-page traffic, but booked appointments lag well behind enquiries.",
    objective:
      "Locate the largest drop-off between first click and booked appointment, then prioritise fixes by expected impact.",
    work: [
      "Map every step from ad click to appointment",
      "Instrument form starts, submissions and follow-up events",
      "Segment drop-off by device, channel and campaign",
      "Draft a ranked experiment backlog for the landing page and follow-up process",
    ],
    tools: ["GA4", "Google Tag Manager", "Funnel analysis", "Experiment backlog"],
    limitations:
      "Scenario for illustration only. Actual findings depend on the business, its tracking coverage and traffic volume.",
  },
  {
    id: "spend-to-revenue",
    kind: "illustrative",
    category: "Acquisition economics",
    title: "Connecting ad spend to first-order margin",
    context:
      "A D2C brand optimises campaigns on platform-reported ROAS, while finance reviews contribution margin from a separate system.",
    objective:
      "Create a weekly view that compares spend with orders, margin and new-customer share by channel.",
    work: [
      "Reconcile platform conversions with store orders",
      "Add product margin and discount data to order records",
      "Build a weekly acquisition-economics report by channel",
      "Set guardrails for scaling and pausing campaigns",
    ],
    tools: ["Shopify export", "Meta & Google Ads data", "Looker Studio", "Python"],
    limitations:
      "Scenario for illustration only. Attribution across platforms is directional, not exact.",
  },
];
