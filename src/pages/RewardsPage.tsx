import { useState } from "react";
import { ArrowLeft, Gift, Users, Copy, Check, ChevronRight, Star, TrendingUp, Zap, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRewardsHubDemoQuery } from "@/lib/demo/screenQueries";
import { formatUsdLineFromCents, formatUsdPosLineFromCents } from "@/lib/format/money";
import { InlineQueryError, ListRowSkeleton } from "@/components/states/AsyncContent";
import { EmptyState } from "@/components/states/StateUI";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RewardsView = "hub" | "referral";

const REFERRAL_BONUS_CENTS = 500_00;

const referrals = [
  { name: "Kendall Bailey", status: "completed" as const, rewardCents: REFERRAL_BONUS_CENTS },
  { name: "Taylor Bakare", status: "completed" as const, rewardCents: REFERRAL_BONUS_CENTS },
  { name: "Nora Ibe", status: "pending" as const, rewardCents: REFERRAL_BONUS_CENTS },
];

const RewardsPage = () => {
  const reduced = usePrefersReducedMotion();
  const hubQuery = useRewardsHubDemoQuery();
  const [view, setView] = useState<RewardsView>("hub");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <motion.div initial={reduced ? undefined : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
              className="rounded-2xl balance-gradient p-5 shadow-balance relative overflow-hidden text-center"
          >
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-white/[0.03]" />
            <Gift className="h-8 w-8 text-white/60 mx-auto mb-2" strokeWidth={1.5} />
            <h2 className="text-[16px] font-bold text-white mb-1">
              Earn {formatUsdLineFromCents(REFERRAL_BONUS_CENTS)} per referral
            </h2>
            <p className="text-[11px] text-white/50 max-w-xs mx-auto">
              Invite friends to Zenith Pay. You both earn {formatUsdLineFromCents(REFERRAL_BONUS_CENTS)} when they complete their first transaction.
            </p>
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
                  <span className={`text-[11px] font-bold tabular-nums ${r.status === "completed" ? "text-success" : "text-warning"}`}>
                    {formatUsdLineFromCents(r.rewardCents)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted/20 border border-border/10 px-4 py-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Rewards settle per your issuer program. Timing shown here is illustrative.
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
        {hubQuery.isPending && (
          <div className="rounded-2xl bg-card shadow-card overflow-hidden border border-border/15">
            <ListRowSkeleton rows={5} />
          </div>
        )}
        {hubQuery.isError && (
          <InlineQueryError message="Could not load rewards." onRetry={() => hubQuery.refetch()} />
        )}

        {hubQuery.data && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="rounded-2xl bg-card shadow-card p-5"
          >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total earned</p>
              <p className="text-[24px] font-extrabold text-foreground tabular-nums mt-0.5">
                {formatUsdLineFromCents(hubQuery.data.totalEarnedCents)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/8">
              <Gift className="h-6 w-6 text-warning" strokeWidth={1.5} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">This month</p>
              <p className="text-[14px] font-bold text-foreground tabular-nums">
                {formatUsdLineFromCents(hubQuery.data.monthCents)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 p-3">
              <p className="text-[9px] text-muted-foreground">Pending</p>
              <p className="text-[14px] font-bold text-warning tabular-nums">
                {formatUsdLineFromCents(hubQuery.data.pendingCents)}
              </p>
            </div>
          </div>
        </motion.div>
        )}

        {/* Invite CTA */}
        <button
          type="button"
          onClick={() => setView("referral")}
          className="w-full rounded-2xl balance-gradient p-4 min-h-[52px] shadow-balance text-left relative overflow-hidden active:scale-[0.98] interactive-focus"
        >
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/[0.04]" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Users className="h-5 w-5 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-white">
                Invite & earn {formatUsdLineFromCents(REFERRAL_BONUS_CENTS)}
              </p>
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
        {hubQuery.data && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reward history</h3>
          {hubQuery.data.history.length === 0 ? (
            <EmptyState
              title="No rewards yet"
              subtitle="Earn cashback when your program is backed by a loyalty engine."
              action={{ label: "Explore services", to: "/services" }}
            />
          ) : (
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              {hubQuery.data.history.map((r, i) => (
                <div key={`${r.title}-${i}`} className={`flex items-center justify-between px-4 py-3.5 min-h-[52px] ${i < hubQuery.data!.history.length - 1 ? "border-b border-border/15" : ""}`}>
                  <div className="min-w-0 pr-3">
                    <p className="text-[12px] font-semibold text-foreground">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-[12px] font-bold tabular-nums ${r.status === "credited" ? "text-success" : "text-warning"}`}>
                      {formatUsdPosLineFromCents(r.amountCents)}
                    </p>
                    <span className="text-[8px] font-semibold text-muted-foreground capitalize">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
};

export default RewardsPage;
