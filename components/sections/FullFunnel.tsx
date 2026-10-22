import { CircleDollarSign, Funnel, Handshake, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FunnelBand } from "./FunnelBand";

const stages = [
  {
    name: "Acquire",
    icon: CircleDollarSign,
    text: "Reach relevant audiences through paid advertising on Meta and Google.",
    signals: ["Reach & frequency", "Cost per click", "Audience fit"],
  },
  {
    name: "Qualify",
    icon: Funnel,
    text: "Understand lead quality, customer intent, and conversion potential.",
    signals: ["Qualified-lead rate", "Intent signals", "Cost per qualified lead"],
  },
  {
    name: "Convert",
    icon: Handshake,
    text: "Improve the journey from enquiry to appointment, opportunity, or purchase.",
    signals: ["Speed to follow-up", "Booking rate", "Close rate"],
  },
  {
    name: "Optimize",
    icon: RefreshCw,
    text: "Use reliable data and structured experiments to improve performance.",
    signals: ["Test results", "CAC trend", "Payback period"],
  },
];

export function FullFunnel() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="dark-surface section-pad relative overflow-hidden bg-ink-900 text-white"
    >
      <div aria-hidden className="bg-grid-dark mask-fade-radial absolute inset-0 opacity-50" />
      <div className="container-site relative">
        <SectionHeading
          id="approach-title"
          tone="dark"
          eyebrow="Our approach · Full-funnel growth"
          title="From first click to real customer"
          intro="Advertising performance is only one part of customer acquisition. We look at the whole path, from the first impression to the customer who pays, and improve the stage that is holding growth back."
        />

        <div className="mt-20 hidden lg:block">
          <FunnelBand />
        </div>

        <ol className="relative mt-14 grid gap-0 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {/* vertical rail on mobile/tablet */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-accent-bright/60 via-violet/50 to-transparent lg:hidden" />
          {stages.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.name} delay={i * 0.1} className="relative pb-12 pl-14 last:pb-0 lg:pb-0 lg:pl-0">
                <span className="absolute top-0 left-0 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-ink-850 text-accent-soft lg:static">
                  <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
                </span>
                <p className="mt-0 font-mono text-xs text-slate-500 lg:mt-6">Stage 0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{s.name}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{s.text}</p>
                <ul aria-label={`What we measure at the ${s.name} stage`} className="mt-5 space-y-2 border-t border-white/[0.08] pt-5">
                  {s.signals.map((sig) => (
                    <li key={sig} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <span aria-hidden className="h-px w-3 bg-accent-soft/60" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
