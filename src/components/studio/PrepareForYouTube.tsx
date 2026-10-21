import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  ListVideo,
  Lock,
  RotateCcw,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type DemoVideo,
  loadPlaylists,
  newCreatedVideoId,
  saveCreatedVideo,
} from "@/lib/playlists";
import { cn } from "@/lib/utils";

/**
 * Simulated PREPARE FOR YOUTUBE workflow for the Video Studio prototype.
 * Nothing here contacts YouTube, an AI/image provider, or a payment system.
 */

export type StudioVideoType =
  | "youtube-video"
  | "youtube-short"
  | "promo"
  | "how-to"
  | "before-after"
  | "faceless-decide";

type SuggestedDetails = {
  titles: { text: string; recommended?: boolean }[];
  description: string;
  hashtags: string[];
  tags: string[];
  cta: string;
  playlistName: string;
};

const TYPE_LABEL: Record<StudioVideoType, string> = {
  "youtube-video": "YouTube Video",
  "youtube-short": "YouTube Short",
  promo: "Promotional Video",
  "how-to": "How-To Video",
  "before-after": "Before-and-After Video",
  "faceless-decide": "FACELESS-recommended format",
};

function buildDetails(videoType: StudioVideoType): SuggestedDetails {
  switch (videoType) {
    case "youtube-short":
      return {
        titles: [
          { text: "One Habit That Changes Everything #shorts" },
          { text: "Watch This Before You Waste Another Year", recommended: true },
          { text: "The 60-Second Reset Your Mind Needs" },
        ],
        description:
          "A 60-second reset from the Stoic Wealth channel. One idea, one visual, one takeaway — built for the Shorts feed. Watch with the sound off: captions are burned in.\n\nSimulated description for the prototype — edit freely.",
        hashtags: ["#shorts", "#stoicism", "#selfimprovement", "#mindset"],
        tags: ["stoic habits", "self improvement shorts", "discipline", "mindset", "faceless channel"],
        cta: "Subscribe for a new Short every day",
        playlistName: "Stoic Shorts",
      };
    case "promo":
      return {
        titles: [
          { text: "The Simple System Behind Our Results" },
          { text: "Why Smart Creators Are Switching to This Approach", recommended: true },
          { text: "See What This Can Do for Your Channel" },
        ],
        description:
          "You saw the result — here's the system behind it. This promotional video presents the offer and sends you to the landing page for the full picture.\n\nSimulated description for the prototype — edit freely.",
        hashtags: ["#facelesschannel", "#youtubegrowth", "#creator"],
        tags: ["faceless youtube", "channel growth", "promo video", "creator business"],
        cta: "Visit our website to learn more",
        playlistName: "Promotions & Offers",
      };
    case "how-to":
      return {
        titles: [
          { text: "How to Build a Calm Morning Routine (Step by Step)" },
          { text: "How to Stay Consistent When Motivation Runs Out", recommended: true },
          { text: "How to Start a Faceless Channel From Zero" },
        ],
        description:
          "A clear step-by-step tutorial: the starting point, each step in order, and the result you can expect. Timestamps will be added in the final cut.\n\nSimulated description for the prototype — edit freely.",
        hashtags: ["#howto", "#tutorial", "#stoicism", "#habits"],
        tags: ["how to", "step by step", "morning routine", "consistency", "tutorial"],
        cta: "Learn more below",
        playlistName: "How-To Library",
      };
    case "before-after":
      return {
        titles: [
          { text: "From Burnout to Unshakable: The Full Transformation" },
          { text: "Before vs After: 90 Days of Stoic Discipline", recommended: true },
          { text: "You Won't Believe the Difference Discipline Makes" },
        ],
        description:
          "The opening shows the starting point, then the full transformation — the strongest comparison first, exactly how the footage was planned.\n\nSimulated description for the prototype — edit freely.",
        hashtags: ["#transformation", "#beforeandafter", "#discipline"],
        tags: ["before and after", "transformation", "stoic discipline", "self improvement"],
        cta: "See the full transformation",
        playlistName: "Transformations",
      };
    default:
      return {
        titles: [
          { text: "5 Stoic Habits That Rewire Your Mind" },
          { text: "Why Discipline Beats Motivation Every Time", recommended: true },
          { text: "The Quiet Power of Doing Less (Stoic Wealth)" },
        ],
        description:
          "Welcome back to Stoic Wealth. In this video we break down the habits and thinking patterns that compound into real results — researched, scripted, and assembled from your confirmed footage.\n\nSimulated description for the prototype — edit freely.",
        hashtags: ["#stoicism", "#discipline", "#mindset", "#selfimprovement"],
        tags: ["stoicism", "stoic habits", "discipline", "marcus aurelius", "faceless channel", "self improvement"],
        cta: "Subscribe for more",
        playlistName: "Stoic Mindset Essentials",
      };
  }
}

type ThumbnailConcept = {
  id: string;
  name: string;
  visual: string;
  overlayText: string;
  reason: string;
  recommended?: boolean;
};

const THUMBNAIL_SETS: ThumbnailConcept[][] = [
  [
    {
      id: "t1",
      name: "Bold Confrontation",
      visual: "Close-cropped subject silhouette against a dark navy background with a single electric-blue rim light.",
      overlayText: "STOP SCROLLING",
      reason: "High-contrast single focus reads instantly at small sizes in the feed.",
      recommended: true,
    },
    {
      id: "t2",
      name: "Split Comparison",
      visual: "Vertical split: muted 'before' on the left, vivid gold-lit 'after' on the right.",
      overlayText: "BEFORE → AFTER",
      reason: "Curiosity gap — viewers click to learn what happened between the two states.",
    },
    {
      id: "t3",
      name: "Minimal Statement",
      visual: "Clean dark frame, one asset photo faded into the background, large gold serif number.",
      overlayText: "5 HABITS",
      reason: "List-style promise sets a clear expectation and attracts intentional viewers.",
    },
  ],
  [
    {
      id: "t4",
      name: "The Question",
      visual: "Single oversized question mark formed from your footage still, electric-blue glow on navy.",
      overlayText: "WHY?",
      reason: "An open loop in one word — strong for browse traffic and suggested videos.",
      recommended: true,
    },
    {
      id: "t5",
      name: "Timeline Reveal",
      visual: "Horizontal timeline graphic from first clip to final result, small frames of your own assets.",
      overlayText: "DAY 1 → DAY 90",
      reason: "Shows the journey at a glance; works especially well for transformation content.",
    },
    {
      id: "t6",
      name: "Golden Quote Card",
      visual: "Dark textured background with one short gold quote line and a small channel mark.",
      overlayText: "“DO LESS, BETTER.”",
      reason: "Quote thumbnails overperform with the stoic/self-improvement audience.",
    },
  ],
];

type PublishChoice = "draft" | "schedule" | "publish";
type Audience = "kids" | "not-kids";
type Outcome = "SAVED AS DRAFT" | "SCHEDULED" | "READY FOR PUBLICATION — NOT PUBLISHED";

export function PrepareForYouTube({
  videoType,
  productionLevel,
  onReturnToStudio,
}: {
  videoType: StudioVideoType;
  /** Simulated production level chosen in the cost step (e.g. "Standard"). */
  productionLevel?: string;
  onReturnToStudio: () => void;
}) {
  const suggested = useMemo(() => buildDetails(videoType), [videoType]);
  const existingPlaylists = useMemo(() => loadPlaylists(), []);

  // Video details
  const [title, setTitle] = useState(
    suggested.titles.find((t) => t.recommended)?.text ?? suggested.titles[0]!.text
  );
  const [pickedTitle, setPickedTitle] = useState(
    suggested.titles.find((t) => t.recommended)?.text ?? suggested.titles[0]!.text
  );
  const [description, setDescription] = useState(suggested.description);
  const [hashtags, setHashtags] = useState(suggested.hashtags.join(" "));
  const [tags, setTags] = useState(suggested.tags.join(", "));
  const [cta, setCta] = useState(suggested.cta);
  const [playlistMode, setPlaylistMode] = useState<"recommended" | "existing" | "new">(
    "recommended"
  );
  const [existingPlaylistId, setExistingPlaylistId] = useState(existingPlaylists[0]?.id ?? "");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Thumbnails
  const [thumbSet, setThumbSet] = useState(0);
  const [thumbId, setThumbId] = useState<string | null>(null);
  const [thumbLocked, setThumbLocked] = useState(false);

  // Settings
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "public">("private");
  const [publishChoice, setPublishChoice] = useState<PublishChoice>("draft");
  const [scheduleAt, setScheduleAt] = useState("");
  const [audience, setAudience] = useState<Audience>("not-kids");
  const [allowComments, setAllowComments] = useState(true);
  const [addToPlaylist, setAddToPlaylist] = useState(true);
  const [notifySubs, setNotifySubs] = useState(false);

  // Final review
  const [authorized, setAuthorized] = useState(false);
  const [publicConfirmed, setPublicConfirmed] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const concepts = THUMBNAIL_SETS[thumbSet % THUMBNAIL_SETS.length]!;
  const selectedConcept = concepts.find((c) => c.id === thumbId) ?? null;

  const playlistLabel =
    playlistMode === "recommended"
      ? `${suggested.playlistName} (FACELESS recommended)`
      : playlistMode === "existing"
        ? (existingPlaylists.find((p) => p.id === existingPlaylistId)?.title ?? "—")
        : newPlaylistName.trim();

  const scheduleValid =
    publishChoice !== "schedule" ||
    (scheduleAt !== "" && new Date(scheduleAt).getTime() > Date.now());

  const needsPublicConfirm = visibility === "public" && publishChoice === "publish";

  const missing: string[] = [];
  if (!title.trim()) missing.push("choose or write a video title");
  if (!description.trim()) missing.push("write a video description");
  if (!thumbLocked || !selectedConcept) missing.push("select a thumbnail concept and click “Use Selected Thumbnail”");
  if (playlistMode === "existing" && !existingPlaylistId) missing.push("choose an existing playlist");
  if (playlistMode === "new" && !newPlaylistName.trim()) missing.push("name your new playlist");
  if (publishChoice === "schedule" && scheduleAt === "") missing.push("pick a schedule date and time");
  if (publishChoice === "schedule" && scheduleAt !== "" && !scheduleValid)
    missing.push("choose a schedule time in the future");
  if (!authorized) missing.push("tick the authorization box");
  if (needsPublicConfirm && !publicConfirmed) missing.push("tick the publication safeguard confirmation");

  const ready = missing.length === 0;

  const actionLabel =
    publishChoice === "draft"
      ? "SAVE SIMULATED DRAFT"
      : publishChoice === "schedule"
        ? "SCHEDULE SIMULATED VIDEO"
        : "AUTHORIZE SIMULATED PUBLICATION";

  function complete() {
    if (!ready || outcome) return; // never save the same video twice
    const finalOutcome: Outcome =
      publishChoice === "draft"
        ? "SAVED AS DRAFT"
        : publishChoice === "schedule"
          ? "SCHEDULED"
          : "READY FOR PUBLICATION — NOT PUBLISHED";

    // Persist the video so it appears in My Videos across navigation.
    const status =
      publishChoice === "draft"
        ? "draft"
        : publishChoice === "schedule"
          ? "scheduled"
          : "ready-publication";
    const record: DemoVideo = {
      id: newCreatedVideoId(),
      title: title.trim(),
      duration: "—",
      views: "0",
      published: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status,
      visibility,
      channel: "Stoic Wealth",
      description: description.trim(),
      hashtags: hashtags.trim(),
      tags: tags.trim(),
      cta: cta.trim(),
      videoType: TYPE_LABEL[videoType],
      productionLevel: productionLevel ?? "Standard",
    };
    if (addToPlaylist && playlistLabel) record.playlist = playlistLabel;
    if (selectedConcept) record.thumbnailConcept = selectedConcept.name;
    if (publishChoice === "schedule" && scheduleAt)
      record.scheduledAt = new Date(scheduleAt).toLocaleString();
    saveCreatedVideo(record);
    setOutcome(finalOutcome);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6" aria-label="Prepare for YouTube">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-wide md:text-xl">
        <Youtube className="size-5 text-primary" />
        PREPARE FOR YOUTUBE
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your video is approved. Review the YouTube details below before saving, scheduling, or
        publishing.
      </p>
      <p className="mt-2 rounded-lg border border-border bg-card/50 p-3 text-xs text-muted-foreground">
        Simulation only — no YouTube account is connected and nothing will be published. FACELESS is
        recommending settings for your {TYPE_LABEL[videoType].toLowerCase()}, but you control the
        final choice in every field.
      </p>

      {/* ---------- VIDEO DETAILS ---------- */}
      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Video details</h3>

        <div role="radiogroup" aria-label="Title options" className="mt-3 grid gap-2">
          {suggested.titles.map((t) => {
            const selected = pickedTitle === t.text;
            return (
              <button
                key={t.text}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setPickedTitle(t.text);
                  setTitle(t.text);
                }}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/15"
                    : "border-border bg-card/50 hover:border-primary/50"
                )}
              >
                <span className="font-medium">{t.text}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {t.recommended && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                      FACELESS RECOMMENDED
                    </span>
                  )}
                  {selected && <Check className="size-4 text-primary" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="yt-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected title (editable)
            </label>
            <Input
              id="yt-title"
              className="mt-1.5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="yt-desc" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Video description (editable)
            </label>
            <Textarea
              id="yt-desc"
              rows={5}
              className="mt-1.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="yt-hashtags" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested hashtags (editable)
              </label>
              <Input
                id="yt-hashtags"
                className="mt-1.5"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="yt-tags" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested tags (editable)
              </label>
              <Input
                id="yt-tags"
                className="mt-1.5"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="yt-cta" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested call to action (editable)
            </label>
            <Input
              id="yt-cta"
              className="mt-1.5"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Playlist
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["recommended", `Recommended: ${suggested.playlistName}`],
                  ["existing", "Choose an existing playlist"],
                  ["new", "Create a new playlist"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={playlistMode === mode}
                  onClick={() => setPlaylistMode(mode)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors",
                    playlistMode === mode
                      ? "border-primary bg-primary/15"
                      : "border-border bg-card/50 hover:border-primary/50"
                  )}
                >
                  <ListVideo className="size-4 shrink-0 text-primary" />
                  <span>{label}</span>
                  {playlistMode === mode && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                </button>
              ))}
            </div>
            {playlistMode === "existing" && (
              <select
                aria-label="Existing playlist"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={existingPlaylistId}
                onChange={(e) => setExistingPlaylistId(e.target.value)}
              >
                {existingPlaylists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.videoIds.length} videos)
                  </option>
                ))}
              </select>
            )}
            {playlistMode === "new" && (
              <Input
                aria-label="New playlist name"
                className="mt-2"
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ---------- THUMBNAIL SELECTION ---------- */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
          Thumbnail selection
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Simulated thumbnail concepts — no image provider is contacted and no credits are used.
        </p>
        <div role="radiogroup" aria-label="Thumbnail concepts" className="mt-3 grid gap-3 lg:grid-cols-3">
          {concepts.map((c) => {
            const selected = thumbId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setThumbId(c.id);
                  setThumbLocked(false);
                }}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary bg-primary/15 ring-1 ring-primary"
                    : "border-border bg-card/50 hover:border-primary/60"
                )}
              >
                <span className="flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-accent/40">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{c.name}</span>
                  {c.recommended && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                      FACELESS RECOMMENDED
                    </span>
                  )}
                  {selected && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <CheckCircle2 className="size-4" />
                      Selected
                    </span>
                  )}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{c.visual}</span>
                <span className="text-xs">
                  <span className="font-semibold text-muted-foreground">Suggested text: </span>
                  <span className="font-semibold text-gold">{c.overlayText}</span>
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Why it may attract clicks: </span>
                  {c.reason}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!selectedConcept || thumbLocked}
            onClick={() => setThumbLocked(true)}
          >
            {thumbLocked ? (
              <>
                <CheckCircle2 className="size-4" />
                Thumbnail selected
              </>
            ) : (
              "USE SELECTED THUMBNAIL"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setThumbSet((s) => s + 1);
              setThumbId(null);
              setThumbLocked(false);
            }}
          >
            <RotateCcw className="size-4" />
            GENERATE THREE NEW CONCEPTS
          </Button>
        </div>
        {thumbLocked && selectedConcept && (
          <p role="status" className="mt-2 flex items-center gap-2 text-sm font-semibold text-green-500">
            <CheckCircle2 className="size-4" />
            Using “{selectedConcept.name}” as the simulated thumbnail.
          </p>
        )}
      </div>

      {/* ---------- YOUTUBE SETTINGS ---------- */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wide text-primary">YouTube settings</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          FACELESS is recommending settings — you control the final choice.
        </p>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Visibility
            </p>
            <div role="radiogroup" aria-label="Visibility" className="mt-2 grid gap-2">
              {(
                [
                  ["private", "Private", "Only you — recommended while you review."],
                  ["unlisted", "Unlisted", "Only people with the link."],
                  ["public", "Public", "Anyone can find and watch it."],
                ] as const
              ).map(([value, label, blurb]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={visibility === value}
                  onClick={() => setVisibility(value)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    visibility === value
                      ? "border-primary bg-primary/15"
                      : "border-border bg-card/50 hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{blurb}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Publishing choice
            </p>
            <div role="radiogroup" aria-label="Publishing choice" className="mt-2 grid gap-2">
              {(
                [
                  ["draft", "Save as YouTube Draft"],
                  ["schedule", "Schedule"],
                  ["publish", "Publish Now"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={publishChoice === value}
                  onClick={() => setPublishChoice(value)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    publishChoice === value
                      ? "border-primary bg-primary/15"
                      : "border-border bg-card/50 hover:border-primary/50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {publishChoice === "schedule" && (
              <div className="mt-2">
                <label
                  htmlFor="yt-schedule"
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                >
                  <Calendar className="size-3.5" />
                  Future date and time (required)
                </label>
                <Input
                  id="yt-schedule"
                  type="datetime-local"
                  className="mt-1.5"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                />
                {scheduleAt !== "" && !scheduleValid && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    The schedule time must be in the future.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Audience setting (simulated)
          </p>
          <div role="radiogroup" aria-label="Audience setting" className="mt-2 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["not-kids", "Not Made for Kids"],
                ["kids", "Made for Kids"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={audience === value}
                onClick={() => setAudience(value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  audience === value
                    ? "border-primary bg-primary/15"
                    : "border-border bg-card/50 hover:border-primary/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["Allow Comments", allowComments, setAllowComments],
              ["Add to Selected Playlist", addToPlaylist, setAddToPlaylist],
              ["Notify Subscribers", notifySubs, setNotifySubs],
            ] as const
          ).map(([label, checked, setter]) => (
            <label
              key={label}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5 text-sm"
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={checked}
                onChange={(e) => setter(e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ---------- FINAL REVIEW ---------- */}
      <div className="mt-8 rounded-xl border border-primary/40 bg-primary/5 p-4 md:p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Final review</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Selected title", title.trim() || "—"],
              ["Selected thumbnail", thumbLocked && selectedConcept ? selectedConcept.name : "—"],
              ["Tags", tags.trim() || "—"],
              ["Hashtags", hashtags.trim() || "—"],
              ["Playlist", addToPlaylist ? playlistLabel || "—" : "Not added to a playlist"],
              ["Visibility", visibility === "private" ? "Private" : visibility === "unlisted" ? "Unlisted" : "Public"],
              ["Audience setting", audience === "kids" ? "Made for Kids" : "Not Made for Kids"],
              ["Comments", allowComments ? "Allowed" : "Off"],
              ["Subscriber notification", notifySubs ? "On" : "Off"],
              [
                "Publishing choice",
                publishChoice === "draft"
                  ? "Save as YouTube Draft"
                  : publishChoice === "schedule"
                    ? "Schedule"
                    : "Publish Now",
              ],
              ...(publishChoice === "schedule"
                ? ([
                    [
                      "Scheduled date and time",
                      scheduleAt && scheduleValid
                        ? new Date(scheduleAt).toLocaleString()
                        : "—",
                    ],
                  ] as [string, string][])
                : []),
              ["Call to action", cta.trim() || "—"],
            ] as [string, string][]
          ).map(([term, detail]) => (
            <div key={term} className="rounded-lg border border-border bg-card p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {term}
              </dt>
              <dd className="mt-1 break-words text-sm font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 rounded-lg border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {description.trim() || "—"}
          </p>
        </div>

        {needsPublicConfirm && (
          <div className="mt-3 rounded-lg border border-gold/40 bg-gold/10 p-3">
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                This would make your video publicly visible on YouTube. Nothing will be published in
                this prototype.
              </span>
            </p>
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 size-4 accent-primary"
                checked={publicConfirmed}
                onChange={(e) => setPublicConfirmed(e.target.checked)}
              />
              <span>I understand that real publication would require my final authorization.</span>
            </label>
          </div>
        )}

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={authorized}
            onChange={(e) => setAuthorized(e.target.checked)}
          />
          <span>I reviewed these settings and authorize this simulated action.</span>
        </label>

        {!ready && (
          <div className="mt-3 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Still needed before the button unlocks
            </p>
            <ul className="mt-2 space-y-1.5">
              {missing.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className="mt-4 w-full sm:w-auto"
          disabled={!ready || outcome !== null}
          onClick={complete}
        >
          {!ready ? <Lock className="size-4" /> : <Globe className="size-4" />}
          {actionLabel}
        </Button>
      </div>

      {/* ---------- OUTCOME ---------- */}
      {outcome && (
        <div className="mt-6 rounded-xl border border-green-500/40 bg-green-500/10 p-5">
          <p role="status" className="flex items-center gap-2 text-base font-bold text-green-500">
            <CheckCircle2 className="size-5 shrink-0" />
            {outcome}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              {outcome === "SAVED AS DRAFT" &&
                "Your simulated video was saved as a YouTube draft and now appears in My Videos under Drafts. Nothing was uploaded and no YouTube account is connected."}
              {outcome === "SCHEDULED" &&
                `Your simulated video is scheduled for ${scheduleAt ? new Date(scheduleAt).toLocaleString() : "the selected time"}. Nothing was scheduled on a real YouTube account.`}
              {outcome === "READY FOR PUBLICATION — NOT PUBLISHED" &&
                "Your video is ready for publication. This prototype cannot publish — on the real platform you would give final authorization here."}
            </span>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={onReturnToStudio}>
              <RotateCcw className="size-4" />
              RETURN TO VIDEO STUDIO
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/app/videos">
                <Youtube className="size-4" />
                VIEW IN MY VIDEOS
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
