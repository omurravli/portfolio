"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-glow-purple hover:brightness-110",
  ghost:
    "border border-white/15 text-zinc-200 hover:border-neon-violet/60 hover:text-white hover:bg-white/[0.04]",
} as const;

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-10, Math.min(10, dx * 0.22)));
    y.set(Math.max(-8, Math.min(8, dy * 0.25)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-colors duration-300 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
