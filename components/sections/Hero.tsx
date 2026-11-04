import Link from "next/link";
import { proofPoints } from "@/config/site";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { HeroDemoCard } from "@/components/dashboard/HeroDemoCard";

const commitments = [
  { title: "Cost per customer", text: "Cost per qualified lead or per first order, agreed with you up front." },
  { title: "Reconciled with your CRM or store", text: "Platform numbers checked against real sales." },
  { title: "Caveats in writing", text: "Where the data runs out, we say so." },
];

export function Hero() {
  // Only verified proof points with a stated source are ever rendered.
  const verified = proofPoints.filter((p) => p.verified && p.source.trim().length > 0);

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-title"
        className="container-site pt-[calc(var(--header-h)+48px)] pb-12 sm:pt-[calc(var(--header-h)+72px)] sm:pb-16 sm:text-center"
      >
        <p className="kicker inline-flex items-center gap-2.5 text-graphite">
          <span aria-hidden className="live-dot size-1.5 shrink-0 rounded-full bg-signal-bright" />
          <span>
            AI-driven performance marketing<span className="hidden sm:inline"> · Dubai and Gurugram</span>
          </span>
        </p>
        <h1 id="hero-title" className="display-xl mt-6 max-w-[16ch] text-balance text-ink-900 sm:mx-auto">
          Ad platforms run on AI. We teach it what a customer is.
        </h1>
        <p className="mt-6 max-w-[60ch] text-[1.06rem] leading-relaxed text-graphite sm:mx-auto sm:text-lg">
          Valora manages Meta, Google and other paid advertising platforms for businesses across India, the UAE and
          beyond. We feed each platform’s AI your qualified leads and sales instead of raw form fills, test
          AI-generated creative at speed, and report what each customer costs to acquire.
        </p>
        <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <BookCallButton size="lg" />
          <Link href="/#measurement" className="link-underline self-start text-[0.95rem] font-medium text-ink-900 sm:self-auto">
            See the live report →
          </Link>
        </div>
      </section>

      <div id="hero-demo" className="hero-demo-band">
        <div className="container-site max-w-[1080px]">
          <HeroDemoCard />
        </div>
      </div>

      <div className="bg-mist">
        <div className="container-site py-12">
          <ul className="grid gap-6 sm:grid-cols-3 sm:gap-10">
            {commitments.map((c) => (
              <li key={c.title} className="border-t border-ink-900 pt-4">
                <p className="font-medium tracking-[-0.01em] text-ink-900">{c.title}</p>
                <p className="mt-1 text-[0.92rem] text-graphite">{c.text}</p>
              </li>
            ))}
          </ul>

          {verified.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 lg:grid-cols-4">
              {verified.map((p) => (
                <div key={p.label}>
                  <dt className="text-sm text-graphite">{p.label}</dt>
                  <dd className="tabular mt-1 font-mono text-3xl font-medium tracking-tight text-ink-900">{p.value}</dd>
                  <dd className="mt-1 text-xs text-graphite">Source: {p.source}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </>
  );
}
