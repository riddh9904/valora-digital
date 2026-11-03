import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Discover",
    text: "Understand business goals, customer economics, current marketing activity and conversion challenges.",
    outputs: ["Goals and unit economics", "Tracking audit", "Funnel baseline"],
  },
  {
    title: "Plan",
    text: "Define campaign objectives, measurement requirements, target audiences and an execution plan.",
    outputs: ["Channel and budget plan", "Measurement plan", "First test hypotheses"],
  },
  {
    title: "Launch",
    text: "Launch campaigns, implement tracking, and test creative and landing pages.",
    outputs: ["Live campaigns", "Verified conversion tracking", "First creative and landing-page tests"],
  },
  {
    title: "Review",
    text: "Review performance, identify opportunities and improve the strategy based on evidence.",
    outputs: ["Performance review", "Documented test results", "Updated priorities"],
  },
];

const rules = [
  "You see the numbers we see.",
  "Every test starts as a written hypothesis.",
  "Failed tests are recorded.",
  "You own your ad accounts and data, and we work through partner access.",
];

export function Methodology() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading id="approach-title" kicker="How we work" title="How an engagement runs." />

        <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="border-b border-line py-8 sm:px-6 sm:first:pl-0 lg:border-r lg:last:border-r-0 lg:[&:nth-child(4n+1)]:pl-0 sm:max-lg:odd:border-r sm:max-lg:odd:pl-0"
            >
              <p className="font-mono text-xs text-signal tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink-900">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite">{s.text}</p>
              <p className="mt-5 font-mono text-xs leading-relaxed text-ink-900">
                <span className="sr-only">{s.title} outputs: </span>
                {s.outputs.join(" · ")}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h3 className="kicker text-signal">Working rules</h3>
          <ul className="border-t border-line">
            {rules.map((r) => (
              <li key={r} className="border-b border-line py-4 text-lg text-ink-900">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
