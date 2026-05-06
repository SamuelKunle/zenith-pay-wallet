import { ArrowLeft, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { Switch } from "@/components/ui/switch";

const prefs = [
  {
    key: "login",
    title: "Sign-in alerts",
    sub: "New device / location anomalies",
    defaultOn: true,
  },
  {
    key: "txn",
    title: "Transfers & receipts",
    sub: "Credits, debits, failed attempts",
    defaultOn: true,
  },
  {
    key: "card",
    title: "Card activity",
    sub: "Declines, freezes, risky merchants",
    defaultOn: true,
  },
  {
    key: "merchant",
    title: "Merchant payouts",
    sub: "Settlement batches & chargebacks",
    defaultOn: false,
  },
  {
    key: "marketing",
    title: "Product updates",
    sub: "Non-transactional education & offers",
    defaultOn: false,
  },
];

const NotificationPreferencesPage = () => {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    prefs.reduce((acc, p) => ({ ...acc, [p.key]: p.defaultOn }), {}),
  );

  const toggle = (key: string, next: boolean) => {
    setState((s) => ({ ...s, [key]: next }));
  };

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary shrink-0 hidden sm:block" strokeWidth={1.7} />
            <div>
              <h1 className="text-page-title truncate">Alert preferences</h1>
              <p className="text-caption truncate">Granular toggles mirrored from enterprise wallets</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-5">
        <DemoBanner />

        <div className="rounded-2xl bg-card shadow-card divide-y divide-border/50 overflow-hidden">
          {prefs.map((p) => (
            <div key={p.key} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BellRing className="h-[18px] w-[18px] text-primary" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground">{p.title}</p>
                <p className="text-[11px] font-medium text-muted-foreground">{p.sub}</p>
              </div>
              <Switch checked={state[p.key]} onCheckedChange={(v) => toggle(p.key, v)} />
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default NotificationPreferencesPage;
