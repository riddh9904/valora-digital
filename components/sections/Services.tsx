import { services } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const AI_SPLIT = [
  {
    label: "AI does the volume",
    items: [
      "Bidding and budget allocation",
      "Creative variations for testing",
      "Lead scoring",
      "Spotting changes in the data",
    ],
  },
  {
    label: "People make the calls",
    items: [
      "What counts as a qualified lead",
      "Which signals the AI learns from",
      "Budget and strategy",
      "Reading the caveats",
    ],
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          id="services-title"
          layout="split"
          kicker="What we do"
          title="Acquire, convert, measure."
          intro="Most engagements use all three. The test of success is the same throughout: qualified leads, customers and what each one cost."
        />

        <Reveal>
          <ul className="mt-14 grid border-t border-ink-900 md:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="border-b border-line py-8 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
              >
                <h3 className="text-[1.6rem] font-medium tracking-[-0.03em] text-ink-900">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-graphite">{s.summary}</p>
                <p className="mt-5 font-mono text-[0.75rem] leading-relaxed text-signal">
                  {s.includes.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid overflow-hidden rounded-md border border-line bg-mist md:grid-cols-2">
            {AI_SPLIT.map((col, i) => (
              <div
                key={col.label}
                className={`p-7 sm:p-9 ${i === 1 ? "border-t border-line md:border-t-0 md:border-l" : ""}`}
              >
                <h3 className="kicker text-signal">{col.label}</h3>
                <ul className="mt-5 space-y-3 text-[1.08rem] tracking-[-0.01em] text-ink-900">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
