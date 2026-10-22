import { ArrowRight, Database, Megaphone, ReceiptText } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const surface = [
  { name: "Impressions", note: "How many times an ad was shown" },
  { name: "Clicks", note: "How many people visited" },
  { name: "Raw enquiries", note: "How many forms were submitted" },
];

const business = [
  { name: "Qualified leads", note: "Enquiries that match your criteria" },
  { name: "Conversion rates", note: "Enquiry → appointment → customer" },
  { name: "Cost per acquisition", note: "What a real customer costs" },
  { name: "Sales outcomes", note: "Deals won, orders placed" },
  { name: "Revenue attribution", note: "Where the data supports it" },
];

const sources = [
  { icon: Megaphone, name: "Ad platforms", detail: "Spend, reach, clicks, platform conversions" },
  { icon: Database, name: "CRM", detail: "Lead status, follow-up, pipeline stage" },
  { icon: ReceiptText, name: "Business systems", detail: "Orders, invoices, revenue, margin" },
];

export function BeyondClick() {
  return (
    <section aria-labelledby="beyond-title" className="section-pad bg-paper">
      <div className="container-site">
        <SectionHeading
          id="beyond-title"
          eyebrow="Beyond the click"
          title="We look beyond the click"
          intro="Platform dashboards are good at describing activity. Businesses grow on outcomes. We focus reporting and optimization on the measures that connect to revenue."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_auto_1.35fr] lg:items-stretch">
          <Reveal className="rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-white/60 p-7 sm:p-8">
            <p className="eyebrow text-slate-500">Surface-level metrics</p>
            <ul className="mt-6 divide-y divide-ink-900/[0.07]">
              {surface.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-display text-lg font-medium text-slate-500">{m.name}</span>
                  <span className="text-right text-sm text-slate-400">{m.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Useful signals, but they describe activity, not results.
            </p>
          </Reveal>

          <div aria-hidden className="flex items-center justify-center py-1 lg:px-2">
            <span className="flex size-12 items-center justify-center rounded-full border border-ink-900/10 bg-white text-accent shadow-[var(--shadow-card)]">
              <ArrowRight className="size-5 rotate-90 lg:rotate-0" />
            </span>
          </div>

          <Reveal delay={0.1} className="dark-surface rounded-[var(--radius-lg)] bg-ink-900 p-7 text-white sm:p-8">
            <p className="eyebrow text-accent-soft">Business-oriented measures</p>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {business.map((m) => (
                <li key={m.name} className="border-b border-white/[0.08] py-4">
                  <span className="flex items-center gap-2.5 font-display text-lg font-medium">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent-bright" />
                    {m.name}
                  </span>
                  <span className="mt-1 block pl-4 text-sm text-slate-400">{m.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-300">
              These are the numbers that tell you whether marketing is working.
            </p>
          </Reveal>
        </div>

        {/* Connecting the evidence */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
          <div>
            <h3 className="display-md text-ink-900">Connecting the available evidence</h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              Advertising platforms, CRM records and business systems each hold a different piece
              of the customer journey. We connect what is available, so decisions rest on more
              than one source.
            </p>
            <p className="mt-4 rounded-[var(--radius-md)] border border-ink-900/[0.08] bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
              <strong className="font-medium text-ink-900">An honest caveat:</strong> attribution
              is rarely perfect. Privacy rules, offline sales and multi-device journeys leave gaps. We
              state those limits clearly and treat attribution as directional evidence, not exact
              truth.
            </p>
          </div>

          <figure aria-label="Three data sources combine into one connected view of performance" className="relative">
            <div className="grid gap-3 sm:grid-cols-3">
              {sources.map(({ icon: Icon, name, detail }, i) => (
                <Reveal key={name} delay={i * 0.08} className="rounded-[var(--radius-md)] border border-ink-900/[0.08] bg-white p-5 shadow-[var(--shadow-card)]">
                  <Icon aria-hidden className="size-5 text-accent" strokeWidth={1.75} />
                  <p className="mt-4 font-medium text-ink-900">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p>
                </Reveal>
              ))}
            </div>
            <svg aria-hidden viewBox="0 0 600 56" preserveAspectRatio="none" className="hidden h-14 w-full sm:block">
              {[100, 300, 500].map((x) => (
                <path key={x} d={`M${x},0 C${x},32 300,24 300,56`} fill="none" stroke="var(--brand-accent)" strokeOpacity="0.35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div aria-hidden className="flex justify-center py-3 sm:hidden">
              <span className="h-8 w-px bg-accent/40" />
            </div>
            <div className="dark-surface rounded-[var(--radius-md)] bg-ink-900 px-6 py-5 text-center text-white">
              <p className="font-display text-lg font-semibold">One connected view</p>
              <p className="mt-1 text-sm text-slate-400">
                Spend → qualified leads → customers → revenue, with known gaps labelled
              </p>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
