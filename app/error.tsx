"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="dark-surface relative flex min-h-[80vh] items-center bg-ink-950 pt-[var(--header-h)] text-white">
      <div className="container-site max-w-2xl text-center">
        <p className="eyebrow text-accent-soft">Something went wrong</p>
        <h1 className="display-lg mt-5">We couldn’t load this page.</h1>
        <p className="mt-5 text-lg text-slate-300">Please try again. If the problem continues, come back a little later.</p>
        <div className="mt-10 flex justify-center gap-3">
          <button type="button" onClick={reset} className={buttonClasses("primary")}>
            Try again
          </button>
          <Link href="/" className={buttonClasses("secondary")}>
            Go to home
          </Link>
        </div>
      </div>
    </section>
  );
}
