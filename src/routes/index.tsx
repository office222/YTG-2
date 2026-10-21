import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import {
  BenefitStrip,
  ProblemSection,
  SolutionSection,
  StepsSection,
  WorkingDemoSection,
} from "@/components/landing/LandingMiddle";
import {
  ComparisonSection,
  FeatureShowcase,
  FeedbackSection,
  GuardianSection,
  MarketplaceSection,
  SellBeyondSection,
} from "@/components/landing/LandingFeatures";
import {
  FaqSection,
  FinalCtaSection,
  FoundingOfferSection,
  LandingFooter,
  TransparencySection,
} from "@/components/landing/LandingOffer";

const TITLE =
  "TubeGenerator — You Decide Where You're Going. Your AI Army Does the Work.";
const DESCRIPTION =
  "Founding Member Beta: build a YouTube channel—and the business behind it. Research, create, publish, sell, monitor, optimize, generate. Explore the working demo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <BenefitStrip />
        <ProblemSection />
        <SolutionSection />
        <WorkingDemoSection />
        <StepsSection />
        <FeatureShowcase />
        <SellBeyondSection />
        <GuardianSection />
        <MarketplaceSection />
        <FeedbackSection />
        <ComparisonSection />
        <FoundingOfferSection />
        <TransparencySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
