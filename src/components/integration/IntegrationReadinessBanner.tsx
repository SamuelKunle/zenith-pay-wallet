import { Plug } from "lucide-react";
import { showIntegrationCallout } from "@/lib/integration/integrationCallout";
import { cn } from "@/lib/utils";

export function IntegrationReadinessBanner({ className }: { className?: string }) {
  if (!showIntegrationCallout()) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/[0.06] px-3.5 py-2.5",
        className,
      )}
    >
      <Plug className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
      <p className="text-[11px] font-semibold leading-relaxed text-foreground/90">
        Integration-ready UX: flows are built so you can back them with your payments, identity, notification, session, and settlement services without rework. Use adapter interfaces under{" "}
        <code className="text-[10px] font-mono bg-muted/60 px-1 py-px rounded">src/lib/adapters</code>{" "}
        when you connect real providers.
      </p>
    </div>
  );
}
