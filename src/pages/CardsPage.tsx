import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, CreditCard, Snowflake, Sun, Eye, EyeOff, Globe, ShoppingBag, Wifi, Copy, Check, Plus, Lock, ChevronRight, AlertTriangle, Shield, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useTransactions } from "@/hooks/useTransactions";
import { EmptyState } from "@/components/states/StateUI";
import { formatTxAmountSigned, formatTxCalendarWithTime, prettyCategory } from "@/lib/transactions/transactionUi";
import { motion, AnimatePresence } from "framer-motion";

interface CardData {
  id: string;
  type: "virtual" | "physical";
  name: string;
  last4: string;
  expiry: string;
  cvv: string;
  number: string;
  brand: "Visa" | "Mastercard";
  frozen: boolean;
  color: "emerald" | "navy" | "slate";
  status: "active" | "frozen" | "pending" | "expired";
}

const mockCards: CardData[] = [
  { id: "1", type: "virtual", name: "Charlie Oliver", last4: "4829", expiry: "09/27", cvv: "482", number: "5412 7534 8291 4829", brand: "Visa", frozen: false, color: "emerald", status: "active" },
  { id: "2", type: "physical", name: "Charlie Oliver", last4: "7361", expiry: "03/28", cvv: "713", number: "4532 8910 2345 7361", brand: "Mastercard", frozen: false, color: "navy", status: "active" },
];

const cardGradients = {
  emerald: "from-[hsl(162_72%_22%)] via-[hsl(170_60%_26%)] to-[hsl(180_50%_18%)]",
  navy: "from-[hsl(225_50%_22%)] via-[hsl(225_45%_28%)] to-[hsl(225_40%_18%)]",
  slate: "from-[hsl(220_20%_25%)] via-[hsl(220_18%_30%)] to-[hsl(220_15%_20%)]",
};

type View = "main" | "reveal" | "request" | "lost";

const CardsPage = () => {
  const [cards, setCards] = useState(mockCards);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<View>("main");
  const [revealAuth, setRevealAuth] = useState(false);

  const { data: ledgerTxResponse, isPending: ledgerSpendLoading } = useTransactions();
  const cardSpendPreview = useMemo(() => {
    return (ledgerTxResponse?.transactions ?? [])
      .filter((t) => t.direction === "debit" && (t.category === "merchant" || t.category === "bills"))
      .slice(0, 4);
  }, [ledgerTxResponse?.transactions]);

  const activeCard = cards[activeCardIndex];

  const toggleFreeze = () => {
    setCards(prev => prev.map((c, i) => i === activeCardIndex ? { ...c, frozen: !c.frozen, status: c.frozen ? "active" : "frozen" } : c));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCard.number.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Reveal flow ---
  if (view === "reveal") {
    if (!revealAuth) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 text-center max-w-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
              <Fingerprint className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-foreground mb-1">Verify to view card details</h2>
              <p className="text-[12px] text-muted-foreground">Use biometrics or PIN to reveal sensitive information</p>
            </div>
            <button onClick={() => setRevealAuth(true)}
              className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.98]"
            >
              Authenticate
            </button>
            <button onClick={() => setView("main")} className="text-[12px] font-semibold text-muted-foreground">Cancel</button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => { setView("main"); setRevealAuth(false); }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Card Details</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card shadow-card p-5 space-y-4"
          >
            <DetailRow label="Card Number" value={activeCard.number} copyable onCopy={handleCopy} copied={copied} />
            <DetailRow label="Expiry Date" value={activeCard.expiry} />
            <DetailRow label="CVV" value={activeCard.cvv} />
            <DetailRow label="Card Holder" value={activeCard.name} />
            <DetailRow label="Card Type" value={`${activeCard.brand} ${activeCard.type}`} />
          </motion.div>

          <div className="flex items-center gap-2 rounded-xl bg-warning/[0.04] border border-warning/10 px-4 py-3">
            <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" strokeWidth={2} />
            <p className="text-[11px] text-muted-foreground">Details will be hidden after 60 seconds for your security</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Request new card ---
  if (view === "request") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("main")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Request New Card</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          {[
            { title: "Virtual Card", desc: "Instant. Perfect for online payments.", fee: "Free", color: "bg-primary/8", textColor: "text-primary" },
            { title: "Physical Card", desc: "Delivered to your address in 3-5 days.", fee: "$1,500", color: "bg-accent/8", textColor: "text-accent" },
          ].map((card) => (
            <motion.button key={card.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/15 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                  <CreditCard className={`h-5 w-5 ${card.textColor}`} strokeWidth={1.8} />
                </div>
                <span className={`text-[12px] font-bold ${card.textColor}`}>{card.fee}</span>
              </div>
              <h3 className="text-[14px] font-bold text-foreground mb-0.5">{card.title}</h3>
              <p className="text-[11px] text-muted-foreground">{card.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- Lost/stolen ---
  if (view === "lost") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setView("main")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Report Card Issue</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-3">
          <div className="rounded-2xl bg-destructive/[0.04] border border-destructive/10 p-4">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              If your card is lost or stolen, freeze it immediately. We'll block all transactions and start the replacement process.
            </p>
          </div>
          {!activeCard.frozen && (
            <button onClick={toggleFreeze}
              className="w-full rounded-2xl bg-destructive py-4 text-[15px] font-bold text-destructive-foreground active:scale-[0.98]"
            >
              Freeze Card Immediately
            </button>
          )}
          {activeCard.frozen && (
            <div className="rounded-2xl bg-card shadow-card p-4 flex items-center gap-3">
              <Snowflake className="h-5 w-5 text-destructive" strokeWidth={1.8} />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">Card is frozen</p>
                <p className="text-[10px] text-muted-foreground">All transactions are blocked</p>
              </div>
            </div>
          )}
          <button className="w-full rounded-2xl border border-border/20 bg-card py-3.5 text-[13px] font-semibold text-foreground hover:bg-muted/15 transition-colors">
            Request Replacement Card
          </button>
          <Link to="/support" className="block w-full rounded-2xl border border-border/20 bg-card py-3.5 text-center text-[13px] font-semibold text-primary hover:bg-muted/15 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  // --- Main view ---
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Cards</h1>
          </div>
          <button onClick={() => setView("request")}
            className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/12 transition-colors"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            New Card
          </button>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-5">
        {/* Card selector */}
        <div className="flex justify-center gap-2 mb-1">
          {cards.map((c, i) => (
            <button key={i} onClick={() => setActiveCardIndex(i)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all ${
                i === activeCardIndex ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {c.type === "virtual" ? "Virtual" : "Physical"} ···{c.last4}
            </button>
          ))}
        </div>

        {/* Card Preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`relative rounded-3xl bg-gradient-to-br ${cardGradients[activeCard.color]} p-6 pb-5 shadow-elevated overflow-hidden aspect-[1.7/1] max-w-sm mx-auto`}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/[0.04]" />
              <div className="absolute bottom-4 right-6 h-20 w-20 rounded-full bg-white/[0.03]" />

              {activeCard.frozen && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                    <Snowflake className="h-4 w-4 text-white" strokeWidth={2} />
                    <span className="text-[13px] font-semibold text-white">Card Frozen</span>
                  </div>
                </div>
              )}

              <div className="relative z-[5] h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-wider">{activeCard.type} Card</p>
                    <p className="text-[12px] font-semibold text-white/80 mt-0.5">Zenith Pay</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-white/70 tracking-wide">{activeCard.brand}</p>
                    <p className="text-[8px] font-semibold text-white/25 tracking-[0.1em] uppercase mt-0.5">USD · Intl</p>
                  </div>
                </div>

                <div>
                  <p className="text-[16px] font-semibold text-white/85 tracking-[0.18em] tabular-nums">
                    {showDetails ? activeCard.number : `••••  ••••  ••••  ${activeCard.last4}`}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[8px] text-white/35 uppercase tracking-wider">Card Holder</p>
                    <p className="text-[11px] font-semibold text-white/75">{activeCard.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/35 uppercase tracking-wider">Expires</p>
                    <p className="text-[11px] font-semibold text-white/75 tabular-nums">{activeCard.expiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick actions */}
        <div className="flex justify-center gap-2.5">
          <CardAction icon={showDetails ? EyeOff : Eye} label={showDetails ? "Hide" : "Show"} onClick={() => setShowDetails(!showDetails)} />
          <CardAction icon={activeCard.frozen ? Sun : Snowflake} label={activeCard.frozen ? "Unfreeze" : "Freeze"} onClick={toggleFreeze} danger={!activeCard.frozen} />
          <CardAction icon={copied ? Check : Copy} label="Copy" onClick={handleCopy} />
          <CardAction icon={Lock} label="Reveal" onClick={() => setView("reveal")} />
          <CardAction icon={AlertTriangle} label="Report" onClick={() => setView("lost")} />
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Card Controls</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/15">
            <ControlRow icon={Globe} label="International" sub="Cross-border payments enabled" defaultOn={false} />
            <ControlRow icon={ShoppingBag} label="Online Payments" sub="E-commerce & subscriptions" defaultOn={true} />
            <ControlRow icon={Wifi} label="Contactless" sub="NFC tap-to-pay" defaultOn={true} />
          </div>
        </div>

        {/* Spending limits */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Spending Limits</h3>
          <div className="rounded-2xl bg-card shadow-card p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-semibold text-foreground">Daily</p>
                <p className="text-[12px] font-semibold text-foreground tabular-nums">$70,000 <span className="text-muted-foreground font-normal text-[11px]">/ $200,000</span></p>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[35%] rounded-full bg-primary transition-all" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-semibold text-foreground">International</p>
                <p className="text-[12px] font-semibold text-foreground tabular-nums">$0 <span className="text-muted-foreground font-normal text-[11px]">/ $500</span></p>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[0%] rounded-full bg-info transition-all" />
              </div>
            </div>
            <button className="text-[10px] font-semibold text-primary">Adjust limits</button>
          </div>
        </div>

        {/* Card protection */}
        <div className="rounded-xl bg-success/[0.03] border border-success/8 px-4 py-3 flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-success shrink-0" strokeWidth={2} />
          <div>
            <p className="text-[11px] font-semibold text-foreground">Transaction Protection Active</p>
            <p className="text-[10px] text-muted-foreground">All card payments are monitored for fraud</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Recent Transactions</h3>
            <Link to="/history" className="text-[10px] font-semibold text-primary">See all</Link>
          </div>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {ledgerSpendLoading && (
              <p className="px-4 py-5 text-[11px] text-muted-foreground text-center">Loading spend from ledger…</p>
            )}
            {!ledgerSpendLoading && cardSpendPreview.length === 0 && (
              <EmptyState
                compact
                icon={<ShoppingBag className="h-7 w-7 text-muted-foreground/70" strokeWidth={1.5} />}
                title="No card spend yet"
                subtitle="Debit-style payments from your wallet ledger show here."
                action={{ label: "Send money", to: "/transfer" }}
                secondaryAction={{ label: "View activity", to: "/history" }}
              />
            )}
            {!ledgerSpendLoading &&
              cardSpendPreview.map((tx, i) => (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < cardSpendPreview.length - 1 ? "border-b border-border/15" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                    <CreditCard className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{tx.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {prettyCategory(tx.category)} · {formatTxCalendarWithTime(tx.occurredAt)}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold text-foreground tabular-nums shrink-0">
                    {formatTxAmountSigned(tx)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function CardAction({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all group-active:scale-90 ${
        danger ? "bg-destructive/8" : "bg-secondary"
      }`}>
        <Icon className={`h-[18px] w-[18px] ${danger ? "text-destructive" : "text-muted-foreground"}`} strokeWidth={1.8} />
      </div>
      <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
    </button>
  );
}

function ControlRow({ icon: Icon, label, sub, defaultOn }: { icon: LucideIcon; label: string; sub: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function DetailRow({ label, value, copyable, onCopy, copied }: { label: string; value: string; copyable?: boolean; onCopy?: () => void; copied?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-foreground tabular-nums tracking-wide">{value}</span>
        {copyable && (
          <button onClick={onCopy} className="p-1 rounded hover:bg-muted/30 transition-colors">
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default CardsPage;
