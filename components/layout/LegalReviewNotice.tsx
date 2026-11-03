import { TriangleAlert } from "lucide-react";

export function LegalReviewNotice() {
  return (
    <div role="note" className="mb-12 flex max-w-[680px] gap-3 rounded-md border border-line bg-mist p-5 text-sm leading-relaxed text-graphite">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-900" />
      <div>
        <p className="font-medium text-ink-900">Starter draft: requires legal review before publication.</p>
        <p className="mt-1">
          This page is a template prepared before launch. Items marked <strong className="font-semibold text-ink-900">[To be confirmed]</strong>{" "}
          must be completed, and the full text should be reviewed by a qualified lawyer for each
          jurisdiction you operate in (for example, India’s Digital Personal Data Protection Act
          2023 and applicable US state privacy laws).
        </p>
      </div>
    </div>
  );
}
