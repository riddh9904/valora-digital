"use client";

import { buttonClasses } from "@/components/ui/Button";
import { prefillEnquiry } from "@/lib/prefill";
import { ArrowRight } from "lucide-react";

export function TalkToUsButton({ title }: { title: string }) {
  return (
    <button
      type="button"
      onClick={() => prefillEnquiry({ message: `About “${title}”: ` })}
      className={buttonClasses("ink", "md", "mt-6")}
    >
      Talk to us about this
      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}
