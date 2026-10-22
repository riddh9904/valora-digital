"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { TrendMetric, TrendPoint } from "@/lib/metrics";
import { CHANNEL_LABEL } from "@/lib/sample-data";
import { formatCurrency, formatNumber, formatShortDate } from "@/lib/format";
import type { Channel } from "@/types";

const SERIES: Record<Channel, string> = {
  meta: "var(--series-meta)",
  google: "var(--series-google)",
};

function formatValue(metric: TrendMetric, v: number, compact = false) {
  if (metric === "leads") return formatNumber(v, { compact });
  if (metric === "spend") return formatCurrency(v, { compact, decimals: 0 });
  return formatCurrency(v, { decimals: compact ? 0 : 2 });
}

function TrendTooltip({
  active,
  payload,
  label,
  metric,
}: TooltipContentProps<number, string> & { metric: TrendMetric }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[160px] rounded-[10px] border border-white/10 bg-ink-950/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-mono text-[0.68rem] text-slate-400">
        {typeof label === "string" ? formatShortDate(label) : label}
      </p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: p.color }} />
              {CHANNEL_LABEL[p.dataKey as Channel]}
            </span>
            <span className="font-mono text-white tabular">
              {typeof p.value === "number" ? formatValue(metric, p.value) : "–"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TrendChart({
  data,
  channels,
  metric,
}: {
  data: TrendPoint[];
  channels: Channel[];
  metric: TrendMetric;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="rgb(255 255 255 / 0.07)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={{ stroke: "rgb(255 255 255 / 0.12)" }}
          tickLine={false}
          minTickGap={28}
          tickMargin={8}
        />
        <YAxis
          width={52}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatValue(metric, v, true)}
          domain={[0, "auto"]}
        />
        <Tooltip
          cursor={{ stroke: "rgb(255 255 255 / 0.25)", strokeWidth: 1 }}
          content={(props) => (
            <TrendTooltip {...(props as TooltipContentProps<number, string>)} metric={metric} />
          )}
        />
        {channels.map((c) => (
          <Line
            key={c}
            type="monotone"
            dataKey={c}
            name={CHANNEL_LABEL[c]}
            stroke={SERIES[c]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4.5, stroke: "#0e1530", strokeWidth: 2, fill: SERIES[c] }}
            connectNulls
            animationDuration={700}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
