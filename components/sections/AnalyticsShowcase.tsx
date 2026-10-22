import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnalyticsDemo } from "@/components/dashboard/AnalyticsDemo";
import { Reveal } from "@/components/ui/Reveal";

const notes = [
  { title: "What is it generating?", text: "Spend, leads and conversion in one view, compared with the previous period." },
  { title: "Where does interest drop?", text: "Stage-by-stage conversion from impression to opportunity." },
  { title: "What should we look at next?", text: "Campaigns ranked by cost per qualified lead, not just cost per lead." },
];

export function AnalyticsShowcase() {
  return (
    <section
      id="analytics"
      aria-labelledby="analytics-title"
      className="dark-surface section-pad relative overflow-hidden bg-ink-950 text-white"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            id="analytics-title"
            tone="dark"
            eyebrow="Measurement in practice"
            title="Clarity behind every campaign"
            intro="Understand what your campaigns are generating, where conversion opportunities exist, and what to investigate next."
          />
          <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:pl-10 xl:grid-cols-3 xl:pl-0">
            {notes.map((n) => (
              <li key={n.title} className="border-l border-white/10 pl-4">
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{n.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-14">
          <AnalyticsDemo />
        </Reveal>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-400">
          This interface demonstrates the kind of reporting we set up using your own advertising,
          analytics and CRM data, usually in tools you already have, such as Looker Studio, GA4
          or your CRM’s reporting. We do not sell a proprietary analytics platform.
        </p>
      </div>
    </section>
  );
}
