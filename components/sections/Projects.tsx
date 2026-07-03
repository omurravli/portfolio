"use client";

import { useEffect, useState } from "react";
import RepoCard from "@/components/ui/RepoCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { githubProjects, type RepoProject } from "@/lib/data";

const { username, count, snapshot } = githubProjects;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toRepo(r: any, languages: string[]): RepoProject {
  return {
    name: r.name,
    fullName: r.full_name,
    description: r.description || "",
    url: r.html_url,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    issues: r.open_issues_count || 0,
    pushedAt: (r.pushed_at || "").slice(0, 10),
    languages,
  };
}

export default function Projects() {
  const [repos, setRepos] = useState<RepoProject[]>(snapshot);

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
      const list = await safe(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      );
      if (!alive || !Array.isArray(list)) return;
      const picked = list
        .filter((r: any) => !r.fork && (r.description || r.language))
        .slice(0, count);
      const withLangs = await Promise.all(
        picked.map(async (r: any) => {
          let languages: string[] = r.language ? [r.language] : [];
          const lj = await safe(r.languages_url);
          if (lj && typeof lj === "object") languages = Object.keys(lj).slice(0, 4);
          return toRepo(r, languages);
        }),
      );
      if (alive && withLangs.length) setRepos(withLangs);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="projects" className="relative scroll-mt-24 py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-24 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-neon-purple/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="PROJECT UNIVERSE"
          title="Systems in the field"
          description="Pulled live from my GitHub — the repositories I'm actively building, breaking and shipping. Stars, forks and languages update in real time."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, i) => (
            <RepoCard key={repo.fullName} repo={repo} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-zinc-300 transition hover:border-neon-cyan/50 hover:text-white"
          >
            VIEW ALL ON GITHUB
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
