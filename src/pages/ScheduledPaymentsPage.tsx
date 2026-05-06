import { ArrowLeft, CalendarClock, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import PageTransition from "@/components/PageTransition";
import { IntegrationReadinessBanner } from "@/components/integration/IntegrationReadinessBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSchedulesDemoQuery } from "@/lib/demo/screenQueries";
import { formatUsdLineFromCents } from "@/lib/format/money";
import { InlineQueryError, ListRowSkeleton } from "@/components/states/AsyncContent";
import { EmptyState } from "@/components/states/StateUI";

interface ScheduleRowUi {
  id: string;
  label: string;
  amountCents: number;
  cadence: "Weekly" | "Monthly";
  nextRun: string;
}

const ScheduledPaymentsPage = () => {
  const seedQuery = useSchedulesDemoQuery();
  const [removedSeedIds, setRemovedSeedIds] = useState<Set<string>>(new Set());
  const [localAdds, setLocalAdds] = useState<ScheduleRowUi[]>([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<"Weekly" | "Monthly">("Monthly");

  const seededRows = useMemo(() => {
    const base = seedQuery.data ?? [];
    return base.filter((r) => !removedSeedIds.has(r.id));
  }, [seedQuery.data, removedSeedIds]);

  const items = useMemo(() => [...localAdds, ...seededRows], [localAdds, seededRows]);

  const saveSchedule = () => {
    const n = Number.parseFloat(amount);
    if (!label.trim() || Number.isNaN(n) || n <= 0) {
      toast({ title: "Add details", description: "Enter a label and positive amount.", variant: "destructive" });
      return;
    }
    const id = String(Date.now());
    const cents = Math.round(n * 100);
    setLocalAdds((prev) => [
      {
        id,
        label: label.trim(),
        amountCents: cents,
        cadence,
        nextRun: "Pending schedule",
      },
      ...prev,
    ]);
    setLabel("");
    setAmount("");
    toast({
      title: "Schedule queued locally",
      description: "Connect your billing engine for execution; shown amounts use USD ledger formatting.",
    });
  };

  const removeRow = (id: string, isLocal: boolean) => {
    if (isLocal) {
      setLocalAdds((prev) => prev.filter((x) => x.id !== id));
    } else {
      setRemovedSeedIds((prev) => new Set([...prev, id]));
    }
    toast({
      title: "Schedule removed",
      description: "No payment executed; removals are optimistic until wired to settlement.",
    });
  };

  const pendingSeed = seedQuery.isPending;

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link
            to="/services"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors interactive-focus min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-page-title truncate">Scheduled payments</h1>
            <p className="text-caption truncate">Recurring sends & autopay</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-5">
        <IntegrationReadinessBanner />

        <div className="surface-content p-4 space-y-3">
          <StatusBannerFunding />
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span className="text-[13px] font-bold text-foreground">Add schedule</span>
          </div>
          <Input
            placeholder="Label (e.g. Utilities)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-11 min-h-[44px] rounded-xl text-[13px] font-semibold interactive-focus"
          />
          <Input
            placeholder="Amount (USD)"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 min-h-[44px] rounded-xl text-[13px] font-semibold interactive-focus"
          />
          <div className="flex gap-2">
            {(["Weekly", "Monthly"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={`flex-1 rounded-xl py-3 min-h-[44px] text-[12px] font-bold transition-colors interactive-focus ${
                  cadence === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Button
            type="button"
            onClick={saveSchedule}
            className="w-full h-11 min-h-[44px] rounded-2xl text-[13px] font-bold gap-2 interactive-focus"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Save schedule
          </Button>
        </div>

        <div>
          <p className="text-label mb-2.5 px-0.5">Active schedules</p>
          {pendingSeed && (
            <div className="surface-content overflow-hidden rounded-2xl">
              <ListRowSkeleton rows={4} />
            </div>
          )}
          {!pendingSeed && seedQuery.isError && (
            <InlineQueryError message="Could not sync demo schedules." onRetry={() => seedQuery.refetch()} />
          )}
          {!pendingSeed && !seedQuery.isError && items.length === 0 && (
            <EmptyState
              title="Nothing scheduled yet"
              subtitle="Add a recurring debit or ACH pull prototype entry above."
              action={{ label: "Send a transfer", to: "/transfer" }}
            />
          )}
          {!pendingSeed && !seedQuery.isError && items.length > 0 && (
            <div className="surface-content overflow-hidden divide-y divide-border/50 rounded-2xl">
              {items.map((row) => {
                const isLocal = localAdds.some((l) => l.id === row.id);
                return (
                  <div key={row.id} className="flex items-center gap-3 px-4 py-3.5 min-h-[52px]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                      <CalendarClock className="h-[17px] w-[17px] text-primary" strokeWidth={1.7} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{row.label}</p>
                      <p className="text-meta mt-0.5">
                        {formatUsdLineFromCents(row.amountCents)} · {row.cadence} · Next {row.nextRun}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id, isLocal)}
                      className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors interactive-focus"
                      aria-label="Remove schedule"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

function StatusBannerFunding() {
  return (
    <div className="rounded-xl bg-warning/[0.06] border border-warning/15 px-3 py-2.5 text-[10px] text-muted-foreground leading-relaxed mb-2">
      <strong className="text-foreground font-semibold">Charges real money?</strong> When your processor is wired, each run should show a ledger hold and reversible states before confirming settlement.
    </div>
  );
}

export default ScheduledPaymentsPage;
