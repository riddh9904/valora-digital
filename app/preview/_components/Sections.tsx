import Link from "next/link";
import { industries } from "@/config/site";
import { SignalWordmark } from "./Logo";
import { HeroDemoCard } from "./HeroDemoCard";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "How we work", href: "/#process" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/#about" },
];

const COMMITMENTS = [
  { title: "Cost per qualified lead", text: "The headline metric, agreed with your sales team." },
  { title: "Reconciled with your CRM", text: "Platform numbers checked against real sales." },
  { title: "Caveats in writing", text: "Where the data runs out, we say so." },
];

const PRACTICES = [
  {
    title: "Acquire",
    text: "Meta and Google Ads with Advantage+, Performance Max and Smart Bidding, steered by qualified-lead and sales signals. AI-generated copy, image and video variations, tested against each other.",
    includes: ["Meta Ads", "Google Ads", "Creative testing", "Catalogue campaigns"],
  },
  {
    title: "Convert",
    text: "We find where enquiries drop out and fix it: landing pages, structured A/B tests, AI lead scoring and CRM routing, so the best leads get the fastest reply.",
    includes: ["Landing pages", "A/B testing", "Lead scoring", "CRM routing"],
  },
  {
    title: "Measure",
    text: "Tracking set up properly, platform numbers reconciled with your CRM, AI-assisted summaries of what changed, and a weekly report on cost per qualified lead, acquisition cost and payback.",
    includes: ["GA4 & Tag Manager", "Offline conversions", "Dashboards", "CAC & payback"],
  },
];

const AI_SPLIT = [
  {
    label: "AI does the volume",
    items: ["Bidding and budget allocation", "Creative variations for testing", "Lead scoring", "Spotting changes in the data"],
  },
  {
    label: "People make the calls",
    items: ["What counts as a qualified lead", "Which signals the AI learns from", "Budget and strategy", "Reading the caveats"],
  },
];

const INDUSTRY_LINES: Record<string, string> = {
  "real-estate": "Enquiries are cheap. Site visits are what count.",
  education: "Long decisions, many sources. We track which ones lead to applications.",
  ecommerce: "Acquisition judged against first-order margin, not platform ROAS alone.",
  services: "Missed calls quietly erase a campaign’s value.",
};

const INDUSTRY_CTA: Record<string, string> = {
  "real-estate": "real estate",
  education: "education",
  ecommerce: "e-commerce",
  services: "professional services",
};

const container = "mx-auto w-full max-w-[1240px] px-5 md:px-8";
const kicker = "vp-mono text-[0.7rem] tracking-[0.08em] uppercase";

export function PreviewBar() {
  return (
    <p className="vp-mono bg-(--vp-signal) px-4 py-2 text-center text-[0.7rem] tracking-[0.06em] text-white uppercase">
      Design preview · Not the live site · Hero, services and industries only
    </p>
  );
}

export function PreviewHero() {
  return (
    <>
      <div className="vp-zone-top bg-(--bg) text-(--fg) transition-colors duration-300">
        <header className={`${container} flex h-[72px] items-center justify-between gap-6`}>
          <SignalWordmark />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.92rem] text-(--muted)">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="vp-link transition-colors hover:text-(--fg)">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/#contact"
            className="rounded-md bg-(--fg) px-4 py-2.5 text-sm font-medium whitespace-nowrap text-(--bg) transition-opacity hover:opacity-85"
          >
            Start a conversation
          </Link>
        </header>

        <section aria-labelledby="vp-hero-title" className={`${container} pt-12 pb-12 sm:pt-24 sm:pb-16 sm:text-center`}>
          <p className={`${kicker} inline-flex items-center gap-2.5 text-(--muted)`}>
            <span aria-hidden className="vp-live-dot size-1.5 shrink-0 rounded-full bg-(--vp-signal-bright)" />
            AI-driven performance marketing<span className="hidden sm:inline"> · Dubai and Gurugram</span>
          </p>
          <h1
            id="vp-hero-title"
            className="mt-6 max-w-[16ch] text-[clamp(2.6rem,6.4vw,4.6rem)] sm:mx-auto leading-[1.02] font-medium tracking-[-0.042em] text-balance"
          >
            Ad platforms run on AI. We teach it what a customer is.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[1.06rem] leading-relaxed text-(--muted) sm:mx-auto sm:text-lg">
            Valora runs Meta and Google Ads for businesses in India, the UAE and beyond. We train the platforms’ AI on
            qualified leads and sales instead of form fills, test AI-generated creative at speed, and report what every
            customer cost.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <Link
              href="/#contact"
              className="w-full rounded-md bg-(--cta-bg) px-6 py-3.5 text-[0.95rem] font-medium text-(--cta-fg) transition-opacity hover:opacity-90 sm:w-auto"
            >
              Start a conversation
            </Link>
            <a href="#vp-demo" className="vp-link text-[0.95rem] font-medium">
              See the live report →
            </a>
          </div>
        </section>
      </div>

      <div id="vp-demo" className="vp-demo-band transition-[background] duration-300">
        <div className={`${container} max-w-[1080px]`}>
          <HeroDemoCard />
        </div>
      </div>

      <div className="bg-(--vp-mist)">
        <ul className={`${container} grid gap-6 py-12 sm:grid-cols-3 sm:gap-10`}>
          {COMMITMENTS.map((c) => (
            <li key={c.title} className="border-t border-(--vp-ink) pt-4">
              <p className="font-medium tracking-[-0.01em]">{c.title}</p>
              <p className="mt-1 text-[0.92rem] text-(--vp-graphite)">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function PreviewPractices() {
  return (
    <section id="services" aria-labelledby="vp-services-title" className="bg-white py-24 sm:py-32">
      <div className={container}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`${kicker} text-(--vp-signal)`}>What we do</p>
            <h2 id="vp-services-title" className="mt-4 text-[clamp(2rem,4vw,2.9rem)] leading-[1.06] font-medium tracking-[-0.035em]">
              Acquire, convert, measure.
            </h2>
          </div>
          <p className="text-[1.02rem] leading-relaxed text-(--vp-graphite) lg:col-span-5">
            Most engagements use all three. The test of success is the same throughout: qualified leads, customers and
            what each one cost.
          </p>
        </div>

        <ul className="mt-14 grid border-t border-(--vp-ink) md:grid-cols-3">
          {PRACTICES.map((p) => (
            <li
              key={p.title}
              className="border-b border-(--vp-line) py-8 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <h3 className="text-[1.6rem] font-medium tracking-[-0.03em]">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-(--vp-graphite)">{p.text}</p>
              <p className="vp-mono mt-5 text-[0.75rem] leading-relaxed text-(--vp-signal)">{p.includes.join(" · ")}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid overflow-hidden rounded-md border border-(--vp-line) bg-(--vp-mist) md:grid-cols-2">
          {AI_SPLIT.map((col, i) => (
            <div key={col.label} className={`p-7 sm:p-9 ${i === 1 ? "border-t border-(--vp-line) md:border-t-0 md:border-l" : ""}`}>
              <p className={`${kicker} text-(--vp-signal)`}>{col.label}</p>
              <ul className="mt-5 space-y-3 text-[1.08rem] tracking-[-0.01em]">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PreviewIndustries() {
  return (
    <section id="industries" aria-labelledby="vp-industries-title" className="border-t border-(--vp-line) bg-white py-24 pb-36 sm:py-32 sm:pb-40">
      <div className={container}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`${kicker} text-(--vp-signal)`}>Industries</p>
            <h2 id="vp-industries-title" className="mt-4 max-w-[20ch] text-[clamp(2rem,4vw,2.9rem)] leading-[1.06] font-medium tracking-[-0.035em]">
              For businesses where the sale happens after the click.
            </h2>
          </div>
          <p className="text-[1.02rem] leading-relaxed text-(--vp-graphite) lg:col-span-5">
            A site visit, an admission, an appointment, a first order. We judge campaigns by the step that pays. These
            are the sectors we focus on.
          </p>
        </div>

        <ul className="mt-14 grid border-t border-(--vp-ink) sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <li
              key={ind.id}
              className="flex flex-col border-b border-(--vp-line) py-8 sm:odd:pr-6 sm:even:border-l sm:even:pl-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <h3 className="text-[1.3rem] font-medium tracking-[-0.025em]">{ind.label}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-(--vp-graphite)">{INDUSTRY_LINES[ind.id]}</p>
              <ol aria-label={`${ind.label} journey we measure`} className="vp-mono mt-6 space-y-1.5 text-[0.75rem] text-(--vp-ink)">
                {ind.funnel.map((stage, i) => (
                  <li key={stage} className="flex items-center gap-2">
                    <span aria-hidden className="text-(--vp-graphite)">{i === 0 ? "○" : "→"}</span>
                    {stage}
                  </li>
                ))}
              </ol>
              <Link href="/#contact" className="vp-link mt-auto self-start pt-7 text-[0.92rem] font-medium">
                Talk to us about {INDUSTRY_CTA[ind.id] ?? "your sector"} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
