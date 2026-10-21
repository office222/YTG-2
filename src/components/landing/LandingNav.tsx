import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { TgLogo } from "./primitives";
import { DEMO_ENTRY_PATH, OFFER_ANCHOR } from "@/lib/landing-config";

const NAV_LINKS = [
  { label: "Explore Demo", href: "#working-demo" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Founding Offer", href: OFFER_ANCHOR },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#top" className="rounded-lg focus-visible:outline-2 focus-visible:outline-ring">
          <TgLogo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to={DEMO_ENTRY_PATH}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            Login
          </Link>
          <a
            href={OFFER_ANCHOR}
            className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold tracking-[0.08em] text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
          >
            BECOME A FOUNDING MEMBER
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="landing-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav
          id="landing-mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background px-6 pb-6 pt-3 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3.5 text-base font-semibold text-foreground/90 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to={DEMO_ENTRY_PATH}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3.5 text-base font-semibold text-foreground/90 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                Login
              </Link>
            </li>
          </ul>
          <a
            href={OFFER_ANCHOR}
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-xl bg-primary px-5 py-4 text-center text-sm font-bold tracking-[0.08em] text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            BECOME A FOUNDING MEMBER
          </a>
        </nav>
      ) : null}
    </header>
  );
}
