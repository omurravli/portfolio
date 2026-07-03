"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import GitHubStats from "@/components/sections/GitHubStats";
import SectionHeading from "@/components/ui/SectionHeading";
import { timeline } from "@/lib/data";

export default function Timeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.7"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });

  return (
    <section id="path" className="relative scroll-mt-24 overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          eyebrow="SIGNAL PATH"
          title="The trace so far"
          description="A signal routed through mechanics, machines, classrooms and codebases — each stage feeding the next."
          center
        />

        <div ref={trackRef} className="relative mt-20">
          {/* base trace */}
          <div
            aria-hidden
            className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-white/[0.07] md:left-1/2"
          />
          {/* energized trace that fills as you scroll */}
          <motion.div
            aria-hidden
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute left-4 top-0 h-full w-px origin-top -translate-x-1/2 bg-gradient-to-b from-neon-cyan via-neon-purple to-fuchsia-500 shadow-[0_0_14px_rgba(139,92,246,0.8)] md:left-1/2"
          />

          <div className="space-y-14 md:space-y-20">
            {timeline.map((entry, i) => {
              const onLeft = i % 2 === 0;
              const nodeColor = onLeft ? "#22d3ee" : "#8b5cf6";
              return (
                <div key={entry.title} className="relative md:grid md:grid-cols-2 md:gap-20">
                  {/* junction node */}
                  <div className="absolute left-4 top-1 -translate-x-1/2 md:left-1/2">
                    <span className="relative flex h-3.5 w-3.5">
                      <span
                        className="absolute inset-0 animate-ping rounded-full opacity-50 [animation-duration:2.6s]"
                        style={{ background: nodeColor }}
                      />
                      <span
                        className="relative h-3.5 w-3.5 rounded-full border-2 bg-void"
                        style={{ borderColor: nodeColor }}
                      />
                    </span>
                  </div>

                  <motion.div
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, x: onLeft ? -32 : 32 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`pl-12 md:pl-0 ${
                      onLeft
                        ? "md:col-start-1 md:pr-6 md:text-right"
                        : "md:col-start-2 md:pl-6"
                    }`}
                  >
                    <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500">
                      PHASE {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">
                      {entry.title}
                    </h3>
                    <p
                      className="mt-1 font-mono text-[11px] tracking-wide"
                      style={{ color: nodeColor }}
                    >
                      {entry.context}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {entry.description}
                    </p>
                    <span className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-zinc-300">
                      {entry.tag}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <GitHubStats />
      </div>
    </section>
  );
}
