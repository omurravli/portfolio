"use client";

import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  center,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon-cyan">
            {index}
          </span>
          <span className="h-px w-10 bg-gradient-to-r from-neon-cyan/70 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-zinc-500">
            {eyebrow}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
