import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/SectionHeading";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-white pt-[var(--header-h)]">
      <div className="container-site max-w-2xl">
        <Kicker>404</Kicker>
        <h1 className="display-lg mt-4 text-ink-900">This page doesn’t exist.</h1>
        <p className="mt-5 text-lg text-graphite">The link may be broken, or the page may have moved.</p>
        <div className="mt-10 flex">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
