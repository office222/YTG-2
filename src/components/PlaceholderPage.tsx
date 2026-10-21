import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function PlaceholderPage({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-7" />
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <span className="mt-6 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold">
        COMING SOON
      </span>
    </div>
  );
}
