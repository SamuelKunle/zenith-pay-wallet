import { ArrowLeft, TrendingUp, TrendingDown, Zap, PiggyBank, CreditCard, ShoppingBag, Car, Home as HomeIcon, Utensils, Sparkles, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const insights = [
  { id: "1", icon: TrendingUp, title: "Transport spending up 23%", desc: "You spent $18,400 on transport this week vs $15,000 last week.", color: "text-warning", bg: "bg-warning/8", actionLabel: "View breakdown", actionPath: "/history" },
  { id: "2", icon: Zap, title: "Electricity bill likely due", desc: "Based on your history, your IKEDC payment is usually around this time.", color: "text-primary", bg: "bg-primary/8", actionLabel: "Pay now", actionPath: "/services/electricity" },
  { id: "3", icon: PiggyBank, title: "Savings goal almost there", desc: "You're 80% towards your laptop fund. $100K more to reach your target.", color: "text-success", bg: "bg-success/8", actionLabel: "Top up", actionPath: "/savings" },
  { id: "4", icon: CreditCard, title: "Card unused this month", desc: "Your virtual card hasn't been used in 14 days. Consider freezing it for safety.", color: "text-muted-foreground", bg: "bg-secondary", actionLabel: "Manage card", actionPath: "/cards" },
  { id: "5", icon: TrendingDown, title: "Spending decreased", desc: "Your overall spending is down 12% this month. Great financial discipline.", color: "text-success", bg: "bg-success/8" },
];

const spendingCategories = [
  { icon: Utensils, label: "Food & Dining", amount: "$45,200", pct: 32 },
  { icon: Car, label: "Transport", amount: "$18,400", pct: 13 },
  { icon: ShoppingBag, label: "Shopping", amount: "$62,000", pct: 44 },
  { icon: HomeIcon, label: "Bills & Utilities", amount: "$15,800", pct: 11 },
];

const InsightsPage = () => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const activeInsights = insights.filter(i => !dismissed.includes(i.id));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex items-center gap-1.5 flex-1">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} />
            <h1 className="text-[15px] font-bold text-foreground">Insights</h1>
          </div>
          <span className="text-[9px] font-medium text-muted-foreground">AI-powered</span>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-4">
        {/* Weekly summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-card p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
            <h3 className="text-[12px] font-semibold text-foreground">Weekly Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">Income</p>
              <p className="text-[16px] font-bold text-success tabular-nums">+$285,000</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">Spent</p>
              <p className="text-[16px] font-bold text-foreground tabular-nums">$141,400</p>
            </div>
          </div>

          {/* Spending breakdown */}
          <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Where your money went</h4>
          <div className="space-y-2">
            {spendingCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.label} className="flex items-center gap-3">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.8} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-medium text-foreground">{cat.label}</span>
                      <span className="text-[10px] font-semibold text-foreground tabular-nums">{cat.amount}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Smart insights */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Smart Insights</h3>
          {activeInsights.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Sparkles className="h-6 w-6 text-muted-foreground/80 mb-3" strokeWidth={1.5} />
              <p className="text-[12px] font-semibold text-foreground mb-0.5">All caught up</p>
              <p className="text-[10px] text-muted-foreground">New insights will appear as we learn your patterns</p>
            </div>
          ) : (
            activeInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <motion.div key={insight.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-card shadow-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${insight.bg}`}>
                      <Icon className={`h-[16px] w-[16px] ${insight.color}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground mb-0.5">{insight.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{insight.desc}</p>
                      {insight.actionLabel && insight.actionPath && (
                        <Link to={insight.actionPath} className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary">
                          {insight.actionLabel}
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    <button onClick={() => setDismissed(prev => [...prev, insight.id])}
                      className="p-1 rounded-lg hover:bg-muted/30 transition-colors shrink-0"
                    >
                      <X className="h-3 w-3 text-muted-foreground/60" strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-muted/20 border border-border/10 px-4 py-3">
          <p className="text-[9px] text-muted-foreground leading-relaxed">
            Insights are generated based on your transaction patterns. This is not financial advice. Always make decisions based on your own circumstances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
