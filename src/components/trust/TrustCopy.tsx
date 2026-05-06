import { ReactNode } from "react";
import {
  Shield, ShieldCheck, CheckCircle2, Lock, Clock, Eye, Info,
  Fingerprint, AlertTriangle, HelpCircle, BadgeCheck, Banknote,
  ArrowRight, ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Inline Trust Label ───
// Minimal inline indicator — used beside fields, in lists, next to amounts
interface InlineTrustLabelProps {
  icon?: "check" | "shield" | "lock" | "clock" | "eye" | "verified";
  label: string;
  variant?: "success" | "neutral" | "muted" | "info";
  className?: string;
}

const inlineIcons = {
  check: CheckCircle2,
  shield: ShieldCheck,
  lock: Lock,
  clock: Clock,
  eye: Eye,
  verified: BadgeCheck,
};

export function InlineTrustLabel({ icon = "check", label, variant = "success", className }: InlineTrustLabelProps) {
  const Icon = inlineIcons[icon];
  const colors = {
    success: "text-success",
    neutral: "text-muted-foreground",
    muted: "text-muted-foreground/80",
    info: "text-info",
  };

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Icon className={cn("h-3 w-3", colors[variant])} strokeWidth={2} />
      <span className={cn("text-[10px] font-semibold tracking-[-0.005em]", colors[variant])}>{label}</span>
    </span>
  );
}

// ─── Fee Transparency Card ───
// Shows fees in a clear, structured, non-scary way
interface FeeTransparencyCardProps {
  amount: number;
  fee: number;
  total: number;
  currency?: string;
  feeLabel?: string;
  children?: ReactNode;
}

export function FeeTransparencyCard({ amount, fee, total, currency = "$", feeLabel = "Transfer fee", children }: FeeTransparencyCardProps) {
  const fmt = (v: number) => `${currency}${v.toLocaleString()}`;

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        backgroundColor: "hsl(var(--surface-secondary))",
        border: "1px solid hsl(var(--surface-border-subtle))",
      }}
    >
      <div className="space-y-2">
        <FeeRow label="Amount" value={fmt(amount)} />
        <FeeRow label={feeLabel} value={fmt(fee)} muted />
        <div className="border-t border-border/20 pt-2">
          <FeeRow label="Total" value={fmt(total)} bold />
        </div>
      </div>
      {children}
      <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-border/10">
        <Info className="h-2.5 w-2.5 text-muted-foreground/60" strokeWidth={2} />
        <span className="text-[9px] text-muted-foreground/70">No hidden charges · Final amount</span>
      </div>
    </div>
  );
}

function FeeRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-[12px]", muted ? "text-muted-foreground/60" : "text-muted-foreground")}>{label}</span>
      <span className={cn(
        "text-[12px] tabular-nums",
        bold ? "font-bold text-foreground text-[13px]" : "font-semibold text-foreground",
        muted && !bold && "text-muted-foreground/70"
      )}
        style={{ fontFeatureSettings: '"tnum" 1' }}
      >{value}</span>
    </div>
  );
}

// ─── Secure Action Confirmation ───
// Shown before sensitive actions — biometric, PIN, etc.
interface SecureConfirmationProps {
  method?: "biometric" | "pin" | "otp";
  message?: string;
}

const methodConfig = {
  biometric: { icon: Fingerprint, label: "Biometric verification required", detail: "Confirm with Face ID or fingerprint" },
  pin: { icon: Lock, label: "PIN confirmation required", detail: "Enter your transaction PIN to proceed" },
  otp: { icon: Shield, label: "OTP verification required", detail: "A code will be sent to your registered number" },
};

export function SecureConfirmation({ method = "biometric", message }: SecureConfirmationProps) {
  const config = methodConfig[method];
  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        backgroundColor: "hsl(var(--surface-secondary))",
        border: "1px solid hsl(var(--surface-border-subtle))",
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "hsl(var(--primary) / 0.06)" }}
      >
        <Icon className="h-[17px] w-[17px] text-primary" strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-foreground">{config.label}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{message || config.detail}</p>
      </div>
    </div>
  );
}

// ─── Recipient Verification Marker ───
// Compact verification status for recipient fields
interface RecipientVerifiedProps {
  name: string;
  bank?: string;
  status?: "verified" | "unverified" | "checking";
}

export function RecipientVerificationMarker({ name, bank, status = "verified" }: RecipientVerifiedProps) {
  const configs = {
    verified: { icon: CheckCircle2, label: "Name confirmed", color: "text-success", bg: "hsl(var(--success) / 0.04)", border: "hsl(var(--success) / 0.08)" },
    unverified: { icon: AlertTriangle, label: "Could not verify", color: "text-warning", bg: "hsl(var(--warning) / 0.04)", border: "hsl(var(--warning) / 0.08)" },
    checking: { icon: Clock, label: "Verifying...", color: "text-muted-foreground", bg: "hsl(var(--surface-secondary))", border: "hsl(var(--surface-border-subtle))" },
  };
  const c = configs[status];
  const Icon = c.icon;

  return (
    <div className="rounded-xl px-3.5 py-2.5" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-3.5 w-3.5 shrink-0", c.color)} strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-foreground truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground/60">{bank} · {c.label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Merchant Verification Cue ───
export function MerchantVerifiedBadge({ name, category, verified = true }: { name: string; category?: string; verified?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-semibold text-foreground">{name}</span>
      {verified && (
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
          style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
        >
          <BadgeCheck className="h-2.5 w-2.5 text-success" strokeWidth={2.5} />
          <span className="text-[8px] font-bold text-success tracking-[0.02em]">VERIFIED</span>
        </span>
      )}
      {category && <span className="text-[10px] text-muted-foreground/80">· {category}</span>}
    </div>
  );
}

// ─── Status Timeline ───
// Used for processing states, ticket tracking, transfer progress
interface TimelineStep {
  label: string;
  detail?: string;
  status: "complete" | "active" | "pending";
  time?: string;
}

export function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full shrink-0 mt-1",
                  step.status === "complete" && "bg-success",
                  step.status === "active" && "bg-primary ring-[3px] ring-primary/15",
                  step.status === "pending" && "bg-muted-foreground/15"
                )}
              />
              {!isLast && (
                <div className={cn(
                  "w-px flex-1 min-h-[24px]",
                  step.status === "complete" ? "bg-success/30" : "bg-border/30"
                )} />
              )}
            </div>
            {/* Content */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p className={cn(
                "text-[12px] font-semibold leading-snug",
                step.status === "pending" ? "text-muted-foreground/80" : "text-foreground"
              )}>{step.label}</p>
              {step.detail && (
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{step.detail}</p>
              )}
              {step.time && (
                <p className="text-[9px] text-muted-foreground/35 mt-0.5 tabular-nums" style={{ fontFeatureSettings: '"tnum" 1' }}>{step.time}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Processing Trust Message ───
// Shown during processing states to calm the user
export function ProcessingTrustMessage({ title = "Your transaction is being processed", messages }: { title?: string; messages?: string[] }) {
  const defaultMessages = [
    "Your money has not left your account yet",
    "This transaction is encrypted end-to-end",
    "You will not be charged twice",
  ];
  const items = messages || defaultMessages;

  return (
    <div
      className="rounded-xl px-4 py-3.5 space-y-2"
      style={{
        backgroundColor: "hsl(var(--surface-secondary))",
        border: "1px solid hsl(var(--surface-border-subtle))",
      }}
    >
      <p className="text-[11px] font-semibold text-foreground">{title}</p>
      {items.map((msg, i) => (
        <div key={i} className="flex items-start gap-2">
          <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" strokeWidth={2} />
          <span className="text-[11px] text-muted-foreground leading-relaxed">{msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Support Shortcut ───
// Subtle but always-visible support entry point
export function SupportShortcut({ context, className }: { context?: string; className?: string }) {
  return (
    <Link
      to="/support"
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-medium text-muted-foreground/70 hover:text-muted-foreground/60 transition-colors",
        className
      )}
    >
      <HelpCircle className="h-3 w-3" strokeWidth={1.8} />
      <span>{context || "Need help? Contact support"}</span>
    </Link>
  );
}

// ─── No Duplicate Charge Reassurance ───
export function NoDuplicateCharge() {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <Shield className="h-3 w-3 text-muted-foreground/80" strokeWidth={1.8} />
      <span className="text-[9px] text-muted-foreground/60 tracking-[0.04em]">You will not be charged twice for this transaction</span>
    </div>
  );
}

// ─── Recovery Message ───
// Used after failures to reassure the user
export function RecoveryMessage({ title, subtitle, variant = "safe" }: { title: string; subtitle: string; variant?: "safe" | "caution" }) {
  const isSafe = variant === "safe";
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        backgroundColor: isSafe ? "hsl(var(--success) / 0.03)" : "hsl(var(--warning) / 0.03)",
        border: `1px solid ${isSafe ? "hsl(var(--success) / 0.06)" : "hsl(var(--warning) / 0.06)"}`,
      }}
    >
      {isSafe ? (
        <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" strokeWidth={1.8} />
      ) : (
        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" strokeWidth={1.8} />
      )}
      <div>
        <p className="text-[12px] font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Account Protection Banner ───
// Compact reassurance for dashboard/settings
export function ProtectionBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2"
      style={{ backgroundColor: "hsl(var(--success) / 0.03)", border: "1px solid hsl(var(--success) / 0.05)" }}>
      <ShieldCheck className="h-3.5 w-3.5 text-success/60" strokeWidth={1.8} />
      <span className="text-[10px] font-semibold text-success/70">Account protected · All systems normal</span>
    </div>
  );
}
