import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CreditCard,
  Snowflake,
  Sun,
  Eye,
  EyeOff,
  Globe,
  ShoppingBag,
  Wifi,
  Copy,
  Check,
  Plus,
  Lock,
  AlertTriangle,
  Shield,
  Fingerprint,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTransactions } from "@/hooks/useTransactions";
import { useDeleteCard, useIssueCard, useUpdateCardFreeze, useWalletCards } from "@/hooks/useWalletCards";
import { EmptyState } from "@/components/states/StateUI";
import { formatTxAmountSigned, formatTxCalendarWithTime, prettyCategory } from "@/lib/transactions/transactionUi";
import { motion, AnimatePresence } from "framer-motion";
import type { WalletCardBrand, WalletCardColor, WalletCardDto } from "@/lib/api/types";
import { ApiRequestError } from "@/lib/api/fetchJson";
import { toast } from "@/hooks/use-toast";

function isFrozen(card: WalletCardDto): boolean {
  return card.status === "frozen";
}

const cardGradients = {
  emerald: "from-[hsl(162_72%_22%)] via-[hsl(170_60%_26%)] to-[hsl(180_50%_18%)]",
  navy: "from-[hsl(225_50%_22%)] via-[hsl(225_45%_28%)] to-[hsl(225_40%_18%)]",
  slate: "from-[hsl(220_20%_25%)] via-[hsl(220_18%_30%)] to-[hsl(220_15%_20%)]",
};

type CardGradientKey = keyof typeof cardGradients;

function gradientClassFor(color: WalletCardDto["color"] | undefined): string {
  if (color && color in cardGradients) return cardGradients[color as CardGradientKey];
  return cardGradients.emerald;
}

type View = "main" | "reveal" | "request" | "addVirtual" | "addPhysical" | "lost";

const CardsPage = () => {
  const { data: cardsResponse, isPending: cardsLoading, isError: cardsError, refetch: refetchCards } =
    useWalletCards();
  const cards = cardsResponse?.cards ?? [];
  const issueCardMutation = useIssueCard();
  const freezeMutation = useUpdateCardFreeze();
  const deleteCardMutation = useDeleteCard();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<View>("main");
  const [revealAuth, setRevealAuth] = useState(false);

  const [panInput, setPanInput] = useState("");
  const [expiryInput, setExpiryInput] = useState("");
  const [cvvInput, setCvvInput] = useState("");
  const [holderInput, setHolderInput] = useState("");
  const [brandPick, setBrandPick] = useState<WalletCardBrand>("Visa");
  const [colorPick, setColorPick] = useState<WalletCardColor>("emerald");
  const [physicalHolderName, setPhysicalHolderName] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{
    id: string;
    last4: string;
    type: "virtual" | "physical";
  } | null>(null);

  /** List length can drop before React reconciles `activeCardIndex` — clamp to avoid undefined. */
  const safeCardIndex = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.min(Math.max(0, activeCardIndex), cards.length - 1);
  }, [cards.length, activeCardIndex]);

  const activeCard = cards.length > 0 ? cards[safeCardIndex] : undefined;

  useEffect(() => {
    if (cards.length === 0) return;
    setActiveCardIndex((i) => Math.min(i, cards.length - 1));
  }, [cards.length]);

  useEffect(() => {
    if (view !== "main") {
      setRemoveDialogOpen(false);
      setRemoveTarget(null);
    }
  }, [view]);

  const { data: ledgerTxResponse, isPending: ledgerSpendLoading } = useTransactions();
  const cardSpendPreview = useMemo(() => {
    return (ledgerTxResponse?.transactions ?? [])
      .filter((t) => t.direction === "debit" && (t.category === "merchant" || t.category === "bills"))
      .slice(0, 4);
  }, [ledgerTxResponse?.transactions]);

  const toggleFreeze = () => {
    if (!activeCard) return;
    freezeMutation.mutate(
      { id: activeCard.id, frozen: !isFrozen(activeCard) },
      {
        onError: () => {
          toast({
            title: "Could not update card",
            description: "Try again in a moment.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleCopy = () => {
    if (!activeCard) return;
    const raw = activeCard.number.replace(/\s/g, "").replace(/•/g, "");
    if (!raw || raw.length < 16) {
      toast({
        title: "Number not available yet",
        description: "Physical cards show full PAN after activation.",
        variant: "destructive",
      });
      return;
    }
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onPanChange = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 16);
    setPanInput(d.replace(/(\d{4})(?=\d)/g, "$1 ").trim());
  };

  const submitVirtualCard = async () => {
    const prevLen = cards.length;
    try {
      await issueCardMutation.mutateAsync({
        type: "virtual",
        details: {
          pan: panInput.replace(/\s/g, ""),
          expiry: expiryInput.trim(),
          cvv: cvvInput.trim(),
          holderName: holderInput.trim(),
          brand: brandPick,
          color: colorPick,
        },
      });
      toast({
        title: "Card added",
        description: "Your digital card is saved to this wallet — show details anytime from the card.",
      });
      setPanInput("");
      setExpiryInput("");
      setCvvInput("");
      setHolderInput("");
      setBrandPick("Visa");
      setColorPick("emerald");
      setView("main");
      setActiveCardIndex(prevLen);
    } catch (e) {
      let msg = "Could not add card.";
      if (e instanceof ApiRequestError && typeof e.body === "object" && e.body !== null && "error" in e.body) {
        const err = e.body as { error?: { message?: string } };
        if (err.error?.message) msg = err.error.message;
      }
      toast({ title: "Could not add card", description: msg, variant: "destructive" });
    }
  };

  const submitPhysicalRequest = async () => {
    const prevLen = cards.length;
    try {
      await issueCardMutation.mutateAsync({
        type: "physical",
        holderName: physicalHolderName.trim() || undefined,
      });
      toast({
        title: "Physical card requested",
        description: "We’ll ship your card in 3–5 business days. It appears as Pending until activated.",
      });
      setPhysicalHolderName("");
      setView("main");
      setActiveCardIndex(prevLen);
    } catch (e) {
      let msg = "Request failed.";
      if (e instanceof ApiRequestError && typeof e.body === "object" && e.body !== null && "error" in e.body) {
        const err = e.body as { error?: { message?: string } };
        if (err.error?.message) msg = err.error.message;
      }
      toast({ title: "Could not complete request", description: msg, variant: "destructive" });
    }
  };

  const openRemoveDialog = () => {
    if (!activeCard) return;
    setRemoveTarget({
      id: activeCard.id,
      last4: activeCard.last4,
      type: activeCard.type,
    });
    setRemoveDialogOpen(true);
  };

  const confirmRemoveCard = () => {
    if (!removeTarget) return;
    const typeLabel = removeTarget.type === "virtual" ? "Digital" : "Physical";
    const { id: removeId, last4 } = removeTarget;
    deleteCardMutation.mutate(removeId, {
      onSuccess: () => {
        setRemoveDialogOpen(false);
        setRemoveTarget(null);
        toast({
          variant: "success",
          duration: 4200,
          title: (
            <span className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--success)/0.22)] ring-1 ring-success/25">
                <CheckCircle2 className="h-[22px] w-[22px] text-success" strokeWidth={2.25} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5 text-left">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Card removed</span>
                <span className="text-[13px] font-medium leading-snug text-muted-foreground">
                  {typeLabel} card ···· {last4} is no longer saved in this wallet.
                </span>
              </span>
            </span>
          ),
        });
      },
      onError: () => {
        setRemoveDialogOpen(false);
        setRemoveTarget(null);
        toast({
          variant: "destructive",
          duration: 5200,
          title: (
            <span className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/18">
                <AlertCircle className="h-[22px] w-[22px]" strokeWidth={2.25} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5 text-left">
                <span className="text-[15px] font-semibold tracking-[-0.01em]">Couldn’t remove card</span>
                <span className="text-[13px] font-medium leading-snug opacity-95">
                  Check your connection and try again.
                </span>
              </span>
            </span>
          ),
        });
      },
    });
  };

  // --- Reveal flow ---
  if (view === "reveal") {
    if (!activeCard) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <p className="text-sm text-muted-foreground mb-4">No card selected.</p>
          <button type="button" onClick={() => setView("main")} className="text-sm font-semibold text-primary">
            Back
          </button>
        </div>
      );
    }

    const pendingIssue = activeCard.status === "pending" && activeCard.type === "physical";

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
              <p className="text-[12px] text-muted-foreground">
                {pendingIssue
                  ? "This physical card is still being issued — PAN/CVV are not available until activation."
                  : "Use biometrics or PIN to reveal sensitive information"}
              </p>
            </div>
            {!pendingIssue ? (
              <button type="button" onClick={() => setRevealAuth(true)}
                className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.98]"
              >
                Authenticate
              </button>
            ) : null}
            <button type="button" onClick={() => setView("main")} className="text-[12px] font-semibold text-muted-foreground">Cancel</button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => { setView("main"); setRevealAuth(false); }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Card Details</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card shadow-card p-5 space-y-4"
          >
            <DetailRow label="Card Number" value={activeCard.number} copyable={!pendingIssue} onCopy={handleCopy} copied={copied} />
            <DetailRow label="Expiry Date" value={activeCard.expiry} />
            <DetailRow label="CVV" value={activeCard.cvv ?? "—"} />
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

  // --- Request new card (pick flow) ---
  if (view === "request") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => setView("main")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Add a card</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Enter your card details — nothing is auto-generated here. Use any 16 digits; brand must match the number (Visa starts with <strong>4</strong>; Mastercard with <strong>51–55</strong> or <strong>2221–2720</strong> range).
          </p>
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setView("addVirtual")}
            className="w-full rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/15 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                <CreditCard className="h-5 w-5 text-primary" strokeWidth={1.8} />
              </div>
              <span className="text-[12px] font-bold text-primary">Digital</span>
            </div>
            <h3 className="text-[14px] font-bold text-foreground mb-0.5">Digital (virtual) card</h3>
            <p className="text-[11px] text-muted-foreground">Add number, expiry, CVV, and name — same as linking a card elsewhere.</p>
          </motion.button>
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => setView("addPhysical")}
            className="w-full rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/15 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/8">
                <CreditCard className="h-5 w-5 text-accent" strokeWidth={1.8} />
              </div>
              <span className="text-[12px] font-bold text-accent">Fee applies</span>
            </div>
            <h3 className="text-[14px] font-bold text-foreground mb-0.5">Physical card</h3>
            <p className="text-[11px] text-muted-foreground">Request shipment — name on card, shown as Pending until it arrives.</p>
          </motion.button>
        </div>
      </div>
    );
  }

  // --- Add virtual: manual entry ---
  if (view === "addVirtual") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => setView("request")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Digital card details</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4 max-w-md mx-auto">
          <div className="space-y-1.5">
            <label className="form-label" htmlFor="card-pan">Card number</label>
            <input
              id="card-pan"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className="input-premium"
              value={panInput}
              onChange={(e) => onPanChange(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">
              Examples: Visa <span className="tabular-nums">4242 4242 4242 4242</span> · MC{" "}
              <span className="tabular-nums">5555 5555 5555 4444</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="form-label" htmlFor="card-exp">Expires</label>
              <input
                id="card-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="input-premium"
                value={expiryInput}
                onChange={(e) => setExpiryInput(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="form-label" htmlFor="card-cvv">CVV</label>
              <input
                id="card-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                className="input-premium"
                maxLength={4}
                value={cvvInput}
                onChange={(e) => setCvvInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="form-label" htmlFor="card-name">Name on card</label>
            <input
              id="card-name"
              autoComplete="cc-name"
              placeholder="As printed on card"
              className="input-premium"
              value={holderInput}
              onChange={(e) => setHolderInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <span className="form-label">Brand</span>
            <div className="flex gap-2">
              {(["Visa", "Mastercard"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrandPick(b)}
                  className={`flex-1 rounded-xl py-2.5 text-[12px] font-semibold border transition-colors ${
                    brandPick === b ? "border-primary bg-primary/8 text-primary" : "border-border/30 bg-card text-muted-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="form-label">Card appearance</span>
            <div className="flex gap-2">
              {([
                { id: "emerald" as const, label: "Forest" },
                { id: "navy" as const, label: "Navy" },
                { id: "slate" as const, label: "Slate" },
              ]).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setColorPick(id)}
                  className={`flex-1 rounded-xl py-2.5 text-[11px] font-semibold border transition-colors ${
                    colorPick === id ? "border-primary bg-primary/8 text-primary" : "border-border/30 bg-card text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={issueCardMutation.isPending}
            onClick={() => void submitVirtualCard()}
            className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]"
          >
            {issueCardMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Saving…
              </>
            ) : (
              "Add card to wallet"
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- Request physical (name + pending placeholder) ---
  if (view === "addPhysical") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => setView("request")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Physical card</h1>
          </div>
        </header>
        <div className="px-5 py-5 space-y-4 max-w-md mx-auto">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            We’ll order a physical card to your profile address. You’ll see it here as <strong>Pending</strong> until you activate it.
          </p>
          <div className="space-y-1.5">
            <label className="form-label" htmlFor="phys-name">Name on card</label>
            <input
              id="phys-name"
              placeholder="Charlie Oliver"
              className="input-premium"
              value={physicalHolderName}
              onChange={(e) => setPhysicalHolderName(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={issueCardMutation.isPending}
            onClick={() => void submitPhysicalRequest()}
            className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]"
          >
            {issueCardMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Submitting…
              </>
            ) : (
              "Request physical card"
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- Lost/stolen ---
  if (view === "lost") {
    if (!activeCard) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <p className="text-sm text-muted-foreground">No card selected.</p>
          <button type="button" onClick={() => setView("main")} className="mt-4 text-sm font-semibold text-primary">
            Back
          </button>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => setView("main")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
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
          {!isFrozen(activeCard) && (
            <button type="button" onClick={toggleFreeze}
              disabled={freezeMutation.isPending}
              className="w-full rounded-2xl bg-destructive py-4 text-[15px] font-bold text-destructive-foreground active:scale-[0.98] disabled:opacity-60"
            >
              Freeze Card Immediately
            </button>
          )}
          {isFrozen(activeCard) && (
            <div className="rounded-2xl bg-card shadow-card p-4 flex items-center gap-3">
              <Snowflake className="h-5 w-5 text-destructive" strokeWidth={1.8} />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">Card is frozen</p>
                <p className="text-[10px] text-muted-foreground">All transactions are blocked</p>
              </div>
            </div>
          )}
          <button type="button" onClick={() => setView("request")}
            className="w-full rounded-2xl border border-border/20 bg-card py-3.5 text-[13px] font-semibold text-foreground hover:bg-muted/15 transition-colors"
          >
            Request Replacement Card
          </button>
          <Link to="/support" className="block w-full rounded-2xl border border-border/20 bg-card py-3.5 text-center text-[13px] font-semibold text-primary hover:bg-muted/15 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  if (cardsLoading && cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2} />
        <p className="text-sm text-muted-foreground">Loading cards…</p>
      </div>
    );
  }

  if (cardsError && cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 gap-4">
        <p className="text-sm text-center text-muted-foreground">Could not load cards.</p>
        <button type="button" onClick={() => refetchCards()} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!cardsLoading && cards.length === 0) {
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
            <button type="button" onClick={() => setView("request")}
              className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/12 transition-colors"
            >
              <Plus className="h-3 w-3" strokeWidth={2.5} />
              New Card
            </button>
          </div>
        </header>
        <div className="px-5 pt-6">
          <EmptyState
            title="No cards yet"
            subtitle="Issue a virtual card instantly or request a physical card."
            action={{ label: "Request a card", onClick: () => setView("request") }}
          />
        </div>
      </div>
    );
  }

  // --- Main view ---
  return (
    <>
      <AlertDialog
        open={removeDialogOpen}
        onOpenChange={(open) => {
          setRemoveDialogOpen(open);
          if (!open) setRemoveTarget(null);
        }}
      >
        <AlertDialogContent className="max-w-[min(100vw-2rem,400px)] rounded-2xl border-border/60 bg-card p-5 shadow-2xl sm:p-6 gap-4">
          <AlertDialogHeader className="text-left space-y-2">
            <AlertDialogTitle className="text-[17px] font-bold tracking-tight pr-6">
              Remove this card?
            </AlertDialogTitle>
            {removeTarget ? (
              <AlertDialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
                This{" "}
                <strong className="font-semibold text-foreground">
                  {removeTarget.type === "virtual" ? "digital" : "physical"}
                </strong>{" "}
                card ending in{" "}
                <span className="font-mono tabular-nums font-semibold text-foreground">{removeTarget.last4}</span>{" "}
                will be removed from this wallet. You can’t undo this here.
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2">
            <AlertDialogCancel className="mt-0 min-h-[48px] w-full rounded-xl border-border/50 sm:w-auto sm:min-w-[120px]">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="min-h-[48px] w-full rounded-xl font-semibold sm:w-auto sm:min-w-[140px]"
              disabled={deleteCardMutation.isPending}
              onClick={confirmRemoveCard}
            >
              {deleteCardMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" strokeWidth={2} aria-hidden />
                  Removing…
                </span>
              ) : (
                "Remove card"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Cards</h1>
          </div>
          <button type="button" onClick={() => setView("request")}
            className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/12 transition-colors"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            New Card
          </button>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-5">
        {/* Card selector */}
        <div className="flex justify-center gap-2 mb-1 flex-wrap">
          {cards.map((c, i) => (
            <button type="button" key={c.id} onClick={() => setActiveCardIndex(i)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all ${
                i === safeCardIndex ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {c.type === "virtual" ? "Virtual" : "Physical"} ···{c.last4}
              {c.status === "pending" ? " · Pending" : ""}
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
            <div className={`relative rounded-3xl bg-gradient-to-br ${gradientClassFor(activeCard.color)} p-6 pb-5 shadow-elevated overflow-hidden aspect-[1.7/1] max-w-sm mx-auto`}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/[0.04]" />
              <div className="absolute bottom-4 right-6 h-20 w-20 rounded-full bg-white/[0.03]" />

              {isFrozen(activeCard) && (
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
                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-wider">
                      {activeCard.type} Card
                      {activeCard.status === "pending" ? " · Pending" : ""}
                    </p>
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
        <div className="flex justify-center gap-2.5 flex-wrap">
          <CardAction icon={showDetails ? EyeOff : Eye} label={showDetails ? "Hide" : "Show"} onClick={() => setShowDetails(!showDetails)} />
          <CardAction
            icon={isFrozen(activeCard) ? Sun : Snowflake}
            label={isFrozen(activeCard) ? "Unfreeze" : "Freeze"}
            onClick={toggleFreeze}
            danger={!isFrozen(activeCard)}
            disabled={freezeMutation.isPending}
          />
          <CardAction icon={copied ? Check : Copy} label="Copy" onClick={handleCopy} />
          <CardAction
            icon={Lock}
            label="Reveal"
            onClick={() => {
              if (activeCard.status === "pending") {
                toast({
                  title: "Card still pending",
                  description: "Physical card PAN/CVV appear after activation. Use Request new card for updates.",
                });
                return;
              }
              setView("reveal");
            }}
          />
          <CardAction icon={AlertTriangle} label="Report" onClick={() => setView("lost")} />
          <CardAction
            icon={Trash2}
            label="Remove"
            onClick={openRemoveDialog}
            danger
            disabled={deleteCardMutation.isPending}
          />
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
    </>
  );
};

function CardAction({
  icon: Icon,
  label,
  onClick,
  danger,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="flex flex-col items-center gap-1 group disabled:opacity-45">
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
