import { ArrowLeft, CalendarClock, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ScheduledPay {
  id: string;
  label: string;
  amountUsd: number;
  cadence: "Weekly" | "Monthly";
  nextRun: string;
}

const seed: ScheduledPay[] = [
  { id: "1", label: "Rent autopay · landlord", amountUsd: 1800, cadence: "Monthly", nextRun: "Mar 29" },
  { id: "2", label: "Gym subscription", amountUsd: 49, cadence: "Monthly", nextRun: "Mar 15" },
  { id: "3", label: "Allowance split · family", amountUsd: 200, cadence: "Weekly", nextRun: "Mar 14" },
];

const ScheduledPaymentsPage = () => {
  const [items, setItems] = useState<ScheduledPay[]>(seed);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<"Weekly" | "Monthly">("Monthly");

  const addDemo = () => {
    const n = parseFloat(amount);
    if (!label.trim() || Number.isNaN(n) || n <= 0) {
      toast({ title: "Add details", description: "Enter a label and positive amount.", variant: "destructive" });
      return;
    }
    const id = String(Date.now());
    setItems((prev) => [
      {
        id,
        label: label.trim(),
        amountUsd: n,
        cadence,
        nextRun: "Pending schedule",
      },
      ...prev,
    ]);
    setLabel("");
    setAmount("");
    toast({ title: "Scheduled payment saved (demo)", description: "Orchestration would persist on your backend cron." });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Removed", description: "Demo only — nothing was billed." });
  };

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/services" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-page-title truncate">Scheduled payments</h1>
            <p className="text-caption truncate">Recurring sends & autopay previews</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-5">
        <DemoBanner />

        <div className="surface-content p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span className="text-[13px] font-bold text-foreground">Add simulated schedule</span>
          </div>
          <Input
            placeholder="Label (e.g. Utilities)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-11 rounded-xl text-[13px] font-semibold"
          />
          <Input
            placeholder="Amount (USD)"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 rounded-xl text-[13px] font-semibold"
          />
          <div className="flex gap-2">
            {(["Weekly", "Monthly"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={`flex-1 rounded-xl py-2.5 text-[12px] font-bold transition-colors ${
                  cadence === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Button type="button" onClick={addDemo} className="w-full h-11 rounded-2xl text-[13px] font-bold gap-2">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Save schedule (demo)
          </Button>
        </div>

        <div>
          <p className="text-label mb-2.5 px-0.5">Active (demo)</p>
          <div className="surface-content overflow-hidden divide-y divide-border/50">
            {items.map((row) => (
              <div key={row.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  <CalendarClock className="h-[17px] w-[17px] text-primary" strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground truncate">{row.label}</p>
                  <p className="text-meta mt-0.5">
                    ${row.amountUsd.toLocaleString()} · {row.cadence} · Next {row.nextRun}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ScheduledPaymentsPage;
