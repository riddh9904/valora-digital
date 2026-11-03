"use client";

import { useMemo, useState } from "react";
import { dailyByChannel, relativeChange, selectPeriods, totals, type RangeDays } from "@/lib/metrics";
import { formatCurrency, formatDelta, formatNumber } from "@/lib/format";
import { SampleDataLabel } from "@/components/ui/SampleDataLabel";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const RANGES: { value: RangeDays; label: string }[] = [
  { value: 30, label: "30D" },
  { value: 90, label: "90D" },
];

const W = 600;
const H = 140;

function linePath(values: (number | undefined)[], max: number) {
  const step = W / Math.max(values.length - 1, 1);
  return values
    .map((v, i) => (v === undefined ? null : `${i * step},${H - 6 - ((v / max) * (H - 18))}`))
    .filter(Boolean)
    .join(" ");
}

const fmtCompact = (n: number) => formatCurrency(n, { compact: true });
const fmtCurrency = (n: number) => formatCurrency(n);

/** Compact, light version of the measurement demo. Same deterministic sample data. */
export function HeroDemoCard() {
  const [range, setRange] = useState<RangeDays>(30);

  const view = useMemo(() => {
    const { current, previous, dates } = selectPeriods({ range, channel: "all", campaignId: "all" });
    const now = totals(current);
    const before = totals(previous);
    const series = dailyByChannel(current, dates, "leads");
    const max = Math.max(1, ...series.flatMap((p) => [p.meta ?? 0, p.google ?? 0]));
    return {
      now,
      kpis: [
        { label: "Spend", value: now.spend, format: fmtCompact, delta: relativeChange(now.spend, before.spend), goodWhenUp: null },
        { label: "Qualified leads", value: now.qualified, format: formatNumber, delta: relativeChange(now.qualified, before.qualified), goodWhenUp: true },
        { label: "Cost per qualified lead", value: now.cpql, format: fmtCurrency, delta: relativeChange(now.cpql, before.cpql), goodWhenUp: false },
        { label: "Opportunities", value: now.opportunities, format: formatNumber, delta: relativeChange(now.opportunities, before.opportunities), goodWhenUp: true },
      ],
      meta: linePath(series.map((p) => p.meta), max),
      google: linePath(series.map((p) => p.google), max),
    };
  }, [range]);

  return (
    <div className="rounded-md border border-line bg-white p-4 text-ink-900 shadow-[0_24px_60px_-28px_rgb(11_12_14/0.35)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SampleDataLabel />
        <div role="radiogroup" aria-label="Date range" className="font-mono inline-flex rounded-md bg-mist p-1 text-xs">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={range === r.value}
              onClick={() => setRange(r.value)}
              className={`rounded px-3 py-1.5 font-medium transition-colors ${
                range === r.value ? "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)]" : "text-graphite hover:text-ink-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {view.kpis.map((k, i) => {
          const good = k.goodWhenUp === null ? null : k.goodWhenUp ? k.delta >= 0 : k.delta <= 0;
          return (
            <div
              key={k.label}
              className={`py-4 ${i % 2 === 1 ? "border-l border-line pl-4" : "pr-4"} ${
                i >= 2 ? "border-t border-line lg:border-t-0" : ""
              } lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0`}
            >
              <dt className="text-[0.8rem] text-graphite">{k.label}</dt>
              <dd className="font-mono mt-2 text-[1.55rem] leading-none font-medium tracking-[-0.02em] sm:text-[1.9rem]"><AnimatedNumber value={k.value} format={k.format} />
              </dd>
              <dd
                className={`font-mono mt-2 text-xs ${
                  good === null ? "text-graphite" : good ? "text-signal" : "text-[#a2452f]"
                }`}
              >
                {formatDelta(k.delta)}{" "}
                <span className="text-graphite">
                  <span className="sm:hidden">vs prior {range}D</span>
                  <span className="hidden sm:inline">vs previous {range} days</span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      <figure className="mt-2 border-t border-line pt-4">
        <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8rem] text-graphite">
          <span>Leads per day</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-3 bg-[#4c7dff]" /> Meta Ads
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-3 bg-[#d96a2e]" /> Google Ads
          </span>
        </figcaption>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-3 h-24 w-full sm:h-32"
          role="img"
          aria-label={`Leads per day by channel over the last ${range} days, sample data`}
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#eceded" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1="0" x2={W} y1={H - 1} y2={H - 1} stroke="#d5d8d5" vectorEffect="non-scaling-stroke" />
          <polyline points={view.meta} fill="none" stroke="#4c7dff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <polyline points={view.google} fill="none" stroke="#d96a2e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </figure>

      <p className="mt-4 border-t border-line pt-4 text-[0.8rem] text-graphite">
        Cost per qualified lead <span className="font-mono text-ink-900">{formatCurrency(view.now.cpql)}</span>, against{" "}
        <span className="font-mono text-ink-900">{formatCurrency(view.now.cpl)}</span> per raw lead. Generated data, not client results.
      </p>
    </div>
  );
}
