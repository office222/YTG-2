import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusLabel =
  | "AVAILABLE IN DEMO"
  | "IN DEVELOPMENT"
  | "FOUNDING MEMBER ROADMAP";

export function TgLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary font-display text-sm font-black text-primary-foreground">
        TG
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-gold" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        TubeGenerator
      </span>
    </span>
  );
}

export function StatusBadge({ status }: { status: StatusLabel }) {
  const tone =
    status === "AVAILABLE IN DEMO"
      ? "border-primary/50 bg-primary/15 text-primary"
      : status === "IN DEVELOPMENT"
        ? "border-border bg-muted text-muted-foreground"
        : "border-gold/45 bg-gold/10 text-gold";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-[0.625rem] font-bold tracking-[0.12em]",
        tone,
      )}
    >
      {status}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-[0.6875rem] font-bold tracking-[0.16em] text-gold">
      {children}
    </span>
  );
}

export function Section({
  id,
  className,
  children,
  tinted,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-border/70 px-6 py-20 md:py-28",
        tinted && "bg-card/35",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  centered = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-[2.75rem] md:leading-[1.12]">
        {title}
      </h2>
      {lead ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Stylised placeholder panel used for features that have no screenshot yet. */
export function MockPanel({
  label,
  lines = 3,
  accent = "primary",
}: {
  label: string;
  lines?: number;
  accent?: "primary" | "gold";
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-background/70 p-4">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-70",
          accent === "primary"
            ? "bg-[radial-gradient(20rem_10rem_at_20%_0%,var(--color-primary)/18%,transparent_70%)]"
            : "bg-[radial-gradient(20rem_10rem_at_20%_0%,var(--color-gold)/14%,transparent_70%)]",
        )}
      />
      <div className="relative flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-destructive/70" />
        <span className="size-2 rounded-full bg-gold/70" />
        <span className="size-2 rounded-full bg-primary/70" />
        <span className="ml-2 truncate font-display text-xs font-semibold text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="relative mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 rounded-full",
              i === 0
                ? accent === "gold"
                  ? "w-2/3 bg-gold/45"
                  : "w-2/3 bg-primary/45"
                : "bg-muted",
              i === 1 && "w-full",
              i > 1 && "w-4/5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
