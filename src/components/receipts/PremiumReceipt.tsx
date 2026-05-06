import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Shield,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Share2,
  Download,
  HelpCircle,
  RotateCcw,
  QrCode,
  CreditCard,
  Zap,
  PiggyBank,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Receipt Types ───
export type ReceiptType =
  | "bank-transfer"
  | "wallet-transfer"
  | "qr-payment"
  | "bill-payment"
  | "card-transaction"
  | "merchant-payment"
  | "savings-contribution";

export type ReceiptStatus =
  | "success"
  | "pending"
  | "failed"
  | "reversed"
  | "processing";

export interface ReceiptParty {
  name: string;
  detail?: string; // bank name, wallet tag, merchant category
  avatar?: string;
  verified?: boolean;
}

export interface ReceiptData {
  type: ReceiptType;
  status: ReceiptStatus;
  amount: number;
  currency?: string;
  fee?: number;
  total?: number;
  reference: string;
  date: Date;
  sender?: ReceiptParty;
  recipient?: ReceiptParty;
  merchant?: ReceiptParty;
  note?: string;
  source?: string; // "Personal · $1,245,800"
  channel?: string; // "Mobile App", "QR Code", "POS"
  category?: string; // "Electricity", "Airtime", etc.
  savingsType?: string; // "Auto-Save", "Manual Top-Up"
  planName?: string;
}

// ─── Formatting helpers ───
const fmtMoney = (val: number, currency = "$") =>
  `${currency}${val.toLocaleString("en-US", { minimumFractionDigits: val % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`;

const fmtDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtRef = (ref: string) => ref;

// ─── Status Config ───
const statusConfig: Record<
  ReceiptStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
    chipClass: string;
  }
> = {
  success: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/6",
    chipClass: "chip-success",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/6",
    chipClass: "chip-pending",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/6",
    chipClass: "chip-failed",
  },
  reversed: {
    label: "Reversed",
    icon: RotateCcw,
    color: "text-info",
    bg: "bg-info/6",
    chipClass: "chip-info",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/6",
    chipClass: "chip-info",
  },
};

// ─── Type Config ───
const typeConfig: Record<
  ReceiptType,
  { label: string; icon: typeof ArrowUpRight }
> = {
  "bank-transfer": { label: "Bank Transfer", icon: ArrowUpRight },
  "wallet-transfer": { label: "Wallet Transfer", icon: ArrowUpRight },
  "qr-payment": { label: "QR Payment", icon: QrCode },
  "bill-payment": { label: "Bill Payment", icon: Zap },
  "card-transaction": { label: "Card Transaction", icon: CreditCard },
  "merchant-payment": { label: "Merchant Payment", icon: Store },
  "savings-contribution": { label: "Savings", icon: PiggyBank },
};

// ─── Receipt Row ───
const ReceiptRow = ({
  label,
  value,
  mono,
  muted,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
}) => (
  <div className="flex items-start justify-between py-[7px]">
    <span className="text-[12px] text-muted-foreground leading-snug">
      {label}
    </span>
    <span
      className={`text-[12px] font-semibold leading-snug text-right max-w-[60%] ${
        mono
          ? "font-mono text-[11px] text-muted-foreground tracking-wide"
          : muted
            ? "text-muted-foreground"
            : "text-foreground"
      } tabular-nums`}
    >
      {value}
    </span>
  </div>
);

// ─── Receipt Divider ───
const ReceiptDivider = () => (
  <div className="relative my-1">
    <div className="border-t border-dashed border-border/30" />
    {/* Scalloped edges */}
    <div className="absolute -left-[13px] top-1/2 -translate-y-1/2 h-[10px] w-[10px] rounded-full bg-background" />
    <div className="absolute -right-[13px] top-1/2 -translate-y-1/2 h-[10px] w-[10px] rounded-full bg-background" />
  </div>
);

// ─── Copyable Reference ───
const CopyRef = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-start justify-between py-[7px]">
      <span className="text-[12px] text-muted-foreground">Reference</span>
      <button onClick={handleCopy} className="flex items-center gap-1.5 group">
        <span className="font-mono text-[11px] font-semibold text-muted-foreground tracking-wide tabular-nums">
          {value}
        </span>
        {copied ? (
          <Check className="h-3 w-3 text-success" strokeWidth={2} />
        ) : (
          <Copy
            className="h-3 w-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors"
            strokeWidth={2}
          />
        )}
      </button>
    </div>
  );
};

// ─── Party Block — the sender/recipient display ───
const PartyBlock = ({
  label,
  party,
}: {
  label: string;
  party: ReceiptParty;
}) => (
  <div className="flex items-center gap-3">
    {party.avatar && (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-[11px] font-bold text-foreground/70">
        {party.avatar}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.06em] mb-0.5">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <p className="text-[13px] font-semibold text-foreground truncate">
          {party.name}
        </p>
        {party.verified && (
          <CheckCircle2
            className="h-3 w-3 text-success shrink-0"
            strokeWidth={2}
          />
        )}
      </div>
      {party.detail && (
        <p className="text-[11px] text-muted-foreground">{party.detail}</p>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════
// ─── PREMIUM RECEIPT — the main component ───
// ═══════════════════════════════════════════

export const PremiumReceipt = ({
  data,
  onShare,
  onDone,
  onRetry,
  showActions = true,
  compact = false,
}: {
  data: ReceiptData;
  onShare?: () => void;
  onDone?: () => void;
  onRetry?: () => void;
  showActions?: boolean;
  compact?: boolean;
}) => {
  const status = statusConfig[data.status];
  const type = typeConfig[data.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const isDebit = !["savings-contribution"].includes(data.type);
  const displayAmount = fmtMoney(data.amount, data.currency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Receipt card */}
      <div
        className="bg-card rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 1px 3px hsl(var(--shadow-card) / 0.06), 0 8px 24px hsl(var(--shadow-card) / 0.04)",
          border: "1px solid hsl(var(--surface-border-subtle))",
        }}
      >
        {/* ── Header — status + type ── */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TypeIcon
                className="h-3.5 w-3.5 text-muted-foreground"
                strokeWidth={1.8}
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                {type.label}
              </span>
            </div>
            <span className={status.chipClass}>{status.label}</span>
          </div>

          {/* ── Amount hero ── */}
          <div className="text-center mb-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <p
                className="text-[38px] font-extrabold text-foreground tabular-nums tracking-[-0.03em] leading-none"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                {isDebit ? "" : "+"}
                {displayAmount}
              </p>
            </motion.div>
            {data.fee !== undefined && data.fee > 0 && (
              <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
                Fee: {fmtMoney(data.fee, data.currency)}
                {data.total && (
                  <> · Total: {fmtMoney(data.total, data.currency)}</>
                )}
              </p>
            )}
          </div>
        </div>

        <ReceiptDivider />

        {/* ── Parties ── */}
        <div className="px-6 py-4 space-y-4">
          {data.sender && <PartyBlock label="From" party={data.sender} />}
          {data.recipient && <PartyBlock label="To" party={data.recipient} />}
          {data.merchant && (
            <PartyBlock label="Merchant" party={data.merchant} />
          )}
          {data.planName && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.06em] mb-0.5">
                Savings Plan
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {data.planName}
              </p>
              {data.savingsType && (
                <p className="text-[11px] text-muted-foreground">
                  {data.savingsType}
                </p>
              )}
            </div>
          )}
        </div>

        <ReceiptDivider />

        {/* ── Details ── */}
        <div className="px-6 py-3">
          {data.source && <ReceiptRow label="Source" value={data.source} />}
          {data.channel && <ReceiptRow label="Channel" value={data.channel} />}
          {data.category && (
            <ReceiptRow label="Category" value={data.category} />
          )}
          {data.note && <ReceiptRow label="Note" value={data.note} />}
          <ReceiptRow label="Date" value={fmtDate(data.date)} />
          <ReceiptRow label="Time" value={fmtTime(data.date)} />
          <CopyRef value={data.reference} />
        </div>

        {/* ── Compliance footer ── */}
        <div
          className="px-6 py-3 space-y-1.5"
          style={{
            backgroundColor:
              data.status === "success"
                ? "hsl(var(--success) / 0.025)"
                : "hsl(var(--surface-inset))",
          }}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Shield
              className="h-3 w-3 text-muted-foreground/60"
              strokeWidth={2}
            />
            <span className="text-[9px] font-semibold text-muted-foreground/70 tracking-[0.08em] uppercase">
              {data.status === "success"
                ? "Verified & Encrypted"
                : "End-to-End Encrypted"}
            </span>
          </div>
          <p className="text-[8px] text-muted-foreground/80 text-center tracking-[0.04em]">
            Zenith Pay · FINRA Licensed · FDIC Insured · PCI DSS Compliant
          </p>
        </div>
      </div>

      {/* ── Actions ── */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 space-y-3"
        >
          {data.status === "success" && (
            <div className="flex gap-3">
              <button
                onClick={onShare}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-semibold text-foreground transition-all active:scale-[0.98]"
                style={{
                  background: "hsl(var(--surface-primary))",
                  border: "1px solid hsl(var(--surface-border-subtle))",
                }}
              >
                <Share2
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.8}
                />
                Share
              </button>
              {onDone && (
                <Link
                  to="/"
                  className="flex-1 rounded-2xl balance-gradient py-3.5 text-center text-[13px] font-bold text-white hover:opacity-95 transition-opacity active:scale-[0.98]"
                >
                  Done
                </Link>
              )}
            </div>
          )}

          {data.status === "failed" && onRetry && (
            <div className="flex gap-3">
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-semibold text-foreground active:scale-[0.98]"
                style={{
                  background: "hsl(var(--surface-primary))",
                  border: "1px solid hsl(var(--surface-border-subtle))",
                }}
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
                Retry
              </button>
              <Link
                to="/support"
                className="flex-1 rounded-2xl bg-primary py-3.5 text-center text-[13px] font-bold text-primary-foreground hover:opacity-95 transition-opacity"
              >
                Get Help
              </Link>
            </div>
          )}

          {data.status === "pending" && (
            <div className="rounded-xl bg-warning/[0.04] border border-warning/10 px-4 py-3 flex items-start gap-2.5">
              <Clock
                className="h-4 w-4 text-warning shrink-0 mt-0.5"
                strokeWidth={1.8}
              />
              <div>
                <p className="text-[12px] font-semibold text-foreground">
                  Awaiting confirmation
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  This usually completes within a few minutes. You'll be
                  notified.
                </p>
              </div>
            </div>
          )}

          {/* Dispute/support link */}
          <div className="flex items-center justify-center pt-1">
            <Link
              to="/support"
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-3 w-3" strokeWidth={1.8} />
              <span>Report an issue with this transaction</span>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Receipt Success Header — shown above receipt on success screens ───
export const ReceiptSuccessHeader = ({
  title = "Transfer Complete",
  subtitle = "Your money is on its way",
}: {
  title?: string;
  subtitle?: string;
}) => {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 200, damping: 20 }
      }
      className="flex flex-col items-center text-center mb-6"
    >
      <motion.div
        initial={reduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={
          reduced
            ? { duration: 0 }
            : { delay: 0.15, type: "spring", stiffness: 300, damping: 20 }
        }
        className="flex h-16 w-16 items-center justify-center rounded-full mb-4"
        style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
      >
        <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.8} />
      </motion.div>
      <h2 className="text-[18px] font-bold text-foreground mb-0.5">{title}</h2>
      <p className="text-[13px] text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
};

// ─── Mini Receipt — for inline use in lists and notifications ───
export const MiniReceipt = ({
  data,
}: {
  data: Pick<
    ReceiptData,
    | "type"
    | "status"
    | "amount"
    | "recipient"
    | "merchant"
    | "reference"
    | "date"
  >;
}) => {
  const status = statusConfig[data.status];
  const type = typeConfig[data.type];
  const party = data.recipient || data.merchant;

  return (
    <div className="surface-content p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted-foreground/60">
          {type.label}
        </span>
        <span className={status.chipClass}>{status.label}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {party?.avatar && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-tertiary text-[9px] font-bold text-foreground/50">
              {party.avatar}
            </div>
          )}
          <div>
            <p className="text-[13px] font-semibold text-foreground">
              {party?.name}
            </p>
            <p className="text-meta">{fmtDate(data.date)}</p>
          </div>
        </div>
        <p className="text-[15px] font-bold text-foreground tabular-nums">
          {fmtMoney(data.amount)}
        </p>
      </div>
    </div>
  );
};
