import { TriangleAlert } from "lucide-react";

export function LegalReviewNotice() {
  return (
    <div role="note" className="mb-12 flex gap-3 rounded-[var(--radius-md)] border border-amber-600/25 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
      <div>
        <p className="font-semibold">Starter draft: requires legal review before publication.</p>
        <p className="mt-1">
          This page is a template prepared before launch. Items marked <strong>[To be confirmed]</strong>{" "}
          must be completed, and the full text should be reviewed by a qualified lawyer for each
          jurisdiction you operate in (for example, India’s Digital Personal Data Protection Act
          2023 and applicable US state privacy laws).
        </p>
      </div>
    </div>
  );
}
