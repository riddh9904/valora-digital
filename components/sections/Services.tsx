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
          {/* Rows (title | copy) from 768px, three columns from 1024px. */}
          <ul className="mt-14 grid border-t border-ink-900 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="border-b border-line py-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8 lg:block lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <h3 className="text-[1.6rem] font-medium tracking-[-0.03em] text-ink-900">{s.title}</h3>
                <div>
                  <p className="mt-3 leading-relaxed text-graphite md:mt-1 lg:mt-3">{s.summary}</p>
                  <p className="mt-5 font-mono text-[0.75rem] leading-relaxed text-signal">
                    {s.includes.map((item, i) => (
                      <span key={item}>
                        {i > 0 && "\u00a0· "}
                        <span className="whitespace-nowrap">{item}</span>
                      </span>
                    ))}
                  </p>
                </div>
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
