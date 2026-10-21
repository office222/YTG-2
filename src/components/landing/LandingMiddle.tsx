import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  Compass,
  Eye,
  PlayCircle,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Upload,
  Video,
  Wand2,
} from "lucide-react";
import researchShot from "@/assets/demo-research.jpg";
import videosShot from "@/assets/demo-videos.jpg";
import playlistShot from "@/assets/demo-playlist.jpg";
import dashboardShot from "@/assets/demo-dashboard.jpg";
import { DEMO_ENTRY_PATH } from "@/lib/landing-config";
import { Section, SectionHeading } from "./primitives";

const BENEFITS = [
  { icon: Search, text: "Find a viable niche" },
  { icon: Video, text: "Create complete videos" },
  { icon: Upload, text: "Publish with confidence" },
  { icon: BadgeDollarSign, text: "Sell beyond ad revenue" },
  { icon: BarChart3, text: "Monitor every result" },
  { icon: RefreshCw, text: "Repair what is not working" },
];

export function BenefitStrip() {
  return (
    <div className="border-y border-border bg-card/50 px-6 py-8">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-primary" aria-hidden />
            <span className="text-sm font-semibold leading-snug">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PROBLEMS = [
  "You picked a niche on instinct, then found out months later that nobody was searching for it.",
  "You wrote the script, recorded the voice, cut the footage, made the thumbnail — for one video.",
  "You published, watched the graph flatten, and had no idea which part to change.",
  "Ad revenue arrived slowly, so the channel never paid for the hours it consumed.",
  "Your tools never spoke to each other, so every hand-off was a copy and paste.",
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow="THE HARD PART NOBODY WARNS YOU ABOUT"
        title="Creating the video was only the beginning."
        lead="A channel is not a pile of uploads. It is a research decision, a production line, a publishing habit, an offer, and a repair loop — and most creators are running all five by hand."
      />
      <ul className="mx-auto mt-12 grid max-w-4xl gap-4">
        {PROBLEMS.map((p) => (
          <li
            key={p}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
          >
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-gold"
              aria-hidden
            />
            <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {p}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const STAGES = [
  {
    icon: Compass,
    name: "RESEARCH",
    text: "Test a niche before you commit to it, and get a written verdict instead of a hunch.",
  },
  {
    icon: Wand2,
    name: "CREATE",
    text: "Turn the approved direction into scripts, voice, visuals and thumbnails as one job.",
  },
  {
    icon: Upload,
    name: "PUBLISH",
    text: "Package titles, descriptions and playlists so each upload lands the way it was planned.",
  },
  {
    icon: ShoppingCart,
    name: "SELL",
    text: "Point viewers at a landing page and a checkout, so the channel earns more than ad revenue.",
  },
  {
    icon: Eye,
    name: "MONITOR",
    text: "Watch retention, growth and channel health continuously instead of once a month.",
  },
  {
    icon: Target,
    name: "OPTIMIZE",
    text: "Fix the specific thing that underperformed — the hook, the thumbnail, the offer.",
  },
  {
    icon: Sparkles,
    name: "GENERATE",
    text: "Feed everything you learned back into the next batch, so the channel compounds.",
  },
];

export function SolutionSection() {
  return (
    <Section id="solution" tinted>
      <SectionHeading
        eyebrow="THE COMPLETE TG SOLUTION"
        title="One system. One AI army. One destination."
        lead="You set the destination. Each stage of TubeGenerator hands its finished work to the next one, so nothing stalls between tools."
      />
      <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STAGES.map(({ icon: Icon, name, text }, i) => (
          <li
            key={name}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-display text-xs font-bold tracking-[0.14em] text-muted-foreground">
                STAGE {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold tracking-[0.06em]">
              {name}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const DEMO_ITEMS = [
  {
    title: "Check My Niche",
    image: researchShot,
    alt: "The Check My Niche form inside the TubeGenerator demo.",
    text: "Describe the channel you have in mind and submit it for analysis. The form captures the niche, audience and intent before anything is produced.",
  },
  {
    title: "Niche Opportunity Report",
    image: researchShot,
    alt: "The Niche Opportunity Report produced by the Check My Niche flow.",
    text: "The completed report returns a written verdict on the niche, so you can save it, choose it, or compare it against another direction.",
  },
  {
    title: "My Videos",
    image: videosShot,
    alt: "The My Videos library with search, filters and status badges.",
    text: "Search your library, filter by draft, ready, published or needs attention, and act on any video from its card.",
  },
  {
    title: "My Playlists",
    image: playlistShot,
    alt: "The My Playlists page with playlist cards and video ordering.",
    text: "Build playlists, drag videos into the order you want, and set each playlist to public, unlisted or private.",
  },
  {
    title: "Dashboard & Navigation",
    image: dashboardShot,
    alt: "The TubeGenerator dashboard and its side navigation.",
    text: "Move through every module from one shell — sidebar on desktop, full menu on mobile — with the demo data already in place.",
  },
];

export function WorkingDemoSection() {
  return (
    <Section id="working-demo">
      <SectionHeading
        eyebrow="AVAILABLE IN THE WORKING DEMO"
        title="Don't just read about it. Explore what we've already built."
        lead="These screens are running now. Everything you see below is the real interface from the demo, using prototype data rather than a live YouTube connection."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {DEMO_ITEMS.map((item, i) => (
          <article
            key={item.title}
            className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card ${
              i === DEMO_ITEMS.length - 1 ? "md:col-span-2" : ""
            }`}
          >
            <img
              src={item.image}
              alt={item.alt}
              width={1280}
              height={800}
              loading="lazy"
              className="w-full border-b border-border"
            />
            <div className="flex flex-1 flex-col gap-2 p-6">
              <span className="text-[0.625rem] font-bold tracking-[0.14em] text-primary">
                AVAILABLE IN THE WORKING DEMO
              </span>
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to={DEMO_ENTRY_PATH}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold tracking-[0.06em] text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <PlayCircle className="size-4" />
          EXPLORE THE WORKING DEMO
        </Link>
      </div>
    </Section>
  );
}

const STEPS = [
  {
    icon: Compass,
    title: "Choose Your Direction",
    text: "Name the niche and the audience you want. Check My Niche returns a Niche Opportunity Report so the decision is made on evidence, not enthusiasm.",
  },
  {
    icon: Rocket,
    title: "Let the AI Army Build",
    text: "The production stages take the approved direction and carry it through script, voice, visuals, thumbnail, packaging and playlist placement.",
  },
  {
    icon: ShieldCheck,
    title: "Grow the Business",
    text: "Monitor results, repair what underperforms, and put an offer behind the channel so views can become customers.",
  },
];

export function StepsSection() {
  return (
    <Section id="how-it-works" tinted>
      <SectionHeading
        eyebrow="HOW IT WORKS"
        title="Three decisions from you. The rest is the army's job."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-7"
          >
            <span className="font-display text-5xl font-black text-primary/25">
              {i + 1}
            </span>
            <Icon className="size-6 text-gold" aria-hidden />
            <h3 className="font-display text-xl font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
