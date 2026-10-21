import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Coins,
  FileVideo,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  MessageSquare,
  Pause,
  Play,
  Receipt,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  ThumbsUp,
  Trash2,
  Upload,
  Video,
  Youtube,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CreativeDirection } from "@/components/studio/CreativeDirection";
import { PrepareForYouTube } from "@/components/studio/PrepareForYouTube";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/studio")({
  head: () => ({
    meta: [
      { title: "Video Studio — FACELESS" },
      {
        name: "description",
        content:
          "Upload your photos and video clips, confirm every file, then start a simulated faceless video production run.",
      },
      { property: "og:title", content: "Video Studio — FACELESS" },
      {
        property: "og:description",
        content:
          "Upload photos and clips, confirm each file, and start a demo production run in the FACELESS Video Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideoStudio,
});

type VideoTypeId =
  | "youtube-video"
  | "youtube-short"
  | "promo"
  | "how-to"
  | "before-after"
  | "faceless-decide";

type VideoTypeOption = {
  id: VideoTypeId;
  label: string;
  description: string;
  icon: typeof Youtube;
};

const VIDEO_TYPES: VideoTypeOption[] = [
  {
    id: "youtube-video",
    label: "YouTube Video",
    description: "A full-length video for your channel — the standard format for building watch time.",
    icon: Youtube,
  },
  {
    id: "youtube-short",
    label: "YouTube Short",
    description: "A vertical video under 60 seconds, built for fast discovery in the Shorts feed.",
    icon: Zap,
  },
  {
    id: "promo",
    label: "Promotional Video",
    description: "A persuasive video that presents an offer and sends viewers to your landing page.",
    icon: Megaphone,
  },
  {
    id: "how-to",
    label: "How-To Video",
    description: "A clear step-by-step tutorial that teaches the viewer one specific skill or result.",
    icon: GraduationCap,
  },
  {
    id: "before-after",
    label: "Before-and-After Video",
    description: "A transformation story that contrasts the starting point with the end result.",
    icon: ArrowLeftRight,
  },
  {
    id: "faceless-decide",
    label: "Let FACELESS Decide",
    description: "FACELESS analyzes your confirmed project assets and recommends the strongest format.",
    icon: Sparkles,
  },
];

type Recommendation = {
  format: string;
  length: string;
  style: string;
  narration: string;
  captions: string;
  music: string;
  originalSound: string;
  missing: string[];
};

function buildRecommendation(assets: Asset[]): Recommendation {
  const images = assets.filter((a) => a.kind === "image").length;
  const videos = assets.filter((a) => a.kind === "video").length;
  const hasVideo = videos > 0;
  const manyImages = images >= 3;

  const missing: string[] = [];
  if (!hasVideo) {
    missing.push(
      "No video clips confirmed yet — add at least one MP4 or MOV clip if you want moving footage beyond still photos."
    );
  }
  if (images === 0) {
    missing.push("No photos confirmed yet — a thumbnail image or cover photo would strengthen the final cut.");
  }
  if (!hasVideo && images < 3) {
    missing.push("More source material would help — aim for 3 or more confirmed files for a richer result.");
  }
  if (missing.length === 0) {
    missing.push("Nothing critical is missing — your confirmed assets are enough for the recommended format.");
  }

  return {
    format: hasVideo ? "YouTube Video (standard 16:9)" : "YouTube Video built from photo slideshow (16:9)",
    length: hasVideo ? "6–9 minutes" : manyImages ? "4–6 minutes" : "3–5 minutes",
    style: hasVideo
      ? "Clean cinematic cuts with calm pacing, on-screen key phrases, and a dark navy / electric-blue grade to match your channel."
      : "Slow zoom-and-pan motion across your photos (Ken Burns style) with bold on-screen key phrases.",
    narration: "Yes — a calm, confident AI voiceover carries the script from start to finish.",
    captions: "Yes — burned-in captions throughout, so the video works with the sound off.",
    music: "Yes — a subtle ambient background track, kept well below the narration.",
    originalSound: hasVideo
      ? "No — original clip audio will be replaced by narration and music for a consistent result."
      : "Not applicable — photos carry no sound, so narration and music provide the full soundtrack.",
    missing,
  };
}

/* ---------- Simulated production levels, cost and progress ---------- */

type LevelId = "light" | "standard" | "best";

type Level = {
  id: LevelId;
  name: string;
  tagline: string;
  credits: number;
  minutes: number;
  recommended?: boolean;
  includes: string[];
};

const DEMO_CREDIT_BALANCE = 1250;

const LEVELS: Level[] = [
  {
    id: "light",
    name: "LIGHT",
    tagline: "Lowest estimated credit cost, basic production quality.",
    credits: 40,
    minutes: 4,
    includes: [
      "Essential editing and scene assembly",
      "Burned-in captions",
      "Background music bed",
      "Basic 1080p export",
    ],
  },
  {
    id: "standard",
    name: "STANDARD",
    tagline: "Balanced credit cost and production quality.",
    credits: 90,
    minutes: 9,
    recommended: true,
    includes: [
      "Enhanced editing with paced scene cuts",
      "AI narration voiceover",
      "Styled captions",
      "Music mixed under narration",
      "Smooth transitions between scenes",
      "1080p export",
    ],
  },
  {
    id: "best",
    name: "BEST",
    tagline: "Highest production quality, everything included.",
    credits: 180,
    minutes: 18,
    includes: [
      "Premium narration with expressive delivery",
      "Premium visuals and motion treatment",
      "Advanced editing and rhythm pass",
      "Styled captions with emphasis words",
      "Layered music and sound effects",
      "Cinematic transitions",
      "Full quality-check pass",
    ],
  },
];

const PRODUCTION_STEPS = [
  "Files Confirmed",
  "Production Plan Created",
  "Script and Scenes Prepared",
  "Narration Prepared",
  "Visuals Assembled",
  "Captions, Music, and Transitions Added",
  "Quality Check Completed",
  "Ready for Review",
];

type SceneState = "approved" | "change-requested" | "regenerating" | "ready-for-review";

type Scene = {
  id: number;
  title: string;
  note: string;
  state: SceneState;
  requested?: string;
};

const INITIAL_SCENES: Scene[] = [
  { id: 1, title: "Scene 1 — Hook", note: "Opening line over your first confirmed asset.", state: "approved" },
  { id: 2, title: "Scene 2 — Setup", note: "Context and the promise of the video.", state: "approved" },
  { id: 3, title: "Scene 3 — Payoff", note: "The main demonstration built from your assets.", state: "approved" },
  { id: 4, title: "Scene 4 — Call to Action", note: "Closing line and channel prompt.", state: "approved" },
];

const SCENE_STATE_LABEL: Record<SceneState, string> = {
  approved: "Approved",
  "change-requested": "Change Requested",
  regenerating: "Regenerating…",
  "ready-for-review": "Ready for Review",
};

const REVISION_CREDITS = 4;

function formatMinutes(min: number) {
  return min < 60 ? `about ${min} minutes` : `about ${(min / 60).toFixed(1)} hours`;
}

const ACCEPTED = ["image/jpeg", "image/png", "video/mp4", "video/quicktime"];
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.mp4,.mov,image/jpeg,image/png,video/mp4,video/quicktime";
const MAX_BYTES = 200 * 1024 * 1024;

type Asset = {
  id: string;
  name: string;
  size: number;
  kind: "image" | "video";
  url: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validate(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ["jpg", "jpeg", "png", "mp4", "mov"].includes(ext);
  if (!ACCEPTED.includes(file.type) && !okExt) {
    return `“${file.name}” is a ${ext ? `.${ext}` : "unknown"} file. Only JPG, PNG, MP4 and MOV files are accepted.`;
  }
  if (file.size > MAX_BYTES) {
    return `“${file.name}” is ${formatSize(file.size)}. The demo upload limit is 200 MB per file.`;
  }
  if (file.size === 0) {
    return `“${file.name}” is empty (0 KB), so it could not be read.`;
  }
  return null;
}

function VideoStudio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [producing, setProducing] = useState(false);
  const [produced, setProduced] = useState(false);
  const [videoType, setVideoType] = useState<VideoTypeId | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recAccepted, setRecAccepted] = useState(false);
  const [level, setLevel] = useState<LevelId | null>(null);
  const [approved, setApproved] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [playing, setPlaying] = useState(false);
  const [playingScene, setPlayingScene] = useState<number | null>(null);
  const [reviewNote, setReviewNote] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null);
  const [retries, setRetries] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTarget, setPanelTarget] = useState<"all" | number | null>(null);
  const [panelText, setPanelText] = useState("");
  const [panelError, setPanelError] = useState<string | null>(null);
  const [entireConfirmed, setEntireConfirmed] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{ target: "all" | number; text: string } | null>(null);
  const [extraCredits, setExtraCredits] = useState(0);
  const [directionApproved, setDirectionApproved] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [videoApproved, setVideoApproved] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  const uploadSectionRef = useRef<HTMLElement>(null);
  const costSectionRef = useRef<HTMLElement>(null);
  const prepSectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  // Any change to the plan resets the simulated run so nothing stale is shown.
  useEffect(() => {
    setApproved(false);
    setProducing(false);
    setProduced(false);
    setStepIndex(0);
    setScenes(INITIAL_SCENES);
    setReviewNote(null);
    setCreditsUsed(null);
    setRetries(0);
    setPlaying(false);
    setPlayingScene(null);
    setPanelOpen(false);
    setPanelTarget(null);
    setPanelText("");
    setPanelError(null);
    setEntireConfirmed(false);
    setActiveRequest(null);
    setExtraCredits(0);
    setApproveConfirmOpen(false);
    setVideoApproved(false);
    setPrepOpen(false);
  }, [videoType, recAccepted, level]);

  // A different video type or recommendation means the creative plan needs approving again.
  useEffect(() => {
    setDirectionApproved(false);
  }, [videoType, recAccepted]);


  useEffect(
    () => () => {
      timersRef.current.forEach(clearInterval);
    },
    []
  );

  function simulateUpload(id: string, willFail: boolean) {
    const timer = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id !== id || a.status !== "uploading") return a;
          const next = Math.min(100, a.progress + 12 + Math.random() * 14);
          if (next >= 100) {
            clearInterval(timer);
            return willFail
              ? {
                  ...a,
                  status: "error",
                  progress: 100,
                  error:
                    "The upload was interrupted before it finished. Nothing was saved — use Replace to try this file again.",
                }
              : { ...a, status: "success", progress: 100 };
          }
          return { ...a, progress: next };
        })
      );
    }, 220);
    timersRef.current.push(timer);
  }

  function addFiles(files: FileList | null, replaceId?: string) {
    if (!files || files.length === 0) return;
    const rejected: string[] = [];
    const accepted: Asset[] = [];

    Array.from(files).forEach((file) => {
      const problem = validate(file);
      if (problem) {
        rejected.push(problem);
        return;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        kind: file.type.startsWith("video") || /\.(mp4|mov)$/i.test(file.name) ? "video" : "image",
        url: URL.createObjectURL(file),
        status: "uploading",
        progress: 4,
      });
    });

    setNotice(
      rejected.length > 0
        ? rejected.join(" ")
        : accepted.length > 0
          ? `${accepted.length} file${accepted.length > 1 ? "s" : ""} accepted and uploading.`
          : null
    );

    if (accepted.length === 0) return;
    setProduced(false);

    if (replaceId) {
      const replacement = accepted[0]!;
      setAssets((prev) => prev.map((a) => (a.id === replaceId ? replacement : a)));
      simulateUpload(replacement.id, false);
      return;
    }

    setAssets((prev) => [...prev, ...accepted]);
    accepted.forEach((a, i) => simulateUpload(a.id, i === 0 ? false : Math.random() < 0.08));
  }

  function removeAsset(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setNotice("File removed from your project assets.");
    setProduced(false);
  }

  const confirmed = assets.filter((a) => a.status === "success");
  const pending = assets.some((a) => a.status === "uploading");
  const failed = assets.filter((a) => a.status === "error");
  const uploadsReady = confirmed.length > 0 && !pending && failed.length === 0;

  function selectVideoType(id: VideoTypeId) {
    setVideoType(id);
    setProduced(false);
    if (id === "faceless-decide") {
      setRecommendation(buildRecommendation(confirmed));
      setRecAccepted(false);
    } else {
      setRecommendation(null);
      setRecAccepted(false);
    }
  }

  const choiceMade =
    videoType !== null && (videoType !== "faceless-decide" || recAccepted);
  const canProduce = uploadsReady && choiceMade;

  const blockers: string[] = [];
  if (confirmed.length === 0) blockers.push("upload at least one photo or clip and wait for the green “Upload Successful” confirmation");
  if (pending) blockers.push("wait for every upload to finish");
  if (failed.length > 0) blockers.push("fix or remove the failed uploads");
  if (uploadsReady && !choiceMade) {
    blockers.push(
      videoType === "faceless-decide"
        ? "review the FACELESS recommendation below and accept it (or pick a different video type)"
        : "choose one video type under “What would you like to create?”"
    );
  }

  const selectedLevel = LEVELS.find((l) => l.id === level) ?? null;
  const balanceAfter = selectedLevel ? DEMO_CREDIT_BALANCE - selectedLevel.credits : DEMO_CREDIT_BALANCE;
  const readyToApprove = canProduce && directionApproved && selectedLevel !== null;

  const approvalBlockers = [...blockers];
  if (canProduce && !directionApproved) {
    approvalBlockers.push("review the plan under “Creative direction” and accept it");
  }
  if (canProduce && directionApproved && !selectedLevel) {
    approvalBlockers.push("choose one production level under “Know your cost before you create”");
  }

  function approveAndCreate() {
    if (!selectedLevel) return;
    setApproved(true);
    setProducing(true);
    setProduced(false);
    setScenes(INITIAL_SCENES);
    setReviewNote(null);
    setRetries(0);
    setPlayingScene(null);
    setApproveConfirmOpen(false);
    setVideoApproved(false);
    setStepIndex(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setStepIndex(i);
      if (i >= PRODUCTION_STEPS.length) {
        clearInterval(timer);
        setProducing(false);
        setProduced(true);
        setCreditsUsed(Math.max(1, selectedLevel.credits - 3));
      }
    }, 900);
    timersRef.current.push(timer);
  }

  function openChangePanel(target: "all" | number | null) {
    setPanelOpen(true);
    setPanelTarget(target);
    setPanelText("");
    setPanelError(null);
    setEntireConfirmed(false);
    setReviewNote(null);
  }

  function closeChangePanel() {
    setPanelOpen(false);
    setPanelTarget(null);
    setPanelText("");
    setPanelError(null);
    setEntireConfirmed(false);
  }

  function targetLabel(target: "all" | number) {
    return target === "all"
      ? "Entire Video"
      : (scenes.find((s) => s.id === target)?.title ?? `Scene ${target}`);
  }

  function submitChangeRequest() {
    const missing: string[] = [];
    if (panelTarget === null) missing.push("select Entire Video or one scene");
    if (!panelText.trim()) missing.push("describe the change you want");
    if (missing.length) {
      setPanelError(`Still needed: ${missing.join(" and ")}.`);
      return;
    }
    if (panelTarget === "all" && !entireConfirmed) {
      setPanelError(
        "Changing the entire video affects all four scenes, including the ones already approved. Tick the confirmation box to continue."
      );
      return;
    }
    const target = panelTarget as "all" | number;
    const text = panelText.trim();
    setActiveRequest({ target, text });
    setScenes((prev) =>
      prev.map((s) =>
        target === "all" || s.id === target
          ? { ...s, state: "change-requested", requested: text }
          : s
      )
    );
    setPanelOpen(false);
    setPanelText("");
    setPanelError(null);
    setEntireConfirmed(false);
    setReviewNote(null);
  }

  function regenerateSelected() {
    if (!activeRequest) return;
    const { target } = activeRequest;
    setScenes((prev) =>
      prev.map((s) =>
        target === "all" || s.id === target ? { ...s, state: "regenerating" } : s
      )
    );
    setRetries((r) => r + 1);
    setPlayingScene(null);
    setPlaying(false);
    const timer = setTimeout(() => {
      setScenes((prev) =>
        prev.map((s) =>
          target === "all" || s.id === target
            ? {
                ...s,
                state: "ready-for-review",
                note: `${s.note} Rebuilt in this simulated pass from your instructions.`,
              }
            : s
        )
      );
      setReviewNote(
        "Your revised scene is ready. Watch the revised scene, then approve it or request another change. No simulated credits are added to the receipt until you approve it."
      );
      // Bring the reviewer straight to the revised scene and preview.
      const firstScene = target === "all" ? 1 : target;
      document
        .getElementById(`scene-card-${firstScene}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1400);
    timersRef.current.push(timer as unknown as ReturnType<typeof setInterval>);
  }

  function approveRevisedScene(sceneId?: number) {
    const target: "all" | number | undefined = sceneId ?? activeRequest?.target;
    if (target === undefined) return;
    setScenes((prev) =>
      prev.map((s) => {
        if ((target === "all" || s.id === target) && s.state === "ready-for-review") {
          const { requested: _dropped, ...rest } = s;
          return { ...rest, state: "approved" as SceneState };
        }
        return s;
      })
    );
    const count = target === "all" ? scenes.length : 1;
    setExtraCredits((c) => c + REVISION_CREDITS * count);
    setPlayingScene(null);
    setReviewNote(
      `${targetLabel(target)} is approved again. The extra simulated credits for this revision are listed separately in the receipt below.`
    );
    setActiveRequest(null);
  }

  const allScenesApproved = scenes.every((s) => s.state === "approved");
  const scenesNeedingReview = scenes.filter((s) => s.state !== "approved");

  function playScene(id: number) {
    setPlayingScene((current) => {
      const next = current === id ? null : id;
      setPlaying(next !== null);
      return next;
    });
  }

  function approveCompleteVideo() {
    if (!allScenesApproved) return;
    setVideoApproved(true);
    setApproveConfirmOpen(false);
    setPlaying(false);
    setPlayingScene(null);
    setReviewNote("Your video is approved and ready for the next step.");
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
          <Video className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold md:text-3xl">Video Studio</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Script, voice, and assemble faceless videos with AI — from idea to upload-ready. Add your
          own photos and clips below; everything in this prototype is simulated, so no credits are
          used.
        </p>
      </header>

      {/* Upload area */}
      <section ref={uploadSectionRef} id="upload-area">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload your photos or video clips"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-12 text-center transition-colors md:py-16",
            dragging
              ? "border-primary bg-primary/10"
              : "border-border bg-card/50 hover:border-primary/60 hover:bg-accent/40"
          )}
        >
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-accent text-primary">
            <Upload className="size-8" />
          </div>
          <h2 className="text-lg font-bold tracking-wide md:text-2xl">
            UPLOAD YOUR PHOTOS OR VIDEO CLIPS
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Drag files here or click to choose files.
          </p>
          <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground">
            Accepted files: JPG, PNG, MP4, MOV
          </p>
          <Button className="mt-6 w-full sm:w-auto" type="button" tabIndex={-1}>
            Choose files
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={replaceRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files, replaceTargetRef.current ?? undefined);
            replaceTargetRef.current = null;
            e.target.value = "";
          }}
        />

        {notice && (
          <p
            role="status"
            className={cn(
              "mt-4 rounded-lg border px-4 py-3 text-sm",
              notice.includes("accepted") || notice.includes("removed")
                ? "border-border bg-card text-muted-foreground"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            )}
          >
            {notice}
          </p>
        )}
      </section>

      {/* Project assets */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            Project assets{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({confirmed.length} confirmed)
            </span>
          </h2>
          {assets.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Saved to this demo project only — files stay in your browser.
            </span>
          )}
        </div>

        {assets.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
            No files yet. Every upload will appear here with a preview and a clear status before
            production can start.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-video w-full bg-accent/40">
                  {asset.kind === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={asset.url}
                      controls
                      playsInline
                      className="size-full object-cover"
                    />
                  )}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                    {asset.kind === "image" ? (
                      <ImageIcon className="size-3.5" />
                    ) : (
                      <FileVideo className="size-3.5" />
                    )}
                    {formatSize(asset.size)}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <p className="truncate text-sm font-medium" title={asset.name}>
                    {asset.name}
                  </p>

                  {asset.status === "uploading" && (
                    <div className="space-y-2">
                      <Progress value={asset.progress} />
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="size-3.5 animate-spin" />
                        Uploading… {Math.round(asset.progress)}%
                      </p>
                    </div>
                  )}

                  {asset.status === "success" && (
                    <p className="flex items-center gap-2 text-sm font-semibold text-green-500">
                      <CheckCircle2 className="size-4.5" />
                      Upload Successful
                    </p>
                  )}

                  {asset.status === "error" && (
                    <p className="flex items-start gap-2 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
                      <span>{asset.error}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        replaceTargetRef.current = asset.id;
                        replaceRef.current?.click();
                      }}
                    >
                      <RefreshCw className="size-4" />
                      Replace
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => removeAsset(asset.id)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* What would you like to create? */}
      {confirmed.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold tracking-wide md:text-xl">
            WHAT WOULD YOU LIKE TO CREATE?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose one format for this production run. Not sure? Let FACELESS analyze your confirmed
            assets and recommend the strongest option — technical settings stay behind the scenes.
          </p>

          <div
            role="radiogroup"
            aria-label="Choose a video type"
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {VIDEO_TYPES.map((opt) => {
              const selected = videoType === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectVideoType(opt.id)}
                  className={cn(
                    "flex min-h-28 flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/15 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:border-primary/60 hover:bg-accent/40"
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        selected ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    {selected && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <CheckCircle2 className="size-4" />
                        Selected
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>

          {videoType === "faceless-decide" && recommendation && (
            <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="size-4.5" />
                FACELESS recommendation (simulated)
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on {confirmed.length} confirmed asset{confirmed.length > 1 ? "s" : ""} (
                {confirmed.filter((a) => a.kind === "image").length} photo
                {confirmed.filter((a) => a.kind === "image").length === 1 ? "" : "s"},{" "}
                {confirmed.filter((a) => a.kind === "video").length} clip
                {confirmed.filter((a) => a.kind === "video").length === 1 ? "" : "s"}). No AI
                provider was called and no credits were spent.
              </p>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Recommended video format", recommendation.format],
                  ["Recommended video length", recommendation.length],
                  ["Recommended visual style", recommendation.style],
                  ["Narration", recommendation.narration],
                  ["Captions", recommendation.captions],
                  ["Music", recommendation.music],
                  ["Original sound", recommendation.originalSound],
                ].map(([term, detail]) => (
                  <div key={term} className="rounded-lg border border-border bg-card p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {term}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed">{detail}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 rounded-lg border border-border bg-card p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Missing footage or information needed
                </p>
                <ul className="mt-2 space-y-1.5">
                  {recommendation.missing.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm leading-relaxed">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-sm font-semibold text-gold">
                “You Decide Where You’re Going. Your AI Army Does the Work.”
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setRecAccepted(true)}
                  disabled={recAccepted}
                  className="w-full sm:w-auto"
                >
                  {recAccepted ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Recommendation accepted
                    </>
                  ) : (
                    "Accept this recommendation"
                  )}
                </Button>
                {!recAccepted && (
                  <p className="text-xs text-muted-foreground">
                    Or pick a different video type above instead.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Creative direction */}
      {canProduce && videoType && (
        <CreativeDirection
          assets={confirmed.map((a) => ({ id: a.id, name: a.name, kind: a.kind }))}
          videoType={videoType}
          acceptedRecommendation={
            videoType === "faceless-decide" && recommendation
              ? {
                  length: recommendation.length,
                  style: recommendation.style,
                  narration: recommendation.narration,
                  captions: recommendation.captions,
                  music: recommendation.music,
                  originalSound: recommendation.originalSound,
                }
              : null
          }
          approved={directionApproved}
          onApprove={() => setDirectionApproved(true)}
          onAddMoreFiles={() => {
            uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onReviewProductionOptions={() => {
            costSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      )}

      {/* Know your cost before you create */}
      {canProduce && directionApproved && (
        <section ref={costSectionRef} className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold tracking-wide md:text-xl">
            KNOW YOUR COST BEFORE YOU CREATE
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick one production level. Nothing is charged when you select — credits are only shown as
            an estimate until you approve, and every number here is simulated for this prototype.
          </p>

          <div role="radiogroup" aria-label="Choose a production level" className="mt-5 grid gap-3 lg:grid-cols-3">
            {LEVELS.map((opt) => {
              const selected = level === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setLevel(opt.id)}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/15 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:border-primary/60 hover:bg-accent/40"
                  )}
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold tracking-wide">{opt.name}</span>
                    {opt.recommended && (
                      <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-gold-foreground">
                        RECOMMENDED
                      </span>
                    )}
                    {selected && (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <CheckCircle2 className="size-4" />
                        Selected
                      </span>
                    )}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{opt.tagline}</span>
                  <span className="flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                      <Coins className="size-4" />
                      {opt.credits} credits (est.)
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-4" />
                      {formatMinutes(opt.minutes)}
                    </span>
                  </span>
                  <ul className="space-y-1">
                    {opt.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-xs leading-relaxed">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {selectedLevel && (
            <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 p-5">
              <p className="text-sm font-semibold text-primary">Cost summary (simulated)</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Selected production level", selectedLevel.name],
                  ["Estimated credit cost", `${selectedLevel.credits} credits`],
                  ["Current credit balance", `${DEMO_CREDIT_BALANCE} credits`],
                  ["Estimated balance after production", `${balanceAfter} credits`],
                  ["Estimated completion time", formatMinutes(selectedLevel.minutes)],
                ].map(([term, detail]) => (
                  <div key={term} className="rounded-lg border border-border bg-card p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {term}
                    </dt>
                    <dd className="mt-1 text-sm font-medium">{detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 rounded-lg border border-border bg-card p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Everything included at this level
                </p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {selectedLevel.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm leading-relaxed">
                      <Check className="mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No credits are subtracted for choosing an option. Nothing starts until you click
                Approve and Create.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Approval gate */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Approve and create</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {readyToApprove
            ? `${confirmed.length} file${confirmed.length > 1 ? "s" : ""} confirmed, video type set, and production level chosen. Approve to start the simulated run.`
            : "Production is locked until everything below is complete."}
        </p>
        {!readyToApprove && approvalBlockers.length > 0 && (
          <div className="mt-3 rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Still needed before production can begin
            </p>
            <ul className="mt-2 space-y-1.5">
              {approvalBlockers.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          className="mt-4 w-full sm:w-auto"
          disabled={!readyToApprove || producing}
          onClick={approveAndCreate}
        >
          {producing && <Loader2 className="size-4 animate-spin" />}
          {producing ? "Producing…" : "APPROVE AND CREATE"}
        </Button>
      </section>

      {/* Production progress */}
      {approved && (
        <section className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-semibold">Production progress (simulated)</h2>
          <ol className="mt-4 space-y-2.5">
            {PRODUCTION_STEPS.map((step, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex && producing;
              return (
                <li
                  key={step}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm",
                    done
                      ? "border-green-500/40 bg-green-500/10"
                      : active
                        ? "border-primary bg-primary/15"
                        : "border-border bg-card/50 text-muted-foreground"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                  ) : active ? (
                    <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
                  ) : (
                    <Circle className="size-5 shrink-0" />
                  )}
                  <span className={cn("font-medium", done && "text-green-500")}>{step}</span>
                  <span className="ml-auto text-xs uppercase tracking-wide">
                    {done ? "Completed" : active ? "In progress" : "Upcoming"}
                  </span>
                </li>
              );
            })}
          </ol>
          <Progress className="mt-4" value={(stepIndex / PRODUCTION_STEPS.length) * 100} />
          <p className="mt-2 text-xs text-muted-foreground">
            This run is simulated inside your browser. No AI provider is contacted and no real video
            is produced.
          </p>
        </section>
      )}

      {/* Review area */}
      {produced && selectedLevel && (
        <>
          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <h2 className="text-lg font-semibold">Review your video</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              “Stoic Wealth — Draft Cut” · {selectedLevel.name} level · simulated preview only.
            </p>

            {videoApproved && (
              <p
                role="status"
                className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm font-semibold text-green-500"
              >
                <CheckCircle2 className="size-5 shrink-0" />
                APPROVED — Your video is approved and ready for the next step.
              </p>
            )}

            <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-accent/40">
              <div className="text-center">
                <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {playing ? <Pause className="size-7" /> : <Play className="size-7" />}
                </span>
                <p className="text-sm font-medium">
                  {playing
                    ? playingScene !== null
                      ? `Playing revised ${targetLabel(playingScene).toLowerCase()} (simulated)…`
                      : "Simulated playback running…"
                    : "Simulated video preview"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {scenes.length} scenes · {formatMinutes(selectedLevel.minutes)} of simulated render
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Button onClick={() => { setPlayingScene(null); setPlaying((p) => !p); }}>
                {playing && playingScene === null ? <Pause className="size-4" /> : <Play className="size-4" />}
                {playing && playingScene === null ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                disabled={!allScenesApproved || videoApproved}
                title={
                  !allScenesApproved
                    ? "Review and approve all revised scenes before approving the complete video."
                    : undefined
                }
                onClick={() => setApproveConfirmOpen(true)}
              >
                {videoApproved ? <CheckCircle2 className="size-4 text-green-500" /> : <ThumbsUp className="size-4" />}
                {videoApproved ? "Video Approved" : "Approve Video"}
              </Button>
              <Button variant="outline" onClick={() => openChangePanel(null)}>
                <MessageSquare className="size-4" />
                Request Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setReviewNote("Saved as a demo draft. It would appear in My Videos as a draft.")}
              >
                <Save className="size-4" />
                Save as Draft
              </Button>
              <Button
                variant="outline"
                disabled={!videoApproved}
                title={
                  !videoApproved
                    ? "Approve the complete video first — then you can prepare it for YouTube."
                    : undefined
                }
                onClick={() => {
                  setPrepOpen(true);
                  setTimeout(() => {
                    prepSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
              >
                <Youtube className="size-4" />
                Prepare for YouTube
              </Button>
            </div>

            {!allScenesApproved && !videoApproved && (
              <p role="note" className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  Review and approve all revised scenes before approving the complete video.
                  {scenesNeedingReview.length > 0 &&
                    ` Still waiting: ${scenesNeedingReview.map((s) => s.title).join(", ")}.`}
                </span>
              </p>
            )}

            {/* Final-approval confirmation panel */}
            {approveConfirmOpen && !videoApproved && (
              <div className="mt-5 rounded-xl border border-primary/50 bg-primary/5 p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
                  Approve this complete video?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  This is a simulated approval. Nothing will be published and no real video is
                  created.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setApproveConfirmOpen(false)}
                  >
                    Go Back and Review
                  </Button>
                  <Button className="w-full sm:flex-1" onClick={approveCompleteVideo}>
                    <ThumbsUp className="size-4" />
                    Approve Complete Video
                  </Button>
                </div>
              </div>
            )}

            {/* Change-request panel */}
            {panelOpen && (
              <div className="mt-5 rounded-xl border border-primary/50 bg-primary/5 p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
                  Select what you want changed
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["all", ...scenes.map((s) => s.id)] as ("all" | number)[]).map((opt) => {
                    const selected = panelTarget === opt;
                    return (
                      <button
                        key={String(opt)}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setPanelTarget(opt);
                          setPanelError(null);
                          if (opt !== "all") setEntireConfirmed(false);
                        }}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-accent text-foreground"
                            : "border-border bg-card/50 hover:border-primary/50"
                        )}
                      >
                        <span>{opt === "all" ? "Entire Video" : targetLabel(opt)}</span>
                        {selected && <Check className="size-4 shrink-0 text-primary" />}
                      </button>
                    );
                  })}
                </div>

                {panelTarget === "all" && (
                  <div className="mt-3 rounded-lg border border-gold/40 bg-gold/10 p-3">
                    <p className="flex items-start gap-2 text-sm leading-relaxed">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>
                        Changing the entire video affects all {scenes.length} scenes, including the
                        ones you already approved. Every scene will be rebuilt in the simulation.
                      </span>
                    </p>
                    <label className="mt-3 flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 accent-primary"
                        checked={entireConfirmed}
                        onChange={(e) => {
                          setEntireConfirmed(e.target.checked);
                          setPanelError(null);
                        }}
                      />
                      <span>Yes — change all scenes.</span>
                    </label>
                  </div>
                )}

                <div className="mt-4">
                  <label
                    htmlFor="change-instructions"
                    className="text-sm font-bold uppercase tracking-wide text-primary"
                  >
                    Describe the change you want
                  </label>
                  <Textarea
                    id="change-instructions"
                    rows={4}
                    value={panelText}
                    onChange={(e) => {
                      setPanelText(e.target.value);
                      setPanelError(null);
                    }}
                    placeholder="Make Scene 3 more exciting and show the strongest result sooner."
                    className="mt-2"
                  />
                </div>

                {panelError && (
                  <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{panelError}</span>
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={closeChangePanel}>
                    Cancel
                  </Button>
                  <Button className="w-full sm:flex-1" onClick={submitChangeRequest}>
                    <MessageSquare className="size-4" />
                    Submit Change Request
                  </Button>
                </div>
              </div>
            )}

            {/* Submitted change request */}
            {activeRequest && !panelOpen && (
              <div className="mt-5 rounded-xl border border-primary/50 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Change requested
                </p>
                <p className="mt-2 text-sm font-semibold">{targetLabel(activeRequest.target)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  “{activeRequest.text}”
                </p>

                {scenes.some((s) => s.state === "change-requested") && (
                  <Button className="mt-4 w-full sm:w-auto" onClick={regenerateSelected}>
                    <RotateCcw className="size-4" />
                    Regenerate Selected Scene
                  </Button>
                )}

                {scenes.some((s) => s.state === "regenerating") && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="size-4 animate-spin" />
                    Regenerating {targetLabel(activeRequest.target).toLowerCase()} in the simulation…
                  </p>
                )}

                {scenes.some((s) => s.state === "ready-for-review") && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button className="w-full sm:flex-1" onClick={() => approveRevisedScene()}>
                      <ThumbsUp className="size-4" />
                      Approve Revised Scene
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => openChangePanel(activeRequest.target)}
                    >
                      <MessageSquare className="size-4" />
                      Request Another Change
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scenes — regenerate only what you want changed
              </p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {scenes.map((scene) => (
                  <li
                    key={scene.id}
                    id={`scene-card-${scene.id}`}
                    className={cn(
                      "rounded-lg border bg-card/50 p-3",
                      scene.state === "ready-for-review"
                        ? "border-primary ring-2 ring-primary/60"
                        : "border-border"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{scene.title}</p>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          scene.state === "approved"
                            ? "text-green-500"
                            : scene.state === "change-requested"
                              ? "text-gold"
                              : "text-primary"
                        )}
                      >
                        {SCENE_STATE_LABEL[scene.state]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{scene.note}</p>
                    {scene.requested && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gold">
                        Requested: “{scene.requested}”
                      </p>
                    )}

                    {scene.state === "ready-for-review" ? (
                      <div className="mt-3 space-y-2">
                        <p role="status" className="rounded-md border border-primary/40 bg-primary/10 p-2 text-xs leading-relaxed">
                          Your revised scene is ready. Watch the revised scene, then approve it or
                          request another change.
                        </p>
                        <div className="grid gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => playScene(scene.id)}
                          >
                            {playing && playingScene === scene.id ? (
                              <Pause className="size-4" />
                            ) : (
                              <Play className="size-4" />
                            )}
                            {playing && playingScene === scene.id
                              ? "Pause Revised Scene"
                              : "Play Revised Scene"}
                          </Button>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => approveRevisedScene(scene.id)}
                          >
                            <ThumbsUp className="size-4" />
                            Approve Revised Scene
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => openChangePanel(scene.id)}
                          >
                            <MessageSquare className="size-4" />
                            Request Another Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        disabled={scene.state === "regenerating" || videoApproved}
                        onClick={() => openChangePanel(scene.id)}
                      >
                        {scene.state === "regenerating" ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <RotateCcw className="size-4" />
                        )}
                        Regenerate This Scene
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {reviewNote && (
              <p role="status" className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm">
                {reviewNote}
              </p>
            )}
          </section>

          {/* Usage receipt */}
          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Receipt className="size-5 text-primary" />
              Usage receipt (simulated)
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Estimated credits approved", `${selectedLevel.credits} credits`],
                ["Simulated credits used", `${creditsUsed ?? selectedLevel.credits} credits`],
                ...(extraCredits > 0
                  ? ([
                      [
                        "Additional approved revisions (simulated)",
                        `${extraCredits} credits`,
                      ],
                    ] as [string, string][])
                  : []),
                [
                  "Remaining simulated balance",
                  `${DEMO_CREDIT_BALANCE - (creditsUsed ?? selectedLevel.credits) - extraCredits} credits`,
                ],
                ["Production level", selectedLevel.name],
                ["Completion status", videoApproved ? "Completed — Video Approved" : "Completed — ready for review"],
              ].map(([term, detail]) => (
                <div key={term} className="rounded-lg border border-border bg-card/50 p-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {term}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">
              Failed or retried demo tasks were not charged twice
              {retries > 0 ? ` — ${retries} scene retr${retries === 1 ? "y" : "ies"} in this run cost nothing extra.` : "."}{" "}
              This is a prototype receipt: no real credits were spent and no payment was taken.
            </p>
          </section>

          {/* Prepare for YouTube — unlocked only after the complete video is approved */}
          {videoApproved && prepOpen && videoType && (
            <div ref={prepSectionRef}>
              <PrepareForYouTube
                videoType={videoType}
                productionLevel={selectedLevel?.name}
                onReturnToStudio={() => {
                  uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
