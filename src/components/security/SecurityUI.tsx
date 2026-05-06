import { Shield, ShieldCheck, CheckCircle2, Fingerprint, Lock, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

// ─── Trust Badge ───
// Inline verification indicator for recipients, merchants, transactions
interface TrustBadgeProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function TrustBadge({ label = "Verified", size = "sm", className }: TrustBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-semibold",
      size === "sm" && "text-[9px] px-1.5 py-0.5",
      size === "md" && "text-[10px] px-2 py-0.5",
      "text-success",
      className
    )}
    style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
    >
      <CheckCircle2 className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2.5} />
      {label}
    </span>
  );
}

// ─── Verified Recipient ───
// Shows recipient with trust indicators for transfer review
interface VerifiedRecipientProps {
  name: string;
  bank: string;
  avatar: string;
  tag?: string;
  verified?: boolean;
  compact?: boolean;
}

export function VerifiedRecipient({ name, bank, avatar, tag, verified = true, compact = false }: VerifiedRecipientProps) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "" : "gap-3.5")}>
      <div className={cn(
        "flex items-center justify-center rounded-full balance-gradient font-bold text-white shrink-0",
        compact ? "h-9 w-9 text-[10px]" : "h-11 w-11 text-[12px]"
      )}>
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={cn(
            "font-bold text-foreground truncate",
            compact ? "text-[13px]" : "text-[14px]"
          )}>{name}</p>
          {verified && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={2.5} />}
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {bank}{tag ? ` · ${tag}` : ""}
        </p>
      </div>
    </div>
  );
}

// ─── Security Shield Score ───
// Animated score indicator for security center
interface SecurityScoreProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

export function SecurityScore({ score, label, size = "sm" }: SecurityScoreProps) {
  const color = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";
  const bgColor = score >= 80 ? "hsl(var(--success) / 0.06)" : score >= 60 ? "hsl(var(--warning) / 0.06)" : "hsl(var(--destructive) / 0.06)";
  const barColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <motion.circle
              cx="40" cy="40" r="34" fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - score / 100) }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className={color}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ShieldCheck className={cn("h-5 w-5 mb-0.5", color)} strokeWidth={1.8} />
            <span className={cn("text-[16px] font-extrabold tabular-nums", color)}>{score}</span>
          </div>
        </div>
        <span className={cn("text-[11px] font-bold", color)}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full px-2.5 py-1" style={{ backgroundColor: bgColor }}>
      <Shield className={cn("h-3.5 w-3.5", color)} strokeWidth={2} />
      <span className={cn("text-[10px] font-bold tabular-nums", color)}>{score}%</span>
    </div>
  );
}

// ─── Trust Signal Banner ───
// Contextual security reassurance for transfers, payments, receipts
interface TrustSignalProps {
  icon?: "shield" | "check" | "lock" | "fingerprint";
  title: string;
  subtitle: string;
  variant?: "success" | "neutral" | "warning";
}

export function TrustSignal({ icon = "check", title, subtitle, variant = "success" }: TrustSignalProps) {
  const icons = {
    shield: ShieldCheck,
    check: CheckCircle2,
    lock: Lock,
    fingerprint: Fingerprint,
  };
  const Icon = icons[icon];

  const styles = {
    success: {
      bg: "hsl(var(--success) / 0.04)",
      border: "hsl(var(--success) / 0.08)",
      iconColor: "text-success",
    },
    neutral: {
      bg: "hsl(var(--surface-secondary))",
      border: "hsl(var(--surface-border-subtle))",
      iconColor: "text-muted-foreground",
    },
    warning: {
      bg: "hsl(var(--warning) / 0.04)",
      border: "hsl(var(--warning) / 0.08)",
      iconColor: "text-warning",
    },
  };

  const s = styles[variant];

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", s.iconColor)} strokeWidth={2} />
      <div>
        <p className="text-[12px] font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Fraud Alert ───
// Emergency/suspicious activity surface
interface FraudAlertProps {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}

export function FraudAlert({ title, description, action, onAction }: FraudAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: "hsl(var(--destructive) / 0.04)",
        border: "1px solid hsl(var(--destructive) / 0.1)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "hsl(var(--destructive) / 0.08)" }}
        >
          <ShieldAlert className="h-[17px] w-[17px] text-destructive" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-foreground mb-0.5">{title}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
          {action && (
            <button
              onClick={onAction}
              className="mt-2 text-[11px] font-bold text-destructive hover:text-destructive/80 transition-colors"
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Protection Summary ───
// Compact security status for dashboard and settings
interface ProtectionSummaryProps {
  score: number;
  features: { label: string; enabled: boolean }[];
}

export function ProtectionSummary({ score, features }: ProtectionSummaryProps) {
  const enabledCount = features.filter(f => f.enabled).length;
  return (
    <div className="surface-interactive p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
        >
          <ShieldCheck className="h-[17px] w-[17px] text-success" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="text-card-label">Account Protected</p>
          <p className="text-meta">{enabledCount}/{features.length} features active</p>
        </div>
        <SecurityScore score={score} label="" size="sm" />
      </div>
      <div className="flex gap-1.5">
        {features.map((f) => (
          <div
            key={f.label}
            className={cn(
              "flex-1 h-1 rounded-full transition-colors",
              f.enabled ? "bg-success/40" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Encryption Badge ───
// Processing state indicator
export function EncryptionBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ backgroundColor: "hsl(var(--primary) / 0.06)" }}
    >
      <Lock className="h-2.5 w-2.5 text-primary" strokeWidth={2.5} />
      <span className="text-[9px] font-bold text-primary tracking-[0.04em]">ENCRYPTED</span>
    </div>
  );
}
