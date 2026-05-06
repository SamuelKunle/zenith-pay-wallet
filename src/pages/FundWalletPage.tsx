import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CreditCard, Landmark, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { IntegrationReadinessBanner } from "@/components/integration/IntegrationReadinessBanner";
import { toast } from "@/hooks/use-toast";
import type { SimulatedFundingChannel, SimulatedFundResponse } from "@/lib/api/types";
import { ApiRequestError, postJson } from "@/lib/api/fetchJson";
import { formatUsdLineFromCents } from "@/lib/format/money";

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
] as const;

const amountPresets = [
  { label: "$100", cents: 10_000 },
  { label: "$500", cents: 50_000 },
  { label: "$1,000", cents: 100_000 },
] as const;

const FundWalletPage = () => {
  const queryClient = useQueryClient();
  const [presetCents, setPresetCents] = useState<number>(amountPresets[1].cents);

  const simulation = useMutation({
    mutationFn: (payload: { amountCents: number; channel: SimulatedFundingChannel }) =>
      postJson<SimulatedFundResponse>("/api/v1/wallet/fund", payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      toast({
        title: "Simulated credit posted",
        description: `${formatUsdLineFromCents(variables.amountCents)} via ${variables.channel.toUpperCase()} — balance reflects mock ledger.`,
      });
    },
    onError: (e: unknown) => {
      let msg = "Could not simulate funding.";
      if (e instanceof ApiRequestError && typeof e.body === "object" && e.body !== null && "error" in e.body) {
        const err = e.body as { error?: { message?: string } };
        if (err.error?.message) msg = err.error.message;
      }
      toast({ title: "Funding failed", description: msg, variant: "destructive" });
    },
  });

  const busy = simulation.isPending;

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link
            to="/services"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors"
          >
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
              Each tile maps to orchestration jobs you own server-side—payment initiation, PSP webhooks, limit checks,
              AML screening, and settlement reporting.
            </p>
          </div>
        </div>

        <div className="surface-content p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Prototype amount</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {amountPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={busy}
                onClick={() => setPresetCents(p.cents)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                  presetCents === p.cents
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:bg-surface-tertiary"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <code className="text-[10px]">POST /api/v1/wallet/fund</code> credits the in-memory ledger and appends a
            received-line for QA. Remove or fence this route behind auth in production.
          </p>
        </div>

        <div className="space-y-3">
          {methods.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                disabled={busy}
                onClick={() =>
                  simulation.mutate({
                    amountCents: presetCents,
                    channel: m.id,
                  })
                }
                className="w-full surface-interactive p-4 text-left flex gap-3.5 transition-transform active:scale-[0.99] disabled:opacity-60"
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
                  <p className="text-[10px] font-semibold text-primary mt-2">Simulate incoming funds → ledger</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default FundWalletPage;
