import { ChartSpline, Eye, Layers, RefreshCcw } from "lucide-react";
import { proofPoints } from "@/config/site";

const statements = [
  { icon: ChartSpline, title: "Analytics-led marketing", text: "Decisions start from data, not hunches." },
  { icon: Layers, title: "Full-funnel thinking", text: "From first click to closed customer." },
  { icon: Eye, title: "Transparent reporting", text: "Clear numbers, clear caveats." },
  { icon: RefreshCcw, title: "Continuous optimization", text: "Structured tests, every cycle." },
];

export function CredibilityStrip() {
  // Only verified proof points with a stated source are ever rendered.
  const verified = proofPoints.filter((p) => p.verified && p.source.trim().length > 0);

  return (
    <section aria-label="How we work" className="border-b border-ink-900/[0.07] bg-white">
      <div className="container-site">
        <ul className="grid grid-cols-1 divide-y divide-ink-900/[0.07] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {statements.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={`flex items-start gap-4 py-7 sm:py-9 lg:px-8 lg:first:pl-0 lg:last:pr-0 ${
                i % 2 === 1 ? "sm:pl-8 lg:pl-8" : ""
              } ${i < 2 ? "sm:border-b sm:border-ink-900/[0.07] lg:border-b-0" : ""}`}
            >
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-ink-900/10 bg-paper text-accent">
                <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block font-display text-[1.02rem] font-semibold tracking-tight text-ink-900">
                  {title}
                </span>
                <span className="mt-1 block text-sm text-slate-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        {verified.length > 0 && (
          <dl className="grid grid-cols-2 gap-6 border-t border-ink-900/[0.07] py-8 lg:grid-cols-4">
            {verified.map((p) => (
              <div key={p.label}>
                <dt className="text-sm text-slate-500">{p.label}</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
                  {p.value}
                </dd>
                <dd className="mt-1 text-xs text-slate-400">Source: {p.source}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
