"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillCategories } from "@/lib/data";

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TechGalaxy() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  // Slowly tour the sectors until the visitor takes over.
  useEffect(() => {
    if (!auto || reduce) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % skillCategories.length),
      5000
    );
    return () => clearInterval(id);
  }, [auto, reduce]);

  const category = skillCategories[active];

  return (
    <section id="stack" className="relative scroll-mt-24 overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          eyebrow="TECH GALAXY"
          title="A galaxy of tools, one core"
          description="Eight sectors orbit the same engineering core. Select a sector — or let the scanner sweep through them."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* sector selector */}
          <Reveal>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {skillCategories.map((cat, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActive(i);
                      setAuto(false);
                    }}
                    className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 lg:w-full ${
                      isActive
                        ? "border-white/20 bg-white/[0.06] lg:translate-x-2"
                        : "border-white/[0.06] hover:border-white/15 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: cat.color,
                        boxShadow: isActive ? `0 0 12px ${cat.color}` : "none",
                      }}
                    />
                    <span className="flex flex-col">
                      <span className="font-mono text-[9px] tracking-[0.22em] text-zinc-500">
                        SECTOR {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`whitespace-nowrap text-sm font-medium ${
                          isActive ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        {cat.label}
                      </span>
                    </span>
                    <span className="ml-auto hidden font-mono text-xs text-zinc-600 lg:inline">
                      {cat.skills.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* orbit stage (desktop / tablet) */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block">
            <div aria-hidden className="absolute inset-[6%] rounded-full border border-white/5" />
            <div
              aria-hidden
              className="absolute inset-[19%] animate-spin-slower rounded-full border border-dashed border-white/10"
            />
            <div
              aria-hidden
              className="absolute inset-[32%] animate-spin-reverse rounded-full border border-white/5"
            />

            {/* central hub */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-36 w-36 flex-col items-center justify-center rounded-full border bg-ink/85 text-center backdrop-blur"
                style={{
                  borderColor: `${category.color}55`,
                  boxShadow: `0 0 70px -12px ${category.color}88`,
                }}
              >
                <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500">
                  SECTOR {String(active + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 px-3 font-display text-sm font-semibold text-white">
                  {category.label}
                </span>
                <span className="mt-1 font-mono text-[9px] text-zinc-500">
                  {category.skills.length} MODULES
                </span>
              </motion.div>
            </div>

            {/* orbiting skill chips */}
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                className="absolute inset-0"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              >
                {category.skills.map((skill, i) => {
                  const n = category.skills.length;
                  const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                  const radius = i % 2 === 0 ? 41 : 32;
                  const left = 50 + radius * Math.cos(angle);
                  const top = 50 + radius * Math.sin(angle);
                  return (
                    <div
                      key={skill}
                      className="absolute"
                      style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <motion.div variants={chipVariants}>
                        <motion.span
                          animate={reduce ? undefined : { y: [0, -6, 0] }}
                          transition={
                            reduce
                              ? undefined
                              : {
                                  duration: 3 + (i % 4) * 0.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 0.15,
                                }
                          }
                          className="block whitespace-nowrap rounded-full border bg-ink/85 px-3 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur transition-shadow hover:text-white"
                          style={{ borderColor: `${category.color}44` }}
                        >
                          {skill}
                        </motion.span>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* compact chip cloud (mobile) */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-wrap gap-2"
              >
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border bg-ink/85 px-3 py-1.5 font-mono text-[11px] text-zinc-200"
                    style={{ borderColor: `${category.color}44` }}
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
