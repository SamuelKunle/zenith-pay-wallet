import { useState } from "react";
import { ArrowLeft, Shield, Fingerprint, AlertTriangle, Lock, Eye, ChevronRight, Monitor, Info, Ban, CheckCircle2, XCircle, Smartphone, Key, Activity, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { SecurityScore, TrustSignal, FraudAlert } from "@/components/security/SecurityUI";
import { motionConfig } from "@/components/PageTransition";

const trustedDevices = [
  { name: "iPhone 15 Pro", location: "London, worldwide", lastActive: "Active now", current: true, os: "iOS 17.4" },
  { name: "MacBook Pro", location: "London, worldwide", lastActive: "2 hours ago", current: false, os: "macOS 14" },
  { name: "Samsung Galaxy S24", location: "New York, worldwide", lastActive: "3 days ago", current: false, os: "Android 14" },
];

const loginActivity = [
  { device: "iPhone 15 Pro", location: "London, worldwide", time: "Today, 2:30 PM", status: "success" as const },
  { device: "MacBook Pro", location: "London, worldwide", time: "Today, 10:15 AM", status: "success" as const },
  { device: "Unknown Device", location: "Singapore, worldwide", time: "Yesterday, 11:45 PM", status: "blocked" as const },
  { device: "iPhone 15 Pro", location: "London, worldwide", time: "Yesterday, 8:20 AM", status: "success" as const },
];

const fraudTips = [
  { title: "Never share your PIN", desc: "Zenith Pay will never ask for your PIN or password via call, SMS, or email." },
  { title: "Verify before you send", desc: "Always confirm the recipient's name before completing a transfer." },
  { title: "Report suspicious activity", desc: "If you notice unauthorized transactions, freeze your account immediately." },
  { title: "Use strong passwords", desc: "Combine letters, numbers, and symbols. Avoid using birthdays or names." },
];

const SecurityPage = () => {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [accountFrozen, setAccountFrozen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "devices" | "activity" | "learn">("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "devices" as const, label: "Devices" },
    { id: "activity" as const, label: "Activity" },
    { id: "learn" as const, label: "Learn" },
  ];

  const securityScore = biometric && twoFactor && loginAlerts ? 92 : biometric && twoFactor ? 85 : 65;
  const scoreLabel = securityScore >= 90 ? "Excellent" : securityScore >= 80 ? "Strong" : "Needs attention";
  const scoreColor = securityScore >= 80 ? "text-success" : "text-warning";

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-page-title">Security Center</h1>
          </div>
          <SecurityScore score={securityScore} label={scoreLabel} size="sm" />
        </div>

        <div className="flex gap-1 px-5 pb-2.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ease-premium ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-surface-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-4 md:px-8 space-y-4">
        {activeTab === "overview" && (
          <>
            {/* Protection summary with animated score ring */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="surface-content p-6 flex flex-col items-center"
            >
              <SecurityScore score={securityScore} label={scoreLabel} size="lg" />
              <p className="text-caption mt-3 text-center max-w-[240px]">
                {securityScore >= 90
                  ? "Your account has maximum protection enabled"
                  : "Enable all security features to reach maximum protection"}
              </p>
              <div className="flex gap-1.5 w-full mt-4">
                {[
                  { label: "Biometric", on: biometric },
                  { label: "2FA", on: twoFactor },
                  { label: "Alerts", on: loginAlerts },
                  { label: "Tx Alerts", on: transactionAlerts },
                ].map((f) => (
                  <div key={f.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`w-full h-1 rounded-full transition-colors ${f.on ? "bg-success/40" : "bg-muted"}`} />
                    <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emergency: Freeze */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
              className={`rounded-2xl shadow-card p-4 transition-colors ${accountFrozen ? "bg-destructive/[0.04] border border-destructive/15" : "bg-card"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accountFrozen ? "bg-destructive/10" : "bg-secondary"}`}>
                  <Ban className={`h-[18px] w-[18px] ${accountFrozen ? "text-destructive" : "text-muted-foreground"}`} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{accountFrozen ? "Account Frozen" : "Freeze Account"}</p>
                  <p className="text-[11px] text-muted-foreground">{accountFrozen ? "All transactions blocked" : "Instantly block all transactions"}</p>
                </div>
                <Switch checked={accountFrozen} onCheckedChange={setAccountFrozen} />
              </div>
              {accountFrozen && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/8 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" strokeWidth={2} />
                  <p className="text-[11px] text-destructive">Unfreeze to resume normal account activity</p>
                </div>
              )}
            </motion.div>

            {/* Authentication */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Authentication</h3>
              <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/15">
                <ToggleRow icon={Fingerprint} label="Biometric Login" sub="Face ID & fingerprint" value={biometric} onChange={setBiometric} />
                <ToggleRow icon={Shield} label="Two-Factor Auth" sub="Extra verification on login" value={twoFactor} onChange={setTwoFactor} />
                <LinkRow icon={Lock} label="Change PIN" sub="Update 6-digit transaction PIN" />
                <LinkRow icon={Key} label="Change Password" sub="Update login password" />
              </div>
            </motion.div>

            {/* Transfer Limits */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Transfer Limits · Tier 3</h3>
              <div className="rounded-2xl bg-card shadow-card p-4 space-y-4">
                <LimitRow label="Daily Transfer" current="$2,000,000" max="$5,000,000" pct={40} />
                <LimitRow label="Single Transaction" current="$500,000" max="$1,000,000" pct={50} />
                <LimitRow label="International" current="$0" max="$10,000 /mo" pct={0} />
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Notifications</h3>
              <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/15">
                <ToggleRow icon={Eye} label="Login Alerts" sub="Notify on new device logins" value={loginAlerts} onChange={setLoginAlerts} />
                <ToggleRow icon={Activity} label="Transaction Alerts" sub="Alerts for large transactions" value={transactionAlerts} onChange={setTransactionAlerts} />
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "devices" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">Devices with access to your account</p>
            {trustedDevices.map((device, i) => (
              <motion.div key={device.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card shadow-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                    {device.os.includes("iOS") ? <Smartphone className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} /> : <Monitor className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-foreground">{device.name}</p>
                      {device.current && (
                        <span className="rounded-full bg-success/8 px-2 py-0.5 text-[9px] font-bold text-success uppercase">Current</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{device.os} · {device.location}</p>
                    <p className="text-[10px] text-muted-foreground/70">{device.lastActive}</p>
                  </div>
                  {!device.current && (
                    <button className="text-[11px] font-semibold text-destructive/80 hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/5">
                      Remove
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground mb-2">Recent login attempts</p>
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              {loginActivity.map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < loginActivity.length - 1 ? "border-b border-border/15" : ""
                  } ${entry.status === "blocked" ? "bg-destructive/[0.02]" : ""}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    entry.status === "success" ? "bg-success/8" : "bg-destructive/8"
                  }`}>
                    {entry.status === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground">{entry.device}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.location} · {entry.time}</p>
                  </div>
                  {entry.status === "blocked" && (
                    <span className="text-[10px] font-bold text-destructive">Blocked</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "learn" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-primary/[0.03] border border-primary/8 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="h-4 w-4 text-primary" strokeWidth={2} />
                <h3 className="text-[13px] font-bold text-foreground">Stay Safe with Zenith Pay</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Learn how to protect your account and recognize common fraud patterns.
              </p>
            </div>

            {fraudTips.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card shadow-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/8">
                    <Info className="h-3.5 w-3.5 text-warning" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground mb-0.5">{tip.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/support" className="block w-full rounded-2xl border border-border/20 bg-card py-3.5 text-center text-[13px] font-semibold text-primary hover:bg-muted/15 transition-colors">
              Report Suspicious Activity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

function ToggleRow({ icon: Icon, label, sub, value, onChange }: {
  icon: any; label: string; sub: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function LinkRow({ icon: Icon, label, sub }: { icon: any; label: string; sub: string }) {
  return (
    <button className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/15 transition-colors">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={1.8} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
    </button>
  );
}

function LimitRow({ label, current, max, pct }: { label: string; current: string; max: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[12px] font-semibold text-foreground">{label}</p>
        <p className="text-[12px] font-semibold text-foreground tabular-nums">{current}</p>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground">Max: {max}</p>
    </div>
  );
}

export default SecurityPage;
