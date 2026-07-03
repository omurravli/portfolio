"use client";

import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import StatCounter from "@/components/ui/StatCounter";
import { github } from "@/lib/data";

const { username, url, snapshot } = github;

type Lang = { name: string; pct: number };
type Stats = {
  repos: number;
  followers: number;
  following: number;
  contributions: number;
  languages: Lang[];
  contributionStart: string;
  contributionDays: string;
  live: boolean;
};

/* ------------------------------------------------------------------ */
/* Palettes                                                             */
/* ------------------------------------------------------------------ */

const LANG_COLORS: Record<string, string> = {
  Python: "#38bdf8",
  TypeScript: "#22d3ee",
  JavaScript: "#facc15",
  Dart: "#2dd4bf",
  HTML: "#fb7185",
  CSS: "#a78bfa",
  "C++": "#f472b6",
  "C#": "#4ade80",
  C: "#94a3b8",
  Java: "#fb923c",
  Go: "#67e8f9",
  Rust: "#fdba74",
  Shell: "#86efac",
  Kotlin: "#c084fc",
  Swift: "#fb923c",
};
const FALLBACK = ["#8b5cf6", "#22d3ee", "#38bdf8", "#2dd4bf", "#f472b6", "#a78bfa"];
const colorFor = (name: string, i: number) => LANG_COLORS[name] ?? FALLBACK[i % FALLBACK.length];

// intensity level 0–4 → cell background
const LEVEL_BG = [
  "bg-white/[0.05]",
  "bg-emerald-500/25",
  "bg-emerald-500/45",
  "bg-emerald-500/70",
  "bg-emerald-400",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ------------------------------------------------------------------ */
/* Heatmap helpers                                                      */
/* ------------------------------------------------------------------ */

type Cell = { level: number; date: Date } | null;

function buildWeeks(daysStr: string, startDate: string): Cell[][] {
  const days = daysStr.split("").map((c) => parseInt(c, 10) || 0);
  const start = new Date(`${startDate}T00:00:00`);
  const startDow = start.getDay(); // 0 = Sunday
  const cells: Cell[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null); // pad to the first column
  for (let i = 0; i < days.length; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ level: days[i], date: d });
  }
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks: Cell[][]): string[] {
  let last = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean) as Exclude<Cell, null> | undefined;
    if (!first) return "";
    const m = first.date.getMonth();
    if (m !== last) {
      last = m;
      return MONTHS[m];
    }
    return "";
  });
}

function computeLanguages(repos: Array<{ fork?: boolean; language?: string | null }>): Lang[] {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const total = entries.reduce((sum, [, c]) => sum + c, 0) || 1;
  return entries.map(([name, c]) => ({ name, pct: Math.round((c / total) * 100) }));
}

// Summary metrics derived from the contribution calendar (levels 0–4 per day).
function contribMetrics(daysStr: string, startDate: string) {
  const levels = daysStr.split("").map((c) => parseInt(c, 10) || 0);
  const start = new Date(`${startDate}T00:00:00`);
  const monthSum = new Array(12).fill(0);
  let active = 0;
  let longest = 0;
  let run = 0;
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] > 0) {
      active++;
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    monthSum[d.getMonth()] += levels[i];
  }
  let current = 0;
  for (let i = levels.length - 1; i >= 0 && levels[i] > 0; i--) current++;
  let bm = 0;
  for (let m = 1; m < 12; m++) if (monthSum[m] > monthSum[bm]) bm = m;
  return { active, longest, current, busiest: monthSum[bm] > 0 ? MONTHS[bm] : "—" };
}

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

const iconProps = {
  className: "h-5 w-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const IconRepo = () => (
  <svg {...iconProps}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z" />
  </svg>
);
const IconFollowers = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-2.7-4.7" />
  </svg>
);
const IconFollowing = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="8" r="3.2" />
    <path d="M5 20a6 6 0 0 1 12 0" />
    <path d="M19 8h4M21 6v4" />
  </svg>
);
const IconContrib = () => (
  <svg {...iconProps}>
    <path d="M3 12h4l2.5 6 5-12L17 12h4" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Stat card                                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center">
      <span style={{ color: accent }}>{icon}</span>
      <div className="mt-3">
        <StatCounter value={value} label={label} />
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="font-display text-lg font-semibold text-white">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function GitHubStats() {
  const [s, setS] = useState<Stats>({ ...snapshot, live: false });

  useEffect(() => {
    let alive = true;
    const safe = async (u: string) => {
      try {
        const r = await fetch(u);
        return r.ok ? await r.json() : null;
      } catch {
        return null;
      }
    };
    (async () => {
      const [profile, contrib, repos] = await Promise.all([
        safe(`https://api.github.com/users/${username}`),
        safe(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
        safe(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
      ]);
      if (!alive) return;
      setS((prev) => {
        const next: Stats = { ...prev, live: true };
        if (profile) {
          next.repos = profile.public_repos ?? prev.repos;
          next.followers = profile.followers ?? prev.followers;
          next.following = profile.following ?? prev.following;
        }
        if (contrib?.contributions?.length) {
          next.contributions = contrib.total?.lastYear ?? prev.contributions;
          next.contributionStart = contrib.contributions[0].date;
          next.contributionDays = contrib.contributions
            .map((d: { level: number }) => d.level)
            .join("");
        }
        if (Array.isArray(repos) && repos.length) {
          const langs = computeLanguages(repos);
          if (langs.length) next.languages = langs;
        }
        return next;
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const weeks = useMemo(
    () => buildWeeks(s.contributionDays, s.contributionStart),
    [s.contributionDays, s.contributionStart],
  );
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const metrics = useMemo(
    () => contribMetrics(s.contributionDays, s.contributionStart),
    [s.contributionDays, s.contributionStart],
  );
  const langTotal = s.languages.reduce((sum, l) => sum + l.pct, 0) || 1;

  return (
    <div className="mt-24 md:mt-28">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.3em] text-neon-cyan">04·G</span>
          <span className="h-px w-10 bg-gradient-to-r from-neon-cyan/70 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-zinc-500">
            GITHUB ACTIVITY
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Open-source footprint
        </h3>
      </Reveal>

      <Reveal delay={0.14} className="mt-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]">
          {/* stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<IconRepo />} value={s.repos} label="Repositories" accent="#22d3ee" />
            <StatCard icon={<IconFollowers />} value={s.followers} label="Followers" accent="#a78bfa" />
            <StatCard icon={<IconFollowing />} value={s.following} label="Following" accent="#38bdf8" />
            <StatCard icon={<IconContrib />} value={s.contributions} label="Contributions" accent="#34d399" />
          </div>

          {/* contribution heatmap */}
          <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                <span className="text-white">{s.contributions}</span> contributions in the last year
              </p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-wide text-zinc-500 transition-colors hover:text-white"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    s.live ? "animate-pulse-dot bg-emerald-400" : "bg-zinc-600"
                  }`}
                />
                @{username}
              </a>
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="min-w-max">
                {/* month labels */}
                <div className="flex gap-[2px] pl-7">
                  {months.map((label, i) => (
                    <span
                      key={i}
                      className="w-2.5 shrink-0 whitespace-nowrap font-mono text-[9px] text-zinc-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                {/* weekday column + weeks */}
                <div className="mt-1 flex gap-[2px]">
                  <div className="flex w-7 flex-col gap-[2px] pr-1">
                    {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                      <span
                        key={i}
                        className="h-2.5 font-mono text-[9px] leading-[10px] text-zinc-500"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((_, ri) => {
                        const cell = week[ri];
                        return (
                          <span
                            key={ri}
                            title={
                              cell ? cell.date.toISOString().slice(0, 10) : undefined
                            }
                            className={`h-2.5 w-2.5 rounded-[2px] ${
                              cell ? LEVEL_BG[cell.level] : "bg-transparent"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* legend */}
            <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[9px] text-zinc-500">
              <span>Less</span>
              {LEVEL_BG.map((c, i) => (
                <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
              ))}
              <span>More</span>
            </div>

            {/* derived metrics — pinned to the bottom to fill the panel */}
            <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.06] pt-5 sm:grid-cols-4">
              <Metric value={metrics.active} label="Active days" />
              <Metric value={`${metrics.longest}d`} label="Longest streak" />
              <Metric value={`${metrics.current}d`} label="Current streak" />
              <Metric value={metrics.busiest} label="Busiest month" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* top languages */}
      <Reveal delay={0.2} className="mt-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
            Top Languages
          </p>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
            {s.languages.map((l, i) => (
              <span
                key={l.name}
                style={{ width: `${(l.pct / langTotal) * 100}%`, background: colorFor(l.name, i) }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {s.languages.map((l, i) => (
              <span
                key={l.name}
                className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-400"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colorFor(l.name, i) }}
                />
                <span className="text-zinc-200">{l.name}</span> {l.pct}%
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
