import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/check")({
  head: () => ({
    meta: [{ title: "Check My Niche — FACELESS" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/app/research" });
  },
});
