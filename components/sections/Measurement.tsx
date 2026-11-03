import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnalyticsDemo } from "@/components/dashboard/AnalyticsDemo";
import { Reveal } from "@/components/ui/Reveal";

const platformReports = ["Impressions", "Clicks", "Form fills", "Platform conversions"];
const weReport = ["Qualified leads", "Cost per qualified lead", "Customers", "Acquisition cost and payback"];

function Column({ title, items, strong = false }: { title: string; items: string[]; strong?: boolean }) {
  return (
    <div>
      <h3 className={`kicker ${strong ? "text-signal-bright" : "text-white/60"}`}>{title}</h3>
      <ul className="mt-4 border-t border-white/15">
        {items.map((item) => (
          <li
            key={item}
            className={`border-b border-white/15 py-3 text-lg ${strong ? "text-white" : "text-white/70"}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Measurement() {
  return (
    <section
      id="measurement"
      aria-labelledby="measurement-title"
      className="dark-surface section-pad bg-ink-950 text-white"
    >
      <div className="container-site">
        <SectionHeading
          id="measurement-title"
          tone="dark"
          layout="split"
          kicker="How we measure"
          title="What your weekly report looks like."
          intro="Spend, leads, qualified leads and opportunities in one view, by campaign. This demo runs on generated data. We build the same kind of report in Looker Studio, GA4 or your CRM."
        />

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          <Column title="What ad platforms report" items={platformReports} />
          <Column title="What we report" items={weReport} strong />
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Attribution is never perfect. Privacy rules, offline sales and multi-device journeys leave gaps, and the report labels them.
        </p>

        <Reveal>
          <AnalyticsDemo />
        </Reveal>
      </div>
    </section>
  );
}
