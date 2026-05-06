import { ArrowLeft, LogOut, MonitorSmartphone, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { IntegrationReadinessBanner } from "@/components/integration/IntegrationReadinessBanner";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SessionRow {
  id: string;
  label: string;
  detail: string;
  location: string;
  current?: boolean;
}

const seed: SessionRow[] = [
  { id: "s1", label: "This device · Safari · iPhone", detail: "Last active · now", location: "Brooklyn, US", current: true },
  { id: "s2", label: "Chrome · MacBook", detail: "Last active · 2 hrs ago", location: "New York, US" },
  { id: "s3", label: "Zenith Pay · Web session", detail: "Last active · Mar 01", location: "London, GB" },
];

const SessionsPage = () => (
  <PageTransition className="min-h-screen bg-background pb-28">
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
      <div className="flex items-center gap-3 px-5 py-3.5">
        <Link to="/security" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors">
          <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-page-title truncate">Devices & sessions</h1>
          <p className="text-caption truncate">Trusted devices • revoke stale sessions</p>
        </div>
      </div>
    </header>

    <div className="px-5 pt-4 space-y-5">
      <IntegrationReadinessBanner />

      <div className="surface-content p-4 flex gap-3">
        <Shield className="h-10 w-10 shrink-0 text-primary mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-[13px] font-bold text-foreground">Session hardening</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
            Wire sign-out actions to revoke refresh tokens, rotate device keys, and append security events for compliance reviews.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {seed.map((s) => (
          <div key={s.id} className="surface-content p-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/70">
              <MonitorSmartphone className="h-[17px] w-[17px] text-foreground/70" strokeWidth={1.7} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground">{s.label}</p>
              <p className="text-meta mt-0.5">{s.detail}</p>
              <p className="text-meta">{s.location}</p>
              {s.current ? (
                <span className="chip-success mt-2 inline-flex">Trusted device</span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-xl h-9 text-[12px] font-bold gap-1.5"
                  onClick={() =>
                    toast({
                      title: "Revocation queued",
                      description: "Invalidate refresh tokens server-side so this client reconnects through full auth.",
                    })
                  }
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out device
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageTransition>
);

export default SessionsPage;
