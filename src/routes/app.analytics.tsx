import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — FACELESS" }] }),
  component: () => (
    <PlaceholderPage
      icon={BarChart3}
      title="Analytics"
      description="Views, watch time, subscriber growth, and revenue signals across all your channels."
    />
  ),
});
