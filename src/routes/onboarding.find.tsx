import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/onboarding/find")({
  head: () => ({
    meta: [{ title: "Find a Niche for Me — FACELESS" }],
  }),
  component: () => (
    <PlaceholderPage
      icon={Search}
      title="Find a Niche for Me"
      description="Answer a few questions about your goals and interests, and AI will scan the YouTube landscape to recommend niches with the best opportunity for you."
    />
  ),
});
