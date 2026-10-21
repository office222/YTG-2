import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  GripVertical,
  ListVideo,
  Lock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEMO_VIDEOS,
  type Playlist,
  VISIBILITY_OPTIONS,
  type Visibility,
  formatUpdated,
  loadPlaylists,
  newPlaylistId,
  reorder,
  savePlaylists,
  videoById,
  visibilityLabel,
} from "@/lib/playlists";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/playlist")({
  head: () => ({
    meta: [
      { title: "My Playlist — FACELESS" },
      {
        name: "description",
        content:
          "Build and organise your YouTube playlists: pick videos, drag to reorder, and set visibility.",
      },
      { property: "og:title", content: "My Playlist — FACELESS" },
      {
        property: "og:description",
        content:
          "Build and organise your YouTube playlists: pick videos, drag to reorder, and set visibility.",
      },
    ],
  }),
  component: PlaylistPage,
});

type Mode =
  | { kind: "list" }
  | { kind: "edit"; id: string | null }
  | { kind: "view"; id: string };

const visibilityIcon = { public: Eye, unlisted: EyeOff, private: Lock } as const;

function PlaylistPage() {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    setPlaylists(loadPlaylists());
  }, []);

  function persist(next: Playlist[]) {
    setPlaylists(next);
    savePlaylists(next);
  }

  if (!playlists) {
    return (
      <div className="min-h-[40vh] text-sm text-muted-foreground">Loading your playlists…</div>
    );
  }

  if (mode.kind === "edit") {
    const existing = mode.id ? playlists.find((p) => p.id === mode.id) ?? null : null;
    return (
      <PlaylistEditor
        playlist={existing}
        onCancel={() => setMode({ kind: "list" })}
        onSave={(p) => {
          const next = existing
            ? playlists.map((x) => (x.id === p.id ? p : x))
            : [p, ...playlists];
          persist(next);
          setSaved(p.title);
          setMode({ kind: "list" });
        }}
      />
    );
  }

  if (mode.kind === "view") {
    const p = playlists.find((x) => x.id === mode.id);
    if (!p) {
      setMode({ kind: "list" });
      return null;
    }
    return (
      <PlaylistViewer
        playlist={p}
        onBack={() => setMode({ kind: "list" })}
        onEdit={() => setMode({ kind: "edit", id: p.id })}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Playlist</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Group your videos into playlists so new viewers binge-watch instead of
            leaving after one video.
          </p>
        </div>
        <button
          onClick={() => setMode({ kind: "edit", id: null })}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create playlist
        </button>
      </div>

      {saved && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-foreground">
            <span className="font-semibold">“{saved}” saved.</span> This is a
            prototype, so nothing is sent to YouTube yet.
          </p>
          <button
            onClick={() => setSaved(null)}
            aria-label="Dismiss"
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <ListVideo className="mx-auto size-6 text-gold" />
          <p className="mt-3 text-sm text-muted-foreground">
            You have no playlists yet. Create your first one to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((p) => {
            const VIcon = visibilityIcon[p.visibility];
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <ListVideo className="mt-0.5 size-5 shrink-0 text-primary" />
                  <h2 className="min-w-0 text-base font-semibold leading-snug">
                    {p.title}
                  </h2>
                </div>
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                )}
                <dl className="mt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Videos</dt>
                    <dd className="font-semibold">{p.videoIds.length}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Visibility</dt>
                    <dd className="inline-flex items-center gap-1.5 font-semibold">
                      <VIcon className="size-3.5 text-gold" />
                      {visibilityLabel(p.visibility)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Last updated</dt>
                    <dd className="font-semibold">{formatUpdated(p.updatedAt)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setMode({ kind: "edit", id: p.id })}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary/60 hover:bg-accent/40"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setMode({ kind: "view", id: p.id })}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Videos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
        Prototype preview — playlists are simulated with demo data. Once your
        YouTube channel is connected, your real playlists will appear here.
      </p>
    </div>
  );
}

function PlaylistViewer({
  playlist,
  onBack,
  onEdit,
}: {
  playlist: Playlist;
  onBack: () => void;
  onEdit: () => void;
}) {
  const VIcon = visibilityIcon[playlist.visibility];
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All playlists
      </button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{playlist.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {playlist.description || "No description yet."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {playlist.videoIds.length} videos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <VIcon className="size-3.5 text-gold" />
              {visibilityLabel(playlist.visibility)}
            </span>
            <span>Updated {formatUpdated(playlist.updatedAt)}</span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-accent/40"
        >
          <Pencil className="size-4" />
          Edit
        </button>
      </div>

      <ol className="mt-8 space-y-2">
        {playlist.videoIds.map((id, i) => {
          const v = videoById(id);
          if (!v) return null;
          return (
            <li
              key={id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{v.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {v.duration} · {v.views} views · {v.published}
                </p>
              </div>
            </li>
          );
        })}
        {playlist.videoIds.length === 0 && (
          <li className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
            This playlist has no videos yet.
          </li>
        )}
      </ol>
    </div>
  );
}

function PlaylistEditor({
  playlist,
  onSave,
  onCancel,
}: {
  playlist: Playlist | null;
  onSave: (p: Playlist) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(playlist?.title ?? "");
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [visibility, setVisibility] = useState<Visibility>(
    playlist?.visibility ?? "public"
  );
  const [videoIds, setVideoIds] = useState<string[]>(playlist?.videoIds ?? []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = useMemo(
    () => DEMO_VIDEOS.filter((v) => !videoIds.includes(v.id)),
    [videoIds]
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= videoIds.length) return;
    setVideoIds((ids) => reorder(ids, from, to));
  }

  function submit() {
    if (!title.trim()) {
      setError("Give your playlist a name.");
      return;
    }
    if (videoIds.length === 0) {
      setError("Add at least one video to the playlist.");
      return;
    }
    setError(null);
    onSave({
      id: playlist?.id ?? newPlaylistId(),
      title: title.trim(),
      description: description.trim(),
      visibility,
      videoIds,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All playlists
      </button>

      <h1 className="text-2xl font-bold md:text-3xl">
        {playlist ? "Edit playlist" : "Create a playlist"}
      </h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        Name it, pick your videos, then drag them into the order you want viewers
        to watch.
      </p>

      {/* Details */}
      <section className="mt-8 rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-base font-semibold">Playlist details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="pl-title"
              className="mb-1.5 block text-sm font-medium"
            >
              Playlist name
            </label>
            <input
              id="pl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stoic Mindset Essentials"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="pl-desc"
              className="mb-1.5 block text-sm font-medium"
            >
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="pl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell viewers what this playlist is about."
              className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-base font-semibold">Who can see this playlist?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {VISIBILITY_OPTIONS.map((o) => {
            const VIcon = visibilityIcon[o.value];
            const active = visibility === o.value;
            return (
              <button
                key={o.value}
                onClick={() => setVisibility(o.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  active
                    ? "border-primary bg-accent/50"
                    : "border-border hover:border-primary/50 hover:bg-accent/30"
                )}
              >
                <VIcon
                  className={cn(
                    "size-5",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <p className="mt-2.5 text-sm font-semibold">{o.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{o.blurb}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected videos with drag-and-drop */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold">
            Playlist order{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({videoIds.length} selected)
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Drag a row to reorder, or use the arrows on mobile.
          </p>
        </div>

        {videoIds.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No videos yet — pick some from My Videos below.
          </p>
        ) : (
          <ol className="mt-4 space-y-2">
            {videoIds.map((id, i) => {
              const v = videoById(id);
              if (!v) return null;
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverIndex(i);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors",
                    dragIndex === i
                      ? "border-primary opacity-60"
                      : overIndex === i
                        ? "border-primary/70 bg-accent/40"
                        : "border-border"
                  )}
                >
                  <GripVertical
                    className="size-4 shrink-0 cursor-grab text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{v.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {v.duration} · {v.views} views
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label={`Move ${v.title} up`}
                      className="rounded-md px-2 py-1 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, i + 1)}
                      disabled={i === videoIds.length - 1}
                      aria-label={`Move ${v.title} down`}
                      className="rounded-md px-2 py-1 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() =>
                        setVideoIds((ids) => ids.filter((x) => x !== id))
                      }
                      aria-label={`Remove ${v.title}`}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Pick from My Videos */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-base font-semibold">Add from My Videos</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Demo videos from your channel library.
        </p>
        {available.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Every video is already in this playlist.
          </p>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {available.map((v) => (
              <button
                key={v.id}
                onClick={() => setVideoIds((ids) => [...ids, v.id])}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary/60 hover:bg-accent/40"
              >
                <Plus className="size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{v.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {v.duration} · {v.views} views · {v.published}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Check className="size-4" />
          Save playlist
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent/40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
