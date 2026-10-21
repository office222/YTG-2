import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  Film,
  Info,
  Pencil,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type DemoVideo,
  createdVideoById,
  videoStatusLabel,
  visibilityLabel,
} from "@/lib/playlists";

export const Route = createFileRoute("/app/video/$videoId/")({
  head: () => ({
    meta: [
      { title: "Video Details — FACELESS" },
      {
        name: "description",
        content:
          "Review the saved details of a video created in the simulated Video Studio.",
      },
      { property: "og:title", content: "Video Details — FACELESS" },
      {
        property: "og:description",
        content:
          "Review the saved details of a video created in the simulated Video Studio.",
      },
    ],
  }),
  component: VideoDetailsPage,
});

function Row({ label, value }: { label: string; value?: string | undefined }) {
  return (
    <div className="border-b border-border py-3 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground sm:mt-0">
        {value && value.trim() !== "" ? value : "—"}
      </dd>
    </div>
  );
}

function VideoDetailsPage() {
  const { videoId } = useParams({ from: "/app/video/$videoId/" });
  const [video, setVideo] = useState<DemoVideo | null | undefined>(undefined);

  useEffect(() => {
    setVideo(createdVideoById(videoId) ?? null);
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

  return (
    <div className="max-w-3xl">
      <Link
        to="/app/videos"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to My Videos
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
        {video.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Read-only video details, saved in this browser.
      </p>

      {/* Simulated preview area — clearly labelled */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex aspect-video items-center justify-center bg-muted/40">
          <div className="text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-background/60">
              <Play className="size-5 fill-current text-foreground" />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Simulated preview — no video file exists
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>Simulation only — nothing was uploaded or published.</span>
      </div>

      <dl className="mt-6 rounded-xl border border-border bg-card px-5 py-2">
        <Row label="Title" value={video.title} />
        <Row label="Status" value={videoStatusLabel(video.status)} />
        <Row label="Visibility" value={visibilityLabel(video.visibility)} />
        <Row label="Thumbnail concept" value={video.thumbnailConcept} />
        <Row label="Video type" value={video.videoType} />
        <Row label="Production level" value={video.productionLevel} />
        <Row label="Description" value={video.description} />
        <Row label="Hashtags" value={video.hashtags} />
        <Row label="Tags" value={video.tags} />
        <Row label="Call to action" value={video.cta} />
        <Row label="Playlist" value={video.playlist} />
        <Row
          label={video.status === "scheduled" ? "Scheduled date" : "Saved date"}
          value={
            video.status === "scheduled"
              ? (video.scheduledAt ?? video.published)
              : video.published
          }
        />
        {video.status === "scheduled" && (
          <Row label="Scheduled time" value={video.scheduledAt} />
        )}
      </dl>

      {video.status === "scheduled" && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" />
          Scheduled in this prototype only — nothing will be sent to YouTube.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/app/videos"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <ArrowLeft className="size-4" /> Back to My Videos
        </Link>
        <Link
          to="/app/video/$videoId/edit"
          params={{ videoId: video.id }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Pencil className="size-4" /> Edit Video Details
        </Link>
      </div>
    </div>
  );
}
