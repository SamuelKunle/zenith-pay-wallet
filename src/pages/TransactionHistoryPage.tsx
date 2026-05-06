import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownLeft, ShoppingBag, Smartphone, Zap, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumReceipt, ReceiptData } from "@/components/receipts/PremiumReceipt";
import { StatusPill } from "@/components/states/StateUI";
import { toast } from "@/hooks/use-toast";

const tabs = ["All", "Sent", "Received", "Bills", "Merchant"];

interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: "transfer" | "merchant" | "airtime" | "bills" | "received";
  title: string;
  subtitle: string;
  amount: string;
  rawAmount: number;
  status: "success" | "pending" | "failed";
  time: string;
  date: string;
  ref: string;
}

const allTransactions: Transaction[] = [
  { id: "1", type: "credit", category: "received", title: "From Emerson Obi", subtitle: "Transfer", amount: "+$50,000", rawAmount: 50000, status: "success", time: "2:30 PM", date: "Today", ref: "TXN-2024-K8F2M1" },
  { id: "2", type: "debit", category: "merchant", title: "Shoprite Soho", subtitle: "QR Payment", amount: "-$12,450", rawAmount: 12450, status: "success", time: "1:15 PM", date: "Today", ref: "TXN-2024-P3Q7R4" },
  { id: "3", type: "debit", category: "transfer", title: "To Avery Nwachukwu", subtitle: "Bank transfer", amount: "-$75,000", rawAmount: 75000, status: "pending", time: "12:45 PM", date: "Today", ref: "TXN-2024-B5N9W2" },
  { id: "4", type: "debit", category: "airtime", title: "Carrier Airtime", subtitle: "08012345678", amount: "-$2,000", rawAmount: 2000, status: "success", time: "11:20 AM", date: "Today", ref: "TXN-2024-A1C6D8" },
  { id: "5", type: "credit", category: "received", title: "From Kendall Adrian", subtitle: "Payment request", amount: "+$15,000", rawAmount: 15000, status: "success", time: "10:00 AM", date: "Today", ref: "TXN-2024-E4F8G3" },
  { id: "6", type: "debit", category: "bills", title: "streaming TV Subscription", subtitle: "Bills payment", amount: "-$21,000", rawAmount: 21000, status: "failed", time: "9:30 AM", date: "Today", ref: "TXN-2024-H7J2L5" },
  { id: "7", type: "credit", category: "received", title: "From Taylor Bakare", subtitle: "Transfer", amount: "+$120,000", rawAmount: 120000, status: "success", time: "6:00 PM", date: "Yesterday", ref: "TXN-2024-M9N4P6" },
  { id: "8", type: "debit", category: "transfer", title: "To Fatima Yusuf", subtitle: "Bank transfer", amount: "-$35,000", rawAmount: 35000, status: "success", time: "3:30 PM", date: "Yesterday", ref: "TXN-2024-Q1R5S8" },
  { id: "9", type: "debit", category: "merchant", title: "Chicken Republic", subtitle: "QR Payment", amount: "-$4,800", rawAmount: 4800, status: "success", time: "1:00 PM", date: "Yesterday", ref: "TXN-2024-T3U7V0" },
];

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

function txToReceipt(tx: Transaction): ReceiptData {
  const typeMap: Record<string, ReceiptData["type"]> = {
    transfer: "bank-transfer",
    received: "bank-transfer",
    merchant: "merchant-payment",
    airtime: "bill-payment",
    bills: "bill-payment",
  };
  return {
    type: typeMap[tx.category] || "bank-transfer",
    status: tx.status,
    amount: tx.rawAmount,
    fee: tx.rawAmount > 5000 ? (tx.rawAmount > 50000 ? 50 : 25) : 10,
    reference: tx.ref,
    date: new Date(),
    ...(tx.type === "debit" && tx.category === "transfer" ? {
      sender: { name: "Charlie Oliver", detail: "Personal · Zenith Pay", avatar: "CO" },
      recipient: { name: tx.title.replace("To ", ""), detail: tx.subtitle, verified: true },
    } : {}),
    ...(tx.type === "credit" ? {
      sender: { name: tx.title.replace("From ", ""), detail: tx.subtitle },
      recipient: { name: "Charlie Oliver", detail: "Personal · Zenith Pay", avatar: "CO" },
    } : {}),
    ...(tx.category === "merchant" ? {
      merchant: { name: tx.title, detail: tx.subtitle },
    } : {}),
    ...(["airtime", "bills"].includes(tx.category) ? {
      recipient: { name: tx.title, detail: tx.subtitle },
      category: tx.category === "airtime" ? "Airtime" : "Bills",
    } : {}),
    source: "Personal · $1,245,800",
    channel: "Mobile App",
  };
}

const TransactionHistoryPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const grouped = allTransactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

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
                title: "Export prepared (demo)",
                description: "Production would queue CSV/PDF generation and deliver a signed download URL.",
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
            <input type="text" placeholder="Search transactions..." />
          </div>
        </div>
        <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
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
        {Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <p className="text-label mb-2.5">{date}</p>
            <div className="surface-content overflow-hidden">
              {txs.map((tx, i) => {
                const Icon = categoryIcons[tx.category];
                return (
                  <button 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className={`flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-surface-secondary transition-colors ${
                      i < txs.length - 1 ? "border-b border-surface-border-subtle" : ""
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgs[tx.category]}`}>
                      <Icon className={`h-[17px] w-[17px] ${iconColors[tx.category]}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-tx-title truncate">{tx.title}</p>
                      <p className="text-meta mt-0.5">{tx.subtitle} · {tx.time}</p>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
