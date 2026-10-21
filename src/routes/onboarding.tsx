import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CheckCircle2, Compass, Search } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — FACELESS" },
      { name: "description", content: "Choose how to start your faceless YouTube channel." },
    ],
  }),
  component: OnboardingLayout,
});

const choices = [
  {
    icon: Compass,
    title: "Choose a Niche",
    description: "Browse proven niches and pick the one that fits your goals.",
    to: "/onboarding/niche" as const,
  },
  {
    icon: Search,
    title: "Find a Niche for Me",
    description: "Let AI analyze the market and recommend a niche for you.",
    to: "/onboarding/find" as const,
  },
  {
    icon: CheckCircle2,
    title: "Check My Niche",
    description: "Already have an idea? Validate it before you commit.",
    to: "/onboarding/check" as const,
  },
];

function OnboardingLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRoot = pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/">
          <Logo />
        </Link>
        <Link
          to="/app"
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip to dashboard →
        </Link>
      </header>

      {isRoot ? (
        <main className="mx-auto max-w-5xl px-6 pt-12 pb-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold md:text-4xl">
              Let's set up your channel
            </h1>
            <p className="mt-3 text-muted-foreground">
              Pick how you'd like to find your niche. You can change this later.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {choices.map(({ icon: Icon, title, description, to }) => (
              <Link
                key={title}
                to={to}
                className="group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/60 hover:bg-accent/40"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <span className="mt-6 text-sm font-semibold text-primary">
                  Continue →
                </span>
              </Link>
            ))}
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-4xl px-6 pt-8 pb-20">
          <Link
            to="/onboarding"
            className="mb-6 inline-block text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to choices
          </Link>
          <Outlet />
        </main>
      )}
    </div>
  );
}
