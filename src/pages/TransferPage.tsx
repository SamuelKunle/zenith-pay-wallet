import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Search, ChevronRight, User, Building2, CheckCircle2, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrustSignal, VerifiedRecipient, TrustBadge } from "@/components/security/SecurityUI";
import { ProcessingState, FailedState } from "@/components/states/StateUI";
import { PremiumReceipt, ReceiptSuccessHeader, ReceiptData } from "@/components/receipts/PremiumReceipt";
import {
  FeeTransparencyCard,
  SecureConfirmation,
  ProcessingTrustMessage,
  NoDuplicateCharge,
  RecoveryMessage,
  SupportShortcut,
  InlineTrustLabel,
} from "@/components/trust/TrustCopy";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { postJson, ApiRequestError } from "@/lib/api/fetchJson";
import type { PaymentQuoteResponse, TransferCreateResponse } from "@/lib/api/types";
import { formatUsdLineFromCents } from "@/lib/format/money";

const recentRecipients = [
  { name: "Emerson Obi", tag: "@emeka_obi", avatar: "EO", bank: "Zenith Pay Wallet", verified: true },
  { name: "Avery Nwachukwu", tag: "@adaobi", avatar: "AN", bank: "Global Bank", verified: true },
  { name: "Kendall Adrian", tag: "@kemi_a", avatar: "KA", bank: "Zenith Pay Wallet", verified: true },
  { name: "Taylor Bakare", tag: "@tunde_b", avatar: "TB", bank: "UBA", verified: true },
  { name: "Fatima Yusuf", tag: "@fatima_y", avatar: "FY", bank: "Access Bank", verified: true },
];

type Step = "select" | "amount" | "confirm" | "processing" | "success" | "failed";

const TransferPage = () => {
  const queryClient = useQueryClient();
  const { data: balance, isPending: balanceLoading } = useWalletBalance();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [selectedRecipient, setSelectedRecipient] = useState<(typeof recentRecipients)[0] | null>(null);
  const [quote, setQuote] = useState<PaymentQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [lastTransfer, setLastTransfer] = useState<TransferCreateResponse | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  const numericAmount = Number(amount) || 0;
  const amountCents = Math.round(numericAmount * 100);

  useEffect(() => {
    if (numericAmount <= 0) {
      setQuote(null);
      setQuoteLoading(false);
      return;
    }

    const ac = new AbortController();
    const t = setTimeout(() => {
      setQuoteLoading(true);
      postJson<PaymentQuoteResponse>(
        "/api/v1/payments/quote",
        { amountCents },
        { signal: ac.signal },
      )
        .then((q) => {
          if (!ac.signal.aborted) setQuote(q);
        })
        .catch(() => {
          if (!ac.signal.aborted) setQuote(null);
        })
        .finally(() => {
          if (!ac.signal.aborted) setQuoteLoading(false);
        });
    }, 280);

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [numericAmount, amountCents]);

  const feeDollars = quote ? quote.feeCents / 100 : 0;
  const totalDollars = numericAmount + feeDollars;

  const insufficientBalance = useMemo(() => {
    if (!balance || amountCents <= 0) return false;
    if (!quote) return amountCents > balance.availableCents;
    return amountCents + quote.feeCents > balance.availableCents;
  }, [balance, amountCents, quote]);

  const fmtAmt = (val: string) => {
    const n = Number(val);
    return n ? n.toLocaleString() : "0";
  };

  const reviewDisabled =
    !amount ||
    numericAmount === 0 ||
    insufficientBalance ||
    balanceLoading ||
    quoteLoading ||
    (numericAmount > 0 && !quote);

  const handleConfirm = () => {
    setTransferError(null);
    setStep("processing");
    postJson<TransferCreateResponse>("/api/v1/transfers", {
      amountCents,
      recipientTag: selectedRecipient?.tag?.replace(/^@/, "") || undefined,
    })
      .then((r) => {
        setLastTransfer(r);
        setStep("success");
        queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
        queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      })
      .catch((e: unknown) => {
        let msg =
          "The transfer service returned an error. Your balance should be unchanged if the debit did not settle.";
        if (e instanceof ApiRequestError && e.status === 409) {
          msg = "Insufficient balance for this amount including fees.";
        } else if (e instanceof ApiRequestError && typeof e.body === "object" && e.body !== null && "error" in e.body) {
          const errBody = e.body as { error?: { message?: string } };
          if (errBody.error?.message) msg = errBody.error.message;
        }
        setTransferError(msg);
        setStep("failed");
      });
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <ProcessingState
          title="Processing transfer..."
          subtitle="Posting to ledger through the API route"
        />
        <div className="mt-6 w-full max-w-xs">
          <ProcessingTrustMessage />
        </div>
        <div className="mt-4">
          <NoDuplicateCharge />
        </div>
      </div>
    );
  }

  if (step === "confirm" && selectedRecipient) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button
              type="button"
              onClick={() => setStep("amount")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60"
            >
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Review Transfer</h1>
          </div>
        </header>

        <div className="flex-1 px-5 py-5 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">You're sending</p>
            <p className="text-[34px] font-extrabold text-foreground tabular-nums">${fmtAmt(amount)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="rounded-2xl bg-card shadow-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-surface-border-subtle">
              <p className="text-label mb-3">Recipient</p>
              <VerifiedRecipient
                name={selectedRecipient.name}
                bank={selectedRecipient.bank}
                avatar={selectedRecipient.avatar}
                tag={selectedRecipient.tag}
                verified={selectedRecipient.verified}
              />
            </div>

            <div className="px-5 py-3">
              <FeeTransparencyCard amount={numericAmount} fee={feeDollars} total={totalDollars}>
                {note && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                    <span className="text-[12px] text-muted-foreground">Note</span>
                    <span className="text-[12px] font-semibold text-foreground">{note}</span>
                  </div>
                )}
              </FeeTransparencyCard>
              <div className="flex items-center justify-between mt-2.5">
                <InlineTrustLabel icon="check" label="Recipient verified" variant="success" />
                <InlineTrustLabel icon="lock" label="Encrypted" variant="muted" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <SecureConfirmation method="biometric" />
          </motion.div>
        </div>

        <div className="sticky bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Fingerprint className="h-5 w-5 text-white/80" strokeWidth={1.8} />
            Confirm & Send
          </motion.button>
        </div>
      </div>
    );
  }

  if (step === "success" && selectedRecipient && lastTransfer) {
    const receiptFee = lastTransfer.feeCents / 100;
    const receiptAmount = lastTransfer.amountCents / 100;
    const receiptTotal = lastTransfer.totalCents / 100;

    const receiptData: ReceiptData = {
      type: selectedRecipient.bank?.includes("Zenith Pay") ? "wallet-transfer" : "bank-transfer",
      status: "success",
      amount: receiptAmount,
      fee: receiptFee,
      total: receiptTotal,
      reference: lastTransfer.reference,
      date: new Date(),
      sender: { name: "Charlie Oliver", detail: "Personal · Zenith Pay", avatar: "CO" },
      recipient: {
        name: selectedRecipient.name,
        detail: selectedRecipient.bank,
        avatar: selectedRecipient.avatar,
        verified: selectedRecipient.verified,
      },
      note: note || undefined,
      source: "Personal · Zenith Pay (balance on home reflects API)",
      channel: "Mobile App",
    };

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
        <ReceiptSuccessHeader title="Transfer Complete" subtitle="Your money is on its way" />
        <PremiumReceipt data={receiptData} onDone={() => {}} onShare={() => {}} />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          type="button"
          onClick={() => {
            setStep("select");
            setAmount("");
            setNote("");
            setSelectedRecipient(null);
            setLastTransfer(null);
            setQuote(null);
          }}
          className="text-[12px] font-semibold text-primary mt-4"
        >
          Send another transfer
        </motion.button>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <FailedState
          title="Transfer Failed"
          subtitle={
            transferError ||
            "Your money has not been debited. Retry or adjust the amount—including network fees quoted by the API."
          }
          onRetry={() => setStep("confirm")}
          secondaryAction={{ label: "Get Help", to: "/support" }}
        />
        <div className="mt-5 w-full max-w-xs space-y-3">
          <RecoveryMessage
            title="Your account is safe"
            subtitle="Ledger debits only occur after a successful response from POST /api/v1/transfers."
            variant="safe"
          />
          <SupportShortcut context="Need help with this transfer?" />
        </div>
      </div>
    );
  }

  if (step === "amount" && selectedRecipient) {
    const balanceLabel = balanceLoading
      ? "Loading balance…"
      : balance
        ? `Balance: ${formatUsdLineFromCents(balance.availableCents)}`
        : "Balance unavailable";

    const feeLabel =
      numericAmount <= 0
        ? null
        : quoteLoading
          ? "Fetching fee…"
          : quote
            ? `Fee: ${formatUsdLineFromCents(quote.feeCents)}`
            : "Fee: —";

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button type="button" onClick={() => setStep("select")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Enter Amount</h1>
          </div>
        </header>

        <div className="flex-1 px-5 py-5 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 rounded-full bg-card shadow-card border border-border/15 pl-1 pr-3.5 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full balance-gradient text-[9px] font-bold text-white">
                {selectedRecipient.avatar}
              </div>
              <span className="text-[12px] font-semibold text-foreground">{selectedRecipient.name}</span>
              {selectedRecipient.verified && <CheckCircle2 className="h-3 w-3 text-success" strokeWidth={2} />}
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-8">
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-[24px] font-bold text-muted-foreground/60">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? Number(amount).toLocaleString() : ""}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                className="input-amount w-48"
                autoFocus
              />
            </div>
            <p className={`text-[11px] mb-5 ${insufficientBalance ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              {insufficientBalance ? "Insufficient balance" : balanceLabel}
            </p>

            <div className="flex gap-2">
              {["1000", "5000", "10000", "50000"].map((val) => (
                <button key={val} type="button" onClick={() => setAmount(val)} className={`amount-chip ${amount === val ? "active" : ""}`}>
                  ${Number(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-3 mb-5">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="input-premium"
            />
            {numericAmount > 0 && (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span className="text-caption">{feeLabel}</span>
                  <InlineTrustLabel icon="shield" label="Quoted by API" variant="muted" />
                </div>
                <span className="text-[11px] font-semibold text-foreground tabular-nums">
                  Total:{" "}
                  {quoteLoading
                    ? "…"
                    : quote
                      ? `$${totalDollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "—"}
                </span>
              </div>
            )}
          </motion.div>

          <button type="button" onClick={() => setStep("confirm")} disabled={reviewDisabled} className="btn-primary">
            Review Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-[15px] font-bold text-foreground">Send Money</h1>
        </div>
      </header>

      <div className="px-5 py-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="input-search">
          <Search className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={2} />
          <input type="text" placeholder="Search name, tag, or phone number" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className="space-y-2">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Transfer To</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <Link to="/transfer/bank" className="flex items-center gap-3 px-4 py-3 border-b border-border/15 hover:bg-muted/15 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(225_50%_95%)]">
                <Building2 className="h-[17px] w-[17px] text-[hsl(225_55%_45%)]" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">Bank Account</p>
                <p className="text-[11px] text-muted-foreground">Send to any global bank</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </Link>
            <button type="button" className="flex items-center gap-3 px-4 py-3 w-full hover:bg-muted/15 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                <User className="h-[17px] w-[17px] text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-semibold text-foreground">Zenith Pay User</p>
                <p className="text-[11px] text-muted-foreground">Send to wallet tag or phone</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-2.5">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Recent</h3>
          <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
            {recentRecipients.map((r) => (
              <button
                key={r.tag}
                type="button"
                onClick={() => {
                  setSelectedRecipient(r);
                  setStep("amount");
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-secondary text-[12px] font-bold text-foreground/70 group-hover:bg-primary group-hover:text-primary-foreground transition-colors group-active:scale-90">
                  {r.avatar}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground w-14 text-center truncate">{r.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className="space-y-2">
          <h3 className="text-label">Saved Beneficiaries</h3>
          <div className="surface-content overflow-hidden">
            {recentRecipients.map((r, i) => (
              <button
                key={r.tag}
                type="button"
                onClick={() => {
                  setSelectedRecipient(r);
                  setStep("amount");
                }}
                className={`flex items-center gap-3 px-4 py-3.5 w-full hover:bg-surface-secondary transition-colors ${
                  i < recentRecipients.length - 1 ? "border-b border-surface-border-subtle" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-[10px] font-bold text-foreground/60">{r.avatar}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-tx-title">{r.name}</p>
                    {r.verified && <TrustBadge size="sm" />}
                  </div>
                  <p className="text-meta">{r.bank}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TransferPage;
