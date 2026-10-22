"use client";

import { motion } from "motion/react";

/**
 * Decorative band that narrows from left to right: a horizontal funnel that
 * sits behind the four stages. A single signal travels through it.
 */
export function FunnelBand() {
  const W = 1200;
  const H = 120;
  const seg = W / 4;
  const heights = [120, 92, 68, 50, 40];
  const shapes = [0, 1, 2, 3].map((i) => {
    const x0 = i * seg + (i === 0 ? 0 : 3);
    const x1 = (i + 1) * seg - 3;
    const h0 = heights[i];
    const h1 = heights[i + 1];
    return `M${x0},${(H - h0) / 2} L${x1},${(H - h1) / 2} L${x1},${(H + h1) / 2} L${x0},${(H + h0) / 2} Z`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="band" x1="0" x2="1">
          <stop offset="0" stopColor="#5b84ff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#7c5cff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {shapes.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="url(#band)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 + i * 0.18 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.15 }}
        />
      ))}
      <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="rgb(255 255 255 / 0.25)" strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
      <motion.circle
        r="5"
        cy={H / 2}
        fill="#fff"
        initial={{ cx: 0, opacity: 0 }}
        whileInView={{ cx: [0, W], opacity: [0, 1, 1, 0] }}
        viewport={{ once: false }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
      />
    </svg>
  );
}
