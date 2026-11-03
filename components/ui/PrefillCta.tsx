"use client";

import { prefillEnquiry, type PrefillDetail } from "@/lib/prefill";

/**
 * A text-link CTA that pre-fills the enquiry form and scrolls to it.
 * A link rather than a filled button: a row of ink blocks reads heavy, and long
 * labels wrapped inside fixed-height buttons.
 */
export function PrefillCta({
  label,
  detail,
  className = "",
}: {
  label: string;
  detail: PrefillDetail;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => prefillEnquiry(detail)}
      className={`inline-flex min-h-11 cursor-pointer items-center text-left text-[0.92rem] sm:min-h-0 sm:inline sm:items-baseline font-medium text-ink-900 hover:text-signal ${className}`}
    >
      <span className="link-underline">{label}</span>
      {/* No-break space keeps the arrow with the last word when the label wraps. */}
      <span aria-hidden>{" →"}</span>
    </button>
  );
}
