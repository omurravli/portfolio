"use client";

import { useState } from "react";
import { useContent } from "@/components/ContentProvider";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const GitHubIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
const LinkedInIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
  </svg>
);
const EmailIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const cleanUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 border-neon-cyan/50 ${className}`}
    />
  );
}

export default function Contact() {
  const { profile } = useContent();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const CHANNELS = [
    { label: "GitHub", handle: cleanUrl(profile.github), href: profile.github, icon: GitHubIcon },
    { label: "LinkedIn", handle: cleanUrl(profile.linkedin), href: profile.linkedin, icon: LinkedInIcon },
    { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, icon: EmailIcon },
  ].filter((c) => c.href);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Transmission from ${form.name || "a portfolio visitor"}`
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  const inputClasses =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-neon-cyan/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.3)]";

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-neon-cyan/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="06"
          eyebrow="TRANSMISSION"
          title="Open a channel"
          description="Internships, freelance builds, drone talk, or a product idea that needs both a mechanical and a software brain — the panel is listening."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* direct channels */}
          <Reveal>
            <div className="flex h-full flex-col gap-3">
              {CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition duration-300 hover:border-neon-purple/50 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-ink text-zinc-300 transition-colors group-hover:text-neon-cyan">
                    {channel.icon}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {channel.label}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {channel.handle}
                    </span>
                  </span>
                  <span className="ml-auto text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-neon-cyan">
                    ↗
                  </span>
                </a>
              ))}

              <div className="mt-auto space-y-2 pt-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">
                  BASE: KAYSERI, TÜRKİYE — 38.7°N, 35.5°E
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">
                  STATUS:{" "}
                  <span className="text-emerald-400">
                    OPEN TO INTERNSHIPS &amp; FREELANCE BUILDS
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* transmission panel */}
          <Reveal delay={0.12}>
            <div className="relative rounded-2xl border border-white/[0.08] bg-ink/80 backdrop-blur">
              <Corner className="left-0 top-0 border-l border-t" />
              <Corner className="right-0 top-0 border-r border-t" />
              <Corner className="bottom-0 left-0 border-b border-l" />
              <Corner className="bottom-0 right-0 border-b border-r" />

              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-zinc-400">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                  TRANSMISSION PANEL — CHANNEL OPEN
                </span>
                <span className="font-mono text-[10px] text-zinc-600">SIG 100%</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block font-mono text-[10px] tracking-[0.22em] text-zinc-500"
                    >
                      CALLSIGN / NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ada Lovelace"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-mono text-[10px] tracking-[0.22em] text-zinc-500"
                    >
                      RETURN FREQUENCY / EMAIL
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.com"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-[10px] tracking-[0.22em] text-zinc-500"
                  >
                    PAYLOAD / MESSAGE
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me what you want to build…"
                    className={`${inputClasses} resize-none`}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 text-sm font-medium text-white shadow-glow-purple transition hover:brightness-110"
                  >
                    Transmit →
                  </button>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
                    {status === "sent"
                      ? "TRANSMISSION ROUTED TO YOUR MAIL CLIENT ✓"
                      : "ROUTED VIA MAILTO — NO SERVERS INVOLVED"}
                  </span>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
