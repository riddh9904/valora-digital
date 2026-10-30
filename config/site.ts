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
import {
  ChartNoAxesCombined,
  Crosshair,
  Magnet,
  MousePointerClick,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import type {
  CaseStudy,
  Founder,
  Industry,
  NavItem,
  ProofPoint,
  Service,
} from "@/types";

const env = (value: string | undefined) =>
  value && value.trim().length > 0 ? value.trim() : null;

export const site = {
  name: "Valora Digital",
  shortName: "Valora",
  tagline: "Performance marketing with conversion intelligence.",
  description:
    "Valora Digital is a performance marketing partner for ambitious businesses: Meta and Google Ads, lead generation, conversion rate optimization and marketing analytics that connect spend to real business outcomes.",
  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL in each environment. */
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  locale: "en_IN",

  /**
   * Brand palette. These are injected as CSS custom properties in app/layout.tsx
   * and consumed by the Tailwind theme in app/globals.css.
   */
  colors: {
    ink: "#0A1022",
    inkDeep: "#070B18",
    paper: "#F7F6F2",
    accent: "#3461F0",
    accentBright: "#5B84FF",
    violet: "#7C5CFF",
  },

  /** Contact details. `null` = not shown anywhere on the site. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
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
    primary: "Book a strategy call",
    secondary: "Explore our approach",
    form: "Tell us about your business",
  },
} as const;

export const navItems: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Industries", href: "/#industries" },
  { label: "Our approach", href: "/#approach" },
  { label: "Insights", href: "/#insights" },
  { label: "About", href: "/#about" },
];

export const services: Service[] = [
  {
    id: "paid-media",
    title: "Paid media management",
    icon: Crosshair,
    description:
      "Meta Ads and Google Ads management: campaign structure, targeting, budget allocation and continuous optimization.",
    benefit:
      "Budget moves toward the campaigns that produce qualified demand, not just cheap clicks.",
    capabilities: ["Meta Ads", "Google Ads", "Budget pacing", "Account structure"],
  },
  {
    id: "lead-generation",
    title: "Lead generation",
    icon: Magnet,
    description:
      "Campaigns designed to generate relevant enquiries and qualified opportunities, with lead quality tracked from day one.",
    benefit: "A sales pipeline judged by fit and intent, not form-fill volume.",
    capabilities: ["Lead forms", "Qualification criteria", "Lead scoring inputs"],
  },
  {
    id: "cro",
    title: "Conversion rate optimization",
    icon: MousePointerClick,
    description:
      "Landing-page analysis, funnel improvements, structured experimentation and conversion diagnostics.",
    benefit: "More customers from the traffic you already pay for.",
    capabilities: ["Landing pages", "A/B testing", "Funnel diagnostics"],
  },
  {
    id: "analytics",
    title: "Marketing analytics",
    icon: ChartNoAxesCombined,
    description:
      "Conversion tracking, attribution analysis, reporting dashboards and acquisition economics.",
    benefit: "Decisions grounded in numbers your team can trust and explain.",
    capabilities: ["Tracking setup", "Attribution", "Dashboards", "CAC & payback"],
  },
  {
    id: "ecommerce",
    title: "E-commerce growth",
    icon: ShoppingBag,
    description:
      "Customer acquisition, creative testing, purchase-funnel optimization and campaign performance analysis for D2C brands.",
    benefit: "Profitable acquisition measured against margin, not platform-reported ROAS alone.",
    capabilities: ["Creative testing", "Catalogue campaigns", "Checkout funnel"],
  },
  {
    id: "automation",
    title: "Marketing automation",
    icon: Workflow,
    description:
      "Lead routing, CRM workflows, follow-up automation and lead lifecycle reporting.",
    benefit: "Faster follow-up and a clear record of what happens after the enquiry.",
    capabilities: ["Lead routing", "CRM workflows", "Lifecycle reporting"],
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
    services: ["Lead generation", "Marketing automation", "Marketing analytics"],
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
    services: ["Lead generation", "Conversion rate optimization", "Marketing analytics"],
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
    services: ["Paid media management", "E-commerce growth", "Conversion rate optimization"],
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
    services: ["Paid media management", "Lead generation", "Marketing automation"],
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
      "Locate the largest drop-off between first click and booked appointment, then prioritize fixes by expected impact.",
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
      "A D2C brand optimizes campaigns on platform-reported ROAS, while finance reviews contribution margin from a separate system.",
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
