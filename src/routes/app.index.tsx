import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Coins,
  Eye,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FACELESS" },
      { name: "description", content: "Your FACELESS command center." },
    ],
  }),
  component: Dashboard,
});

const sections = [
  {
    icon: Search,
    title: "Niche Research",
    description: "Discover and validate profitable niches.",
    to: "/app/research",
  },
  {
    icon: Eye,
    title: "Competitor Watch",
    description: "Track rival channels and spot openings.",
    to: "/app/competitors",
  },
  {
    icon: Video,
    title: "Video Studio",
    description: "Create videos with your AI army.",
    to: "/app/studio",
  },
  {
    icon: ShieldCheck,
    title: "Channel Guardian",
    description: "Monitor channel health and policy risks.",
    to: "/app/guardian",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Measure growth and revenue signals.",
    to: "/app/analytics",
  },
  {
    icon: Coins,
    title: "Credits & Plan",
    description: "Manage your AI credits and subscription.",
    to: "/app/credits",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Your AI army is standing by.
          </p>
        </div>
        <Link
          to="/onboarding"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Set up channel
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ icon: Icon, title, description, to }) => (
          <Link
            key={title}
            to={to}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/60 hover:bg-accent/40"
          >
            <Icon className="size-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <LayoutDashboard className="mx-auto size-6 text-gold" />
        <p className="mt-3 text-sm text-muted-foreground">
          Live channel stats, tasks, and recommendations will appear here once
          AI features are enabled.
        </p>
      </div>
    </div>
  );
}
