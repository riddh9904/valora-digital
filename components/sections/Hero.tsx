import { site } from "@/config/site";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { ButtonLink } from "@/components/ui/Button";
import { HeroDashboard } from "@/components/dashboard/HeroDashboard";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="dark-surface relative isolate overflow-hidden bg-ink-950 pt-[calc(var(--header-h)+36px)] pb-24 sm:pt-[calc(var(--header-h)+56px)] text-white sm:pb-28 lg:pt-[calc(var(--header-h)+72px)] lg:pb-36"
    >
      {/* Quiet structure: hairline grid + one restrained colour field */}
      <div aria-hidden className="bg-grid-dark mask-fade-b absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden
        className="absolute -top-40 right-[-10%] -z-10 h-[620px] w-[720px] rounded-full opacity-[0.22] blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--brand-accent), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute top-[38%] right-[18%] -z-10 h-[320px] w-[420px] rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: "radial-gradient(closest-side, var(--brand-violet), transparent)" }}
      />

      <div className="container-site grid items-center gap-10 sm:gap-16 lg:grid-cols-[1.02fr_1fr] lg:gap-14 xl:gap-20">
        <div className="max-w-2xl">
          <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-accent-soft">
            <span>Performance marketing</span>
            <span aria-hidden className="text-slate-600">·</span>
            <span>Conversion intelligence</span>
          </p>
          <h1 id="hero-title" className="display-xl mt-5 text-white sm:mt-7">
            Turn marketing spend into{" "}
            <span className="bg-gradient-to-r from-[#a9bdff] via-[#c7d3ff] to-[#c4b5ff] bg-clip-text text-transparent">
              measurable growth
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed sm:mt-7 text-slate-300 sm:text-xl sm:leading-relaxed">
            We help ambitious businesses acquire better customers, convert more leads, and make
            smarter marketing decisions through performance-driven campaigns and data-led
            optimization.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <BookCallButton size="lg" />
            <ButtonLink href="/#approach" variant="secondary" size="lg" icon="none">
              {site.cta.secondary}
            </ButtonLink>
          </div>
          <p className="mt-10 hidden flex-wrap items-center sm:flex gap-x-3 gap-y-1 border-t border-white/[0.08] pt-6 text-sm text-slate-400">
            <span>Paid acquisition.</span>
            <span>Lead conversion.</span>
            <span>Transparent measurement.</span>
          </p>
        </div>

        <div className="lg:pl-4 xl:pr-6">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
