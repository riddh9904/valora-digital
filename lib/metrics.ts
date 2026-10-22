import type { Channel } from "@/types";
import {
  SAMPLE_CAMPAIGNS,
  SAMPLE_DATES,
  SAMPLE_ROWS,
  type DailyRow,
} from "@/lib/sample-data";

export type RangeDays = 7 | 30 | 90;
export type ChannelFilter = "all" | Channel;

export interface Filters {
  range: RangeDays;
  channel: ChannelFilter;
  campaignId: "all" | string;
}

export interface Totals {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualified: number;
  opportunities: number;
  ctr: number;
  cvr: number;
  cpl: number;
  cpql: number;
}

const safeDiv = (a: number, b: number) => (b > 0 ? a / b : 0);

export function totals(rows: DailyRow[]): Totals {
  const t = rows.reduce(
    (acc, r) => {
      acc.spend += r.spend;
      acc.impressions += r.impressions;
      acc.clicks += r.clicks;
      acc.leads += r.leads;
      acc.qualified += r.qualified;
      acc.opportunities += r.opportunities;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, leads: 0, qualified: 0, opportunities: 0 },
  );
  return {
    ...t,
    ctr: safeDiv(t.clicks, t.impressions),
    cvr: safeDiv(t.leads, t.clicks),
    cpl: safeDiv(t.spend, t.leads),
    cpql: safeDiv(t.spend, t.qualified),
  };
}

function matches(row: DailyRow, f: Filters) {
  if (f.channel !== "all" && row.channel !== f.channel) return false;
  if (f.campaignId !== "all" && row.campaignId !== f.campaignId) return false;
  return true;
}

/** Returns the rows for the selected window and for the equal-length window before it. */
export function selectPeriods(f: Filters) {
  const end = SAMPLE_DATES.length;
  const currentDates = new Set(SAMPLE_DATES.slice(end - f.range, end));
  const previousDates = new Set(SAMPLE_DATES.slice(end - f.range * 2, end - f.range));
  const current: DailyRow[] = [];
  const previous: DailyRow[] = [];
  for (const row of SAMPLE_ROWS) {
    if (!matches(row, f)) continue;
    if (currentDates.has(row.date)) current.push(row);
    else if (previousDates.has(row.date)) previous.push(row);
  }
  return {
    current,
    previous,
    dates: SAMPLE_DATES.slice(end - f.range, end),
  };
}

export function relativeChange(current: number, previous: number) {
  return previous > 0 ? (current - previous) / previous : 0;
}

export type TrendMetric = "leads" | "spend" | "cpl";

export interface TrendPoint {
  date: string;
  meta?: number;
  google?: number;
}

/** Daily series split by channel, for the selected metric. */
export function dailyByChannel(rows: DailyRow[], dates: string[], metric: TrendMetric): TrendPoint[] {
  const bucket = new Map<string, Record<Channel, { spend: number; leads: number; seen: boolean }>>();
  for (const d of dates) {
    bucket.set(d, {
      meta: { spend: 0, leads: 0, seen: false },
      google: { spend: 0, leads: 0, seen: false },
    });
  }
  for (const r of rows) {
    const day = bucket.get(r.date);
    if (!day) continue;
    day[r.channel].spend += r.spend;
    day[r.channel].leads += r.leads;
    day[r.channel].seen = true;
  }
  const pick = (v: { spend: number; leads: number; seen: boolean }) => {
    if (!v.seen) return undefined;
    if (metric === "leads") return v.leads;
    if (metric === "spend") return Math.round(v.spend);
    return v.leads > 0 ? Math.round((v.spend / v.leads) * 100) / 100 : undefined;
  };
  return dates.map((date) => {
    const day = bucket.get(date)!;
    return { date, meta: pick(day.meta), google: pick(day.google) };
  });
}

export interface CampaignRollup extends Totals {
  id: string;
  name: string;
  channel: Channel;
}

export function byCampaign(rows: DailyRow[]): CampaignRollup[] {
  return SAMPLE_CAMPAIGNS.map((c) => {
    const t = totals(rows.filter((r) => r.campaignId === c.id));
    return { id: c.id, name: c.name, channel: c.channel, ...t };
  }).filter((c) => c.spend > 0);
}

export interface FunnelStage {
  key: "impressions" | "clicks" | "leads" | "qualified" | "opportunities";
  label: string;
  value: number;
  /** Conversion from the previous stage (undefined for the first stage). */
  stepRate?: number;
}

export function funnel(t: Totals): FunnelStage[] {
  return [
    { key: "impressions", label: "Impressions", value: t.impressions },
    { key: "clicks", label: "Clicks", value: t.clicks, stepRate: safeDiv(t.clicks, t.impressions) },
    { key: "leads", label: "Leads", value: t.leads, stepRate: safeDiv(t.leads, t.clicks) },
    { key: "qualified", label: "Qualified leads", value: t.qualified, stepRate: safeDiv(t.qualified, t.leads) },
    { key: "opportunities", label: "Opportunities", value: t.opportunities, stepRate: safeDiv(t.opportunities, t.qualified) },
  ];
}
