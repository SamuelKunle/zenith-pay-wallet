import { Sparkles } from "lucide-react";
import { isDemoMode } from "@/lib/demo/demoMode";
import { cn } from "@/lib/utils";

export function DemoBanner({ className }: { className?: string }) {
  if (!isDemoMode()) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border border-warning/25 bg-warning/8 px-3.5 py-2.5",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-warning mt-0.5" strokeWidth={2} />
      <p className="text-[11px] font-semibold leading-relaxed text-foreground/90">
        Demo simulation — no funds move and no identity checks run. Built to mirror production wallet flows before provider integration.
      </p>
    </div>
  );
}
