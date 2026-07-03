"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/components/ContentProvider";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

// Indexed by pipeline position so it works whether stages come from the API or
// the bundled fallback. Extra stages fall back to the last icon.
const ICONS: JSX.Element[] = [
  (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.9 10.6c.6.5.9 1.2.9 2V16h6v-.4c0-.8.3-1.5.9-2A6 6 0 0 0 12 3z" />
    </>
  ),
  (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M10 6.5h7.5V14" />
      <circle cx="6.5" cy="17.5" r="2.5" />
    </>
  ),
  (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  (
    <>
      <path d="M5.5 19a8.5 8.5 0 1 1 13 0" />
      <path d="M12 15l3.5-5" />
      <circle cx="12" cy="15" r="1.5" />
    </>
  ),
  (
    <>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v5h-5" />
    </>
  ),
  (
    <>
      <path d="M12 2c3 2.5 4.5 6 4.5 9.5L14 14h-4l-2.5-2.5C7.5 8 9 4.5 12 2z" />
      <circle cx="12" cy="8.5" r="1.5" />
      <path d="M9 14l-2.5 5L10 17M15 14l2.5 5L14 17" />
    </>
  ),
];

export default function Process() {
  const { processStages } = useContent();
  const reduce = !!useReducedMotion();

  return (
    <section id="process" className="relative scroll-mt-24 overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
      />
      <div
        aria-hidden
        className="bg-grid-faint absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_50%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="05"
          eyebrow="PIPELINE"
          title="Idea → Ship"
          description="The same pipeline runs whether the payload is an app, a machine, or a storefront."
          center
        />

        <div className="relative mt-20">
          {/* energized connector line across the pipeline */}
          <div
            aria-hidden
            className="absolute left-[8%] right-[8%] top-8 hidden h-px animate-flow bg-[linear-gradient(90deg,transparent,#8b5cf6,#22d3ee,#8b5cf6,transparent)] bg-[length:200%_100%] opacity-40 md:block"
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:grid-cols-6">
            {processStages.map((stage, i) => (
              <Reveal key={stage.id} delay={i * 0.08} className="relative z-10">
                <div className="group flex flex-col items-center text-center">
                  <motion.div
                    whileHover={reduce ? undefined : { rotate: 6, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-ink text-zinc-300 transition-colors duration-300 group-hover:border-neon-cyan/50 group-hover:text-neon-cyan group-hover:shadow-glow-cyan"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-7 w-7"
                    >
                      {ICONS[i] ?? ICONS[ICONS.length - 1]}
                    </svg>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-void font-mono text-[9px] text-neon-purple">
                      {i + 1}
                    </span>
                  </motion.div>
                  <h3 className="mt-4 font-display text-sm font-semibold text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-1.5 max-w-[10rem] text-xs leading-relaxed text-zinc-500">
                    {stage.blurb}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
