# Ömür Ravlı — Engineering Core

A cinematic 3D portfolio built around a procedural "engineering core": a React Three Fiber reactor orb with orbit rings, data streams, particles, mouse-reactive lighting and floating discipline labels — framing work across AI, robotics, mobile, IoT, drones and web systems.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · React Three Fiber · Drei · Three.js

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production build: `npm run build && npm start`.

## Customize

Everything content-related lives in **`lib/data.ts`**:

- `profile` — name, location, **email / GitHub / LinkedIn links** (the contact section and the mailto form read from here; replace `hello@example.com` with your real address).
- `stats` — the animated hero counters. Set the values to your real counts.
- `projects` — title, system label, status, description, stack chips, accent color, `featured` flag (featured spans two columns).
- `skillCategories` — the eight sectors of the tech galaxy.
- `timeline` — the signal-path phases.
- `processStages` — the pipeline stages.

Visual identity:

- Colors: `tailwind.config.ts` (`void`, `ink`, `neon.*`).
- 3D scene: `components/three/CoreAssembly.tsx` — orbit labels (`LABELS`), ring config (`RINGS`), stream count, core materials.
- Fonts: `app/layout.tsx` (Space Grotesk / Inter / JetBrains Mono via `next/font`).

## Deploy on Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo — Next.js is auto-detected, no config needed.
3. Deploy. Every push to `main` redeploys automatically.

(CLI alternative: `npx vercel`.)

## Improve next

- Real form backend (Resend / Formspree) instead of `mailto:`.
- Bloom post-processing (`@react-three/postprocessing`) for a richer core glow — test mobile perf first.
- Per-project detail pages or case-study modals.
- OG image (`app/opengraph-image.tsx`) and sitemap/robots for SEO.
- Scroll-linked camera moves so the core "hands off" into the mission section.

## Accessibility & performance notes

- `prefers-reduced-motion` disables camera parallax, idle animations, counters and CSS spins; the WebGL canvas drops to on-demand rendering.
- The 3D scene uses only procedural geometry (~750 particles, 3 torus rings, dashed line curves) — no model files, DPR capped at 1.75.
- The scene is client-only (`next/dynamic`, `ssr: false`) so the page shell renders instantly.
