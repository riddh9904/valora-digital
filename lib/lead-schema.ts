/**
 * Enquiry form schema, shared by the browser (instant feedback) and the API
 * route (authoritative validation). No third-party validation library needed.
 */
import { industries } from "@/config/site";

export const MARKET_OPTIONS = [
  { value: "india", label: "India" },
  { value: "us", label: "United States" },
  { value: "both", label: "Both India and the US" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under-2k", label: "Under $2,000 / month" },
  { value: "2k-5k", label: "$2,000 – $5,000 / month" },
  { value: "5k-15k", label: "$5,000 – $15,000 / month" },
  { value: "15k-50k", label: "$15,000 – $50,000 / month" },
  { value: "50k-plus", label: "$50,000+ / month" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const CHALLENGE_OPTIONS = [
  { value: "lead-quality", label: "Lead quality is inconsistent" },
  { value: "lead-volume", label: "Not enough leads or sales" },
  { value: "rising-costs", label: "Acquisition costs are rising" },
  { value: "conversion", label: "Leads aren't converting to customers" },
  { value: "measurement", label: "Unclear tracking or attribution" },
  { value: "launch", label: "Launching paid campaigns for the first time" },
  { value: "other", label: "Something else" },
] as const;

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
      return inOptions(String(v), BUDGET_OPTIONS) ? undefined : "Please select a budget range.";
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

export const FIELD_ORDER: LeadField[] = [
  "fullName",
  "email",
  "company",
  "website",
  "industry",
  "market",
  "budget",
  "challenge",
  "message",
  "consent",
];

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
