"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce, delay]);

  return (
    <div ref={ref}>
      <div className="font-display text-2xl font-semibold text-white md:text-3xl">
        {n}
        {suffix && <span className="text-neon-cyan">{suffix}</span>}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}
