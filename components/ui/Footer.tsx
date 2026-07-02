import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
          © {new Date().getFullYear()} {profile.name.toUpperCase()} — ENGINEERED, NOT TEMPLATED
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-600">
          NEXT.JS · REACT THREE FIBER · TAILWIND
        </p>
        <a
          href="#top"
          className="font-mono text-[10px] tracking-[0.18em] text-zinc-400 transition hover:text-neon-cyan"
        >
          ↑ BACK TO CORE
        </a>
      </div>
    </footer>
  );
}
