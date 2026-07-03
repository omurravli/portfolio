"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/ui/MagneticButton";
import StatCounter from "@/components/ui/StatCounter";
import { stats } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_65%_45%,rgba(139,92,246,0.12),transparent_70%)]" />
  ),
});

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export default function Hero() {
  const reduce = !!useReducedMotion();

  const item: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.6 } },
      }
    : {
        hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      {/* 3D engineering core */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <HeroScene reducedMotion={reduce} />
      </div>

      {/* readability scrims — transparent over the core, dense over the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-void/90 via-void/45 to-void/10 md:from-void/80 md:via-void/25 md:to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-void to-transparent"
      />

      <div className="relative z-10 flex flex-1 items-center pt-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[10px] tracking-[0.22em] text-zinc-300 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                SYSTEMS ONLINE — KAYSERI, TÜRKİYE
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Ömür Ravlı builds where{" "}
              <span className="bg-gradient-to-r from-[#c9b8ff] via-[#a78bfa] to-[#5fe6fb] bg-clip-text text-transparent [filter:drop-shadow(0_1px_2px_rgba(5,5,9,0.9))_drop-shadow(0_0_22px_rgba(124,92,246,0.22))]">
                software meets machines
              </span>
              .
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
            >
              Mechanical engineering student and multidisciplinary developer
              creating mobile apps, IoT systems, ML workflows, drone projects,
              optimization tools, and modern web experiences.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton href="#projects">Explore Projects</MagneticButton>
              <MagneticButton href="#stack" variant="ghost">
                View Tech Stack
              </MagneticButton>
              <MagneticButton href="#contact" variant="ghost">
                Contact
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* animated stats strip */}
      <div className="relative z-10 border-t border-white/[0.06] bg-void/40 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-7 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
