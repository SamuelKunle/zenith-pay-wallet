import { useState } from "react";
import { ArrowLeft, Plus, Target, TrendingUp, PiggyBank, Lock, ChevronRight, CheckCircle2, Calendar, Zap, ArrowUpRight, Pause, Edit2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SuccessState, FirstUseState, StatusBanner } from "@/components/states/StateUI";
import { Switch } from "@/components/ui/switch";

interface SavingsPlan {
  id: string;
  name: string;
  type: "flexible" | "locked" | "goal";
  balance: number;
  target?: number;
  rate: string;
  maturity?: string;
  autoSave: boolean;
  autoAmount?: number;
  frequency?: string;
}

const mockPlans: SavingsPlan[] = [
  { id: "1", name: "Emergency Fund", type: "flexible", balance: 450000, rate: "8% p.a.", autoSave: true, autoAmount: 10000, frequency: "Weekly" },
  { id: "2", name: "New Laptop", type: "goal", balance: 280000, target: 500000, rate: "10% p.a.", autoSave: true, autoAmount: 25000, frequency: "Monthly" },
  { id: "3", name: "Fixed Deposit", type: "locked", balance: 1000000, rate: "14% p.a.", maturity: "Dec 2026", autoSave: false },
];

type View = "dashboard" | "create" | "detail";

const SavingsPage = () => {
  const [view, setView] = useState<View>("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
  const [createStep, setCreateStep] = useState(0);

  const totalSavings = mockPlans.reduce((s, p) => s + p.balance, 0);
  const totalTarget = mockPlans.filter(p => p.target).reduce((s, p) => s + (p.target || 0), 0);

  const typeIcons = { flexible: PiggyBank, locked: Lock, goal: Target };
  const typeLabels = { flexible: "Flexible", locked: "Locked", goal: "Goal" };
  const typeColors = { flexible: "text-primary", locked: "text-accent", goal: "text-success" };
  const typeBgs = { flexible: "bg-primary/8", locked: "bg-accent/8", goal: "bg-success/8" };

  // --- Create flow ---
  if (view === "create") {
    const createSteps = ["Type", "Details", "Automation", "Confirm"];
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => { setView("dashboard"); setCreateStep(0); }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Create Savings Plan</h1>
          </div>
          <div className="px-5 pb-2.5">
            <div className="flex gap-1">
              {createSteps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= createStep ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">{createSteps[createStep]}</p>
          </div>
        </header>

        <div className="px-5 py-5 space-y-4">
          {createStep === 0 && (
            <>
              <p className="text-[12px] text-muted-foreground">Choose a savings type</p>
              {(["flexible", "locked", "goal"] as const).map((type) => {
                const Icon = typeIcons[type];
                return (
                  <motion.button key={type} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setCreateStep(1)}
                    className="w-full rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/15 transition-colors"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeBgs[type]} mb-3`}>
                      <Icon className={`h-5 w-5 ${typeColors[type]}`} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-[14px] font-bold text-foreground mb-0.5">{typeLabels[type]} Savings</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {type === "flexible" ? "Withdraw anytime. 8% p.a. interest." :
                       type === "locked" ? "Lock for higher returns. Up to 14% p.a." :
                       "Set a target and track progress. 10% p.a."}
                    </p>
                  </motion.button>
                );
              })}
            </>
          )}

          {createStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="form-section">
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input type="text" placeholder="e.g., New Car Fund" className="input-premium" />
              </div>
              <div className="form-group">
                <label className="form-label">Target Amount</label>
                <input type="text" placeholder="$0" className="input-premium" />
              </div>
              <div className="form-group">
                <label className="form-label">Target Date</label>
                <input type="text" placeholder="DD/MM/YYYY" className="input-premium" />
              </div>
              <button onClick={() => setCreateStep(2)} className="btn-primary mt-2">
                Continue
              </button>
            </motion.div>
          )}

          {createStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-2xl bg-card shadow-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Auto-Save</p>
                    <p className="text-[10px] text-muted-foreground">Automatically save on schedule</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount per contribution</label>
                  <input type="text" placeholder="$10,000" className="input-premium" />
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <div className="flex gap-2">
                    {["Daily", "Weekly", "Monthly"].map((f) => (
                      <button key={f} className="flex-1 rounded-lg border border-border/20 bg-card py-2.5 text-[11px] font-semibold text-foreground hover:bg-muted/20 transition-colors">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setCreateStep(3)} className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.98]">
                Review Plan
              </button>
            </motion.div>
          )}

          {createStep === 3 && (
            <SuccessState
              title="Plan Created!"
              subtitle="Your savings plan is ready. Start building your future."
              action={{ label: "Go to Savings", onClick: () => { setView("dashboard"); setCreateStep(0); } }}
            />
          )}
        </div>
      </div>
    );
  }

  // --- Detail view ---
  if (view === "detail" && selectedPlan) {
    const pct = selectedPlan.target ? Math.round((selectedPlan.balance / selectedPlan.target) * 100) : null;
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">{selectedPlan.name}</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          {/* Balance card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl balance-gradient p-5 shadow-balance relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/[0.03]" />
            <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">Saved</p>
            <p className="text-[28px] font-extrabold text-white tabular-nums mb-2">
              ${selectedPlan.balance.toLocaleString()}
            </p>
            {selectedPlan.target && (
              <>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-1.5">
                  <div className="h-full rounded-full bg-white/60 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50">{pct}% of target</span>
                  <span className="text-[10px] text-white/50 tabular-nums">${selectedPlan.target.toLocaleString()}</span>
                </div>
              </>
            )}
          </motion.div>

          {/* Plan info */}
          <div className="rounded-2xl bg-card shadow-card p-4 space-y-2.5">
            <InfoRow label="Type" value={typeLabels[selectedPlan.type]} />
            <InfoRow label="Interest Rate" value={selectedPlan.rate} />
            {selectedPlan.maturity && <InfoRow label="Maturity" value={selectedPlan.maturity} />}
            {selectedPlan.autoSave && (
              <>
                <InfoRow label="Auto-Save" value={`$${selectedPlan.autoAmount?.toLocaleString()} / ${selectedPlan.frequency}`} />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-2xl balance-gradient py-3.5 text-[13px] font-bold text-white active:scale-[0.98]">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              Top Up
            </button>
            {selectedPlan.type === "flexible" && (
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-border/20 bg-card py-3.5 text-[13px] font-semibold text-foreground active:scale-[0.98]">
                Withdraw
              </button>
            )}
            {selectedPlan.type === "locked" && (
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-border/20 bg-card py-3.5 text-[13px] font-semibold text-muted-foreground active:scale-[0.98]" disabled>
                <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                Locked
              </button>
            )}
          </div>

          {/* Contribution history placeholder */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Recent Contributions</h3>
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              {[
                { label: "Auto-Save", amount: "+$10,000", date: "Today" },
                { label: "Manual Top-Up", amount: "+$50,000", date: "Mar 12" },
                { label: "Auto-Save", amount: "+$10,000", date: "Mar 10" },
              ].map((c, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-border/15" : ""}`}>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{c.label}</p>
                    <p className="text-[10px] text-muted-foreground">{c.date}</p>
                  </div>
                  <p className="text-[12px] font-bold text-success tabular-nums">{c.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Plan management */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 rounded-2xl bg-card shadow-card px-4 py-3 hover:bg-muted/15 transition-colors">
              <Edit2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
              <span className="text-[12px] font-semibold text-foreground flex-1 text-left">Edit Plan</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </button>
            <button className="w-full flex items-center gap-3 rounded-2xl bg-card shadow-card px-4 py-3 hover:bg-muted/15 transition-colors">
              <Pause className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
              <span className="text-[12px] font-semibold text-foreground flex-1 text-left">Pause Auto-Save</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Savings</h1>
          </div>
          <button onClick={() => setView("create")}
            className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/12 transition-colors"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            New Plan
          </button>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-4">
        {/* Total savings card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl balance-gradient p-5 shadow-balance relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/[0.03]" />
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1">Total Savings</p>
          <p className="text-[32px] font-extrabold text-white tabular-nums leading-none">
            ${totalSavings.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="h-3 w-3 text-white/50" strokeWidth={2} />
            <span className="text-[10px] font-medium text-white/50">Earning across {mockPlans.length} plans</span>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Your Plans</h3>
          {mockPlans.map((plan, i) => {
            const Icon = typeIcons[plan.type];
            const pct = plan.target ? Math.round((plan.balance / plan.target) * 100) : null;
            return (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setSelectedPlan(plan); setView("detail"); }}
                className="w-full rounded-2xl bg-card shadow-card p-4 text-left hover:bg-muted/15 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeBgs[plan.type]}`}>
                    <Icon className={`h-[18px] w-[18px] ${typeColors[plan.type]}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13px] font-semibold text-foreground">{plan.name}</p>
                      <span className={`text-[9px] font-bold uppercase ${typeColors[plan.type]}`}>{typeLabels[plan.type]}</span>
                    </div>
                    <p className="text-[15px] font-bold text-foreground tabular-nums">${plan.balance.toLocaleString()}</p>
                    {pct !== null && (
                      <div className="mt-2">
                        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-muted-foreground">{pct}% complete</span>
                          <span className="text-[9px] text-muted-foreground tabular-nums">${plan.target!.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {plan.autoSave && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Zap className="h-2.5 w-2.5 text-primary" strokeWidth={2} />
                        <span className="text-[9px] text-muted-foreground">${plan.autoAmount?.toLocaleString()} / {plan.frequency}</span>
                      </div>
                    )}
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{plan.rate}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Smart suggestion */}
        <div className="rounded-xl bg-primary/[0.03] border border-primary/8 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <p className="text-[11px] font-semibold text-foreground">Smart Suggestion</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Based on your spending, saving $15,000/week could build a $780,000 emergency fund by year-end.
          </p>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default SavingsPage;
