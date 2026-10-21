/**
 * Channel Guardian prototype data.
 * Simulation only — no YouTube account is connected and no live channel data
 * is read or changed. All metrics below are invented demo numbers.
 */

import { DEMO_VIDEOS, type DemoVideo } from "@/lib/playlists";

export type Health = "attention" | "watch" | "healthy";
export type Priority = "high" | "medium" | "low";

export type GuardianMetrics = {
  views: string;
  ctr: string;
  retention: string;
  watchTime: string;
  engagement: string;
};

export type RepairKind = "title-thumbnail" | "hook" | "follow-up";

export type MonitoredVideo = {
  id: string;
  health: Health;
  priority: Priority;
  metrics: GuardianMetrics;
  /** Plain-language one-liner shown on the monitoring card. */
  summary: string;
  /** The metric driving the alert. */
  metric: string;
  current: string;
  benchmark: string;
  difference: string;
  diagnosis: string;
  confidence: string;
  cause: string[];
  repairKind: RepairKind;
  recommendation: string;
  estimatedEffect: string;
  currentTitleNote: string;
  recommendedTitle?: string;
  currentThumbnail?: string;
  recommendedThumbnail?: string;
  currentHook?: string;
  recommendedHook?: string;
  followUp?: { title: string; hook: string; concept: string };
};

/** Only published demo videos are monitored — Guardian starts after publishing. */
export function publishedDemoVideos(): DemoVideo[] {
  return DEMO_VIDEOS.filter((v) => v.status === "published");
}

export const MONITORED: MonitoredVideo[] = [
  {
    id: "v1",
    health: "attention",
    priority: "high",
    metrics: {
      views: "128K",
      ctr: "2.1%",
      retention: "44%",
      watchTime: "3,910 hrs",
      engagement: "3.2%",
    },
    summary:
      "Plenty of people are being shown this video, but very few are choosing to click it.",
    metric: "Click-through rate",
    current: "2.1%",
    benchmark: "5.0%",
    difference: "2.9 points below benchmark",
    diagnosis:
      "This video is getting shown to a large audience, yet only about two people in a hundred click it. That points at the packaging — the thumbnail and title — rather than the video itself, because the people who do watch stay a reasonable amount of time.",
    confidence: "High confidence (simulated)",
    cause: [
      "The thumbnail is visually weak and hard to read at small sizes.",
      "The title states a fact instead of creating curiosity.",
      "The title and thumbnail repeat each other instead of working together.",
    ],
    repairKind: "title-thumbnail",
    recommendation:
      "Replace the title with a curiosity-driven version and pair it with a high-contrast face-and-text thumbnail.",
    estimatedEffect: "Simulated estimate: click-through rate 2.1% → 4.6%",
    currentTitleNote: "5 Stoic Habits That Rewire Your Mind",
    recommendedTitle: "The Stoic Habit That Broke My Bad Days",
    currentThumbnail:
      "Dark statue photo with small centred text — low contrast, unreadable on phones.",
    recommendedThumbnail:
      "Tight close-up with a sharp blue rim light, three bold words on the left, one clear focal point.",
  },
  {
    id: "v2",
    health: "attention",
    priority: "medium",
    metrics: {
      views: "94K",
      ctr: "5.4%",
      retention: "28%",
      watchTime: "2,140 hrs",
      engagement: "2.4%",
    },
    summary:
      "People click this video happily, then leave in the first minute — the opening is losing them.",
    metric: "Average audience retention",
    current: "28%",
    benchmark: "45%",
    difference: "17 points below benchmark",
    diagnosis:
      "The click-through rate is healthy, so the packaging is doing its job. Viewers drop out early instead, which usually means the opening takes too long to deliver what the title promised.",
    confidence: "Medium confidence (simulated)",
    cause: [
      "The opening spends too long setting the scene before the point arrives.",
      "The hook does not restate the promise made by the title.",
      "The first payoff arrives after the point where most viewers leave.",
    ],
    repairKind: "hook",
    recommendation:
      "Rewrite the first fifteen seconds so the promise lands immediately, then tighten pacing by cutting the slow introduction.",
    estimatedEffect: "Simulated estimate: retention 28% → 41%",
    currentTitleNote: "The Psychology of Staying Calm Under Pressure",
    currentHook:
      "Welcome back to the channel. Today we're going to talk about something that has fascinated psychologists for a very long time...",
    recommendedHook:
      "Under real pressure, your body decides before you do. Here is the ninety-second reset that puts you back in charge.",
  },
  {
    id: "v3",
    health: "healthy",
    priority: "low",
    metrics: {
      views: "212K",
      ctr: "7.8%",
      retention: "52%",
      watchTime: "9,480 hrs",
      engagement: "6.1%",
    },
    summary:
      "This video is outperforming the rest of the channel — worth building a follow-up on it.",
    metric: "Overall performance",
    current: "7.8% click-through, 52% retention",
    benchmark: "5.0% click-through, 45% retention",
    difference: "Ahead of benchmark on both measures",
    diagnosis:
      "Strong packaging and a strong opening are working together here. The topic is concrete, the promise is easy to understand, and viewers stay past the halfway mark, which is why it keeps being recommended.",
    confidence: "High confidence (simulated)",
    cause: [
      "A clear, practical promise viewers already care about.",
      "The payoff starts early and keeps arriving.",
    ],
    repairKind: "follow-up",
    recommendation:
      "Publish a follow-up that continues the same idea while the topic is still being recommended.",
    estimatedEffect: "Simulated estimate: a follow-up typically retains 60–70% of this audience",
    currentTitleNote: "Why Discipline Beats Motivation Every Time",
    followUp: {
      title: "Discipline Without Willpower: The 3-Rule System",
      hook: "Motivation lost. Discipline won. Now here is how to run discipline on the days you feel nothing at all.",
      concept:
        "A practical sequel that turns the winning idea into a repeatable system: three rules, one worked example each, and a short closing challenge that points back at the original video.",
    },
  },
  {
    id: "v5",
    health: "watch",
    priority: "low",
    metrics: {
      views: "301K",
      ctr: "4.6%",
      retention: "43%",
      watchTime: "12,050 hrs",
      engagement: "4.0%",
    },
    summary:
      "Steady numbers, slightly under benchmark on clicks — worth watching, no repair needed yet.",
    metric: "Click-through rate",
    current: "4.6%",
    benchmark: "5.0%",
    difference: "0.4 points below benchmark",
    diagnosis:
      "This video performs close to the channel benchmark. The gap is small enough that it may simply be normal variation, so Guardian is watching it rather than recommending a change.",
    confidence: "Low confidence (simulated)",
    cause: ["Normal variation between similar videos on the channel."],
    repairKind: "title-thumbnail",
    recommendation:
      "No repair recommended yet. If clicks keep sliding, refresh the thumbnail text first.",
    estimatedEffect: "Simulated estimate: little to no change from a repair today",
    currentTitleNote: "3 Money Rules Nobody Teaches You",
    recommendedTitle: "3 Money Rules Nobody Teaches You (Rule 2 Hurts)",
    currentThumbnail: "Stacked coins with a plain white number three.",
    recommendedThumbnail:
      "Same coins, but the number three replaced by two bold words and a blue underline for contrast.",
  },
  {
    id: "v8",
    health: "watch",
    priority: "medium",
    metrics: {
      views: "88K",
      ctr: "3.9%",
      retention: "38%",
      watchTime: "2,760 hrs",
      engagement: "2.9%",
    },
    summary:
      "Clicks and retention are both drifting below benchmark — a title refresh is the cheapest first fix.",
    metric: "Click-through rate",
    current: "3.9%",
    benchmark: "5.0%",
    difference: "1.1 points below benchmark",
    diagnosis:
      "Both packaging and opening are slightly soft. Because the packaging decides whether anyone arrives at all, Guardian recommends fixing the title and thumbnail first and measuring again before touching the edit.",
    confidence: "Medium confidence (simulated)",
    cause: [
      "The title assumes viewers already know who the subject is.",
      "The thumbnail has no single clear focal point.",
    ],
    repairKind: "title-thumbnail",
    recommendation:
      "Rewrite the title around the lesson rather than the name, and simplify the thumbnail to one subject and three words.",
    estimatedEffect: "Simulated estimate: click-through rate 3.9% → 5.2%",
    currentTitleNote: "What Marcus Aurelius Knew About Failure",
    recommendedTitle: "The Failure Rule That Ran an Empire",
    currentThumbnail: "Wide marble bust on a busy background, small caption text.",
    recommendedThumbnail:
      "Cropped bust on a flat navy field, three gold words stacked to the right.",
  },
];

/* ---------------------------- Simulated state ---------------------------- */

export type GuardianMode = "approval" | "full" | "paused";

export type AppliedRepair = {
  videoId: string;
  kind: RepairKind;
  title?: string | undefined;
  thumbnail?: string | undefined;
  hook?: string | undefined;
  appliedAt: string; // ISO
};

export type HistoryEntry = {
  id: string;
  at: string; // ISO
  videoId: string;
  videoTitle: string;
  problem: string;
  recommendation: string;
  approval: string;
  action: string;
  result: string;
  /** Undo is offered only for apply entries that are still in effect. */
  undoable: boolean;
  kind: "apply" | "undo" | "idea";
};

export type GuardianState = {
  mode: GuardianMode;
  repairs: AppliedRepair[];
  history: HistoryEntry[];
};

const KEY = "faceless-guardian";

export const EMPTY_STATE: GuardianState = {
  mode: "approval",
  repairs: [],
  history: [],
};

export function loadGuardian(): GuardianState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<GuardianState>;
    return {
      mode: parsed.mode ?? "approval",
      repairs: Array.isArray(parsed.repairs) ? parsed.repairs : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveGuardian(state: GuardianState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* prototype only — ignore storage failures */
  }
}

export function newEntryId(): string {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function formatStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const HEALTH_LABEL: Record<Health, string> = {
  attention: "Needs Attention",
  watch: "Watch",
  healthy: "Healthy",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

/** Simulated channel-level summary numbers. */
export const CHANNEL_SUMMARY = {
  score: 68,
  status: "Needs Attention",
  lastScan: "Today, 09:20",
  nextScan: "Today, 21:20",
  views: "823K",
  ctr: "4.8%",
  retention: "41%",
  watchTime: "30,340 hrs",
  engagement: "3.7%",
  subscriberChange: "+2,140",
};
