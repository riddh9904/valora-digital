"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, CircleCheck, Clock3, Sparkles } from "lucide-react";
import { dailyByChannel, funnel, relativeChange, selectPeriods, totals } from "@/lib/metrics";
import { formatCurrency, formatDelta, formatNumber, formatPercent } from "@/lib/format";
import { rollingAverage, scalePoints, smoothPath } from "@/lib/svg";
import { SampleDataLabel } from "@/components/ui/SampleDataLabel";

// ── Synthetic figures, computed once from the shared sample dataset ──────────
const period = selectPeriods({ range: 30, channel: "all", campaignId: "all" });
const now = totals(period.current);
const prev = totals(period.previous);
const series = dailyByChannel(period.current, period.dates, "leads");
const metaLine = rollingAverage(series.map((p) => p.meta ?? 0), 5);
const googleLine = rollingAverage(series.map((p) => p.google ?? 0), 5);
const W = 520;
const H = 150;
const domain: [number, number] = [0, Math.max(...metaLine, ...googleLine) * 1.15];
const metaPts = scalePoints(metaLine, W, H, { top: 10, bottom: 6 }, domain);
const googlePts = scalePoints(googleLine, W, H, { top: 10, bottom: 6 }, domain);
const metaPath = smoothPath(metaPts);
const googlePath = smoothPath(googlePts);
const metaArea = `${metaPath} L${W},${H} L0,${H} Z`;
const stages = funnel(now).slice(2); // leads → qualified → opportunities
const topOfFunnel = stages[0].value;

const kpis = [
  { label: "Spend", value: formatCurrency(now.spend, { compact: true }), delta: relativeChange(now.spend, prev.spend), upIsGood: null },
  { label: "Leads", value: formatNumber(now.leads), delta: relativeChange(now.leads, prev.leads), upIsGood: true },
  { label: "Cost / qualified lead", value: formatCurrency(now.cpql), delta: relativeChange(now.cpql, prev.cpql), upIsGood: false },
] as const;

const leadFeed = [
  { source: "Search · High intent", status: "Qualified", tone: "good", time: "2m" },
  { source: "Lookalike · Leads", status: "Meeting booked", tone: "good", time: "14m" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function Delta({ value, upIsGood }: { value: number; upIsGood: boolean | null }) {
  const up = value >= 0;
  const good = upIsGood === null ? null : up === upIsGood;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-[0.68rem] ${
        good === null ? "text-slate-400" : good ? "text-emerald-300" : "text-amber-300"
      }`}
    >
      <Icon aria-hidden className="size-3" />
      {formatDelta(value)}
    </span>
  );
}

export function HeroDashboard() {
  return (
    <figure
      className="relative mx-auto w-full max-w-[640px] lg:max-w-none"
      aria-label="Illustrative marketing analytics dashboard using sample data"
    >
      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.15 }}
        className="relative rounded-[var(--radius-xl)] border border-white/[0.08] bg-gradient-to-b from-ink-800/90 to-ink-850/95 p-4 shadow-[var(--shadow-panel)] backdrop-blur sm:p-5"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5 xl:justify-start">
          <div className="flex items-center gap-1 text-[0.72rem]">
            {["Overview", "Campaigns", "Funnel"].map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-1 ${
                  i === 0 ? "bg-white/[0.08] text-white" : "text-slate-400"
                } ${i === 2 ? "hidden sm:inline" : ""}`}
              >
                {t}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[0.66rem] text-slate-300 xl:hidden">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" aria-hidden />
            Last 30 days
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-2 pt-4 sm:gap-3">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.45 + i * 0.08 }}
              className="rounded-[var(--radius-md)] border border-white/[0.06] bg-white/[0.025] p-2.5 sm:p-3.5"
            >
              <dt className="text-[0.66rem] leading-tight text-slate-400 sm:text-[0.72rem]">{k.label}</dt>
              <dd className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white tabular sm:text-2xl">
                {k.value}
              </dd>
              <dd className="mt-1">
                <Delta value={k.delta} upIsGood={k.upIsGood} />
              </dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-4 rounded-[var(--radius-md)] border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[0.72rem] text-slate-300">
              Leads per day<span className="hidden xl:inline"> · last 30 days</span> · 5-day avg
            </p>
            <ul className="flex items-center gap-3 text-[0.68rem] text-slate-300">
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="h-0.5 w-3 rounded-full bg-meta" /> Meta Ads
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="h-0.5 w-3 rounded-full bg-google" /> Google Ads
              </li>
            </ul>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-3 h-auto w-full overflow-visible"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="hero-meta-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--series-meta)" stopOpacity="0.16" />
                <stop offset="1" stopColor="var(--series-meta)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((t) => (
              <line key={t} x1="0" x2={W} y1={H * t} y2={H * t} stroke="rgb(255 255 255 / 0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <motion.path
              d={metaArea}
              fill="url(#hero-meta-fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.path
              d={googlePath}
              fill="none"
              stroke="var(--series-google)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease, delay: 0.6 }}
            />
            <motion.path
              d={metaPath}
              fill="none"
              stroke="var(--series-meta)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="mt-4 flex xl:hidden">
          <SampleDataLabel />
        </div>
      </motion.div>

      <div className="mt-5 hidden justify-end xl:flex">
        <SampleDataLabel />
      </div>

      {/* Floating: funnel card */}
      <motion.div
        initial={{ opacity: 0, y: 24, x: -12 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.75 }}
        className="absolute -bottom-24 -left-10 hidden w-[250px] rounded-[var(--radius-lg)] border border-white/[0.09] bg-ink-900/95 p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl xl:block"
        aria-hidden
      >
        <p className="text-[0.72rem] text-slate-300">Lead funnel</p>
        <ul className="mt-3 space-y-2.5">
          {stages.map((s, i) => (
            <li key={s.key}>
              <div className="flex items-baseline justify-between text-[0.68rem]">
                <span className="text-slate-400">{s.label}</span>
                <span className="font-mono text-slate-200 tabular">
                  {formatNumber(s.value, { compact: true })}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: ["#7097ff", "#4c7dff", "#3560d9"][i] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(3, (s.value / topOfFunnel) * 100)}%` }}
                  transition={{ duration: 1, ease, delay: 1 + i * 0.12 }}
                />
              </div>
              {s.stepRate !== undefined && i > 0 && (
                <span className="mt-0.5 block text-right font-mono text-[0.6rem] text-slate-500">
                  {formatPercent(s.stepRate)} of previous
                </span>
              )}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Floating: lead feed */}
      <motion.div
        initial={{ opacity: 0, y: -16, x: 12 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.95 }}
        className="absolute -top-32 -right-6 hidden w-[248px] rounded-[var(--radius-lg)] border border-white/[0.09] bg-ink-900/95 p-3.5 shadow-[var(--shadow-panel)] backdrop-blur-xl xl:block"
        aria-hidden
      >
        <p className="flex items-center gap-1.5 text-[0.72rem] text-slate-300">
          <Sparkles className="size-3.5 text-accent-soft" /> Lead status
        </p>
        <ul className="mt-2.5 space-y-2">
          {leadFeed.map((l, i) => (
            <motion.li
              key={l.source}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 1.3 + i * 0.15 }}
              className="flex items-start gap-2 rounded-[10px] bg-white/[0.03] px-2.5 py-2"
            >
              {l.tone === "good" ? (
                <CircleCheck className="mt-px size-3.5 shrink-0 text-emerald-300" />
              ) : (
                <Clock3 className="mt-px size-3.5 shrink-0 text-amber-300" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.7rem] text-white">{l.status}</span>
                <span className="block truncate text-[0.62rem] text-slate-400">{l.source}</span>
              </span>
              <span className="font-mono text-[0.6rem] text-slate-500">{l.time}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </figure>
  );
}
