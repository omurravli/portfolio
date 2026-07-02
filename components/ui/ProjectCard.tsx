"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/data";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${project.accent}1c, transparent 70%)`;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (reduce) return;
    ry.set((px - 0.5) * 12);
    rx.set(-(py - 0.5) * 10);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative [perspective:1200px] ${
        project.featured ? "lg:col-span-2" : ""
      }`}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full rounded-2xl"
      >
        {/* soft halo behind the card */}
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-purple/60 via-transparent to-neon-cyan/60 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60"
        />
        {/* gradient border */}
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 via-white/[0.04] to-white/10 transition duration-500 group-hover:from-neon-purple/70 group-hover:to-neon-cyan/70"
        />
        <div className="relative flex h-full flex-col rounded-2xl bg-ink p-6 [transform-style:preserve-3d] md:p-7">
          {/* cursor spotlight */}
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative flex h-full flex-col [transform:translateZ(28px)]">
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[10px] tracking-[0.2em]"
                style={{ color: project.accent }}
              >
                {project.system}
              </span>
              <span className="font-mono text-[10px] text-zinc-600">
                SYS.{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
                {project.status}
              </span>
              <span
                className="h-2 w-2 animate-pulse-dot rounded-full"
                style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
