"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Tweens between values over 300ms. The first render (server and hydration)
 * always shows `format(value)`; reduced motion jumps straight to the final value.
 */
export function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduce) {
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 0.3,
      ease: "easeOut",
      onUpdate: (n) => {
        from.current = n;
        setShown(n);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <span className="tabular">{format(reduce ? value : shown)}</span>;
}
