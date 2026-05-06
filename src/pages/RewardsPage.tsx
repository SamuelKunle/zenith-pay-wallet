import { useState } from "react";
import { ArrowLeft, Gift, Users, Copy, Check, ChevronRight, Star, TrendingUp, Zap, Share2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type RewardsView = "hub" | "referral";

const rewards = [
  { title: "Bill Payment Cashback", amount: "$250", date: "Today", status: "credited" },
  { title: "Referral Bonus", amount: "$500", date: "Yesterday", status: "credited" },
  { title: "Transfer Milestone", amount: "$1,000", date: "Mar 12", status: "pending" },
  { title: "Savings Streak", amount: "$150", date: "Mar 10", status: "credited" },
];

const referrals = [
  { name: "Kendall Bailey", status: "completed", reward: "$500" },
  { name: "Taylor Bakare", status: "completed", reward: "$500" },
  { name: "Nora Ibe", status: "pending", reward: "$500" },
];

const RewardsPage = () => {
  const [view, setView] = useState<RewardsView>("hub");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // --- Referral ---
  if (view === "referral") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("hub")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Invite Friends</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl balance-gradient p-5 shadow-balance relative overflow-hidden text-center"
          >
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-white/[0.03]" />
            <Gift className="h-8 w-8 text-white/60 mx-auto mb-2" strokeWidth={1.5} />
            <h2 className="text-[16px] font-bold text-white mb-1">Earn $500 per referral</h2>
            <p className="text-[11px] text-white/50 max-w-xs mx-auto">Invite friends to Zenith Pay. You both earn $500 when they complete their first transaction.</p>
          </motion.div>

          <div className="rounded-2xl bg-card shadow-card p-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-muted/30 px-4 py-3">
                <p className="text-[15px] font-bold text-foreground tracking-wider tabular-nums">CHIOMA2024</p>
              </div>
              <button onClick={handleCopy} className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 active:scale-90">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-primary" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-2xl balance-gradient py-3.5 text-[12px] font-bold text-white active:scale-[0.98]">
              <Share2 className="h-4 w-4" /> Share Link
            </button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-2xl border border-border/20 bg-card py-3.5 text-[12px] font-semibold text-foreground active:scale-[0.98]">
              <Copy className="h-4 w-4" /> Copy Code
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Your Referrals</h3>
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              {referrals.map((r, i) => (
                <div key={r.name} className={`flex items-center gap-3 px-4 py-3 ${i < referrals.length - 1 ? "border-b border-border/15" : ""}`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/8">
                    <span className="text-[10px] font-bold text-primary">{r.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{r.status}</p>
                  </div>
                  <span className={`text-[11px] font-bold ${r.status === "completed" ? "text-success" : "text-warning"}`}>{r.reward}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted/20 border border-border/10 px-4 py-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Rewards are credited within 24 hours of your friend's first transaction. <span className="font-semibold text-primary">Terms apply</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Hub ---
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Rewards</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-4">
        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total Earned</p>
              <p className="text-[24px] font-extrabold text-foreground tabular-nums mt-0.5">$4,900</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/8">
              <Gift className="h-6 w-6 text-warning" strokeWidth={1.5} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">This Month</p>
              <p className="text-[14px] font-bold text-foreground tabular-nums">$1,900</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">Pending</p>
              <p className="text-[14px] font-bold text-warning tabular-nums">$1,000</p>
            </div>
          </div>
        </motion.div>

        {/* Invite CTA */}
        <button onClick={() => setView("referral")}
          className="w-full rounded-2xl balance-gradient p-4 shadow-balance text-left relative overflow-hidden active:scale-[0.98]"
        >
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/[0.04]" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Users className="h-5 w-5 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-white">Invite & Earn $500</p>
              <p className="text-[10px] text-white/50">Share your referral code with friends</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/30" />
          </div>
        </button>

        {/* Active offers */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Active Offers</h3>
          <div className="space-y-2">
            {[
              { icon: Zap, title: "Bill Payment Cashback", desc: "Get 2% back on all utility payments", color: "text-warning", bg: "bg-warning/8" },
              { icon: TrendingUp, title: "Savings Streak Bonus", desc: "Save weekly for 4 weeks, earn $500", color: "text-success", bg: "bg-success/8" },
              { icon: Star, title: "Fee-Free Weekend", desc: "Zero transfer fees this Saturday", color: "text-primary", bg: "bg-primary/8" },
            ].map((offer) => {
              const Icon = offer.icon;
              return (
                <div key={offer.title} className="flex items-center gap-3 rounded-2xl bg-card shadow-card p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${offer.bg}`}>
                    <Icon className={`h-[17px] w-[17px] ${offer.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-foreground">{offer.title}</p>
                    <p className="text-[10px] text-muted-foreground">{offer.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* History */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reward History</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {rewards.map((r, i) => (
              <div key={`${r.title}-${i}`} className={`flex items-center justify-between px-4 py-3 ${i < rewards.length - 1 ? "border-b border-border/15" : ""}`}>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground">{r.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[12px] font-bold tabular-nums ${r.status === "credited" ? "text-success" : "text-warning"}`}>+{r.amount}</p>
                  <span className="text-[8px] font-semibold text-muted-foreground capitalize">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="flex items-center gap-2 rounded-xl bg-muted/20 border border-border/10 px-4 py-3">
          <Shield className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" strokeWidth={2} />
          <p className="text-[10px] text-muted-foreground">Rewards are applied automatically. No hidden conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
