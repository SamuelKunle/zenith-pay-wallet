import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownLeft, ShoppingBag, Smartphone, Zap, Download } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumReceipt, ReceiptData } from "@/components/receipts/PremiumReceipt";
import { StatusPill } from "@/components/states/StateUI";
import { toast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionCategory, TransactionDto } from "@/lib/api/types";
import {
  dateGroupLabel,
  formatTxAmountSigned,
  formatTxTimeShort,
} from "@/lib/transactions/transactionUi";
import { ListRowSkeleton } from "@/components/states/AsyncContent";

const tabs = ["All", "Sent", "Received", "Bills", "Merchant"] as const;

interface HistoryRow {
  id: string;
  dto: TransactionDto;
  occurredAtIso: string;
  type: "credit" | "debit";
  category: TransactionCategory;
  title: string;
  subtitle: string;
  amount: string;
  rawAmount: number;
  feeCents: number;
  status: "success" | "pending" | "failed";
  time: string;
  date: string;
  ref: string;
}

const categoryIcons = {
  transfer: ArrowUpRight,
  merchant: ShoppingBag,
  airtime: Smartphone,
  bills: Zap,
  received: ArrowDownLeft,
};

const iconBgs: Record<string, string> = {
  transfer: "bg-surface-tertiary",
  merchant: "bg-accent/8",
  airtime: "bg-surface-tertiary",
  bills: "bg-surface-tertiary",
  received: "bg-success/8",
};

const iconColors: Record<string, string> = {
  transfer: "text-foreground/50",
  merchant: "text-accent",
  airtime: "text-foreground/50",
  bills: "text-foreground/50",
  received: "text-success",
};

function mapDtoToRow(d: TransactionDto): HistoryRow {
  return {
    id: d.id,
    dto: d,
    occurredAtIso: d.occurredAt,
    type: d.direction === "credit" ? "credit" : "debit",
    category: d.category,
    title: d.title,
    subtitle: d.subtitle,
    amount: formatTxAmountSigned(d),
    rawAmount: d.amountCents / 100,
    feeCents: d.feeCents,
    status: d.status,
    time: formatTxTimeShort(d.occurredAt),
    date: dateGroupLabel(d.occurredAt),
    ref: d.reference,
  };
}

function matchesTab(row: HistoryRow, tab: (typeof tabs)[number]): boolean {
  switch (tab) {
    case "All":
      return true;
    case "Sent":
      return row.type === "debit";
    case "Received":
      return row.type === "credit";
    case "Bills":
      return row.category === "bills";
    case "Merchant":
      return row.category === "merchant";
    default:
      return true;
  }
}

function matchesSearch(row: HistoryRow, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    row.title.toLowerCase().includes(q) ||
    row.subtitle.toLowerCase().includes(q) ||
    row.ref.toLowerCase().includes(q)
  );
}

function txToReceipt(tx: HistoryRow): ReceiptData {
  const feeDollars = tx.feeCents / 100;
  const typeMap: Record<string, ReceiptData["type"]> = {
    transfer: "bank-transfer",
    received: "bank-transfer",
    merchant: "merchant-payment",
    airtime: "bill-payment",
    bills: "bill-payment",
  };
  const recipientNameTransfer = tx.title.replace(/^To\s+/i, "");
  const senderNameCredit = tx.title.replace(/^From\s+/i, "");
  const base = {
    type: typeMap[tx.category] || "bank-transfer",
    status: tx.status,
    amount: tx.rawAmount,
    fee: feeDollars,
    total: tx.type === "debit" ? tx.rawAmount + feeDollars : undefined,
    reference: tx.ref,
    date: new Date(tx.occurredAtIso),
    source: "Personal · Zenith Pay",
    channel: "Mobile App",
  };

  if (tx.type === "debit" && tx.category === "transfer") {
    return {
      ...base,
      sender: { name: "You", detail: "Personal · Zenith Pay", avatar: "YO" },
      recipient: { name: recipientNameTransfer, detail: tx.subtitle, verified: true },
    };
  }
  if (tx.type === "credit") {
    return {
      ...base,
      sender: { name: senderNameCredit, detail: tx.subtitle },
      recipient: { name: "You", detail: "Personal · Zenith Pay", avatar: "YO" },
    };
  }
  if (tx.category === "merchant") {
    return {
      ...base,
      merchant: { name: tx.title, detail: tx.subtitle },
    };
  }
  if (tx.category === "airtime" || tx.category === "bills") {
    return {
      ...base,
      recipient: { name: tx.title, detail: tx.subtitle },
      category: tx.category === "airtime" ? "Airtime" : "Bills",
    };
  }
  return base;
}

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [selectedTx, setSelectedTx] = useState<HistoryRow | null>(null);
  const [search, setSearch] = useState("");
  const { data, isPending, isError, refetch } = useTransactions();

  useEffect(() => {
    const st = location.state as { focusSearch?: boolean } | null;
    if (st?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const rows = useMemo(() => (data?.transactions ?? []).map(mapDtoToRow), [data?.transactions]);

  const { groupOrder, groupMap } = useMemo(() => {
    const filtered = rows.filter((r) => matchesTab(r, activeTab) && matchesSearch(r, search));
    const order: string[] = [];
    const map: Record<string, HistoryRow[]> = {};
    for (const tx of filtered) {
      const key = tx.date;
      if (!map[key]) {
        map[key] = [];
        order.push(key);
      }
      map[key].push(tx);
    }
    return { groupOrder: order, groupMap: map };
  }, [rows, activeTab, search]);

  // ─── Receipt detail view ───
  if (selectedTx) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-surface-border-subtle">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setSelectedTx(null)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-page-title">Transaction Details</h1>
          </div>
        </header>
        <div className="px-5 py-6">
          <PremiumReceipt data={txToReceipt(selectedTx)} showActions={true} />
        </div>
      </div>
    );
  }

  // ─── Main list ───
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-page-title">Transactions</h1>
          <div className="flex-1" />
          <button
            type="button"
            aria-label="Export statements"
            onClick={() =>
              toast({
                title: "Export requested",
                description: "Serve CSV/PDF from your reporting service and return a time-limited signed download URL.",
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
          >
            <Download className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={2} />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
            <Filter className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={2} />
          </button>
        </div>
        <div className="px-5 pb-3">
          <div className="input-search">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search transactions…"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="interactive-focus rounded-md min-h-[44px]"
            />
          </div>
        </div>
        <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
              className={`shrink-0 rounded-full px-3.5 py-2 min-h-[40px] text-[11px] font-semibold transition-all interactive-focus ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-4 md:px-8 space-y-6">
        {isPending && (
          <div className="surface-content overflow-hidden rounded-2xl">
            <ListRowSkeleton rows={6} />
          </div>
        )}
        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4 text-center space-y-3 mx-5">
            <p className="text-sm text-foreground">Could not load wallet activity.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline min-h-[44px] px-2 interactive-focus rounded-md"
            >
              Retry
            </button>
          </div>
        )}
        {!isPending && !isError && groupOrder.length === 0 && (
          <div className="text-center px-6 py-10 space-y-4">
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {rows.length === 0
                ? "No transactions yet — send funds or simulate funding from the Funding flow."
                : "No transactions match your search or filter."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch">
              <Link to="/transfer" className="btn-primary text-center px-6 min-h-[48px] flex items-center justify-center interactive-focus">
                Send money
              </Link>
              <Link to="/fund-wallet" className="rounded-2xl border border-input bg-secondary px-6 min-h-[48px] flex items-center justify-center text-sm font-semibold interactive-focus hover:bg-muted/60">
                Fund wallet
              </Link>
            </div>
            {rows.length > 0 && activeTab !== "All" && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("All");
                  setSearch("");
                }}
                className="text-sm font-semibold text-primary interactive-focus px-3 py-2 rounded-lg"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {!isPending &&
            !isError &&
            groupOrder.map((date) => (
              <motion.div key={date} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-label mb-2.5">{date}</p>
                <div className="surface-content overflow-hidden">
                  {(groupMap[date] ?? []).map((tx, i, arr) => {
                    const Icon = categoryIcons[tx.category];
                    return (
                      <button
                        type="button"
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className={`flex items-center gap-3 px-4 py-3 min-h-[52px] w-full text-left hover:bg-surface-secondary transition-colors interactive-focus rounded-none ${
                          i < arr.length - 1 ? "border-b border-surface-border-subtle" : ""
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgs[tx.category]}`}>
                          <Icon className={`h-[17px] w-[17px] ${iconColors[tx.category]}`} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-tx-title truncate">{tx.title}</p>
                          <p className="text-meta mt-0.5">
                            {tx.subtitle} · {tx.time}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-tx-amount ${tx.type === "credit" ? "text-success" : ""}`}>{tx.amount}</p>
                          <div className="mt-1">
                            <StatusPill status={tx.status} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
