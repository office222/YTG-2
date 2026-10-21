import {
  AlertCircle,
  CheckCircle2,
  Film,
  ListOrdered,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type DirectionAsset = { id: string; name: string; kind: "image" | "video" };

export type DirectionVideoType =
  | "youtube-video"
  | "youtube-short"
  | "promo"
  | "how-to"
  | "before-after"
  | "faceless-decide";

type AcceptedRecommendation = {
  length: string;
  style: string;
  narration: string;
  captions: string;
  music: string;
  originalSound: string;
} | null;

type Plan = {
  typeLabel: string;
  length: string;
  aspect: string;
  style: string;
  pacing: string;
  narration: string;
  captions: string;
  music: string;
  originalSound: string;
  audience: string;
  purpose: string;
  structure: string[];
  message: string;
  cta: string;
};

const TYPE_LABEL: Record<DirectionVideoType, string> = {
  "youtube-video": "YouTube Video",
  "youtube-short": "YouTube Short",
  promo: "Promotional Video",
  "how-to": "How-To Video",
  "before-after": "Before-and-After Video",
  "faceless-decide": "Let FACELESS Decide",
};

function buildPlan(
  type: DirectionVideoType,
  assets: DirectionAsset[],
  rec: AcceptedRecommendation
): Plan {
  const clips = assets.filter((a) => a.kind === "video").length;
  const photos = assets.filter((a) => a.kind === "image").length;
  const material = `${photos} photo${photos === 1 ? "" : "s"} and ${clips} clip${clips === 1 ? "" : "s"}`;

  const base = {
    captions: "Yes — burned-in captions so the video works with the sound off.",
    music: "Yes — a background track kept well under the spoken words.",
    originalSound: clips
      ? "Original clip sound is lowered and kept only where it adds atmosphere."
      : "Not applicable — your photos carry no sound.",
  };

  switch (type) {
    case "youtube-short":
      return {
        typeLabel: TYPE_LABEL[type],
        length: "About 30–60 seconds",
        aspect: "9:16 vertical",
        style: "Punchy vertical framing, bold on-screen words, tight crops on your strongest asset.",
        pacing: "Fast — a new visual roughly every 2 seconds, no slow intro.",
        narration: "Yes — a short, energetic voiceover of roughly 90 words.",
        ...base,
        audience: "Scrolling viewers who have never seen your channel before.",
        purpose: "Stop the scroll and win a follow in under a minute.",
        structure: [
          "Opening hook in the first 2 seconds",
          "The one idea, stated plainly",
          "Your strongest footage as proof",
          "Quick payoff or result",
          "Call to action",
        ],
        message: `A fast vertical cut built from ${material}: open on the most striking moment, state the single idea in one sentence, then show the proof and close before attention drops.`,
        cta: "Follow for more",
      };
    case "promo":
      return {
        typeLabel: TYPE_LABEL[type],
        length: clips ? "About 60–90 seconds" : "About 45–75 seconds, based on the material you confirmed",
        aspect: "16:9 with a 1:1 crop kept safe for social",
        style: "Polished and confident — clean type, product-forward framing, restrained motion.",
        pacing: "Brisk, building to the offer.",
        narration: "Yes — a warm, persuasive voiceover that leads to the offer.",
        ...base,
        audience: "Warm viewers who already have the problem your offer solves.",
        purpose: "Present the offer clearly and send viewers to your landing page.",
        structure: [
          "Opening hook",
          "The problem it solves",
          "What you are offering, shown with your footage",
          "The strongest benefit or result",
          "Closing message",
          "Call to action",
        ],
        message: `A short promotional cut using ${material}: name the problem, present the offer in plain language, show it working, then point viewers to the next step.`,
        cta: "Visit our website",
      };
    case "how-to":
      return {
        typeLabel: TYPE_LABEL[type],
        length: "About 3–6 minutes",
        aspect: "16:9",
        style: "Clear and instructional — numbered step titles, steady framing, close-ups on the detail that matters.",
        pacing: "Measured, with a beat of breathing room after each step.",
        narration: "Yes — a calm, instructional voiceover that names each step.",
        ...base,
        audience: "Viewers actively searching for how to get this specific result.",
        purpose: "Teach one skill end to end so the viewer can repeat it.",
        structure: [
          "Opening hook — the finished result first",
          "What you will need",
          "Step 1",
          "Step 2",
          "Step 3",
          "The finished result again",
          "Call to action",
        ],
        message: `A step-by-step walkthrough built from ${material}: show the finished result first, then take the viewer through each step in order, and finish by repeating the result.`,
        cta: "Learn more below",
      };
    case "before-after":
      return {
        typeLabel: TYPE_LABEL[type],
        length: "About 60–120 seconds",
        aspect: "16:9",
        style: "Split-screen or hard-cut comparison, with the before state kept short and the after state held longer.",
        pacing: "Slow on the comparison, quicker through the middle, slow again on the reveal.",
        narration: "Yes — a short voiceover that frames the change without over-explaining.",
        ...base,
        audience: "Viewers who want the same change and need to see it is possible.",
        purpose: "Prove the transformation with your own material.",
        structure: [
          "Opening comparison — before beside after",
          "The starting point, honestly shown",
          "What changed, in the middle footage",
          "The transformation revealed in full",
          "Closing message",
          "Call to action",
        ],
        message: `A transformation cut from ${material}: open on the before-and-after side by side, walk back through the starting point, show what changed, then hold on the finished result.`,
        cta: "See the full transformation",
      };
    case "faceless-decide":
      return {
        typeLabel: TYPE_LABEL[type],
        length: rec?.length ?? "About 4–8 minutes",
        aspect: "16:9",
        style: rec?.style ?? "Clean cinematic cuts with calm pacing and on-screen key phrases.",
        pacing: "Calm and steady, with a lift before each key point.",
        narration: rec?.narration ?? "Yes — a calm, confident voiceover across the whole video.",
        captions: rec?.captions ?? base.captions,
        music: rec?.music ?? base.music,
        originalSound: rec?.originalSound ?? base.originalSound,
        audience: "Your core channel audience, plus viewers arriving from search.",
        purpose: "Deliver the value promised in the title and keep viewers watching to the end.",
        structure: [
          "Opening hook",
          "The question the video answers",
          "Main footage and explanation",
          "Strongest moment or result",
          "Closing message",
          "Call to action",
        ],
        message: `Built from the recommendation you accepted and ${material}: open with the promise, answer it in the middle with your own footage, and close on the strongest moment.`,
        cta: "Subscribe for more",
      };
    default:
      return {
        typeLabel: TYPE_LABEL["youtube-video"],
        length: "About 4–8 minutes",
        aspect: "16:9",
        style: "Clean cinematic cuts, dark navy and electric-blue grade, bold on-screen key phrases.",
        pacing: "Steady, with a visual change roughly every 5 seconds.",
        narration: "Yes — a calm, confident voiceover from start to finish.",
        ...base,
        audience: "Viewers of your niche who want depth, not a quick clip.",
        purpose: "Build watch time and earn the subscribe at the end.",
        structure: [
          "Opening hook",
          "The question or starting point",
          "Main footage and explanation",
          "Strongest moment or result",
          "Closing message",
          "Call to action",
        ],
        message: `A full-length cut built from ${material}: open with a hook, set up the question, deliver the main explanation over your footage, and land on the strongest moment before the close.`,
        cta: "Subscribe for more",
      };
  }
}

const USE_ROLES = [
  "Opening shot",
  "Supporting footage",
  "Demonstration clip",
  "Background image",
  "Closing shot",
];

function roleFor(type: DirectionVideoType, asset: DirectionAsset, index: number, total: number) {
  if (type === "before-after") {
    if (index === 0) return "Before footage";
    if (index === total - 1) return "After footage";
    return asset.kind === "video" ? "Demonstration clip" : "Supporting footage";
  }
  if (index === 0) return "Opening shot";
  if (index === total - 1 && total > 1) return "Closing shot";
  if (asset.kind === "video") return index % 2 === 0 ? "Demonstration clip" : "Supporting footage";
  return USE_ROLES[3];
}

function missingFootage(type: DirectionVideoType, assets: DirectionAsset[]) {
  const clips = assets.filter((a) => a.kind === "video").length;
  const photos = assets.filter((a) => a.kind === "image").length;
  const out: string[] = [];
  if (clips === 0) out.push("A short moving clip would make the middle of the video feel less static.");
  if (photos === 0) out.push("One clear still image would give the opening frame and thumbnail more impact.");
  if (assets.length < 3) out.push("Two or three more files would give the edit more variety to cut between.");
  if (type === "before-after" && assets.length < 2)
    out.push("A clear ‘after’ file is what makes the comparison land — one more file would help.");
  if (type === "how-to" && assets.length < 3)
    out.push("One file per step keeps a how-to easy to follow.");
  if (out.length === 0)
    out.push("Nothing is missing — your confirmed files cover every part of this plan.");
  return out;
}

export function CreativeDirection({
  assets,
  videoType,
  acceptedRecommendation,
  approved,
  onApprove,
  onAddMoreFiles,
  onReviewProductionOptions,
}: {
  assets: DirectionAsset[];
  videoType: DirectionVideoType;
  acceptedRecommendation: AcceptedRecommendation;
  approved: boolean;
  onApprove: () => void;
  onAddMoreFiles: () => void;
  onReviewProductionOptions: () => void;
}) {
  // Stable signature so edits are not wiped on every parent re-render.
  const signature = assets.map((a) => `${a.id}:${a.kind}`).join(",");
  const plan = useMemo(
    () => buildPlan(videoType, assets, acceptedRecommendation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoType, signature, acceptedRecommendation]
  );

  const [structure, setStructure] = useState(plan.structure);
  const [message, setMessage] = useState(plan.message);
  const [cta, setCta] = useState(plan.cta);
  const [improving, setImproving] = useState(false);
  const [improvements, setImprovements] = useState<string[] | null>(null);
  const [continuedAsIs, setContinuedAsIs] = useState(false);

  // Re-seed the editable draft when the plan itself changes.
  useEffect(() => {
    setStructure(plan.structure);
    setMessage(plan.message);
    setCta(plan.cta);
    setImprovements(null);
  }, [plan]);

  const missing = missingFootage(videoType, assets);

  function improve() {
    setImproving(true);
    const timer = setTimeout(() => {
      const improvedStructure = [
        `${structure[0]} — sharpened to land in the first 2 seconds`,
        ...structure.slice(1, -1),
        "Closing message with one clear next step",
        structure[structure.length - 1] ?? "Call to action",
      ].filter(Boolean) as string[];
      setStructure(improvedStructure);
      setMessage(
        `${message} The opening now leads with the single most surprising detail, and the middle drops one slow section so the pacing keeps moving.`
      );
      setCta(cta.trim() ? `${cta} — link in the description` : "Subscribe for more");
      setImprovements([
        "Hook: moved the strongest detail into the first two seconds instead of the setup.",
        "Pacing: removed one slow stretch in the middle so the video keeps moving.",
        "Structure: added a clear closing message before the call to action.",
        "Call to action: made it specific and pointed at one next step.",
      ]);
      setImproving(false);
    }, 1100);
    return () => clearTimeout(timer);
  }

  const rows: [string, string][] = [
    ["Selected video type", plan.typeLabel],
    ["Recommended video length", plan.length],
    ["Recommended aspect ratio", plan.aspect],
    ["Suggested visual style", plan.style],
    ["Suggested pacing", plan.pacing],
    ["Narration", plan.narration],
    ["Captions", plan.captions],
    ["Music", plan.music],
    ["Original uploaded sound", plan.originalSound],
    ["Intended audience", plan.audience],
    ["Primary purpose", plan.purpose],
  ];

  return (
    <section
      id="creative-direction"
      className="rounded-xl border border-border bg-card p-5 md:p-6"
    >
      <h2 className="text-lg font-bold tracking-wide md:text-xl">CREATIVE DIRECTION</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Here is the plan FACELESS suggests for your confirmed files and chosen format. Everything on
        this screen is a simulated draft you can change — nothing is produced and no credits are
        used.
      </p>

      {/* 1. Recommended approach */}
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
          <Sparkles className="size-4" />
          Recommended approach
        </h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {rows.map(([term, detail]) => (
            <div key={term} className="rounded-lg border border-border bg-card/50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {term}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 2. Story and structure */}
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
          <ListOrdered className="size-4" />
          Story and structure
        </h3>
        <ol className="mt-3 space-y-2">
          {structure.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-card/50 px-3 py-2.5 text-sm leading-relaxed"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 3. Footage plan */}
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
          <Film className="size-4" />
          Footage plan
        </h3>
        <ul className="mt-3 space-y-2">
          {assets.map((asset, i) => (
            <li
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium" title={asset.name}>
                {asset.name}
              </span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
                {roleFor(videoType, asset, i, assets.length)}
              </span>
            </li>
          ))}
          {assets.some((a) => a.kind === "video") && (
            <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5">
              <span className="text-sm font-medium">Sound from your clips</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
                Original audio
              </span>
            </li>
          )}
        </ul>

        <div className="mt-4 rounded-lg border border-gold/40 bg-gold/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            Missing or helpful footage
          </p>
          <ul className="mt-2 space-y-1.5">
            {missing.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm leading-relaxed">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            These are suggestions only. You can always continue with the files you have.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={onAddMoreFiles}>
              <Upload className="size-4" />
              ADD MORE FILES
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setContinuedAsIs(true)}
            >
              <CheckCircle2 className="size-4" />
              CONTINUE WITH WHAT I HAVE
            </Button>
          </div>
          {continuedAsIs && (
            <p role="status" className="mt-3 text-sm text-muted-foreground">
              Continuing with your {assets.length} confirmed file
              {assets.length === 1 ? "" : "s"}. Nothing was removed.
            </p>
          )}
        </div>
      </div>

      {/* 4. Video message */}
      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="video-message"
            className="text-sm font-bold uppercase tracking-wide text-primary"
          >
            What should this video say?
          </label>
          <Textarea
            id="video-message"
            value={message}
            rows={5}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            This is a draft — edit it in your own words before you continue.
          </p>
        </div>
        <div>
          <label htmlFor="video-cta" className="text-sm font-bold uppercase tracking-wide text-primary">
            Call to action{" "}
            <span className="font-normal normal-case tracking-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <Input
            id="video-cta"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="Subscribe for more · Visit our website · Call today · See the full transformation · Learn more below"
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Leave this empty if you would rather end without asking for anything.
          </p>
        </div>
      </div>

      {/* 5. User decision */}
      {improvements && (
        <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Wand2 className="size-4" />
            What FACELESS improved (simulated second pass)
          </p>
          <ul className="mt-2 space-y-1.5">
            {improvements.map((imp) => (
              <li key={imp} className="flex items-start gap-2 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            The revised plan is shown above. Accept it below, or keep editing.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="w-full sm:flex-1" onClick={onApprove}>
          <CheckCircle2 className="size-5" />
          {improvements ? "USE THE REVISED DIRECTION" : "USE THIS CREATIVE DIRECTION"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:flex-1"
          disabled={improving}
          onClick={improve}
        >
          {improving ? <Loader2 className="size-5 animate-spin" /> : <Wand2 className="size-5" />}
          {improving ? "Improving…" : "LET FACELESS IMPROVE IT"}
        </Button>
      </div>

      {approved && (
        <div
          className={cn(
            "mt-6 rounded-xl border border-green-500/40 bg-green-500/10 p-5 text-center sm:text-left"
          )}
        >
          <p className="flex items-center justify-center gap-2 text-base font-bold tracking-wide text-green-500 sm:justify-start">
            <CheckCircle2 className="size-5" />
            CREATIVE DIRECTION APPROVED
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your plan is locked in for this demo run. Your uploads, video type and edits are all kept.
          </p>
          <Button className="mt-4 w-full sm:w-auto" onClick={onReviewProductionOptions}>
            REVIEW PRODUCTION OPTIONS
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Next step — quality levels and cost.</p>
        </div>
      )}
    </section>
  );
}
