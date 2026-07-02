"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface Segment {
  text: string;
  className?: string;
}

const STATEMENT: Segment[] = [
  { text: "I combine " },
  { text: "mechanical engineering thinking", className: "text-neon-cyan" },
  { text: " with " },
  { text: "software execution", className: "text-neon-violet" },
  { text: " — moving ideas through system design and prototypes into " },
  { text: "real implementation", className: "text-white" },
  { text: "." },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Systems first",
    body: "Every build starts as a system — inputs, constraints, failure modes — whether it's a drone frame, a Flutter codebase, or a production schedule.",
  },
  {
    n: "02",
    title: "Prototype fast",
    body: "An ESP32 on the desk beats a slide deck. I get to a working version early, then let real behavior drive the design.",
  },
  {
    n: "03",
    title: "Ship real things",
    body: "A prototype that never leaves the bench is an expensive sketch. I push builds to users, tables, storefronts — and the sky.",
  },
];

function WordReveal({ segments }: { segments: Segment[] }) {
  const reduce = useReducedMotion();
  const words = segments.flatMap((segment) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, className: segment.className }))
  );

  const wordVariants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { y: "110%" },
        show: { y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <motion.p
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ show: { transition: { staggerChildren: 0.045 } } }}
      className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-zinc-300 sm:text-4xl md:text-5xl"
    >
      {words.map(({ word, className }, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span variants={wordVariants} className={`inline-block ${className ?? ""}`}>
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

export default function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-24 overflow-hidden py-28 md:py-36">
      {/* faint engineering grid + ambient glows */}
      <div
        aria-hidden
        className="bg-grid-faint absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-neon-purple/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-neon-cyan/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading index="01" eyebrow="MISSION" title="From idea to machine" />

        <div className="mt-14 max-w-4xl">
          <WordReveal segments={STATEMENT} />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400">
              Mechanical engineering taught me to respect constraints; software
              taught me to iterate past them. The result is one workflow: model
              the system, build the smallest thing that works, test it against
              reality, and ship — whether the output is an app store release, a
              live storefront, or a machine on a bench blinking &quot;ready&quot;.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.n} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition duration-300 hover:border-neon-purple/40 hover:bg-white/[0.04]">
                <span className="font-mono text-[11px] tracking-[0.25em] text-neon-purple/80">
                  {principle.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
