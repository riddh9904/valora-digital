import { services, site } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Disclosure } from "@/components/ui/Disclosure";
import { DetailsEnhancer } from "@/components/ui/DetailsEnhancer";
import { PrefillCta } from "@/components/ui/PrefillCta";
import { Stamp } from "@/components/ui/Stamp";
import type { Service } from "@/types";

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

/** Dot-separated items; each item stays on one line where it fits. */
function DotList({ items, itemClassName = "whitespace-nowrap" }: { items: string[]; itemClassName?: string }) {
  return items.map((item, i) => (
    <span key={item}>
      {i > 0 && " · "}
      <span className={itemClassName}>{item}</span>
    </span>
  ));
}

// Phrasing content only: <summary> must not contain headings, paragraphs or divs.
function Summary({ s }: { s: Service }) {
  return (
    <span className="block md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
      <span className="kicker block text-signal md:pt-2">{s.label}</span>
      <span className="mt-3 block md:mt-0">
        <span className="block text-[1.4rem] leading-tight font-medium tracking-[-0.03em] text-ink-900 sm:text-[1.6rem]">
          {s.headline}
        </span>
        <span className="mt-2 block font-normal leading-relaxed text-pretty text-graphite">{s.summary}</span>
        {/* Visual only; the panel repeats it for screen readers so the summary stays short. */}
        <span aria-hidden className="mt-4 block font-mono text-[0.75rem] leading-relaxed font-normal text-signal">
          <DotList items={s.includes} />
        </span>
      </span>
    </span>
  );
}

function Panel({ s }: { s: Service }) {
  return (
    // The panel spans the full row width with a wider left share than the summary's 1fr/2fr,
    // so the "What changes" box keeps a readable measure (45+ characters a line) from 1024px.
    <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      <p className="sr-only">Covers: {s.includes.join(", ")}</p>

      <div className="space-y-6">
        <div>
          <p className="kicker text-graphite">The problem</p>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-900">{s.problem}</p>
        </div>
        <div className="rounded-md border border-line p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="kicker text-graphite">What changes</p>
            <Stamp tone="quiet">Illustrative scenario</Stamp>
          </div>
          <p className="mt-3 leading-relaxed text-ink-900">{s.scenario}</p>
        </div>
      </div>

      <div className="mt-8 space-y-7 lg:mt-0">
        <div>
          <p className="kicker text-graphite">How we work on it</p>
          <ol className="mt-3 space-y-2">
            {s.approach.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-ink-900">
                <span aria-hidden className="mt-[0.3em] font-mono text-xs text-signal tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="kicker text-graphite">What we track</p>
          <p className="mt-2 font-mono text-[0.8rem] leading-relaxed text-ink-900">
            {/* The longest item is wider than a 320px screen, so it may wrap below 360px. */}
            <DotList items={s.metrics} itemClassName="min-[360px]:whitespace-nowrap" />
          </p>
        </div>
        <div>
          <p className="kicker text-graphite">Tools</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-graphite">
            <DotList items={s.tools} />
          </p>
        </div>
        <div>
          <p className="kicker text-graphite">Watch-out</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-graphite">{s.watchOut}</p>
        </div>
        <PrefillCta label={s.cta.label} detail={{ challenge: s.cta.challenge }} />
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          id="services-title"
          layout="split"
          kicker="What we do"
          title="Turning ad spend into customers."
          intro={`${site.positioning} For us that comes down to three things: reaching people likely to buy, turning more of them into enquiries or orders, and acquiring each customer at a cost that works.`}
        />

        {/* No Reveal here: deep links (#service-…) must land on visible content. The header
            offset comes from the global scroll-padding-top; a scroll-margin here would double it. */}
        <div id="service-list" className="mt-14 border-t border-ink-900">
          {services.map((s) => (
            <Disclosure
              key={s.id}
              id={`service-${s.id}`}
              summaryClassName="py-7 md:py-8"
              panelClassName="pb-10"
              affordance={{ closed: "See the method", open: "Close" }}
              summary={<Summary s={s} />}
            >
              <Panel s={s} />
            </Disclosure>
          ))}
        </div>
        <DetailsEnhancer containerId="service-list" openFirstQuery="(min-width: 1024px)" />

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
