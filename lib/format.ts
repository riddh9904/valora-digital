const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const CURRENCY_SYMBOL = "$";

export function formatNumber(value: number, opts: { compact?: boolean } = {}) {
  if (!Number.isFinite(value)) return "–";
  return opts.compact && Math.abs(value) >= 10_000
    ? compact.format(value)
    : whole.format(value);
}

export function formatCurrency(
  value: number,
  opts: { compact?: boolean; decimals?: number } = {},
) {
  if (!Number.isFinite(value)) return "–";
  if (opts.compact && Math.abs(value) >= 10_000) {
    return `${CURRENCY_SYMBOL}${compact.format(value)}`;
  }
  const decimals = opts.decimals ?? (Math.abs(value) < 100 ? 2 : 0);
  return `${CURRENCY_SYMBOL}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPercent(value: number, decimals = 1) {
  if (!Number.isFinite(value)) return "–";
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDelta(value: number) {
  if (!Number.isFinite(value)) return "–";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value * 100).toFixed(1)}%`;
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatShortDate(iso: string) {
  return shortDate.format(new Date(`${iso}T00:00:00Z`));
}

export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
