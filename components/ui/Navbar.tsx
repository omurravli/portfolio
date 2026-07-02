"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { n: "01", label: "MISSION", href: "#mission" },
  { n: "02", label: "PROJECTS", href: "#projects" },
  { n: "03", label: "STACK", href: "#stack" },
  { n: "04", label: "PATH", href: "#path" },
  { n: "05", label: "PROCESS", href: "#process" },
  { n: "06", label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-white/[0.06] bg-void/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[72px]">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            ÖR<span className="text-neon-cyan">.</span>
          </span>
          <span className="hidden font-mono text-[9px] tracking-[0.3em] text-zinc-500 sm:inline">
            ENGINEERING CORE
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
            >
              <span className="mr-1 text-neon-purple/80">{link.n}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-300 transition hover:border-neon-cyan/50 hover:text-white md:flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            OPEN CHANNEL
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-white transition-transform ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-white transition-transform ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-mono text-xs tracking-[0.18em] text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="mr-2 text-neon-purple/80">{link.n}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
