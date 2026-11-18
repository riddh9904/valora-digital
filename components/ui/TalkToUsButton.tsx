"use client";

import { buttonClasses } from "@/components/ui/Button";
import { prefillEnquiry } from "@/lib/prefill";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { MouseEvent } from "react";

export function TalkToUsButton({ title }: { title: string }) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modified and non-primary clicks behave as a normal link (new tab, etc.).
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    prefillEnquiry({ message: `About “${title}”: ` });
  }

  return (
    <Link href="/#contact" onClick={onClick} className={buttonClasses("ink", "md", "mt-6")}>
      Talk to us about this
      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
