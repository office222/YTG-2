/**
 * Playlist prototype data.
 * Simulated demo data only — no live YouTube connection.
 * Persisted in localStorage so the prototype feels real between visits.
 */

export type Visibility = "public" | "unlisted" | "private";

export const VISIBILITY_OPTIONS: { value: Visibility; label: string; blurb: string }[] = [
  { value: "public", label: "Public", blurb: "Anyone can find and watch it." },
  { value: "unlisted", label: "Unlisted", blurb: "Only people with the link." },
  { value: "private", label: "Private", blurb: "Only you can see it." },
];

export type VideoStatus =
  | "draft"
  | "ready"
  | "published"
  | "attention"
  | "scheduled"
  | "ready-publication";

export const VIDEO_STATUS_OPTIONS: { value: VideoStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "published", label: "Published" },
  { value: "attention", label: "Needs Attention" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ready-publication", label: "Ready for Publication" },
];

export function videoStatusLabel(s: VideoStatus): string {
  if (s === "ready-publication") return "Ready for Publication — Not Published";
  return VIDEO_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? "Draft";
}

export type DemoVideo = {
  id: string;
  title: string;
  duration: string;
  views: string;
  published: string;
  status: VideoStatus;
  visibility: Visibility;
  channel: string;
  /** Extra detail captured when a video is created through the simulated
   *  Video Studio → Prepare for YouTube flow. Absent on seeded demo videos. */
  description?: string;
  hashtags?: string;
  tags?: string;
  cta?: string;
  playlist?: string;
  videoType?: string;
  productionLevel?: string;
  thumbnailConcept?: string;
  scheduledAt?: string;
};

const DEMO_CHANNEL = "Stoic Wealth";

/** Demo videos — the same set surfaced as "My Videos" in the prototype. */
export const DEMO_VIDEOS: DemoVideo[] = [
  { id: "v1", title: "5 Stoic Habits That Rewire Your Mind", duration: "8:42", views: "128K", published: "2 days ago", status: "published", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v2", title: "The Psychology of Staying Calm Under Pressure", duration: "11:05", views: "94K", published: "6 days ago", status: "published", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v3", title: "Why Discipline Beats Motivation Every Time", duration: "7:19", views: "212K", published: "2 weeks ago", status: "published", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v4", title: "How Ancient Rome Built Wealth From Nothing", duration: "14:31", views: "76K", published: "3 weeks ago", status: "ready", visibility: "unlisted", channel: DEMO_CHANNEL },
  { id: "v5", title: "3 Money Rules Nobody Teaches You", duration: "9:56", views: "301K", published: "1 month ago", status: "published", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v6", title: "The Quiet Power of Doing Less", duration: "6:48", views: "58K", published: "1 month ago", status: "draft", visibility: "private", channel: DEMO_CHANNEL },
  { id: "v7", title: "Sleep Like a Monk: A Simple Night Routine", duration: "10:22", views: "142K", published: "2 months ago", status: "attention", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v8", title: "What Marcus Aurelius Knew About Failure", duration: "12:07", views: "88K", published: "2 months ago", status: "published", visibility: "public", channel: DEMO_CHANNEL },
  { id: "v9", title: "Focus Deep: A 90-Minute Work Blueprint", duration: "13:44", views: "67K", published: "3 months ago", status: "draft", visibility: "private", channel: DEMO_CHANNEL },
  { id: "v10", title: "The Truth About Overnight Success", duration: "8:03", views: "175K", published: "3 months ago", status: "ready", visibility: "unlisted", channel: DEMO_CHANNEL },
];

export function videoById(id: string): DemoVideo | undefined {
  return allVideos().find((v) => v.id === id);
}

/* ---------- Videos created in the simulated Video Studio flow ---------- */

const CREATED_VIDEOS_KEY = "faceless-created-videos";

export function loadCreatedVideos(): DemoVideo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CREATED_VIDEOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as DemoVideo[];
  } catch {
    return [];
  }
}

/** Persist a video created through the simulated Prepare for YouTube flow.
 *  Newest first so it appears at the top of My Videos. */
export function saveCreatedVideo(video: DemoVideo) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCreatedVideos().filter((v) => v.id !== video.id);
    window.localStorage.setItem(
      CREATED_VIDEOS_KEY,
      JSON.stringify([video, ...existing]),
    );
  } catch {
    /* prototype only — ignore storage failures */
  }
}

/** Update an existing studio-created video in place, keeping its position.
 *  Identified by stable id — never by title. Unedited fields are preserved. */
export function updateCreatedVideo(
  id: string,
  patch: Partial<DemoVideo>,
): DemoVideo | undefined {
  if (typeof window === "undefined") return undefined;
  const list = loadCreatedVideos();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return undefined;
  const existing = list[idx];
  if (!existing) return undefined;
  const updated: DemoVideo = { ...existing, ...patch, id: existing.id };
  const next = [...list];
  next[idx] = updated;
  try {
    window.localStorage.setItem(CREATED_VIDEOS_KEY, JSON.stringify(next));
  } catch {
    /* prototype only — ignore storage failures */
  }
  return updated;
}

/** Studio-created videos use `sv-` ids; demo seeds use `v#`. */
export function isCreatedVideo(id: string): boolean {
  return id.startsWith("sv-");
}

export function createdVideoById(id: string): DemoVideo | undefined {
  return loadCreatedVideos().find((v) => v.id === id);
}

/** All videos for My Videos: simulated studio creations first, then demo seeds. */
export function allVideos(): DemoVideo[] {
  return [...loadCreatedVideos(), ...DEMO_VIDEOS];
}

export function newCreatedVideoId(): string {
  return `sv-${Date.now().toString(36)}`;
}

export type Playlist = {
  id: string;
  title: string;
  description: string;
  visibility: Visibility;
  videoIds: string[];
  updatedAt: string; // ISO date
};

const STORAGE_KEY = "faceless-playlists";

const SEED: Playlist[] = [
  {
    id: "p1",
    title: "Stoic Mindset Essentials",
    description: "The core videos every new viewer should start with.",
    visibility: "public",
    videoIds: ["v1", "v3", "v8", "v6"],
    updatedAt: "2026-08-28T10:00:00.000Z",
  },
  {
    id: "p2",
    title: "Money & Discipline",
    description: "Practical money habits paired with the discipline to keep them.",
    visibility: "unlisted",
    videoIds: ["v5", "v3", "v10"],
    updatedAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "p3",
    title: "Deep Work Drafts",
    description: "Work-in-progress focus series — not published yet.",
    visibility: "private",
    videoIds: ["v9", "v7"],
    updatedAt: "2026-09-02T10:00:00.000Z",
  },
];

export function loadPlaylists(): Playlist[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed as Playlist[];
  } catch {
    return SEED;
  }
}

export function savePlaylists(playlists: Playlist[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  } catch {
    /* prototype only — ignore storage failures */
  }
}

export function newPlaylistId(): string {
  return `p${Date.now().toString(36)}`;
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function visibilityLabel(v: Visibility): string {
  return VISIBILITY_OPTIONS.find((o) => o.value === v)?.label ?? "Private";
}

export function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return list;
  next.splice(to, 0, moved);
  return next;
}
