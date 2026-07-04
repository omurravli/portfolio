"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "or_admin_token";
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

async function api(path: string, init: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || `Error ${res.status}`);
  return res.status === 204 ? null : res.json();
}

async function login(username: string, password: string) {
  const res = await fetch(`${API}/api/admin/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid username or password.");
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
}

/* ---------------------------------------------------------------- icons */
const ic = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d={d} />
  </svg>
);
const ICONS: Record<string, JSX.Element> = {
  hero: ic("M4 20v-6a8 8 0 0 1 16 0v6M4 20h16M9 8h.01M15 8h.01"),
  stats: ic("M4 20V10M10 20V4M16 20v-8M22 20H2"),
  skills: ic("M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"),
  timeline: ic("M12 3v18M12 6h7M12 12h5M12 18h7"),
  process: ic("M5 7h5v5H5zM14 12h5v5h-5zM10 9h4M12 12v0"),
  projects: ic("M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7"),
  contact: ic("M4 6h16v12H4zM4 7l8 6 8-6"),
};

const SECTIONS = [
  {
    group: "Content",
    items: [
      { id: "hero", label: "Hero" },
      { id: "stats", label: "Stats" },
      { id: "skills", label: "Skills", soon: true },
      { id: "timeline", label: "Experience", soon: true },
      { id: "process", label: "Process", soon: true },
    ],
  },
  {
    group: "Links & Media",
    items: [
      { id: "projects", label: "Projects", soon: true },
      { id: "contact", label: "Contact", soon: true },
    ],
  },
];

/* ---------------------------------------------------------------- shared ui */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline gap-2 font-mono text-[11px] tracking-wide text-zinc-400">
        {label}
        {hint && <span className="text-zinc-600">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none transition focus:border-neon-violet/60 focus:bg-white/[0.05]";

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
      <span className="font-mono text-[11px] text-zinc-500">
        {saved ? "✓ Saved — changes are live on the site." : "Changes are applied live on the site."}
      </span>
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-white px-6 py-2 font-mono text-sm font-medium text-black transition hover:brightness-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- editors */
function StatsEditor() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => api("/admin/stats/").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const set = (i: number, key: string, val: any) => {
    setSaved(false);
    setRows((r) => r!.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  };
  const add = async () => {
    await api("/admin/stats/", {
      method: "POST",
      body: JSON.stringify({ value: 0, suffix: "+", label: "New stat", order: (rows?.length || 0) }),
    });
    load();
  };
  const remove = async (id: number) => {
    await api(`/admin/stats/${id}/`, { method: "DELETE" });
    load();
  };
  const save = async () => {
    if (!rows) return;
    setSaving(true);
    try {
      await Promise.all(
        rows.map((r) =>
          api(`/admin/stats/${r.id}/`, {
            method: "PATCH",
            body: JSON.stringify({ value: Number(r.value), suffix: r.suffix, label: r.label }),
          }),
        ),
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!rows) return <p className="font-mono text-sm text-zinc-500">Loading…</p>;

  return (
    <div>
      <p className="mb-5 max-w-lg text-sm text-zinc-500">
        The animated counters in the hero. Change a number and hit Save — e.g. how many mobile apps
        or IoT prototypes you&apos;ve built.
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-end gap-3">
            <div className="w-24">
              <Field label="Value">
                <input
                  type="number"
                  value={r.value}
                  onChange={(e) => set(i, "value", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="w-20">
              <Field label="Suffix">
                <input value={r.suffix} onChange={(e) => set(i, "suffix", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Label">
                <input value={r.label} onChange={(e) => set(i, "label", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <button
              onClick={() => remove(r.id)}
              aria-label="Delete stat"
              className="mb-1 rounded-lg border border-white/10 px-3 py-2.5 font-mono text-xs text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-4 rounded-lg border border-dashed border-white/15 px-4 py-2 font-mono text-xs text-zinc-400 transition hover:border-neon-cyan/50 hover:text-white"
      >
        + Add stat
      </button>
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

function HeroEditor() {
  const [data, setData] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/admin/profile/").then(setData);
  }, []);

  const set = (key: string, val: any) => {
    setSaved(false);
    setData((d: any) => ({ ...d, [key]: val }));
  };
  const save = async () => {
    setSaving(true);
    try {
      await api("/admin/profile/", { method: "PATCH", body: JSON.stringify(data) });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <p className="font-mono text-sm text-zinc-500">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <Field label="Name" hint="shown in the hero + footer">
        <input value={data.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
      </Field>
      <Field label="Role" hint="your title">
        <input value={data.role} onChange={(e) => set("role", e.target.value)} className={inputCls} />
      </Field>
      <Field label="Badge" hint="the pill above the headline">
        <input value={data.hero_badge} onChange={(e) => set("hero_badge", e.target.value)} className={inputCls} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Headline — lead" hint='e.g. "Ömür Ravlı builds where"'>
          <input value={data.hero_heading_lead} onChange={(e) => set("hero_heading_lead", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Headline — accent" hint="the gradient words">
          <input value={data.hero_heading_accent} onChange={(e) => set("hero_heading_accent", e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Subtitle" hint="paragraph under the headline">
        <textarea rows={3} value={data.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} className={`${inputCls} resize-none`} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email"><input value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
        <Field label="CV URL"><input value={data.cv_url} onChange={(e) => set("cv_url", e.target.value)} className={inputCls} /></Field>
        <Field label="GitHub"><input value={data.github} onChange={(e) => set("github", e.target.value)} className={inputCls} /></Field>
        <Field label="LinkedIn"><input value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inputCls} /></Field>
      </div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
      <p className="font-mono text-sm text-zinc-400">{label} editor</p>
      <p className="mt-1 font-mono text-xs text-zinc-600">Coming next — same live-edit pattern as Stats & Hero.</p>
    </div>
  );
}

/* ---------------------------------------------------------------- shell */
function Shell({ username, onSignOut }: { username: string; onSignOut: () => void }) {
  const [active, setActive] = useState("hero");
  const activeItem = SECTIONS.flatMap((s) => s.items).find((i) => i.id === active)!;

  return (
    <div className="flex min-h-screen bg-void text-zinc-200">
      {/* sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/[0.06] bg-ink">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="font-display text-lg font-bold text-white">
            ÖR<span className="text-neon-cyan">.</span>
          </span>
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">ADMIN</span>
        </div>
        <nav className="flex-1 space-y-6 px-3 py-2">
          {SECTIONS.map((s) => (
            <div key={s.group}>
              <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                {s.group}
              </p>
              <div className="space-y-0.5">
                {s.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 font-mono text-[13px] transition ${
                      active === item.id
                        ? "bg-white/[0.06] text-white"
                        : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                    }`}
                  >
                    <span className={active === item.id ? "text-neon-violet" : "text-zinc-500"}>
                      {ICONS[item.id]}
                    </span>
                    {item.label}
                    {(item as any).soon && (
                      <span className="ml-auto font-mono text-[8px] tracking-wider text-zinc-600">SOON</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-4">
          <span className="font-mono text-[11px] text-zinc-400">{username}</span>
          <button onClick={onSignOut} className="font-mono text-[11px] text-zinc-500 transition hover:text-white">
            Sign out
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1">
        <header className="flex items-center gap-2 border-b border-white/[0.06] px-8 py-4">
          <span className="text-neon-violet">{ICONS[active]}</span>
          <h1 className="font-mono text-sm tracking-wide text-white">{activeItem.label}</h1>
        </header>
        <div className="px-8 py-8">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 md:p-8">
            {active === "hero" && <HeroEditor />}
            {active === "stats" && <StatsEditor />}
            {(activeItem as any).soon && <Placeholder label={activeItem.label} />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- login */
function LoginView({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(u, p);
      const me = await api("/admin/me/");
      onSuccess(me.username);
    } catch (e: any) {
      setErr(e?.message?.slice(0, 120) || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6 text-zinc-200">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-6">
          <p className="font-mono text-[11px] tracking-[0.3em] text-zinc-500">SITE ADMIN</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">
            ÖR<span className="text-neon-cyan">.</span> control panel
          </h1>
        </div>
        <div className="space-y-4">
          <Field label="Username">
            <input value={u} onChange={(e) => setU(e.target.value)} autoFocus className={inputCls} />
          </Field>
          <Field label="Password">
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} className={inputCls} />
          </Field>
          {err && <p className="font-mono text-xs text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan py-2.5 font-mono text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in →"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- root */
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      if (!getToken()) {
        setAuthed(false);
        return;
      }
      try {
        const me = await api("/admin/me/");
        setUsername(me.username);
        setAuthed(true);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setAuthed(false);
      }
    })();
  }, []);

  if (authed === null)
    return (
      <div className="flex min-h-screen items-center justify-center bg-void font-mono text-sm text-zinc-500">
        Loading…
      </div>
    );
  if (!authed)
    return (
      <LoginView
        onSuccess={(u) => {
          setUsername(u);
          setAuthed(true);
        }}
      />
    );
  return (
    <Shell
      username={username}
      onSignOut={() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthed(false);
      }}
    />
  );
}
