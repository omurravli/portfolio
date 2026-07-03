"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import type { RepoProject } from "@/lib/data";

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#22d3ee",
  JavaScript: "#facc15",
  Python: "#38bdf8",
  Dart: "#2dd4bf",
  HTML: "#fb7185",
  CSS: "#a78bfa",
  "C++": "#f472b6",
  "C#": "#4ade80",
  C: "#94a3b8",
  Shell: "#86efac",
  Java: "#fb923c",
  Go: "#67e8f9",
  Rust: "#fdba74",
  Swift: "#fb923c",
  Kotlin: "#c084fc",
  CMake: "#94a3b8",
  Makefile: "#a3a3a3",
};
const colorOf = (lang?: string) => (lang && LANG_COLOR[lang]) || "#8b5cf6";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* icons */
const svg = {
  className: "h-3.5 w-3.5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};
const Star = () => (
  <svg {...svg}>
    <path d="M12 4l2.3 4.9 5.2.7-3.8 3.6.9 5.2L12 16.9 7.4 18.4l.9-5.2L4.5 9.6l5.2-.7z" />
  </svg>
);
const Fork = () => (
  <svg {...svg}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M6 7v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 13v4" />
  </svg>
);
const Issue = () => (
  <svg {...svg}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);
const Clock = () => (
  <svg {...svg}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2" />
  </svg>
);
const GitHub = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const External = () => (
  <svg {...svg} className="h-4 w-4">
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
  </svg>
);

export default function RepoCard({
  repo,
  index,
}: {
  repo: RepoProject;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const accent = colorOf(repo.languages[0]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${accent}1c, transparent 70%)`;

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

  const [owner] = repo.fullName.split("/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative [perspective:1200px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full rounded-2xl"
      >
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-purple/60 via-transparent to-neon-cyan/60 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60"
        />
        <div
          aria-hidden
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 via-white/[0.04] to-white/10 transition duration-500 group-hover:from-neon-purple/70 group-hover:to-neon-cyan/70"
        />
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink p-6 [transform-style:preserve-3d] md:p-7">
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          {/* accent edge tinted by primary language */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          <div className="relative flex h-full flex-col [transform:translateZ(28px)]">
            <div className="flex items-start justify-between gap-3">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0"
                aria-label={`${repo.fullName} on GitHub`}
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
                  <GitHub />
                  {owner}/
                </span>
                <h3 className="mt-1 truncate font-display text-lg font-semibold text-white transition-colors group-hover:text-white">
                  {repo.name}
                </h3>
              </a>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${repo.name} on GitHub`}
                className="shrink-0 text-zinc-500 transition-colors hover:text-white"
              >
                <External />
              </a>
            </div>

            <p
              className={`mt-3 line-clamp-2 text-sm leading-relaxed ${
                repo.description ? "text-zinc-400" : "italic text-zinc-600"
              }`}
            >
              {repo.description || "No description yet."}
            </p>

            {repo.languages.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {repo.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-zinc-300"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: colorOf(lang) }}
                    />
                    {lang}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center gap-4 pt-6 font-mono text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1" title="Stars">
                <Star />
                {repo.stars}
              </span>
              <span className="inline-flex items-center gap-1" title="Forks">
                <Fork />
                {repo.forks}
              </span>
              <span className="inline-flex items-center gap-1" title="Open issues">
                <Issue />
                {repo.issues}
              </span>
              <span className="ml-auto inline-flex items-center gap-1" title="Last pushed">
                <Clock />
                {formatDate(repo.pushedAt)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
