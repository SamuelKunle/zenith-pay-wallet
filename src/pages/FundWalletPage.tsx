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
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";

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
  const [lastSuccess, setLastSuccess] = useState<SimulatedFundResponse | null>(null);

  const simulation = useMutation({
    mutationFn: (payload: { amountCents: number; channel: SimulatedFundingChannel }) =>
      postJson<SimulatedFundResponse>("/api/v1/wallet/fund", payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      setLastSuccess(data);
      getTelemetry().track(TelemetryEvents.WALLET_FUND_SIMULATED, {
        amountCents: variables.amountCents,
        channel: variables.channel,
        reference: data.reference,
      });
      toast({
        title: "Simulated credit posted",
        description: `${formatUsdLineFromCents(variables.amountCents)} credited · new available ${formatUsdLineFromCents(data.availableCents)}.`,
      });
    },
    onError: (e: unknown) => {
      let msg = "Could not simulate funding.";
      if (e instanceof ApiRequestError && typeof e.body === "object" && e.body !== null && "error" in e.body) {
        const err = e.body as { error?: { message?: string } };
        if (err.error?.message) msg = err.error.message;
      }
      getTelemetry().track(TelemetryEvents.WALLET_FUND_FAILED, { message: msg });
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

        {lastSuccess && (
          <div className="rounded-2xl border border-success/20 bg-success/[0.07] px-4 py-3.5 space-y-2">
            <p className="text-[12px] font-bold text-foreground">Credit recorded (prototype)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Added{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatUsdLineFromCents(lastSuccess.amountCents)}
              </span>{" "}
              ({lastSuccess.channel.toUpperCase()} rail). Ledger now shows{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatUsdLineFromCents(lastSuccess.availableCents)} available.
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              Reference{" "}
              <code className="text-[10px] font-mono">{lastSuccess.reference}</code> · reverses only inside your mocked host.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                to="/history"
                className="text-[11px] font-bold text-primary py-2 px-1 min-h-[44px] inline-flex items-center rounded-md interactive-focus"
              >
                View activity feed
              </Link>
              <button
                type="button"
                onClick={() => setLastSuccess(null)}
                className="text-[11px] font-semibold text-muted-foreground py-2 px-2 min-h-[44px] rounded-md interactive-focus"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

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
                className={`rounded-full px-4 py-2 min-h-[44px] text-[11px] font-semibold transition-colors disabled:opacity-50 interactive-focus ${
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
                className="w-full surface-interactive p-4 min-h-[52px] text-left flex gap-3.5 transition-transform active:scale-[0.99] disabled:opacity-60 interactive-focus"
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
