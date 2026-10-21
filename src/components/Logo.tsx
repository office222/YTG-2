import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        FACELESS
      </span>
    </span>
  );
}
