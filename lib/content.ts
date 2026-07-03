import {
  processStages as fallbackProcess,
  profile as fallbackProfile,
  skillCategories as fallbackSkills,
  stats as fallbackStats,
  timeline as fallbackTimeline,
} from "@/lib/data";

export interface Hero {
  badge: string;
  headingLead: string;
  headingAccent: string;
  subtitle: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  university: string;
  email: string;
  github: string;
  linkedin: string;
  cv_url: string;
  hero: Hero;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SkillCategory {
  id: number | string;
  label: string;
  color: string;
  skills: string[];
}

export interface TimelineEntry {
  title: string;
  context: string;
  description: string;
  tag: string;
}

export interface ProcessStage {
  id: number | string;
  title: string;
  blurb: string;
}

export interface Content {
  profile: Profile;
  stats: Stat[];
  skillCategories: SkillCategory[];
  timeline: TimelineEntry[];
  processStages: ProcessStage[];
}

// Used for the very first render and whenever the backend is unavailable, so
// the site is always fully populated even with no API configured.
export const fallbackContent: Content = {
  profile: {
    ...fallbackProfile,
    cv_url: "",
    hero: {
      badge: "SYSTEMS ONLINE — KAYSERI, TÜRKİYE",
      headingLead: "Ömür Ravlı builds where",
      headingAccent: "software meets machines",
      subtitle:
        "Mechanical engineering student and multidisciplinary developer creating mobile apps, IoT systems, ML workflows, drone projects, optimization tools, and modern web experiences.",
    },
  },
  stats: fallbackStats,
  skillCategories: fallbackSkills,
  timeline: fallbackTimeline,
  processStages: fallbackProcess,
};

/**
 * Fetch editable site content from the Django backend (server-side, with ISR).
 * Falls back to the bundled content if CONTENT_API_URL is unset or the request
 * fails, so the site never breaks when the backend is down.
 */
export async function getContent(): Promise<Content> {
  const base = process.env.CONTENT_API_URL;
  if (!base) return fallbackContent;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/content/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackContent;
    const d = await res.json();
    return {
      profile: d.profile ?? fallbackContent.profile,
      stats: d.stats?.length ? d.stats : fallbackContent.stats,
      skillCategories: d.skillCategories?.length ? d.skillCategories : fallbackContent.skillCategories,
      timeline: d.timeline?.length ? d.timeline : fallbackContent.timeline,
      processStages: d.processStages?.length ? d.processStages : fallbackContent.processStages,
    };
  } catch {
    return fallbackContent;
  }
}
