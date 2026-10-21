import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import dashboardShot from "@/assets/demo-dashboard.jpg";
import { DEMO_ENTRY_PATH, OFFER_ANCHOR } from "@/lib/landing-config";

const STAGES = [
  "RESEARCH",
  "CREATE",
  "PUBLISH",
  "SELL",
  "MONITOR",
  "OPTIMIZE",
  "GENERATE",
];

export function LandingHero() {
  return (
    <section id="top" className="hero-glow px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[0.6875rem] font-bold tracking-[0.14em] text-gold">
            FOUNDING MEMBER BETA — WORKING DEMO + DEVELOPMENT ROADMAP
          </span>

          <h1 className="text-[2.1rem] font-bold leading-[1.12] md:text-[3.4rem] md:leading-[1.06]">
            You Decide Where You're Going.{" "}
            <span className="text-primary">Your AI Army Does the Work.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Build a YouTube channel—and the business behind it.
          </p>

          <ul className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-card px-2.5 py-1.5 text-[0.6875rem] font-bold tracking-[0.1em] text-foreground/90">
                  {s}
                </span>
                {i < STAGES.length - 1 ? (
                  <ArrowRight className="size-3 text-primary" aria-hidden />
                ) : null}
              </li>
            ))}
          </ul>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Every stage hands its work to the next one, so a niche decision
            becomes a finished video, a published upload, an offer that earns
            beyond ad revenue, and a channel that keeps being repaired and
            improved without you rebuilding the process each time.
          </p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={OFFER_ANCHOR}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold tracking-[0.06em] text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 focus-visible:outline-2 focus-visible:outline-ring"
            >
              BECOME A FOUNDING MEMBER
              <ArrowRight className="size-4" />
            </a>
            <Link
              to={DEMO_ENTRY_PATH}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-7 py-4 text-sm font-bold tracking-[0.06em] text-gold transition-colors hover:bg-gold/20 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <PlayCircle className="size-4" />
              EXPLORE THE WORKING DEMO
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl"
          />
          <figure className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-background">
            <img
              src={dashboardShot}
              alt="The TubeGenerator dashboard, showing niche research, competitor watch, video studio, channel guardian, analytics and plan panels."
              width={1280}
              height={800}
              loading="eager"
              className="w-full"
            />
            <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              The TubeGenerator dashboard as it exists in the working demo
              today.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
