import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  BarChart3,
  Coins,
  Compass,
  Eye,
  FileText,
  LayoutDashboard,
  ListVideo,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { getEmail, isSignedIn, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/app" },
  { icon: Search, label: "Niche Research", to: "/app/research" },
  { icon: Eye, label: "Competitor Watch", to: "/app/competitors" },
  { icon: Video, label: "My Videos", to: "/app/videos" },
  { icon: ListVideo, label: "My Playlist", to: "/app/playlist" },
  { icon: ShieldCheck, label: "Channel Guardian", to: "/app/guardian" },
  { icon: BarChart3, label: "Analytics", to: "/app/analytics" },
  { icon: Coins, label: "Credits & Plan", to: "/app/credits" },
  { icon: Settings, label: "Settings", to: "/app/settings" },
] as const;

const mobileMenuItems = [
  { icon: User, label: "My Profile", to: "/app/settings" },
  { icon: LayoutDashboard, label: "My Channel", to: "/app" },
  { icon: Compass, label: "My Niche", to: "/app/research" },
  { icon: FileText, label: "Niche Opportunity Report", to: "/app/research" },
  { icon: Video, label: "My Videos", to: "/app/videos" },
  { icon: ListVideo, label: "My Playlist", to: "/app/playlist" },
  { icon: BarChart3, label: "My Analytics", to: "/app/analytics" },
  { icon: Settings, label: "Settings", to: "/app/settings" },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSignedIn()) {
      navigate({ to: "/auth", search: { mode: "login" } });
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!authed) return null;

  const email = getEmail();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {navItems.map(({ icon: Icon, label, to }) => {
        const active = pathname === to;
        return (
          <Link
            key={label}
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon
              className={cn("size-4.5 shrink-0", active && "text-sidebar-primary")}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="px-5 py-5">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        {nav}
        <div className="border-t border-sidebar-border px-3 py-4">
          <div className="mb-3 truncate px-3 text-xs text-muted-foreground">
            {email}
          </div>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-foreground hover:bg-sidebar-accent"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/">
          <Logo />
        </Link>
        <div className="size-9" aria-hidden="true" />
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-background/70"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar pt-16">
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {mobileMenuItems.map(({ icon: Icon, label, to }) => {
                const active = to ? pathname === to : false;
                const iconNode = (
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0",
                      active ? "text-sidebar-primary" : "text-muted-foreground"
                    )}
                  />
                );
                if (!to) {
                  return (
                    <span
                      key={label}
                      className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/60"
                    >
                      {iconNode}
                      {label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={label}
                    to={to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {iconNode}
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-sidebar-border px-3 py-4">
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
              >
                <LogOut className="size-4.5" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="min-w-0 flex-1 px-4 pt-20 pb-10 md:px-8 md:pt-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
