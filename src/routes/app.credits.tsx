import { createFileRoute } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/app/credits")({
  head: () => ({ meta: [{ title: "Credits & Plan — FACELESS" }] }),
  component: () => (
    <PlaceholderPage
      icon={Coins}
      title="Credits & Plan"
      description="Your AI credit balance, usage history, and subscription plan management."
    />
  ),
});
