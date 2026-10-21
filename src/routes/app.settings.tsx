import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — FACELESS" }] }),
  component: () => (
    <PlaceholderPage
      icon={Settings}
      title="Settings"
      description="Account details, notifications, and channel preferences."
    />
  ),
});
