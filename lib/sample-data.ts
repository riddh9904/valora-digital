/**
 * SYNTHETIC SAMPLE DATA, used only by the demonstration dashboards.
 *
 * Every figure produced here is generated from a fixed seed. Nothing in this
 * file represents actual client, agency or campaign performance. Each funnel
 * step is derived from the one before it (impressions → clicks → leads →
 * qualified → opportunities), so the numbers stay internally consistent
 * whatever filter is applied.
 */
import type { Channel } from "@/types";

export interface SampleCampaign {
  id: string;
  name: string;
  channel: Channel;
  dailySpend: number;
  cpm: number;
  ctr: number;
  /** click → lead */
  cvr: number;
  /** lead → qualified */
  qualRate: number;
  /** qualified → opportunity */
  oppRate: number;
  /** relative efficiency drift across the period (positive = improving) */
  drift: number;
}

export interface DailyRow {
  date: string; // YYYY-MM-DD
  campaignId: string;
  channel: Channel;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualified: number;
  opportunities: number;
}

export const SAMPLE_CAMPAIGNS: SampleCampaign[] = [
  { id: "meta-prospecting", name: "Prospecting · Broad", channel: "meta", dailySpend: 210, cpm: 7.2, ctr: 0.0118, cvr: 0.072, qualRate: 0.31, oppRate: 0.24, drift: 0.12 },
  { id: "meta-lookalike", name: "Lookalike · Leads", channel: "meta", dailySpend: 160, cpm: 8.9, ctr: 0.0141, cvr: 0.086, qualRate: 0.38, oppRate: 0.27, drift: 0.08 },
  { id: "meta-retargeting", name: "Retargeting · Site visitors", channel: "meta", dailySpend: 70, cpm: 13.5, ctr: 0.0216, cvr: 0.112, qualRate: 0.47, oppRate: 0.33, drift: 0.02 },
  { id: "google-brand", name: "Search · Brand", channel: "google", dailySpend: 55, cpm: 38, ctr: 0.118, cvr: 0.138, qualRate: 0.56, oppRate: 0.38, drift: 0.01 },
  { id: "google-intent", name: "Search · High intent", channel: "google", dailySpend: 190, cpm: 46, ctr: 0.064, cvr: 0.094, qualRate: 0.49, oppRate: 0.31, drift: 0.1 },
  { id: "google-pmax", name: "Performance Max", channel: "google", dailySpend: 120, cpm: 11, ctr: 0.0092, cvr: 0.061, qualRate: 0.27, oppRate: 0.21, drift: -0.04 },
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
};

/** Total days generated: enough for a 90-day view plus its comparison period. */
export const SAMPLE_DAYS = 180;
/** Fixed anchor so output is deterministic (not tied to the current date). */
const START_UTC = Date.UTC(2026, 2, 1);
const DAY_MS = 86_400_000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDate(index: number) {
  return new Date(START_UTC + index * DAY_MS).toISOString().slice(0, 10);
}

function generate(): DailyRow[] {
  const rand = mulberry32(20260301);
  const jitter = (spread: number) => 1 + (rand() - 0.5) * 2 * spread;
  const rows: DailyRow[] = [];

  for (let d = 0; d < SAMPLE_DAYS; d++) {
    const date = isoDate(d);
    const weekday = new Date(START_UTC + d * DAY_MS).getUTCDay();
    const weekly = weekday === 0 || weekday === 6 ? 0.82 : 1.04;
    const progress = d / (SAMPLE_DAYS - 1);
    // gentle budget ramp + a mid-period seasonal bump
    const budget = 0.86 + progress * 0.22 + 0.06 * Math.sin(progress * Math.PI * 2.2);

    for (const c of SAMPLE_CAMPAIGNS) {
      const efficiency = 1 + c.drift * progress;
      const spend = c.dailySpend * budget * weekly * jitter(0.09);
      const impressions = Math.round((spend / (c.cpm * jitter(0.06))) * 1000);
      const clicks = Math.round(impressions * c.ctr * jitter(0.1));
      const leads = Math.round(clicks * c.cvr * efficiency * jitter(0.18));
      const qualified = Math.round(leads * c.qualRate * jitter(0.2));
      const opportunities = Math.round(qualified * c.oppRate * jitter(0.3));
      rows.push({
        date,
        campaignId: c.id,
        channel: c.channel,
        spend: Math.round(spend * 100) / 100,
        impressions,
        clicks,
        leads,
        qualified: Math.min(qualified, leads),
        opportunities: Math.min(opportunities, qualified),
      });
    }
  }
  return rows;
}

export const SAMPLE_ROWS: DailyRow[] = generate();
export const SAMPLE_DATES: string[] = Array.from({ length: SAMPLE_DAYS }, (_, i) => isoDate(i));
