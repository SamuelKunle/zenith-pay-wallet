import { ArrowLeft, Building2, CreditCard, Landmark, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { IntegrationReadinessBanner } from "@/components/integration/IntegrationReadinessBanner";
import { toast } from "@/hooks/use-toast";

const methods = [
  {
    id: "ach",
    title: "Bank transfer (ACH)",
    subtitle: "Connect an external bank and pull funds in 1–3 business days.",
    icon: Landmark,
    eta: "Standard",
  },
  {
    id: "debit",
    title: "Debit card",
    subtitle: "Instant authorization; settlement typically same day in production.",
    icon: CreditCard,
    eta: "Fast",
  },
  {
    id: "payroll",
    title: "Payroll / direct deposit",
    subtitle: "Route part of your paycheck to your Zenith Pay balance.",
    icon: Building2,
    eta: "Setup once",
  },
];

const FundWalletPage = () => (
  <PageTransition className="min-h-screen bg-background pb-28">
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
      <div className="flex items-center gap-3 px-5 py-3.5">
        <Link to="/services" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors">
          <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-page-title truncate">Fund wallet</h1>
          <p className="text-caption truncate">Funding paths — wire to ACH, cards, or payroll rails</p>
        </div>
      </div>
    </header>

    <div className="px-5 pt-4 space-y-5">
      <IntegrationReadinessBanner />

      <div className="surface-content p-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="h-[18px] w-[18px] text-primary" strokeWidth={1.8} />
        </div>
        <div>
            <p className="text-[13px] font-bold text-foreground">Implementation hooks</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Each tile maps to orchestration jobs you own server-side—payment initiation, PSP webhooks, limit checks, AML screening, and settlement reporting.
            </p>
        </div>
      </div>

      <div className="space-y-3">
        {methods.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                toast({
                  title: "Funding flow queued",
                  description: `${m.title} — complete in your orchestration layer with your processor contracts.`,
                })
              }
              className="w-full surface-interactive p-4 text-left flex gap-3.5 transition-transform active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                <Icon className="h-[18px] w-[18px] text-foreground/70" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-bold text-foreground">{m.title}</p>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">{m.eta}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{m.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </PageTransition>
);

export default FundWalletPage;
