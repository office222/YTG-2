import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Film, Info, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type DemoVideo,
  type Playlist,
  VISIBILITY_OPTIONS,
  type VideoStatus,
  type Visibility,
  createdVideoById,
  loadPlaylists,
  updateCreatedVideo,
} from "@/lib/playlists";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/video/$videoId/edit")({
  head: () => ({
    meta: [
      { title: "Edit Video Details — FACELESS" },
      {
        name: "description",
        content:
          "Edit the saved YouTube details of a video created in the simulated Video Studio.",
      },
      { property: "og:title", content: "Edit Video Details — FACELESS" },
      {
        property: "og:description",
        content:
          "Edit the saved YouTube details of a video created in the simulated Video Studio.",
      },
    ],
  }),
  component: EditVideoPage,
});

/** Publishing action choices — mapped to the saved status. Draft stays Draft,
 *  Scheduled stays Scheduled, and Ready for Publication is never "Published". */
const ACTIONS: { value: VideoStatus; label: string }[] = [
  { value: "draft", label: "Save as YouTube Draft" },
  { value: "scheduled", label: "Schedule" },
  { value: "ready-publication", label: "Ready for Publication — Not Published" },
];

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function EditVideoPage() {
  const { videoId } = useParams({ from: "/app/video/$videoId/edit" });
  const navigate = useNavigate();

  const [video, setVideo] = useState<DemoVideo | null | undefined>(undefined);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [tags, setTags] = useState("");
  const [cta, setCta] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [thumbnailConcept, setThumbnailConcept] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [status, setStatus] = useState<VideoStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [videoType, setVideoType] = useState("");
  const [productionLevel, setProductionLevel] = useState("");

  useEffect(() => {
    const found = createdVideoById(videoId) ?? null;
    setVideo(found);
    setPlaylists(loadPlaylists());
    if (found) {
      setTitle(found.title);
      setDescription(found.description ?? "");
      setHashtags(found.hashtags ?? "");
      setTags(found.tags ?? "");
      setCta(found.cta ?? "");
      setVisibility(found.visibility);
      setThumbnailConcept(found.thumbnailConcept ?? "");
      setPlaylist(found.playlist ?? "");
      setStatus(found.status);
      setScheduledAt(found.scheduledAt ?? "");
      setVideoType(found.videoType ?? "");
      setProductionLevel(found.productionLevel ?? "");
    }
  }, [videoId]);

  if (video === undefined) {
    return <p className="text-sm text-muted-foreground">Loading video…</p>;
  }

  if (video === null) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
        <Film className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          This video record was not found in this browser.
        </p>
        <Link
          to="/app/videos"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <ArrowLeft className="size-4" /> Back to My Videos
        </Link>
      </div>
    );
  }

  const missing: string[] = [];
  if (title.trim() === "") missing.push("a video title");
  if (status === "scheduled" && scheduledAt.trim() === "")
    missing.push("a scheduled date and time");
  const canSave = missing.length === 0;

  function save() {
    if (!canSave || !video) return;
    updateCreatedVideo(video.id, {
      title: title.trim(),
      description,
      hashtags,
      tags,
      cta,
      visibility,
      thumbnailConcept,
      playlist,
      status,
      ...(status === "scheduled" ? { scheduledAt } : {}),
      videoType,
      productionLevel,
    });
    setSaved(true);
    void navigate({ to: "/app/video/$videoId", params: { videoId: video.id } });
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/app/video/$videoId"
        params={{ videoId: video.id }}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to video details
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
        Edit Video Details
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Editing the saved record for “{video.title}”. Your uploaded material and
        production settings stay as they are.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          Simulation only — nothing is uploaded, published, or charged.
        </span>
      </div>

      <div className="mt-6 space-y-5 rounded-xl border border-border bg-card p-5">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Video title"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Hashtags">
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Tags">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Call to action">
          <input
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Thumbnail concept">
          <input
            value={thumbnailConcept}
            onChange={(e) => setThumbnailConcept(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Video type">
            <input
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Production level">
            <input
              value={productionLevel}
              onChange={(e) => setProductionLevel(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Playlist">
          <select
            value={playlist}
            onChange={(e) => setPlaylist(e.target.value)}
            className={inputClass}
          >
            <option value="">No playlist</option>
            {playlists.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
            {playlist !== "" && !playlists.some((p) => p.title === playlist) && (
              <option value={playlist}>{playlist}</option>
            )}
          </select>
        </Field>

        <Field label="Visibility">
          <div className="flex flex-wrap gap-2">
            {VISIBILITY_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setVisibility(o.value)}
                aria-pressed={visibility === o.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  visibility === o.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>

        <Field
          label="Publishing action"
          hint="Your saved status stays as it is unless you change it here. Nothing is ever published."
        >
          <div className="space-y-2">
            {ACTIONS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setStatus(a.value)}
                aria-pressed={status === a.value}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  status === a.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent",
                )}
              >
                <span>{a.label}</span>
                {status === a.value && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </Field>

        {status === "scheduled" && (
          <Field label="Scheduled date and time">
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}
      </div>

      {!canSave && (
        <p className="mt-4 text-xs text-destructive">
          Still needed before saving: {missing.join(" and ")}.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/app/video/$videoId"
          params={{ videoId: video.id }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <ArrowLeft className="size-4" /> Cancel and Return
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={!canSave || saved}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="size-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}
