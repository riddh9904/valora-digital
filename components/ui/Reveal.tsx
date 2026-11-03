"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Subtle entrance transition. MotionConfig in the root layout drops the movement under
 * reduced motion, and the `[data-reveal]` rule in globals.css keeps the content visible
 * without waiting for it to scroll into view.
 */
export function Reveal({
  children,
  delay = 0,
  y = 8,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Cmp = motion[as];
  return (
    <Cmp
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Cmp>
  );
}
