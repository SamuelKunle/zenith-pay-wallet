import { ArrowLeft, ArrowDownLeft, ArrowUpRight, ShieldAlert, CreditCard, Star, CheckCircle, Target, Zap, FileText, Users, Bell, Gift, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/states/StateUI";

type NotifCategory = "all" | "money" | "security" | "rewards";

const notifications = [
  { type: "credit", icon: ArrowDownLeft, title: "Money Received", desc: "$50,000 from Emerson Obi", time: "2 min ago", read: false, category: "money", actionLabel: "View", actionPath: "/history" },
  { type: "debit", icon: ArrowUpRight, title: "Transfer Successful", desc: "$75,000 to Avery Nwachukwu", time: "1 hr ago", read: false, category: "money", actionLabel: "Receipt", actionPath: "/history" },
  { type: "security", icon: ShieldAlert, title: "New Device Login", desc: "Samsung Galaxy S23 in London", time: "3 hrs ago", read: false, category: "security", actionLabel: "Review", actionPath: "/security" },
  { type: "reward", icon: Gift, title: "Cashback Earned", desc: "$250 cashback on bill payment", time: "5 hrs ago", read: false, category: "rewards", actionLabel: "View", actionPath: "/rewards" },
  { type: "savings", icon: Target, title: "Savings Milestone", desc: "You've saved 50% of your laptop goal!", time: "8 hrs ago", read: true, category: "money", actionLabel: "View", actionPath: "/savings" },
  { type: "merchant", icon: CreditCard, title: "Payment Received", desc: "$15,000 from Adekunle via QR", time: "1 day ago", read: true, category: "money" },
  { type: "referral", icon: Users, title: "Referral Completed", desc: "Kendall signed up! You earned $500", time: "1 day ago", read: true, category: "rewards", actionLabel: "Invite more", actionPath: "/rewards" },
  { type: "bill", icon: Zap, title: "Bill Due Reminder", desc: "streaming TV subscription due in 3 days", time: "1 day ago", read: true, category: "money", actionLabel: "Pay now", actionPath: "/services/cable-tv" },
  { type: "system", icon: CheckCircle, title: "KYC Verified", desc: "Your account is now fully verified", time: "2 days ago", read: true, category: "security" },
  { type: "promo", icon: Star, title: "Fee-Free Transfers", desc: "Send money free this week", time: "3 days ago", read: true, category: "rewards" },
];

const iconStyles: Record<string, { bg: string; color: string }> = {
  credit: { bg: "bg-success/8", color: "text-success" },
  debit: { bg: "bg-primary/8", color: "text-primary" },
  security: { bg: "bg-destructive/8", color: "text-destructive" },
  reward: { bg: "bg-warning/8", color: "text-warning" },
  savings: { bg: "bg-success/8", color: "text-success" },
  merchant: { bg: "bg-success/8", color: "text-success" },
  referral: { bg: "bg-primary/8", color: "text-primary" },
  bill: { bg: "bg-warning/8", color: "text-warning" },
  system: { bg: "bg-success/8", color: "text-success" },
  promo: { bg: "bg-accent/8", color: "text-accent" },
};

const NotificationsPage = () => {
  const [category, setCategory] = useState<NotifCategory>("all");
  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = category === "all" ? notifications : notifications.filter(n => n.category === category);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button className="text-[10px] font-semibold text-primary">Mark all read</button>
          )}
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 px-5 pb-2.5">
          {(["all", "money", "security", "rewards"] as const).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize transition-all ${category === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
            >
              {cat}
              {cat === "all" && unreadCount > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-bold text-destructive-foreground">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-3 md:px-8">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-7 w-7 text-muted-foreground/60" strokeWidth={1.5} />}
            title="No notifications yet"
            subtitle="You'll see your alerts and activity updates here"
          />
        ) : (
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {filtered.map((n, i) => {
              const Icon = n.icon;
              const style = iconStyles[n.type] || iconStyles.system;
              return (
                <motion.div
                  key={`${n.type}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/20 ${
                    i < filtered.length - 1 ? "border-b border-border/15" : ""
                  } ${!n.read ? "bg-primary/[0.02]" : ""}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                    <Icon className={`h-[17px] w-[17px] ${style.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-[12px] font-semibold text-foreground ${!n.read ? "" : ""}`}>{n.title}</p>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.desc}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[9px] text-muted-foreground/80">{n.time}</p>
                      {n.actionLabel && n.actionPath && (
                        <Link to={n.actionPath} className="text-[9px] font-semibold text-primary">{n.actionLabel}</Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Preferences link */}
        <Link to="/settings" className="flex items-center justify-between mt-4 rounded-2xl bg-card shadow-card px-4 py-3.5 hover:bg-muted/15 transition-colors">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold text-foreground">Notification Preferences</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
