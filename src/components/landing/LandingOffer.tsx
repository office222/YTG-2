import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DEMO_ENTRY_PATH,
  FOOTER_LINKS,
  FOUNDING_TIERS,
  OFFER_ANCHOR,
} from "@/lib/landing-config";
import { Section, SectionHeading, StatusBadge, TgLogo } from "./primitives";

export function FoundingOfferSection() {
  return (
    <Section id="founding-offer">
      <SectionHeading
        eyebrow="FOUNDING MEMBER OFFER"
        title="Join while the army is being built."
        lead="Two Founding Member positions. One payment. You get the working demo as it stands today and the development roadmap as it ships."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {FOUNDING_TIERS.map((tier) => (
          <article
            key={tier.id}
            className={`flex flex-col gap-5 rounded-2xl border bg-card p-7 ${
              tier.highlighted
                ? "border-gold/60 shadow-xl shadow-gold/5"
                : "border-border"
            }`}
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-lg font-bold tracking-[0.08em]">
                {tier.name}
              </h3>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black">
                  {tier.price}
                </span>
                <span className="text-xs font-bold tracking-[0.14em] text-muted-foreground">
                  {tier.billingNote}
                </span>
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tier.summary}
              </p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {tier.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {inc}
                  </span>
                </li>
              ))}
            </ul>

            {tier.checkoutUrl ? (
              <a
                href={tier.checkoutUrl}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold tracking-[0.06em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
              >
                RESERVE {tier.name}
                <ArrowRight className="size-4" />
              </a>
            ) : (
              <a
                href={OFFER_ANCHOR}
                aria-describedby={`${tier.id}-note`}
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold tracking-[0.06em] transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                  tier.highlighted
                    ? "bg-gold text-gold-foreground hover:bg-gold/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                RESERVE {tier.name}
                <ArrowRight className="size-4" />
              </a>
            )}
            <p
              id={`${tier.id}-note`}
              className="text-center text-xs text-muted-foreground"
            >
              Checkout is not connected yet. This button becomes a live checkout
              link once the payment page is in place.
            </p>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
        Both cards are editable in one place, so pricing and inclusions can
        change as the beta develops. We are not publishing bonus stacks,
        countdowns, credit allowances or guarantees we have not defined.
      </p>
    </Section>
  );
}

const TRANSPARENCY = [
  {
    label: "AVAILABLE IN DEMO" as const,
    items: [
      "Check My Niche form and the completed Niche Opportunity Report",
      "My Videos library with search, status filters and card actions",
      "My Playlists with video selection, ordering and visibility",
      "Dashboard shell, sidebar and mobile navigation",
      "Sign-in and onboarding flow into the demo",
    ],
  },
  {
    label: "IN DEVELOPMENT" as const,
    items: [
      "Video Studio production pipeline",
      "Competitor Watch and MIMIC",
      "Thumbnails and graphics generation",
      "Channel Guardian monitoring and repair",
      "Analytics reporting",
    ],
  },
  {
    label: "FOUNDING MEMBER ROADMAP" as const,
    items: [
      "Landing Page Generator and shopping cart",
      "Phone Footage Creator",
      "Head Start Channel Marketplace",
    ],
  },
];

export function TransparencySection() {
  return (
    <Section id="transparency" tinted>
      <SectionHeading
        eyebrow="TRANSPARENCY"
        title="What exists now—and what we're building next."
        lead="The demo uses prototype data. It is not connected to YouTube, and no video is published to a real channel from it."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TRANSPARENCY.map((col) => (
          <div
            key={col.label}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <StatusBadge status={col.label} />
            <ul className="flex flex-col gap-2.5">
              {col.items.map((i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

const FAQ = [
  {
    q: "What exactly am I getting as a Founding Member?",
    a: "Access to the working demo as it stands today, plus the features on the development roadmap as they ship. Every feature on this page carries a status label so you can see which side of that line it sits on.",
  },
  {
    q: "Is TubeGenerator finished?",
    a: "No. It is a Founding Member Beta. Several modules are live in the demo, several are in development, and several are on the roadmap. We label each one rather than implying it all works today.",
  },
  {
    q: "Is the demo connected to YouTube?",
    a: "No. The demo runs on prototype data. Nothing is uploaded, published or changed on a real YouTube channel, and no channel credentials are required to explore it.",
  },
  {
    q: "What does 'AI army' actually mean?",
    a: "It is how we describe the set of units that handle each stage of the work — research, creation, publishing, selling, monitoring, optimising and generating — and hand their output to the next stage.",
  },
  {
    q: "Do I need to be on camera?",
    a: "No. TubeGenerator is built for faceless channels. The Phone Footage Creator exists for creators who want to bring in real-world footage, but it is optional.",
  },
  {
    q: "Can I try it before deciding?",
    a: "Yes. The working demo is open — explore Check My Niche, the Niche Opportunity Report, My Videos and My Playlists before you consider a Founding Member position.",
  },
  {
    q: "What is the difference between the two Founding Member tiers?",
    a: "Founding Creator points the AI army at a channel. Founding Business adds the tools for selling beyond ad revenue, including the landing page and cart tooling and marketplace access when it launches.",
  },
  {
    q: "Is the Founding Member payment recurring?",
    a: "No. Both tiers are shown as a one-time payment. Anything that changes about pricing will be stated on this page rather than hidden in a renewal.",
  },
  {
    q: "When will the roadmap features be ready?",
    a: "We are not publishing dates we cannot stand behind. Founding Members see the build order and influence it, and each release is explained as it ships.",
  },
  {
    q: "How do I influence what gets built?",
    a: "Through the Founding Member feedback channel. Friction you report inside the demo becomes a specific item in the build queue, and Founding Members weigh in on priority.",
  },
  {
    q: "Will TubeGenerator write and publish videos for me automatically?",
    a: "That is the direction of the production and publishing stages. Today the demo shows the structure and organisation around it; the generation pipeline itself is in development.",
  },
  {
    q: "Do I still need other tools?",
    a: "The goal is that you stop stitching separate tools together. Until the roadmap stages ship, you may still use your own editor or store alongside the demo.",
  },
  {
    q: "How do I get support or ask something not covered here?",
    a: "Use the contact and support links in the footer. Founding Members also have the feedback channel for anything about the build itself.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq">
      <SectionHeading eyebrow="FAQ" title="Questions, answered plainly." />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export function FinalCtaSection() {
  return (
    <Section id="final-cta" className="hero-glow">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-[2.9rem] md:leading-[1.1]">
          Your destination is waiting.
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          You decide where the channel is going. The AI army does the work —
          research, creation, publishing, selling, monitoring, optimising,
          generating.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={OFFER_ANCHOR}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold tracking-[0.06em] text-primary-foreground shadow-xl shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
          >
            BECOME A FOUNDING MEMBER
            <ArrowRight className="size-4" />
          </a>
          <Link
            to={DEMO_ENTRY_PATH}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-8 py-4 text-sm font-bold tracking-[0.06em] text-gold transition-colors hover:bg-gold/20 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <PlayCircle className="size-4" />
            EXPLORE THE WORKING DEMO
          </Link>
        </div>
      </div>
    </Section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/40 px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <TgLogo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Build a YouTube channel—and the business behind it. Founding
              Member Beta: working demo plus development roadmap.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {l.label}
              </a>
            ))}
            <Link
              to={DEMO_ENTRY_PATH}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              Login
            </Link>
          </nav>
        </div>
        <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          © 2026 TubeGenerator. Founding Member Beta. The demo uses prototype
          data and is not connected to YouTube. Feature availability is labelled
          throughout this page.
        </p>
      </div>
    </footer>
  );
}
