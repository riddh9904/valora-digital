import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const principles = [
  {
    title: "Business outcomes over vanity metrics",
    text: "We judge campaigns by qualified leads, customers and the cost of acquiring them. Impressions and clicks are diagnostic signals, not goals.",
  },
  {
    title: "Transparent measurement",
    text: "You see the same numbers we see, with their definitions, sources and limitations written down. If data is missing or uncertain, we say so.",
  },
  {
    title: "Evidence-based experimentation",
    text: "Changes start as written hypotheses with a success measure and enough data to judge them. Results, including the ones that didn’t work, are recorded.",
  },
  {
    title: "Clear reporting and accountability",
    text: "Each review covers what happened, why we think it happened, and what we will do next, with named owners and dates.",
  },
];

export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="section-pad border-t border-ink-900/[0.06] bg-white">
      <div className="container-site">
        <SectionHeading
          id="principles-title"
          eyebrow="Working principles"
          title="Better decisions, better marketing"
        />
        <ol className="mt-14 border-t border-ink-900/10">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 0.05}
              className="group grid gap-3 border-b border-ink-900/10 py-8 sm:grid-cols-[96px_1fr] md:grid-cols-[120px_1fr_1.2fr] md:items-baseline md:gap-10 md:py-10"
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-ink-900/15 transition-colors duration-300 group-hover:text-accent md:text-5xl tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-ink-900 sm:text-2xl">
                {p.title}
              </h3>
              <p className="leading-relaxed text-slate-600 sm:col-start-2 md:col-start-auto">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
