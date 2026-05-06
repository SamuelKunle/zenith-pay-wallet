import { motion } from "framer-motion";
import { 
  Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2, Clock, 
  Shield, FileText, Inbox, Wrench, Search, ArrowRight, 
  Loader2, Ban, RotateCcw, Eye, Sparkles, Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

// ─── Premium Loading Spinner ───
export const PremiumSpinner = ({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) => {
  const dims = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };
  const stroke = { sm: "border-[1.5px]", md: "border-2", lg: "border-2" };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className={`${dims[size]} rounded-full ${stroke[size]} border-muted border-t-primary`}
        />
      </div>
      {label && <p className="text-caption animate-pulse">{label}</p>}
    </div>
  );
};

// ─── Skeleton Shimmer Block ───
export const ShimmerBlock = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-xl bg-muted/50 animate-pulse ${className}`} />
);

// ─── State Surface — the core building block for all states ───
interface StateSurfaceProps {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick?: () => void; to?: string };
  secondaryAction?: { label: string; onClick?: () => void; to?: string };
  children?: ReactNode;
  compact?: boolean;
}

export const StateSurface = ({ icon, iconBg = "bg-secondary", title, subtitle, action, secondaryAction, children, compact }: StateSurfaceProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    className={`flex flex-col items-center text-center ${compact ? "py-8" : "py-14"} px-6`}
  >
    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} mb-5`}>
      {icon}
    </div>
    <h3 className="text-[16px] font-bold text-foreground mb-1 max-w-xs">{title}</h3>
    {subtitle && <p className="text-[13px] text-muted-foreground max-w-[280px] leading-relaxed mb-1">{subtitle}</p>}
    {children && <div className="mt-4 w-full max-w-xs">{children}</div>}
    {(action || secondaryAction) && (
      <div className="flex flex-col items-center gap-2.5 mt-6 w-full max-w-xs">
        {action && (
          action.to ? (
            <Link to={action.to} className="btn-primary text-center">{action.label}</Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary">{action.label}</button>
          )
        )}
        {secondaryAction && (
          secondaryAction.to ? (
            <Link to={secondaryAction.to} className="text-[12px] font-semibold text-primary">{secondaryAction.label}</Link>
          ) : (
            <button onClick={secondaryAction.onClick} className="text-[12px] font-semibold text-primary">{secondaryAction.label}</button>
          )
        )}
      </div>
    )}
  </motion.div>
);

// ─── Pre-composed State Surfaces ───

export const EmptyState = ({ 
  icon, title, subtitle, action 
}: { 
  icon?: ReactNode; title: string; subtitle?: string; 
  action?: { label: string; onClick?: () => void; to?: string } 
}) => (
  <StateSurface
    icon={icon || <Inbox className="h-7 w-7 text-muted-foreground/60" strokeWidth={1.5} />}
    iconBg="bg-surface-tertiary"
    title={title}
    subtitle={subtitle}
    action={action}
  />
);

export const FirstUseState = ({ 
  title, subtitle, action, icon 
}: { 
  title: string; subtitle?: string; icon?: ReactNode;
  action?: { label: string; onClick?: () => void; to?: string } 
}) => (
  <StateSurface
    icon={icon || <Sparkles className="h-7 w-7 text-primary" strokeWidth={1.5} />}
    iconBg="bg-primary/8"
    title={title}
    subtitle={subtitle}
    action={action}
  />
);

export const LoadingState = ({ title = "Loading...", subtitle }: { title?: string; subtitle?: string }) => (
  <div className="flex flex-col items-center justify-center py-14 px-6">
    <PremiumSpinner size="md" />
    <p className="text-[14px] font-semibold text-foreground mt-5">{title}</p>
    {subtitle && <p className="text-caption mt-1">{subtitle}</p>}
  </div>
);

export const ProcessingState = ({ 
  title = "Processing...", subtitle, secured = true 
}: { 
  title?: string; subtitle?: string; secured?: boolean 
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 rounded-full border-2 border-muted border-t-primary"
      />
      <Shield className="absolute inset-0 m-auto h-6 w-6 text-primary/50" strokeWidth={1.5} />
    </div>
    <p className="text-[15px] font-bold text-foreground mb-1">{title}</p>
    {subtitle && <p className="text-caption">{subtitle}</p>}
    {secured && (
      <div className="flex items-center gap-1.5 mt-4 rounded-full bg-success/6 px-3 py-1.5">
        <Lock className="h-3 w-3 text-success/60" strokeWidth={2} />
        <span className="text-[10px] font-semibold text-success/70 tracking-[0.03em]">ENCRYPTED</span>
      </div>
    )}
  </div>
);

export const SuccessState = ({ 
  title, subtitle, action, secondaryAction, children 
}: { 
  title: string; subtitle?: string; children?: ReactNode;
  action?: { label: string; onClick?: () => void; to?: string };
  secondaryAction?: { label: string; onClick?: () => void; to?: string };
}) => (
  <StateSurface
    icon={<CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.8} />}
    iconBg="bg-success/8"
    title={title}
    subtitle={subtitle}
    action={action}
    secondaryAction={secondaryAction}
  >
    {children}
  </StateSurface>
);

export const FailedState = ({ 
  title = "Something went wrong", subtitle, 
  onRetry, action, secondaryAction 
}: { 
  title?: string; subtitle?: string; onRetry?: () => void;
  action?: { label: string; onClick?: () => void; to?: string };
  secondaryAction?: { label: string; onClick?: () => void; to?: string };
}) => (
  <StateSurface
    icon={<AlertCircle className="h-8 w-8 text-destructive" strokeWidth={1.8} />}
    iconBg="bg-destructive/8"
    title={title}
    subtitle={subtitle || "Please try again or contact support if this continues."}
    action={action || (onRetry ? { label: "Try Again", onClick: onRetry } : undefined)}
    secondaryAction={secondaryAction || { label: "Contact Support", to: "/support" }}
  />
);

export const PendingState = ({ 
  title = "Under Review", subtitle, children 
}: { 
  title?: string; subtitle?: string; children?: ReactNode 
}) => (
  <StateSurface
    icon={<Clock className="h-7 w-7 text-warning" strokeWidth={1.8} />}
    iconBg="bg-warning/8"
    title={title}
    subtitle={subtitle || "We're reviewing this. You'll be notified when it's complete."}
  >
    {children}
  </StateSurface>
);

export const RestrictedState = ({ 
  title = "Access Restricted", subtitle, action 
}: { 
  title?: string; subtitle?: string;
  action?: { label: string; onClick?: () => void; to?: string };
}) => (
  <StateSurface
    icon={<Ban className="h-7 w-7 text-muted-foreground/80" strokeWidth={1.8} />}
    iconBg="bg-surface-tertiary"
    title={title}
    subtitle={subtitle || "You don't have access to this feature yet."}
    action={action || { label: "Learn More", to: "/kyc" }}
  />
);

export const MaintenanceState = ({ 
  title = "Scheduled Maintenance", subtitle 
}: { 
  title?: string; subtitle?: string 
}) => (
  <StateSurface
    icon={<Wrench className="h-7 w-7 text-muted-foreground/80" strokeWidth={1.5} />}
    iconBg="bg-surface-tertiary"
    title={title}
    subtitle={subtitle || "We're making things better. This will be back shortly."}
  />
);

export const OfflineState = ({ onRetry }: { onRetry?: () => void }) => (
  <StateSurface
    icon={<WifiOff className="h-7 w-7 text-muted-foreground/80" strokeWidth={1.5} />}
    iconBg="bg-surface-tertiary"
    title="You're offline"
    subtitle="Check your connection and try again."
    action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
  />
);

export const ReversedState = ({ 
  title = "Transaction Reversed", subtitle, children 
}: { 
  title?: string; subtitle?: string; children?: ReactNode 
}) => (
  <StateSurface
    icon={<RotateCcw className="h-7 w-7 text-info" strokeWidth={1.8} />}
    iconBg="bg-info/8"
    title={title}
    subtitle={subtitle || "This transaction has been reversed. Your funds have been returned."}
  >
    {children}
  </StateSurface>
);

export const DelayedState = ({ 
  title = "Taking longer than usual", subtitle 
}: { 
  title?: string; subtitle?: string 
}) => (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
    <div className="relative mb-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-14 w-14 rounded-full border-2 border-muted border-t-warning"
      />
      <Clock className="absolute inset-0 m-auto h-5 w-5 text-warning/60" strokeWidth={1.8} />
    </div>
    <p className="text-[15px] font-bold text-foreground mb-1">{title}</p>
    <p className="text-caption max-w-[280px]">{subtitle || "This is still processing. You'll be notified when complete."}</p>
    <div className="flex items-center gap-1.5 mt-4 rounded-full bg-warning/6 px-3 py-1.5">
      <Clock className="h-3 w-3 text-warning/60" strokeWidth={2} />
      <span className="text-[10px] font-semibold text-warning/70 tracking-[0.03em]">PROCESSING</span>
    </div>
  </div>
);

// ─── Inline Status Pill — for use inside lists and cards ───
export const StatusPill = ({ status }: { status: "success" | "pending" | "failed" | "processing" | "reversed" | "review" | "restricted" | "delayed" }) => {
  const configs = {
    success: { label: "Completed", className: "chip-success" },
    pending: { label: "Pending", className: "chip-pending" },
    failed: { label: "Failed", className: "chip-failed" },
    processing: { label: "Processing", className: "chip-info" },
    reversed: { label: "Reversed", className: "chip-info" },
    review: { label: "Under Review", className: "chip-pending" },
    restricted: { label: "Restricted", className: "chip-neutral" },
    delayed: { label: "Delayed", className: "chip-pending" },
  };
  const config = configs[status];
  return <span className={config.className}>{config.label}</span>;
};

// ─── Inline Status Banner — contextual strip inside cards ───
export const StatusBanner = ({ 
  variant, title, subtitle, action 
}: { 
  variant: "success" | "warning" | "error" | "info" | "neutral";
  title: string; subtitle?: string;
  action?: { label: string; onClick?: () => void };
}) => {
  const styles = {
    success: { bg: "bg-success/[0.04]", border: "border-success/10", icon: <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.8} /> },
    warning: { bg: "bg-warning/[0.04]", border: "border-warning/10", icon: <Clock className="h-4 w-4 text-warning" strokeWidth={1.8} /> },
    error: { bg: "bg-destructive/[0.04]", border: "border-destructive/10", icon: <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={1.8} /> },
    info: { bg: "bg-info/[0.04]", border: "border-info/10", icon: <Shield className="h-4 w-4 text-info" strokeWidth={1.8} /> },
    neutral: { bg: "bg-secondary", border: "border-border/10", icon: <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} /> },
  };
  const s = styles[variant];
  return (
    <div className={`rounded-xl ${s.bg} border ${s.border} px-4 py-3 flex items-start gap-3`}>
      <div className="shrink-0 mt-0.5">{s.icon}</div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>}
        {action && (
          <button onClick={action.onClick} className="text-[11px] font-semibold text-primary mt-1.5">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard Skeleton ───
export const DashboardSkeleton = () => (
  <div className="px-6 py-6 space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted/60" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 rounded bg-muted/60" />
          <div className="h-3 w-20 rounded bg-muted/60" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-10 rounded-2xl bg-muted/40" />
        <div className="h-10 w-10 rounded-2xl bg-muted/40" />
      </div>
    </div>
    <div className="h-44 rounded-3xl bg-muted/40" />
    <div className="flex gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-muted/40" />
          <div className="h-2 w-10 rounded bg-muted/30" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted/40" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-muted/40" />
            <div className="h-2.5 w-20 rounded bg-muted/30" />
          </div>
          <div className="h-3 w-16 rounded bg-muted/40" />
        </div>
      ))}
    </div>
  </div>
);
