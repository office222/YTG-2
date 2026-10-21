import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CircleDot,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Image as ImageIcon,
  ListPlus,
  ListVideo,
  Lock,
  Pencil,
  Play,
  Plus,
  Radio,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type DemoVideo,
  type Playlist,
  VIDEO_STATUS_OPTIONS,
  type VideoStatus,
  type Visibility,
  allVideos,
  isCreatedVideo,
  loadPlaylists,
  savePlaylists,
  videoStatusLabel,
} from "@/lib/playlists";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/videos")({
  head: () => ({
    meta: [
      { title: "My Videos — FACELESS" },
      {
        name: "description",
        content:
          "View, organize, and manage the videos created for your channel.",
      },
      { property: "og:title", content: "My Videos — FACELESS" },
      {
        property: "og:description",
        content:
          "View, organize, and manage the videos created for your channel.",
      },
    ],
  }),
  component: MyVideosPage,
});

type Filter = "all" | VideoStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Videos" },
  { value: "draft", label: "Drafts" },
  { value: "ready", label: "Ready" },
  { value: "published", label: "Published" },
  { value: "attention", label: "Needs Attention" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ready-publication", label: "Ready for Publication" },
];

const statusStyle: Record<VideoStatus, { classes: string; icon: typeof Check }> = {
  draft: {
    classes: "border-border bg-muted text-muted-foreground",
    icon: Pencil,
  },
  ready: {
    classes: "border-primary/40 bg-primary/15 text-primary",
    icon: Check,
  },
  published: {
    classes: "border-gold/40 bg-gold/15 text-gold",
    icon: Radio,
  },
  attention: {
    classes: "border-destructive/40 bg-destructive/15 text-destructive",
    icon: AlertTriangle,
  },
  scheduled: {
    classes: "border-primary/40 bg-primary/15 text-primary",
    icon: CalendarClock,
  },
  "ready-publication": {
    classes: "border-gold/40 bg-gold/15 text-gold",
    icon: Sparkles,
  },
};

const visibilityIcon: Record<Visibility, typeof Globe> = {
  public: Globe,
  unlisted: EyeOff,
  private: Lock,
};

const visibilityText: Record<Visibility, string> = {
  public: "Public",
  unlisted: "Unlisted",
  private: "Private",
};

/** Deterministic thumbnail backdrop per video — demo art, not real thumbnails. */
function thumbStyle(id: string): React.CSSProperties {
  const n = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = 215 + ((n * 37) % 60);
  return {
    background: `linear-gradient(135deg, oklch(0.32 0.09 ${hue}) 0%, oklch(0.22 0.06 ${hue + 20}) 60%, oklch(0.18 0.04 258) 100%)`,
  };
}

function MyVideosPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pickerFor, setPickerFor] = useState<DemoVideo | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [addedNote, setAddedNote] = useState<string | null>(null);
  const [allVideoList, setAllVideoList] = useState<DemoVideo[]>([]);

  useEffect(() => {
    setPlaylists(loadPlaylists());
    setAllVideoList(allVideos());
  }, []);

  const videos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allVideoList.filter((v) => {
      if (filter !== "all" && v.status !== filter) return false;
      if (q && !v.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, filter, allVideoList]);

  function addToPlaylist(playlistId: string) {
    if (!pickerFor) return;
    const next = playlists.map((p) =>
      p.id === playlistId && !p.videoIds.includes(pickerFor.id)
        ? {
            ...p,
            videoIds: [...p.videoIds, pickerFor.id],
            updatedAt: new Date().toISOString(),
          }
        : p,
    );
    setPlaylists(next);
    savePlaylists(next);
    const name = playlists.find((p) => p.id === playlistId)?.title ?? "playlist";
    setAddedNote(`“${pickerFor.title}” added to “${name}” (simulated).`);
    setPickerFor(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            My Videos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, organize, and manage the videos created for your channel.
          </p>
        </div>
        <Link
          to="/app/studio"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create New Video
        </Link>
      </div>

      {/* Search + filters */}
      <div className="mt-6 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search videos by title…"
            aria-label="Search videos by title"
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {addedNote && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
          <span className="flex items-center gap-2">
            <Check className="size-4 shrink-0" />
            {addedNote}
          </span>
          <button
            onClick={() => setAddedNote(null)}
            aria-label="Dismiss"
            className="rounded p-1 hover:bg-gold/10"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Video grid */}
      {videos.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <CircleDot className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No videos match your search or filter.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onAddToPlaylist={() => setPickerFor(v)} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Demo videos only — nothing here is connected to or published on a real
        YouTube channel yet.
      </p>

      {/* Add to Playlist picker */}
      {pickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/70"
            onClick={() => setPickerFor(null)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold">
                  Add to Playlist
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Choose a playlist for “{pickerFor.title}”. Simulated — saved
                  in this browser only.
                </p>
              </div>
              <button
                onClick={() => setPickerFor(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {playlists.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No playlists yet — create one on the My Playlist page.
                </p>
              )}
              {playlists.map((p) => {
                const already = p.videoIds.includes(pickerFor.id);
                return (
                  <button
                    key={p.id}
                    disabled={already}
                    onClick={() => addToPlaylist(p.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-colors",
                      already
                        ? "cursor-not-allowed opacity-60"
                        : "hover:border-primary hover:bg-accent",
                    )}
                  >
                    <span>
                      <span className="block font-medium">{p.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.videoIds.length} video{p.videoIds.length === 1 ? "" : "s"} · {visibilityText[p.visibility]}
                      </span>
                    </span>
                    {already ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Check className="size-3.5" /> Added
                      </span>
                    ) : (
                      <ListPlus className="size-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <Link
              to="/app/playlist"
              className="mt-4 block text-center text-xs font-medium text-primary hover:underline"
              onClick={() => setPickerFor(null)}
            >
              Manage playlists
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video,
  onAddToPlaylist,
}: {
  video: DemoVideo;
  onAddToPlaylist: () => void;
}) {
  const status = statusStyle[video.status];
  const StatusIcon = status.icon;
  const VisIcon = visibilityIcon[video.visibility];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Thumbnail */}
      <div
        className="relative flex aspect-video items-center justify-center"
        style={thumbStyle(video.id)}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-background/40 backdrop-blur-sm">
          <Play className="size-5 fill-current text-foreground" />
        </span>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/70 px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
          <Clock className="size-3" />
          {video.duration}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug">
          {video.title}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{video.channel}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              status.classes,
            )}
          >
            <StatusIcon className="size-3" />
            {videoStatusLabel(video.status)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <VisIcon className="size-3" />
            {visibilityText[video.visibility]}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {video.status === "published"
            ? "Published"
            : video.status === "scheduled"
              ? "Scheduled for"
              : "Updated"}{" "}
          {video.status === "scheduled" && video.scheduledAt
            ? video.scheduledAt
            : video.published}
        </p>

        {/* Extra detail for videos created in the simulated studio flow */}
        {(video.thumbnailConcept || video.playlist || video.videoType) && (
          <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-[11px]">
            {video.thumbnailConcept && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ImageIcon className="size-3 shrink-0" />
                <dt className="sr-only">Thumbnail concept</dt>
                <dd>Thumbnail: {video.thumbnailConcept}</dd>
              </div>
            )}
            {video.playlist && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ListVideo className="size-3 shrink-0" />
                <dt className="sr-only">Playlist</dt>
                <dd>Playlist: {video.playlist}</dd>
              </div>
            )}
            {(video.videoType || video.productionLevel) && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="size-3 shrink-0" />
                <dt className="sr-only">Video type and production level</dt>
                <dd>
                  {[video.videoType, video.productionLevel]
                    .filter(Boolean)
                    .join(" · ")}
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          {isCreatedVideo(video.id) ? (
            <>
              <Link
                to="/app/video/$videoId"
                params={{ videoId: video.id }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Eye className="size-3.5" />
                View
              </Link>
              <Link
                to="/app/video/$videoId/edit"
                params={{ videoId: video.id }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
            </>
          ) : (
            <>
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                title="View (simulated)"
              >
                <Eye className="size-3.5" />
                View
              </button>
              <Link
                to="/app/studio"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
            </>
          )}
          <button
            onClick={onAddToPlaylist}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/15 px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
          >
            <ListPlus className="size-3.5" />
            Add to Playlist
          </button>
        </div>
      </div>
    </article>
  );
}
