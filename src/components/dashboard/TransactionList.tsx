import {
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Smartphone,
  Zap,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionCategory, TransactionDto } from "@/lib/api/types";
import { formatTxAmountSigned, formatTxMetaTimeSubtitle } from "@/lib/transactions/transactionUi";

const categoryIcons = {
  transfer: ArrowUpRight,
  merchant: ShoppingBag,
  airtime: Smartphone,
  bills: Zap,
  received: ArrowDownLeft,
};

const TransactionList = () => {
  const { data, isPending, isError, refetch } = useTransactions();
  const shortList = useMemo(() => (data?.transactions ?? []).slice(0, 5), [data?.transactions]);

  const rows = useMemo(() => mapForHome(shortList), [shortList]);

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.16s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-header">Recent</h3>
        <Link to="/history" className="section-link hover:text-primary/80 transition-colors">
          View all
        </Link>
      </div>
      {isPending && (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading wallet activity…</p>
      )}
      {isError && (
        <div className="surface-content px-4 py-5 text-center space-y-3">
          <p className="text-sm text-foreground">Could not load transactions.</p>
          <button
            type="button"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}
      {!isPending && !isError && rows.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">No wallet activity yet.</p>
      )}
      {!isPending && !isError && rows.length > 0 && (
        <div className="surface-content overflow-hidden">
          {rows.map((tx, i) => {
            const Icon = categoryIcons[tx.category];
            const isPendingTx = tx.status === "pending";
            const isFailed = tx.status === "failed";
            return (
              <Link
                to="/history"
                key={tx.id}
                className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-secondary ${
                  i < rows.length - 1 ? "border-b border-surface-border-subtle" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl surface-soft ${isPendingTx ? "opacity-50" : ""}`}
                >
                  <Icon className={`h-[17px] w-[17px] text-muted-foreground`} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-tx-title truncate ${isPendingTx ? "!text-foreground/60" : ""}`}>{tx.title}</p>
                    {isPendingTx && <Clock className="h-3 w-3 text-warning shrink-0" strokeWidth={2} />}
                    {isFailed && <AlertCircle className="h-3 w-3 text-destructive shrink-0" strokeWidth={2} />}
                  </div>
                  <p className="text-meta mt-0.5">{tx.meta}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end">
                  <p
                    className={`text-tx-amount ${
                      tx.type === "credit" ? "!text-fintech-tx-credit" : isPendingTx ? "!text-foreground/50" : ""
                    }`}
                  >
                    {tx.amount}
                  </p>
                  {isPendingTx && <span className="chip-pending mt-0.5">Pending</span>}
                  {isFailed && <span className="chip-failed mt-0.5">Failed</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface HomeTxRow {
  id: string;
  type: "credit" | "debit";
  category: TransactionCategory;
  title: string;
  meta: string;
  amount: string;
  status: "success" | "pending" | "failed";
}

function mapForHome(dt: TransactionDto[]): HomeTxRow[] {
  return dt.map((d) => ({
    id: d.id,
    type: d.direction === "credit" ? "credit" : "debit",
    category: d.category,
    title: d.title,
    meta: formatTxMetaTimeSubtitle(d.occurredAt, d.subtitle),
    amount: formatTxAmountSigned(d),
    status: d.status,
  }));
}

export default TransactionList;
