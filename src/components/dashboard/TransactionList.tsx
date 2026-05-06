import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Smartphone, Zap, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: "transfer" | "merchant" | "airtime" | "bills" | "received";
  title: string;
  subtitle: string;
  amount: string;
  status: "success" | "pending" | "failed";
  time: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "credit", category: "received", title: "From Emerson Obi", subtitle: "Transfer received", amount: "+$50,000", status: "success", time: "2:30 PM" },
  { id: "2", type: "debit", category: "merchant", title: "Shoprite Soho", subtitle: "QR Payment", amount: "-$12,450", status: "success", time: "1:15 PM" },
  { id: "3", type: "debit", category: "transfer", title: "To Avery Nwachukwu", subtitle: "Bank transfer", amount: "-$75,000", status: "pending", time: "12:45 PM" },
  { id: "4", type: "debit", category: "airtime", title: "Carrier Airtime", subtitle: "08012345678", amount: "-$2,000", status: "success", time: "11:20 AM" },
];

const categoryIcons = {
  transfer: ArrowUpRight,
  merchant: ShoppingBag,
  airtime: Smartphone,
  bills: Zap,
  received: ArrowDownLeft,
};

const TransactionList = () => {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.16s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-header">Recent</h3>
        <Link to="/history" className="section-link hover:text-primary/80 transition-colors">
          View all
        </Link>
      </div>
      {/* Content surface wrapping the transaction list */}
      <div className="surface-content overflow-hidden">
        {mockTransactions.map((tx, i) => {
          const Icon = categoryIcons[tx.category];
          const isPending = tx.status === "pending";
          const isFailed = tx.status === "failed";
          return (
            <Link
              to="/history"
              key={tx.id}
              className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-secondary ${
                i < mockTransactions.length - 1 ? "border-b border-surface-border-subtle" : ""
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl surface-soft ${isPending ? "opacity-50" : ""}`}>
                <Icon className={`h-[17px] w-[17px] text-muted-foreground`} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-tx-title truncate ${isPending ? "!text-foreground/60" : ""}`}>{tx.title}</p>
                  {isPending && <Clock className="h-3 w-3 text-warning shrink-0" strokeWidth={2} />}
                  {isFailed && <AlertCircle className="h-3 w-3 text-destructive shrink-0" strokeWidth={2} />}
                </div>
                <p className="text-meta mt-0.5">{tx.time} · {tx.subtitle}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end">
                <p className={`text-tx-amount ${
                  tx.type === "credit" ? "!text-fintech-tx-credit" : isPending ? "!text-foreground/50" : ""
                }`}>
                  {tx.amount}
                </p>
                {isPending && <span className="chip-pending mt-0.5">Pending</span>}
                {isFailed && <span className="chip-failed mt-0.5">Failed</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
