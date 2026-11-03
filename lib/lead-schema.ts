/**
 * Enquiry form schema, shared by the browser (instant feedback) and the API
 * route (authoritative validation). No third-party validation library needed.
 */
import { industries } from "@/config/site";

export interface Option {
  value: string;
  label: string;
}

export type Currency = "INR" | "AED" | "USD";

export const MARKET_OPTIONS: readonly Option[] = [
  { value: "india", label: "India" },
  { value: "uae-gcc", label: "UAE & GCC" },
  { value: "other", label: "Other countries" },
  { value: "multiple", label: "More than one market" },
];

const NOT_SURE: Option = { value: "not-sure", label: "Not sure yet" };

export const BUDGET_OPTIONS_BY_CURRENCY: Record<Currency, readonly Option[]> = {
  INR: [
    { value: "inr-under-1l", label: "Under ₹1 lakh / month" },
    { value: "inr-1l-3l", label: "₹1–3 lakh / month" },
    { value: "inr-3l-10l", label: "₹3–10 lakh / month" },
    { value: "inr-10l-30l", label: "₹10–30 lakh / month" },
    { value: "inr-30l-plus", label: "₹30 lakh+ / month" },
    NOT_SURE,
  ],
  AED: [
    { value: "aed-under-7500", label: "Under AED 7,500 / month" },
    { value: "aed-7500-20k", label: "AED 7,500–20,000 / month" },
    { value: "aed-20k-55k", label: "AED 20,000–55,000 / month" },
    { value: "aed-55k-185k", label: "AED 55,000–185,000 / month" },
    { value: "aed-185k-plus", label: "AED 185,000+ / month" },
    NOT_SURE,
  ],
  USD: [
    { value: "under-2k", label: "Under $2,000 / month" },
    { value: "2k-5k", label: "$2,000 – $5,000 / month" },
    { value: "5k-15k", label: "$5,000 – $15,000 / month" },
    { value: "15k-50k", label: "$15,000 – $50,000 / month" },
    { value: "50k-plus", label: "$50,000+ / month" },
    NOT_SURE,
  ],
};

export function currencyForMarket(market: string): Currency {
  if (market === "india") return "INR";
  if (market === "uae-gcc") return "AED";
  return "USD";
}

export const budgetOptionsFor = (market: string): readonly Option[] =>
  BUDGET_OPTIONS_BY_CURRENCY[currencyForMarket(market)];

/** Every band across currencies (de-duplicated), for label lookups. */
export const BUDGET_OPTIONS: readonly Option[] = [
  ...new Map(Object.values(BUDGET_OPTIONS_BY_CURRENCY).flat().map((o) => [o.value, o])).values(),
];

export const CHALLENGE_OPTIONS = [
  { value: "lead-quality", label: "Lead quality is inconsistent" },
  { value: "lead-volume", label: "Not enough leads or sales" },
  { value: "rising-costs", label: "Acquisition costs are rising" },
  { value: "conversion", label: "Leads aren’t converting to customers" },
  { value: "measurement", label: "Unclear tracking or attribution" },
  { value: "launch", label: "Launching paid campaigns for the first time" },
  { value: "other", label: "Something else" },
] as const;

export type ChallengeValue = (typeof CHALLENGE_OPTIONS)[number]["value"];

export const INDUSTRY_OPTIONS = [
  ...industries.map((i) => ({ value: i.id, label: i.title })),
  { value: "other", label: "Other" },
];

export interface LeadInput {
  fullName: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  market: string;
  budget: string;
  challenge: string;
  message: string;
  consent: boolean;
}

export type LeadField = keyof LeadInput;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const EMPTY_LEAD: LeadInput = {
  fullName: "",
  email: "",
  company: "",
  website: "",
  industry: "",
  market: "",
  budget: "",
  challenge: "",
  message: "",
  consent: false,
};

export const LIMITS = { name: 100, company: 120, website: 200, message: 2000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const inOptions = (value: string, options: readonly { value: string }[]) =>
  options.some((o) => o.value === value);

function normaliseWebsite(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateField(field: LeadField, input: LeadInput): string | undefined {
  const v = input[field];
  switch (field) {
    case "fullName": {
      const s = String(v).trim();
      if (!s) return "Please enter your full name.";
      if (s.length < 2) return "Name looks too short.";
      if (s.length > LIMITS.name) return `Please keep your name under ${LIMITS.name} characters.`;
      return;
    }
    case "email": {
      const s = String(v).trim();
      if (!s) return "Please enter your business email.";
      if (!EMAIL_RE.test(s) || s.length > 254) return "Please enter a valid email address, like name@company.com.";
      return;
    }
    case "company": {
      const s = String(v).trim();
      if (!s) return "Please enter your company name.";
      if (s.length > LIMITS.company) return `Please keep this under ${LIMITS.company} characters.`;
      return;
    }
    case "website": {
      const s = normaliseWebsite(String(v));
      if (!s) return;
      if (s.length > LIMITS.website || !isValidUrl(s)) return "Please enter a valid website, like company.com.";
      return;
    }
    case "industry":
      return inOptions(String(v), INDUSTRY_OPTIONS) ? undefined : "Please select your industry.";
    case "market":
      return inOptions(String(v), MARKET_OPTIONS) ? undefined : "Please select your target market.";
    case "budget":
      return inOptions(String(v), budgetOptionsFor(input.market)) ? undefined : "Please select a budget range.";
    case "challenge":
      return inOptions(String(v), CHALLENGE_OPTIONS) ? undefined : "Please select your main challenge.";
    case "message":
      return String(v).length > LIMITS.message
        ? `Please keep your message under ${LIMITS.message} characters.`
        : undefined;
    case "consent":
      return v === true ? undefined : "Please confirm we may use these details to respond to your enquiry.";
  }
}

export const STEP_ONE_FIELDS: readonly LeadField[] = ["fullName", "email", "company", "website"];
export const STEP_TWO_FIELDS: readonly LeadField[] = [
  "market",
  "industry",
  "budget",
  "challenge",
  "message",
  "consent",
];

export const FIELD_ORDER: readonly LeadField[] = [...STEP_ONE_FIELDS, ...STEP_TWO_FIELDS];

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  for (const f of FIELD_ORDER) {
    const e = validateField(f, input);
    if (e) errors[f] = e;
  }
  return errors;
}

/** Coerce untrusted JSON into a LeadInput with trimmed strings. */
export function coerceLead(raw: unknown): LeadInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (k: string, max = 4000) => (typeof r[k] === "string" ? (r[k] as string).trim().slice(0, max) : "");
  return {
    fullName: str("fullName", 200),
    email: str("email", 300),
    company: str("company", 200),
    website: normaliseWebsite(str("website", 300)),
    industry: str("industry", 50),
    market: str("market", 20),
    budget: str("budget", 20),
    challenge: str("challenge", 30),
    message: str("message", 4000),
    consent: r.consent === true,
  };
}

export function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}
