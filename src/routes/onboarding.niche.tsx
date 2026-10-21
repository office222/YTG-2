import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/onboarding/niche")({
  head: () => ({
    meta: [{ title: "Choose a Niche — FACELESS" }],
  }),
  component: () => (
    <PlaceholderPage
      icon={Compass}
      title="Choose a Niche"
      description="Browse a curated list of proven faceless YouTube niches, compare demand and competition, and pick the one you want your AI army to build on."
    />
  ),
});
