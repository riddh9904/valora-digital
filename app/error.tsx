"use client";

import { useEffect } from "react";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/SectionHeading";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] items-center bg-white pt-[var(--header-h)]">
      <div className="container-site max-w-2xl">
        <Kicker>Something went wrong</Kicker>
        <h1 className="display-lg mt-4 text-ink-900">We couldn’t load this page.</h1>
        <p className="mt-5 text-lg text-graphite">Please try again. If the problem continues, come back a little later.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={buttonClasses("primary")}>
            Try again
          </button>
          <ButtonLink href="/" variant="ghost" icon="none">
            Go to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
