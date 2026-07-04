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
      { id: "skills", label: "Skills" },
      { id: "timeline", label: "Experience" },
      { id: "process", label: "Process" },
    ],
  },
  {
    group: "Links & Media",
    items: [
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
  },
];

/* ---------------------------------------------------------------- field configs */
type FieldDef = {
  key: string;
  label: string;
  hint?: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "color";
  span?: number; // 1..6
};

const HERO_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", hint: "shown in the hero + footer", span: 6 },
  { key: "role", label: "Role", hint: "your title", span: 6 },
  { key: "hero_badge", label: "Badge", hint: "the pill above the headline", span: 6 },
  { key: "hero_heading_lead", label: "Headline — lead", hint: 'e.g. "Ömür Ravlı builds where"', span: 3 },
  { key: "hero_heading_accent", label: "Headline — accent", hint: "the gradient words", span: 3 },
  { key: "hero_subtitle", label: "Subtitle", hint: "paragraph under the headline", type: "textarea", span: 6 },
];

const CONTACT_FIELDS: FieldDef[] = [
  { key: "email", label: "Email", span: 6 },
  { key: "github", label: "GitHub", hint: "profile URL", span: 3 },
  { key: "linkedin", label: "LinkedIn", hint: "profile URL", span: 3 },
  { key: "cv_url", label: "CV URL", hint: "link to your CV/résumé", span: 6 },
];

const STATS_FIELDS: FieldDef[] = [
  { key: "value", label: "Value", type: "number", span: 1 },
  { key: "suffix", label: "Suffix", span: 1 },
  { key: "label", label: "Label", span: 4 },
];

const TIMELINE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span: 3 },
  { key: "tag", label: "Tag", hint: "badge, e.g. MOBILE", span: 3 },
  { key: "context", label: "Context", hint: "org / where / when", span: 6 },
  { key: "description", label: "Description", type: "textarea", span: 6 },
];

const PROCESS_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span: 2 },
  { key: "blurb", label: "Blurb", hint: "one short line", span: 4 },
];

const PROJECT_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span: 3 },
  { key: "status", label: "Status", hint: "e.g. IN DEVELOPMENT", span: 3 },
  { key: "system", label: "System", hint: "e.g. MOBILE / AI SYSTEM", span: 4 },
  { key: "accent", label: "Accent", type: "color", span: 2 },
  { key: "description", label: "Description", type: "textarea", span: 6 },
  { key: "stack", label: "Stack", hint: "comma-separated", span: 4 },
  { key: "url", label: "URL", span: 6 },
  { key: "featured", label: "Featured", type: "checkbox", span: 3 },
  { key: "is_active", label: "Active", type: "checkbox", span: 3 },
];

/* ---------------------------------------------------------------- shared ui */
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none transition focus:border-neon-violet/60 focus:bg-white/[0.05]";
const SPAN: Record<number, string> = {
  1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-3",
  4: "sm:col-span-4", 5: "sm:col-span-5", 6: "sm:col-span-6",
};

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.type === "textarea")
    return <textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} />;
  if (field.type === "number")
    return <input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
  if (field.type === "color")
    return (
      <input
        type="color"
        value={value || "#8b5cf6"}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] w-full cursor-pointer rounded-lg border border-white/10 bg-white/[0.03]"
      />
    );
  if (field.type === "checkbox")
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`flex h-[42px] w-full items-center gap-2 rounded-lg border px-3 font-mono text-xs transition ${
          value ? "border-neon-cyan/40 text-neon-cyan" : "border-white/10 text-zinc-500"
        }`}
      >
        <span className={`h-3 w-3 rounded-sm border ${value ? "border-neon-cyan bg-neon-cyan/30" : "border-white/20"}`} />
        {value ? "On" : "Off"}
      </button>
    );
  return <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

function FieldGrid({ fields, data, set }: { fields: FieldDef[]; data: any; set: (k: string, v: any) => void }) {
  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-4">
      {fields.map((f) => (
        <label key={f.key} className={`col-span-6 ${SPAN[f.span || 6]}`}>
          <span className="mb-2 flex items-baseline gap-1.5 font-mono text-[11px] tracking-wide text-zinc-400">
            {f.label}
            {f.hint && <span className="text-zinc-600">— {f.hint}</span>}
          </span>
          <FieldInput field={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
        </label>
      ))}
    </div>
  );
}

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

function Loading() {
  return <p className="font-mono text-sm text-zinc-500">Loading…</p>;
}

/* ---------------------------------------------------------------- editors */
function ProfileEditor({ fields, note }: { fields: FieldDef[]; note?: string }) {
  const [data, setData] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/admin/profile/").then(setData);
  }, []);

  const set = (k: string, v: any) => {
    setSaved(false);
    setData((d: any) => ({ ...d, [k]: v }));
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

  if (!data) return <Loading />;
  return (
    <div className="max-w-2xl">
      {note && <p className="mb-5 text-sm text-zinc-500">{note}</p>}
      <FieldGrid fields={fields} data={data} set={set} />
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

function ListEditor({
  endpoint,
  fields,
  template,
  note,
  addLabel = "Add item",
}: {
  endpoint: string;
  fields: FieldDef[];
  template: any;
  note?: string;
  addLabel?: string;
}) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => api(endpoint).then(setRows);
  useEffect(() => {
    load();
  }, []);

  const setRow = (i: number, key: string, val: any) => {
    setSaved(false);
    setRows((r) => r!.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  };
  const add = async () => {
    await api(endpoint, { method: "POST", body: JSON.stringify({ ...template, order: rows?.length || 0 }) });
    load();
  };
  const remove = async (id: number) => {
    await api(`${endpoint}${id}/`, { method: "DELETE" });
    load();
  };
  const save = async () => {
    if (!rows) return;
    setSaving(true);
    try {
      await Promise.all(
        rows.map((r) => {
          const body: any = {};
          fields.forEach((f) => (body[f.key] = f.type === "number" ? Number(r[f.key]) : r[f.key]));
          return api(`${endpoint}${r.id}/`, { method: "PATCH", body: JSON.stringify(body) });
        }),
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!rows) return <Loading />;
  return (
    <div>
      {note && <p className="mb-5 max-w-xl text-sm text-zinc-500">{note}</p>}
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={r.id} className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 pr-12">
            <FieldGrid fields={fields} data={r} set={(k, v) => setRow(i, k, v)} />
            <button
              onClick={() => remove(r.id)}
              aria-label="Delete"
              className="absolute right-3 top-3 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
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
        + {addLabel}
      </button>
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

function SkillsEditor() {
  const [cats, setCats] = useState<any[] | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const [c, s] = await Promise.all([api("/admin/skill-categories/"), api("/admin/skills/")]);
    setCats(c);
    setSkills(s);
  };
  useEffect(() => {
    load();
  }, []);

  const setCat = (id: number, key: string, val: any) => {
    setSaved(false);
    setCats((cs) => cs!.map((c) => (c.id === id ? { ...c, [key]: val } : c)));
  };
  const setSkill = (id: number, val: string) => {
    setSaved(false);
    setSkills((ss) => ss.map((s) => (s.id === id ? { ...s, name: val } : s)));
  };
  const addCat = async () => {
    await api("/admin/skill-categories/", { method: "POST", body: JSON.stringify({ label: "New sector", color: "#8b5cf6", order: cats?.length || 0 }) });
    load();
  };
  const delCat = async (id: number) => {
    await api(`/admin/skill-categories/${id}/`, { method: "DELETE" });
    load();
  };
  const addSkill = async (catId: number, n: number) => {
    await api("/admin/skills/", { method: "POST", body: JSON.stringify({ category: catId, name: "New", order: n }) });
    load();
  };
  const delSkill = async (id: number) => {
    await api(`/admin/skills/${id}/`, { method: "DELETE" });
    load();
  };
  const save = async () => {
    if (!cats) return;
    setSaving(true);
    try {
      await Promise.all([
        ...cats.map((c) => api(`/admin/skill-categories/${c.id}/`, { method: "PATCH", body: JSON.stringify({ label: c.label, color: c.color }) })),
        ...skills.map((s) => api(`/admin/skills/${s.id}/`, { method: "PATCH", body: JSON.stringify({ name: s.name }) })),
      ]);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!cats) return <Loading />;
  return (
    <div>
      <p className="mb-5 max-w-xl text-sm text-zinc-500">
        The tech-galaxy sectors. Each sector has a colour and a list of skills.
      </p>
      <div className="space-y-4">
        {cats.map((c) => {
          const catSkills = skills.filter((s) => s.category === c.id);
          return (
            <div key={c.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={c.color}
                  onChange={(e) => setCat(c.id, "color", e.target.value)}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <input value={c.label} onChange={(e) => setCat(c.id, "label", e.target.value)} className={`${inputCls} flex-1`} />
                <button
                  onClick={() => delCat(c.id)}
                  aria-label="Delete sector"
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {catSkills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-3 pr-1.5">
                    <input
                      value={s.name}
                      onChange={(e) => setSkill(s.id, e.target.value)}
                      style={{ width: `${Math.max(4, s.name.length)}ch` }}
                      className="bg-transparent font-mono text-[11px] text-zinc-200 outline-none"
                    />
                    <button onClick={() => delSkill(s.id)} aria-label="Remove skill" className="text-zinc-600 transition hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => addSkill(c.id, catSkills.length)}
                  className="rounded-full border border-dashed border-white/15 px-3 py-1 font-mono text-[11px] text-zinc-400 transition hover:border-neon-cyan/50 hover:text-white"
                >
                  + skill
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={addCat}
        className="mt-4 rounded-lg border border-dashed border-white/15 px-4 py-2 font-mono text-xs text-zinc-400 transition hover:border-neon-cyan/50 hover:text-white"
      >
        + Add sector
      </button>
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

/* ---------------------------------------------------------------- shell */
function Editor({ id }: { id: string }) {
  switch (id) {
    case "hero":
      return <ProfileEditor fields={HERO_FIELDS} note="The headline block at the top of the site." />;
    case "stats":
      return (
        <ListEditor
          endpoint="/admin/stats/"
          fields={STATS_FIELDS}
          template={{ value: 0, suffix: "+", label: "New stat" }}
          note="The animated counters in the hero — e.g. how many mobile apps or IoT prototypes you've built."
          addLabel="Add stat"
        />
      );
    case "skills":
      return <SkillsEditor />;
    case "timeline":
      return (
        <ListEditor
          endpoint="/admin/timeline/"
          fields={TIMELINE_FIELDS}
          template={{ title: "New entry", context: "", description: "", tag: "NEW" }}
          note="Your experience / signal-path entries, top to bottom."
          addLabel="Add entry"
        />
      );
    case "process":
      return (
        <ListEditor
          endpoint="/admin/process/"
          fields={PROCESS_FIELDS}
          template={{ title: "New stage", blurb: "" }}
          note="The Idea → Ship pipeline stages."
          addLabel="Add stage"
        />
      );
    case "projects":
      return (
        <ListEditor
          endpoint="/admin/projects/"
          fields={PROJECT_FIELDS}
          template={{ title: "New project", system: "", status: "", description: "", stack: "", accent: "#8b5cf6", url: "", featured: false, is_active: true }}
          note="Curated projects. Note: the live Projects section currently pulls your GitHub repos, so these show only if you switch it to curated mode — ask me to flip it."
          addLabel="Add project"
        />
      );
    case "contact":
      return <ProfileEditor fields={CONTACT_FIELDS} note="Email, social links and CV — used in the contact section and footer." />;
    default:
      return null;
  }
}

function Shell({ username, onSignOut }: { username: string; onSignOut: () => void }) {
  const [active, setActive] = useState("hero");
  const activeItem = SECTIONS.flatMap((s) => s.items).find((i) => i.id === active)!;

  return (
    <div className="flex min-h-screen bg-void text-zinc-200">
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
              <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">{s.group}</p>
              <div className="space-y-0.5">
                {s.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 font-mono text-[13px] transition ${
                      active === item.id ? "bg-white/[0.06] text-white" : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                    }`}
                  >
                    <span className={active === item.id ? "text-neon-violet" : "text-zinc-500"}>{ICONS[item.id]}</span>
                    {item.label}
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

      <main className="flex-1">
        <header className="flex items-center gap-2 border-b border-white/[0.06] px-8 py-4">
          <span className="text-neon-violet">{ICONS[active]}</span>
          <h1 className="font-mono text-sm tracking-wide text-white">{activeItem.label}</h1>
        </header>
        <div className="px-8 py-8">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 md:p-8">
            {/* key forces a fresh mount per section so each editor re-fetches its own data */}
            <Editor key={active} id={active} />
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
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] tracking-wide text-zinc-400">Username</span>
            <input value={u} onChange={(e) => setU(e.target.value)} autoFocus className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] tracking-wide text-zinc-400">Password</span>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} className={inputCls} />
          </label>
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
    return <div className="flex min-h-screen items-center justify-center bg-void font-mono text-sm text-zinc-500">Loading…</div>;
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
