import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/app/competitors")({
  head: () => ({ meta: [{ title: "Competitor Watch — FACELESS" }] }),
  component: () => (
    <PlaceholderPage
      icon={Eye}
      title="Competitor Watch"
      description="Track competing faceless channels, their uploads, and their growth — all in one watchlist."
    />
  ),
});
