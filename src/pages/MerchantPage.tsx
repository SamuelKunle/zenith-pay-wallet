import { Eye, EyeOff, QrCode, Link as LinkIcon, Users, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, Bell, Settings, Shield, ChevronRight, Plus, FileText, Store, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";

type MerchantView = "dashboard" | "transactions" | "tools" | "settings" | "onboarding";

const recentPayments = [
  { customer: "Adekunle Johnson", amount: "+$15,000", time: "2 min ago", status: "success", method: "QR Scan" },
  { customer: "Mary Udoh", amount: "+$8,500", time: "15 min ago", status: "success", method: "Pay Link" },
  { customer: "Ibrahim Musa", amount: "+$45,000", time: "1 hr ago", status: "pending", method: "QR Scan" },
  { customer: "Grace Eze", amount: "+$3,200", time: "2 hrs ago", status: "success", method: "Transfer" },
  { customer: "Chidi Okafor", amount: "+$22,000", time: "3 hrs ago", status: "success", method: "QR Scan" },
];

const statusColors = {
  success: "bg-success/8 text-success",
  pending: "bg-warning/8 text-warning",
  failed: "bg-destructive/8 text-destructive",
};

const MerchantPage = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [view, setView] = useState<MerchantView>("dashboard");
  const [txFilter, setTxFilter] = useState<"all" | "success" | "pending">("all");

  // --- Onboarding ---
  if (view === "onboarding") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ChevronRight className="h-[17px] w-[17px] text-foreground rotate-180" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Business Setup</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-3">
          <div className="rounded-2xl bg-primary/[0.03] border border-primary/8 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Store className="h-4 w-4 text-primary" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-foreground">Complete your business profile</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Verified businesses get premium badges, faster settlements, and higher limits.</p>
          </div>
          {[
            { title: "Business Information", desc: "Name, category, and address", done: true },
            { title: "Business Verification", desc: "CAC registration or utility bill", done: true },
            { title: "Settlement Account", desc: "Bank account for daily payouts", done: false },
            { title: "Store Identity", desc: "Logo and display name for customers", done: false },
          ].map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 rounded-2xl p-4 ${step.done ? "bg-success/[0.03] border border-success/8" : "bg-card shadow-card border border-border/10"}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.done ? "bg-success/8" : "bg-secondary"}`}>
                {step.done ? <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={2} /> : <AlertCircle className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />}
              </div>
              <div className="flex-1">
                <p className={`text-[12px] font-semibold ${step.done ? "text-success" : "text-foreground"}`}>{step.title}</p>
                <p className="text-[10px] text-muted-foreground">{step.done ? "Completed" : step.desc}</p>
              </div>
              {!step.done && <ChevronRight className="h-4 w-4 text-muted-foreground/80" />}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // --- Transactions ---
  if (view === "transactions") {
    const filtered = txFilter === "all" ? recentPayments : recentPayments.filter(p => p.status === txFilter);
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ChevronRight className="h-[17px] w-[17px] text-foreground rotate-180" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground flex-1">Payments</h1>
            <Filter className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <div className="flex gap-2 px-5 pb-2.5">
            {(["all", "success", "pending"] as const).map(f => (
              <button key={f} onClick={() => setTxFilter(f)}
                className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize transition-all ${txFilter === f ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
              >{f}</button>
            ))}
          </div>
        </header>
        <div className="px-5 py-3">
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {filtered.map((p, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors ${i < filtered.length - 1 ? "border-b border-border/15" : ""}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/8">
                  <ArrowDownLeft className="h-[17px] w-[17px] text-success" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">{p.customer}</p>
                  <p className="text-[10px] text-muted-foreground">{p.method} · {p.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-success tabular-nums">{p.amount}</p>
                  <span className={`inline-block mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-semibold capitalize ${statusColors[p.status as keyof typeof statusColors]}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Tools ---
  if (view === "tools") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ChevronRight className="h-[17px] w-[17px] text-foreground rotate-180" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Business Tools</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-3">
          {[
            { icon: QrCode, title: "Static QR Code", desc: "Permanent QR for your store", path: "/merchant/qr" },
            { icon: QrCode, title: "Dynamic QR", desc: "One-time QR with set amount", path: "/merchant/qr" },
            { icon: LinkIcon, title: "Payment Link", desc: "Share a link to receive payment", path: "/merchant/qr" },
            { icon: FileText, title: "Invoice", desc: "Send professional invoices", path: "/merchant/qr" },
            { icon: Users, title: "Staff Access", desc: "Add cashiers to accept payments", path: "/merchant/qr" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.title} to={tool.path}
                className="flex items-center gap-3 rounded-2xl bg-card shadow-card p-4 hover:bg-muted/15 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-foreground">{tool.title}</p>
                  <p className="text-[10px] text-muted-foreground">{tool.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Settings ---
  if (view === "settings") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ChevronRight className="h-[17px] w-[17px] text-foreground rotate-180" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Business Settings</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/15">
            {[
              { label: "Business Profile", sub: "Chi's Kitchen · Restaurant" },
              { label: "Payout Account", sub: "Global Bank ****4521 · Daily settlement" },
              { label: "Payment Notifications", sub: "Sound + push for every payment" },
              { label: "Settlement Schedule", sub: "Next day, 9:00 AM" },
            ].map(item => (
              <button key={item.label} className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/15 transition-colors text-left">
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/80 shrink-0" />
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-card shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-foreground">Payment Alerts</p>
                <p className="text-[10px] text-muted-foreground">Sound when payment received</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <Link to="/support" className="block rounded-2xl bg-card shadow-card p-4 hover:bg-muted/15 transition-colors">
            <p className="text-[12px] font-semibold text-primary">Contact Business Support</p>
            <p className="text-[10px] text-muted-foreground">Settlement issues, disputes, account help</p>
          </Link>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20 md:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground tracking-wide">Business Mode</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[14px] font-bold text-foreground">Chi's Kitchen</p>
              <div className="flex items-center gap-0.5 rounded-full bg-success/8 px-1.5 py-0.5">
                <Shield className="h-2 w-2 text-success" strokeWidth={2.5} />
                <span className="text-[7px] font-bold text-success">Verified</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <Bell className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-card" />
            </Link>
            <button onClick={() => setView("settings")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <Settings className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 md:px-8 md:py-6 space-y-4">
        {/* Balance card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="merchant-gradient shimmer rounded-2xl p-5 shadow-elevated relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/[0.04]" />
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Business Balance</span>
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 transition-colors">
              {balanceVisible ? <Eye className="h-3.5 w-3.5 text-white/60" /> : <EyeOff className="h-3.5 w-3.5 text-white/60" />}
            </button>
          </div>
          <p className="text-[30px] font-extrabold text-white tracking-tight leading-none tabular-nums">
            {balanceVisible ? "$3,456,200" : "$ ••••••"}
            {balanceVisible && <span className="text-sm font-semibold text-white/40 ml-0.5">.00</span>}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-white/40" />
            <span className="text-[10px] font-medium text-white/40">+$285,400 today · 32 transactions</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Today", value: "$285K", sub: "32 txns" },
            { label: "This Week", value: "$1.2M", sub: "148 txns" },
            { label: "Pending", value: "$45K", sub: "3 txns" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card shadow-card p-3">
              <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-[14px] font-bold text-foreground mt-0.5 tabular-nums">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: QrCode, label: "Receive", action: () => {}, path: "/merchant/qr" },
            { icon: LinkIcon, label: "Pay Link", action: () => setView("tools"), path: undefined },
            { icon: FileText, label: "All Txns", action: () => setView("transactions"), path: undefined },
            { icon: Plus, label: "Tools", action: () => setView("tools"), path: undefined },
          ].map((action) => {
            const Icon = action.icon;
            const Wrapper = action.path ? Link : "button" as any;
            const wrapperProps = action.path ? { to: action.path } : { onClick: action.action };
            return (
              <Wrapper key={action.label} {...wrapperProps} className="flex flex-col items-center gap-1 py-2 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-all group-hover:bg-muted group-active:scale-90">
                  <Icon className="h-[18px] w-[18px] text-foreground/60" strokeWidth={1.8} />
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground">{action.label}</span>
              </Wrapper>
            );
          })}
        </div>

        {/* Settlement */}
        <div className="rounded-2xl bg-card shadow-card p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[11px] font-semibold text-foreground">Next Settlement</h3>
            <span className="text-[9px] font-medium text-muted-foreground">Tomorrow, 9 AM</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/8">
              <Clock className="h-[17px] w-[17px] text-success" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-foreground tabular-nums">$1,245,600</p>
              <p className="text-[10px] text-muted-foreground">Global Bank ****4521</p>
            </div>
            <span className="rounded-full bg-warning/8 px-2 py-0.5 text-[8px] font-semibold text-warning">Processing</span>
          </div>
        </div>

        {/* Recent payments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold text-foreground">Recent Payments</h3>
            <button onClick={() => setView("transactions")} className="text-[10px] font-semibold text-primary">See all</button>
          </div>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {recentPayments.slice(0, 4).map((p, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < 3 ? "border-b border-border/15" : ""}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/8">
                  <ArrowDownLeft className="h-[16px] w-[16px] text-success" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">{p.customer}</p>
                  <p className="text-[10px] text-muted-foreground">{p.method} · {p.time}</p>
                </div>
                <p className="text-[12px] font-bold text-success tabular-nums">{p.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business setup prompt */}
        <button onClick={() => setView("onboarding")}
          className="w-full rounded-2xl bg-primary/[0.03] border border-primary/8 p-4 text-left hover:bg-primary/[0.05] transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <p className="text-[11px] font-semibold text-foreground">Complete Business Setup</p>
          </div>
          <p className="text-[10px] text-muted-foreground">2 of 4 steps complete · Unlock faster settlements</p>
        </button>
      </div>
    </div>
  );
};

export default MerchantPage;
