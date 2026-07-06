# Portfolio — Progress & Handoff

_Last updated: 2026-07-04. Personal notes file — safe to delete or add to `.gitignore`._

## TL;DR — where we are

The portfolio has a **live, editable backend + custom admin panel**. You edit content at
`/admin`, it saves to a Django API on Railway, and the site shows the changes.
Everything is built and working; the **only thing left to ship is pushing the
latest admin code** (all section editors) to the frontend repo.

---

## ✅ What we built this session

**Site polish**
- Fixed the hero 3D text readability (brighter gradient headline + glow + scrim; denser orbit-label chips).
- Removed the floating orbit labels on mobile (they overlapped the copy).
- Fixed mobile horizontal overflow (`overflow-x: hidden` on `html` — decorative blur blobs were causing ~78px of side-scroll).
- Rewrote `README.md` to introduce **you**, not the project.

**Live GitHub integrations**
- **GitHub stats block** in the Experience section: repos/followers/following/contributions, a contribution heatmap, top languages, and derived metrics (active days, longest/current streak, busiest month). Live-fetched with a baked-in snapshot fallback.
- **Projects section** now fetches your real repos live from GitHub (`RepoCard`), with a snapshot fallback.

**Backend (Django on Railway)**
- `backend/` — Django 5.2 + DRF + Postgres. Models for all content: SiteProfile/hero, Stat, SkillCategory + Skill, TimelineEntry, ProcessStage, Project.
- Public read API `GET /api/content/`; authenticated write API `/api/admin/…` (token auth).
- `seed_content` management command; CORS; WhiteNoise; env-driven settings.
- Themed the Django admin with **django-unfold** (kept as a backup; the custom panel is the real UI).

**Frontend wired to backend**
- `lib/content.ts` (`getContent()` with `data.ts` fallback) + `components/ContentProvider.tsx`.
- `app/page.tsx` is a Server Component that fetches content and provides it; Hero, Skills, Timeline, Process, Contact, Footer read from `useContent()`.
- Made content **real-time**: `force-dynamic` + `cache: "no-store"` so admin edits show on the next refresh (was 60s ISR).

**Custom admin panel** — `app/admin/page.tsx`
- On-brand dark/monospace panel (like your onurravli.com reference): login, sidebar, live-save.
- Editors for **every** section: Hero, Stats, Skills (colour + skill chips), Experience, Process, Projects (colour + Featured/Active toggles), Contact.
- Fixed a bug where switching between same-type editors showed stale data (now remounts per section).

---

## 🌐 Live URLs & repos

| Thing | Value |
| --- | --- |
| Frontend (Vercel) | https://portfolio-xi-puce-79.vercel.app |
| Admin panel | https://portfolio-xi-puce-79.vercel.app/admin |
| Backend (Railway) | https://web-production-88e8b.up.railway.app |
| Content API | `…railway.app/api/content/` |
| Frontend repo | `github.com/omurravli/portfolio` |
| Backend repo | `github.com/omurravli/portfolio-backend` |
| Admin login | your Railway superuser (username `omurravli`) |

---

## 🔑 Deployment config (env vars)

**Vercel (frontend)** — both point at the Railway backend:
- `NEXT_PUBLIC_API_URL = https://web-production-88e8b.up.railway.app`  (browser → admin panel)
- `CONTENT_API_URL     = https://web-production-88e8b.up.railway.app`  (server → content)
- ⚠️ These are baked in at **build time** — after changing them you must **redeploy**.

**Railway (backend):**
- `SECRET_KEY` = (set), `DEBUG=false`
- `ALLOWED_HOSTS = web-production-88e8b.up.railway.app` (hostname only, no scheme)
- `CSRF_TRUSTED_ORIGINS = https://web-production-88e8b.up.railway.app` (with scheme, no slash)
- `CORS_ALLOWED_ORIGINS = https://portfolio-xi-puce-79.vercel.app` (with scheme, **no trailing slash**)
- `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
- Start command: `python manage.py migrate && gunicorn config.wsgi --bind 0.0.0.0:$PORT`

---

## 💻 Local dev

```bash
# backend (Django, SQLite locally)
cd backend
.venv/bin/python manage.py runserver          # http://127.0.0.1:8000  (admin: /admin)
# local test login: admin / devpassword123   (LOCAL sqlite only — not production)

# frontend (Next.js)
npm run dev                                    # http://localhost:3000  (admin: /admin)
```
`.env.local` already points `CONTENT_API_URL` + `NEXT_PUBLIC_API_URL` at `http://127.0.0.1:8000`.

---

## ⏭️ START HERE TOMORROW

1. **Push the latest admin panel** (all section editors + the remount fix are done locally but NOT pushed):
   ```bash
   git add app/admin/page.tsx app/page.tsx lib/content.ts
   git commit -m "Admin: editors for all sections + real-time content"
   git push
   ```
   → Vercel redeploys. Then open `/admin` and confirm all sections (Skills, Experience, Process, Projects, Contact) work in production.
2. **Revert the test edits** still in the live backend: on the Hero screen, change the name back from `Ömür Ravlı Deneme` → `Ömür Ravlı`, and the badge from `…TÜRKİYEaaaaa` → `SYSTEMS ONLINE — KAYSERI, TÜRKİYE`. Save.
3. Do a full pass editing each section to make sure everything saves + shows live.

---

## ❓ Open decisions (were mid-discussion)

- **Move everything to Vercel, drop Railway?** You asked about this. It's doable but a *backend rewrite*: replace Django with Next.js API routes + a Vercel Postgres (Neon). Upside: one platform, no CORS, no Railway pain. The custom admin UI stays as-is. → decide, then I can do the migration.
- **Projects source:** the live Projects section currently shows your **GitHub repos** (Option B). The admin "Projects" editor edits a separate curated list that does NOT show on the site yet. Options: keep GitHub, or "flip to curated" so the editor drives the section.

---

## ⚠️ Gotchas / notes

- Real-time works because the homepage is now **dynamic** (fetches the backend on every load). Fine for a portfolio; if you later want it cached + instant, the upgrade is on-demand revalidation.
- If `/admin` login rejects a correct password → check `NEXT_PUBLIC_API_URL` is set in Vercel **and** you redeployed, and that a superuser exists in the **Railway** DB (local ones don't count — create via `railway ssh` → `python manage.py createsuperuser`).
- Django admin (Unfold) still exists at `…railway.app/admin/` as a backup, but the custom `/admin` on the site is the one to use.
