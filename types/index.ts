import type { LucideIcon } from "lucide-react";

export type Channel = "meta" | "google";

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  benefit: string;
  capabilities: string[];
}

export interface Industry {
  id: string;
  /** Short label used in tabs, the footer and the enquiry form. */
  label: string;
  title: string;
  problem: string;
  focus: string[];
  services: string[];
  /** Labels for the stylised mini-funnel illustration (top → bottom). */
  funnel: [string, string, string, string];
}

/**
 * A verified, publishable proof point (e.g. "Campaigns managed").
 * Only entries with `verified: true` AND a `source` are ever rendered.
 */
export interface ProofPoint {
  label: string;
  value: string;
  source: string;
  verified: boolean;
}

export type CaseStudyKind = "verified" | "illustrative" | "methodology";

export interface CaseStudyOutcome {
  metric: string;
  value: string;
  /** Where the number comes from, e.g. "Google Ads account export". */
  source: string;
}

export interface CaseStudy {
  id: string;
  kind: CaseStudyKind;
  category: string;
  title: string;
  context: string;
  objective: string;
  work: string[];
  tools: string[];
  /** Rendered only when `kind === "verified"`. */
  outcomes?: CaseStudyOutcome[];
  measurementPeriod?: string;
  dataSource?: string;
  limitations?: string;
  /** Who did the work, e.g. "Founder-led analysis; media buying by client's in-house team". */
  attribution?: string;
  /** Confirm written permission before publishing any client-identifying detail. */
  publicationApproved?: boolean;
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
  /** Path under /public, e.g. "/team/jane.jpg". Optional. */
  photo?: string;
}

export interface InsightSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface Insight {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readingMinutes: number;
  /** ISO date (YYYY-MM-DD). Fixed, so sitemaps stay deterministic. */
  published: string;
  sections: InsightSection[];
}
