"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, Info } from "lucide-react";
import {
  byCampaign,
  dailyByChannel,
  funnel,
  relativeChange,
  selectPeriods,
  totals,
  type CampaignRollup,
  type ChannelFilter,
  type Filters,
  type RangeDays,
  type TrendMetric,
} from "@/lib/metrics";
import { CHANNEL_LABEL, SAMPLE_CAMPAIGNS } from "@/lib/sample-data";
import {
  formatCurrency,
  formatDelta,
  formatNumber,
  formatPercent,
  formatShortDate,
} from "@/lib/format";
import type { Channel } from "@/types";

const TrendChart = dynamic(() => import("./TrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-[10px] bg-white/[0.03]" aria-hidden />
  ),
});

const RANGES: { value: RangeDays; label: string }[] = [
  { value: 7, label: "7D" },
  { value: 30, label: "30D" },
  { value: 90, label: "90D" },
];
const CHANNELS: { value: ChannelFilter; label: string }[] = [
  { value: "all", label: "All channels" },
  { value: "meta", label: "Meta Ads" },
  { value: "google", label: "Google Ads" },
];
const METRICS: { value: TrendMetric; label: string }[] = [
  { value: "leads", label: "Leads" },
  { value: "spend", label: "Spend" },
  { value: "cpl", label: "Cost per lead" },
];
const FUNNEL_RAMP = ["#9db8ff", "#7097ff", "#4c7dff", "#3560d9", "#2647a8"];

// ── Small building blocks ────────────────────────────────────────────────────

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              selected ? "bg-white text-ink-900" : "text-slate-300 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Delta({ value, upIsGood }: { value: number; upIsGood: boolean | null }) {
  if (!Number.isFinite(value) || value === 0)
    return <span className="font-mono text-[0.7rem] text-slate-500">no change</span>;
  const up = value > 0;
  const good = upIsGood === null ? null : up === upIsGood;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-[0.7rem] ${
        good === null ? "text-slate-400" : good ? "text-emerald-300" : "text-amber-300"
      }`}
    >
      <Icon aria-hidden className="size-3" />
      {formatDelta(value)}
      <span className="sr-only">
        {" "}
        vs previous period{good === null ? "" : good ? " (favorable)" : " (unfavorable)"}
      </span>
    </span>
  );
}

type SortKey = "spend" | "leads" | "cpl" | "qualRate" | "cpql";

function SortHeader({
  k,
  sort,
  onSort,
  children,
  className = "",
}: {
  k: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (k: SortKey) => void;
  children: string;
  className?: string;
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={`px-3 py-3 text-right font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-white ${active ? "text-white" : ""}`}
      >
        {children}
        {active ? (
          sort.dir === "asc" ? <ArrowUp aria-hidden className="size-3" /> : <ArrowDown aria-hidden className="size-3" />
        ) : (
          <span aria-hidden className="size-3" />
        )}
      </button>
    </th>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function AnalyticsDemo() {
  const [filters, setFilters] = useState<Filters>({ range: 30, channel: "all", campaignId: "all" });
  const [metric, setMetric] = useState<TrendMetric>("leads");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "spend", dir: "desc" });
  const campaignSelectId = useId();

  const campaignOptions = SAMPLE_CAMPAIGNS.filter(
    (c) => filters.channel === "all" || c.channel === filters.channel,
  );

  const data = useMemo(() => {
    const p = selectPeriods(filters);
    const now = totals(p.current);
    const prev = totals(p.previous);
    const trend = dailyByChannel(p.current, p.dates, metric);
    const channels: Channel[] = (["meta", "google"] as Channel[]).filter((c) =>
      p.current.some((r) => r.channel === c),
    );
    return {
      now,
      prev,
      trend,
      channels,
      stages: funnel(now),
      campaigns: byCampaign(p.current),
      from: p.dates[0],
      to: p.dates[p.dates.length - 1],
    };
  }, [filters, metric]);

  const sortedCampaigns = useMemo(() => {
    const val = (c: CampaignRollup) =>
      sort.key === "qualRate" ? (c.leads ? c.qualified / c.leads : 0) : c[sort.key];
    return [...data.campaigns].sort((a, b) => (sort.dir === "asc" ? val(a) - val(b) : val(b) - val(a)));
  }, [data.campaigns, sort]);

  const maxCpql = Math.max(...data.campaigns.map((c) => c.cpql), 1);
  const { now, prev } = data;

  const kpis = [
    { label: "Spend", value: formatCurrency(now.spend, { compact: true }), delta: relativeChange(now.spend, prev.spend), upIsGood: null },
    { label: "Impressions", value: formatNumber(now.impressions, { compact: true }), delta: relativeChange(now.impressions, prev.impressions), upIsGood: true },
    { label: "Clicks", value: formatNumber(now.clicks, { compact: true }), delta: relativeChange(now.clicks, prev.clicks), upIsGood: true },
    { label: "Leads", value: formatNumber(now.leads), delta: relativeChange(now.leads, prev.leads), upIsGood: true },
    { label: "Cost per lead", value: formatCurrency(now.cpl), delta: relativeChange(now.cpl, prev.cpl), upIsGood: false },
    { label: "Click-to-lead rate", value: formatPercent(now.cvr), delta: relativeChange(now.cvr, prev.cvr), upIsGood: true },
  ] as const;

  const setChannel = (channel: ChannelFilter) =>
    setFilters((f) => {
      const keep = SAMPLE_CAMPAIGNS.find((c) => c.id === f.campaignId);
      return {
        ...f,
        channel,
        campaignId: keep && (channel === "all" || keep.channel === channel) ? f.campaignId : "all",
      };
    });

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));


  return (
    <div className="rounded-[var(--radius-xl)] border border-white/[0.08] bg-ink-850 shadow-[var(--shadow-panel)]">
      {/* Disclosure, placed first so it is read before any figure */}
      <div className="flex items-start gap-2.5 rounded-t-[var(--radius-xl)] border-b border-white/[0.07] bg-white/[0.03] px-5 py-3 text-xs leading-relaxed text-slate-300 sm:px-7">
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent-soft" />
        <p>
          <strong className="font-medium text-white">Demonstration dashboard.</strong> All figures are
          illustrative and do not represent actual client performance.
        </p>
      </div>

      <div className="p-5 sm:p-7">
        {/* Filters: one row above the charts */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-white">
              Campaign performance
            </h3>
            <p className="mt-0.5 font-mono text-[0.7rem] text-slate-400">
              {formatShortDate(data.from)} – {formatShortDate(data.to)} · compared with the previous {filters.range} days
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented
              label="Date range"
              options={RANGES}
              value={filters.range}
              onChange={(range) => setFilters((f) => ({ ...f, range }))}
            />
            <Segmented label="Channel" options={CHANNELS} value={filters.channel} onChange={setChannel} />
            <label htmlFor={campaignSelectId} className="sr-only">
              Campaign
            </label>
            <select
              id={campaignSelectId}
              value={filters.campaignId}
              onChange={(e) => setFilters((f) => ({ ...f, campaignId: e.target.value }))}
              className="field-input !w-auto !rounded-full !py-2 !pl-4 text-xs"
            >
              <option value="all">All campaigns</option>
              {campaignOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI tiles */}
        <dl aria-live="polite" className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <div key={k.label} className="bg-ink-850 p-4 sm:p-5">
              <dt className="text-xs text-slate-400">{k.label}</dt>
              <dd className="mt-2 font-display text-2xl font-semibold tracking-tight text-white tabular">
                {k.value}
              </dd>
              <dd className="mt-1.5">
                <Delta value={k.delta} upIsGood={k.upIsGood} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          {/* Trend */}
          <section aria-label="Performance trend" className="flex flex-col rounded-[var(--radius-md)] border border-white/[0.07] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-white">
                  {METRICS.find((m) => m.value === metric)?.label} per day
                </h4>
                {data.channels.length > 1 ? (
                  <ul className="mt-1.5 flex gap-4 text-xs text-slate-300" aria-label="Legend">
                    {data.channels.map((c) => (
                      <li key={c} className="flex items-center gap-1.5">
                        <span aria-hidden className={`h-0.5 w-3.5 rounded-full ${c === "meta" ? "bg-meta" : "bg-google"}`} />
                        {CHANNEL_LABEL[c]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">{data.channels.map((c) => CHANNEL_LABEL[c]).join("")}</p>
                )}
              </div>
              <Segmented label="Trend metric" options={METRICS} value={metric} onChange={setMetric} />
            </div>
            <div
              className="mt-4 h-[240px] sm:h-[280px] lg:h-auto lg:min-h-[280px] lg:flex-1"
              role="img"
              aria-label={`Line chart of ${metric === "cpl" ? "cost per lead" : metric} per day by channel, sample data. Exact values are listed in the campaign table below.`}
            >
              <TrendChart data={data.trend} channels={data.channels} metric={metric} />
            </div>
          </section>

          {/* Funnel */}
          <section aria-label="Lead funnel" className="rounded-[var(--radius-md)] border border-white/[0.07] p-4 sm:p-5">
            <h4 className="text-sm font-medium text-white">Lead funnel</h4>
            <p className="mt-1.5 text-xs text-slate-400">Bar length shows conversion from the previous stage</p>
            <ol className="mt-5 space-y-3.5">
              {data.stages.map((s, i) => (
                <li key={s.key}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="font-mono text-white tabular">{formatNumber(s.value)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-quint)]"
                        style={{
                          width: `${s.stepRate === undefined ? 100 : Math.max(1.5, s.stepRate * 100)}%`,
                          background: FUNNEL_RAMP[i],
                        }}
                      />
                    </div>
                    <span className="w-14 text-right font-mono text-[0.7rem] text-slate-400 tabular">
                      {s.stepRate === undefined ? "–" : formatPercent(s.stepRate)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-slate-400">
              Cost per qualified lead:{" "}
              <span className="font-mono text-white">{formatCurrency(now.cpql)}</span>
              <span className="text-slate-500"> vs {formatCurrency(now.cpl)} per raw lead</span>
            </p>
          </section>
        </div>

        {/* Campaign comparison (also serves as the table view for the charts) */}
        <section aria-label="Campaign comparison" className="mt-5 rounded-[var(--radius-md)] border border-white/[0.07]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pt-4 sm:px-5">
            <h4 className="text-sm font-medium text-white">Campaign comparison</h4>
            <p className="text-xs text-slate-500">
              Select a column header to sort<span className="md:hidden"> · swipe for more columns</span>
            </p>
          </div>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <caption className="sr-only">
                Sample campaign metrics for the selected period. Illustrative data only.
              </caption>
              <thead className="text-xs text-slate-400">
                <tr className="border-b border-white/[0.07]">
                  <th scope="col" className="px-4 py-3 text-left font-medium sm:px-5">Campaign</th>
                  <SortHeader sort={sort} onSort={toggleSort} k="spend">Spend</SortHeader>
                  <SortHeader sort={sort} onSort={toggleSort} k="leads">Leads</SortHeader>
                  <SortHeader sort={sort} onSort={toggleSort} k="cpl">CPL</SortHeader>
                  <SortHeader sort={sort} onSort={toggleSort} k="qualRate">Qualified</SortHeader>
                  <SortHeader sort={sort} onSort={toggleSort} k="cpql" className="pr-4 sm:pr-5">Cost / qualified lead</SortHeader>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <th scope="row" className="px-4 py-3 text-left font-normal sm:px-5">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden className={`size-2 shrink-0 rounded-full ${c.channel === "meta" ? "bg-meta" : "bg-google"}`} />
                        <span>
                          <span className="block text-white">{c.name}</span>
                          <span className="block text-xs text-slate-500">{CHANNEL_LABEL[c.channel]}</span>
                        </span>
                      </span>
                    </th>
                    <td className="px-3 py-3 text-right font-mono text-slate-200 tabular">{formatCurrency(c.spend, { decimals: 0 })}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200 tabular">{formatNumber(c.leads)}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200 tabular">{formatCurrency(c.cpl)}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200 tabular">
                      {formatPercent(c.leads ? c.qualified / c.leads : 0, 0)}
                    </td>
                    <td className="py-3 pr-4 pl-3 sm:pr-5">
                      <span className="flex items-center justify-end gap-3">
                        <span aria-hidden className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06] md:block">
                          <span
                            className="block h-full rounded-full bg-accent-bright/80"
                            style={{ width: `${(c.cpql / maxCpql) * 100}%` }}
                          />
                        </span>
                        <span className="w-16 text-right font-mono text-slate-200 tabular">{formatCurrency(c.cpql)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
