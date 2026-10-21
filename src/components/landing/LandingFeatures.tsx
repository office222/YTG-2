import { ArrowRight, Check, Minus, ShoppingBag } from "lucide-react";
import researchShot from "@/assets/demo-research.jpg";
import videosShot from "@/assets/demo-videos.jpg";
import playlistShot from "@/assets/demo-playlist.jpg";
import {
  MockPanel,
  Section,
  SectionHeading,
  type StatusLabel,
  StatusBadge,
} from "./primitives";

type Feature = {
  name: string;
  image?: string;
  imageAlt?: string;
  mock?: string;
  text: string;
  outcome: string;
  status: StatusLabel;
};

const FEATURES: Feature[] = [
  {
    name: "Niche Navigator",
    image: researchShot,
    imageAlt: "The Check My Niche form used by Niche Navigator.",
    text: "Describe a channel idea and have it examined before you invest a single production hour. Niche Navigator captures the niche, the audience and the intent behind the channel.",
    outcome: "You stop guessing which niche deserves your next three months.",
    status: "AVAILABLE IN DEMO",
  },
  {
    name: "Niche Opportunity Report",
    image: researchShot,
    imageAlt: "A completed Niche Opportunity Report.",
    text: "A written verdict on the direction you submitted, laid out so you can act on it. Save it, choose it as your channel niche, or compare it against a second idea.",
    outcome: "You commit to a niche with a documented reason behind it.",
    status: "AVAILABLE IN DEMO",
  },
  {
    name: "Competitor Watch",
    mock: "Competitor Watch — tracked channels",
    text: "Keep the channels you are competing with in one view instead of scattered browser tabs. Watch what they publish, how often, and where their coverage thins out.",
    outcome: "You find the gap they left open and publish into it first.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "MIMIC",
    mock: "MIMIC — pattern match",
    text: "Study the structure behind a video that worked and reuse the structure, not the content. MIMIC breaks a format down into the parts you can legitimately rebuild.",
    outcome: "You reproduce what performs without copying anyone's work.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "Video Studio",
    mock: "Video Studio — production queue",
    text: "The production floor of the AI army. Script, voice, visuals and assembly run as one job instead of five disconnected apps.",
    outcome: "You get finished videos instead of a folder of half-made parts.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "Phone Footage Creator",
    mock: "Phone Footage Creator — clip intake",
    text: "Turn footage you already shot on your phone into channel-ready video. Useful when a faceless channel still needs real-world shots.",
    outcome: "Your existing footage becomes publishable material.",
    status: "FOUNDING MEMBER ROADMAP",
  },
  {
    name: "Thumbnails & Graphics",
    mock: "Thumbnails & Graphics — variants",
    text: "Produce thumbnail and graphic options that match the video and the channel style. Compare variants side by side before you choose one.",
    outcome: "Your click-through stops depending on your design skills.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "My Videos",
    image: videosShot,
    imageAlt: "The My Videos library with filters and status badges.",
    text: "Every video in one library with search and status filters for drafts, ready, published and needs attention. Each card carries view, edit and add-to-playlist actions.",
    outcome: "You always know what is finished and what still needs work.",
    status: "AVAILABLE IN DEMO",
  },
  {
    name: "My Playlists",
    image: playlistShot,
    imageAlt: "The My Playlists page with drag-and-drop ordering.",
    text: "Create playlists, choose videos from your library, and drag them into the order that tells the story. Set each playlist to public, unlisted or private.",
    outcome: "Viewers keep watching because the next video is already queued.",
    status: "AVAILABLE IN DEMO",
  },
  {
    name: "Channel Guardian",
    mock: "Channel Guardian — health checks",
    text: "Continuous watch over channel health and policy risk. Guardian looks for the problems that quietly cost you reach, then tells you what to repair.",
    outcome: "Problems get caught while they are still small.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "Analytics",
    mock: "Analytics — growth signals",
    text: "Growth, retention and revenue signals read together rather than in isolation. Built to point at the next decision, not just display numbers.",
    outcome: "You know which change actually moved the channel.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "Landing Page Generator & Shopping Cart",
    mock: "Landing Page Generator — offer page",
    text: "Publish an offer page connected to a cart, so a video's call to action has somewhere to land. Built for creators who want a business, not only a channel.",
    outcome: "Your audience can buy from you, not just watch you.",
    status: "FOUNDING MEMBER ROADMAP",
  },
  {
    name: "Head Start Channel Marketplace",
    mock: "Head Start Marketplace — listings",
    text: "A marketplace for channels and channel foundations that already have a running start. Intended for creators who would rather build on progress than a blank slate.",
    outcome: "You begin from momentum instead of from zero.",
    status: "FOUNDING MEMBER ROADMAP",
  },
];

export function FeatureShowcase() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="THE AI ARMY"
        title="Every unit in the army, and exactly where it stands."
        lead="Each card carries one honest status label. Nothing here is described as finished before it is."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.name}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/45"
          >
            {f.image ? (
              <img
                src={f.image}
                alt={f.imageAlt ?? f.name}
                width={1280}
                height={800}
                loading="lazy"
                className="w-full rounded-xl border border-border"
              />
            ) : (
              <MockPanel
                label={f.mock ?? f.name}
                accent={f.status === "FOUNDING MEMBER ROADMAP" ? "gold" : "primary"}
              />
            )}
            <StatusBadge status={f.status} />
            <h3 className="font-display text-lg font-bold leading-snug">
              {f.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {f.text}
            </p>
            <p className="mt-auto border-t border-border pt-3 text-sm font-semibold text-foreground/90">
              <span className="text-gold">Outcome: </span>
              {f.outcome}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

const FUNNEL = [
  "YouTube Video",
  "Call to Action",
  "Landing Page",
  "Checkout",
  "Customer",
];

export function SellBeyondSection() {
  return (
    <Section id="sell" tinted>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="SELL BEYOND YOUTUBE AD REVENUE"
            title="Turn viewers into customers."
            lead="Ad revenue pays for attention you already earned. An offer pays for the trust behind it. TubeGenerator is built so the second one is part of the pipeline, not a side project."
            centered={false}
          />
          <p className="rounded-xl border border-gold/40 bg-gold/10 p-5 font-display text-base font-semibold leading-relaxed text-gold">
            YouTube supplies the audience. TubeGenerator builds the business
            around it.
          </p>
        </div>

        <ol className="flex flex-col gap-3">
          {FUNNEL.map((step, i) => (
            <li key={step} className="flex flex-col gap-3">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-display text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <span className="font-display text-base font-bold">{step}</span>
                {i === FUNNEL.length - 1 ? (
                  <ShoppingBag className="ml-auto size-5 text-gold" aria-hidden />
                ) : null}
              </div>
              {i < FUNNEL.length - 1 ? (
                <ArrowRight
                  className="mx-auto size-4 rotate-90 text-primary"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function GuardianSection() {
  return (
    <Section id="guardian">
      <SectionHeading
        eyebrow="CHANNEL GUARDIAN"
        title="TubeGenerator keeps working after you publish."
        lead="Publishing is the middle of the job, not the end of it. Guardian stays on the channel, watching for the quiet failures that cost reach — and telling you what to fix."
      />
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/45 bg-gold/10 p-8 text-center">
        <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground">
          ITS NO. 1 DIRECTIVE
        </p>
        <p className="mt-3 font-display text-2xl font-black tracking-[0.06em] text-gold md:text-3xl">
          GENERATE — AND REPAIR.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Watch",
            d: "Channel health, policy risk and performance drift are checked continuously, not on the day you remember to look.",
          },
          {
            t: "Diagnose",
            d: "When something slips, Guardian points at the part responsible — the hook, the thumbnail, the packaging, the offer.",
          },
          {
            t: "Repair",
            d: "The repair goes back into the pipeline as work, so the fix actually ships instead of sitting on a list.",
          },
        ].map((x) => (
          <div key={x.t} className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">{x.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {x.d}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Channel Guardian is in development. The demo shows its place in the
        system, not live channel monitoring.
      </p>
    </Section>
  );
}

export function MarketplaceSection() {
  return (
    <Section id="marketplace" tinted>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="HEAD START CHANNEL MARKETPLACE"
            title="Start from progress, not a blank channel."
            lead="A planned marketplace for channels and channel foundations that already have groundwork done — niche researched, direction set, early assets in place. You choose what to take over, and the AI army continues from there."
            centered={false}
          />
          <StatusBadge status="FOUNDING MEMBER ROADMAP" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            This is on the Founding Member roadmap. Listings, terms and
            availability are still being designed, and Founding Members will see
            it take shape.
          </p>
        </div>
        <MockPanel label="Head Start Marketplace — listings" lines={5} accent="gold" />
      </div>
    </Section>
  );
}

export function FeedbackSection() {
  return (
    <Section id="founding-influence">
      <SectionHeading
        eyebrow="CUSTOMER FEEDBACK AND FOUNDING MEMBER INFLUENCE"
        title="Help shape the AI army."
        lead="TubeGenerator is being built in the open with the people using it. Founding Members get a direct line into what gets built next and how it behaves."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Tell us what breaks",
            d: "Report the friction you hit inside the working demo and it goes to the build queue as a specific item.",
          },
          {
            t: "Vote on what's next",
            d: "Founding Members weigh in on which roadmap units the army gets first.",
          },
          {
            t: "See the decisions",
            d: "Changes are explained as they ship, so you can tell what moved and why.",
          },
        ].map((x) => (
          <div key={x.t} className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">{x.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {x.d}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        We do not publish ratings, review counts or testimonials, because the
        beta has not produced them yet.
      </p>
    </Section>
  );
}

const COMPARISON = [
  { row: "Choosing a niche", diy: false, tg: true },
  { row: "Written verdict before you commit", diy: false, tg: true },
  { row: "Scripts, voice, visuals in one job", diy: false, tg: true },
  { row: "Thumbnails matched to the video", diy: false, tg: true },
  { row: "Library and playlist organisation", diy: false, tg: true },
  { row: "Ongoing channel health monitoring", diy: false, tg: true },
  { row: "An offer and checkout behind the channel", diy: false, tg: true },
  { row: "One place where the stages hand off", diy: false, tg: true },
];

export function ComparisonSection() {
  return (
    <Section id="comparison" tinted>
      <SectionHeading
        eyebrow="HONEST COMPARISON"
        title="Stop assembling a business from disconnected parts."
        lead="Most creators run a keyword tool, a script tool, a voice tool, an editor, a thumbnail app, a spreadsheet and a store — and glue them together by hand every week."
      />
      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 bg-card px-5 py-4 text-xs font-bold tracking-[0.1em] text-muted-foreground">
          <span>WHAT THE JOB NEEDS</span>
          <span className="w-24 text-center">SEPARATE TOOLS</span>
          <span className="w-24 text-center text-primary">TUBEGENERATOR</span>
        </div>
        {COMPARISON.map((r) => (
          <div
            key={r.row}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-border bg-background px-5 py-4"
          >
            <span className="text-sm leading-snug">{r.row}</span>
            <span className="flex w-24 justify-center">
              <Minus className="size-4 text-muted-foreground" aria-hidden />
              <span className="sr-only">handled manually</span>
            </span>
            <span className="flex w-24 justify-center">
              <Check className="size-4 text-primary" aria-hidden />
              <span className="sr-only">part of TubeGenerator</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Comparison describes the TubeGenerator system as designed. Roadmap
        stages are labelled as such throughout this page.
      </p>
    </Section>
  );
}
