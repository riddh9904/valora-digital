import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="dark-surface relative flex min-h-[80vh] items-center bg-ink-950 pt-[var(--header-h)] text-white">
      <div aria-hidden className="bg-grid-dark mask-fade-radial absolute inset-0 opacity-60" />
      <div className="container-site relative max-w-2xl text-center">
        <p className="eyebrow text-accent-soft">404</p>
        <h1 className="display-lg mt-5">This page doesn’t exist.</h1>
        <p className="mt-5 text-lg text-slate-300">The link may be broken, or the page may have moved.</p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
