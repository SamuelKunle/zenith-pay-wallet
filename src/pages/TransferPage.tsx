import { useState } from "react";
import { ArrowLeft, Search, ChevronRight, User, Building2, CheckCircle2, Share2, Clock, AlertCircle, RotateCcw, Fingerprint, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrustSignal, VerifiedRecipient, TrustBadge, EncryptionBadge } from "@/components/security/SecurityUI";
import { motionConfig } from "@/components/PageTransition";
import { ProcessingState, FailedState, StatusBanner } from "@/components/states/StateUI";
import { PremiumReceipt, ReceiptSuccessHeader, ReceiptData } from "@/components/receipts/PremiumReceipt";
import { FeeTransparencyCard, SecureConfirmation, RecipientVerificationMarker, ProcessingTrustMessage, NoDuplicateCharge, RecoveryMessage, SupportShortcut, InlineTrustLabel } from "@/components/trust/TrustCopy";

const recentRecipients = [
  { name: "Emerson Obi", tag: "@emeka_obi", avatar: "EO", bank: "Zenith Pay Wallet", verified: true },
  { name: "Avery Nwachukwu", tag: "@adaobi", avatar: "AN", bank: "Global Bank", verified: true },
  { name: "Kendall Adrian", tag: "@kemi_a", avatar: "KA", bank: "Zenith Pay Wallet", verified: true },
  { name: "Taylor Bakare", tag: "@tunde_b", avatar: "TB", bank: "UBA", verified: true },
  { name: "Fatima Yusuf", tag: "@fatima_y", avatar: "FY", bank: "Access Bank", verified: true },
];

type Step = "select" | "amount" | "confirm" | "processing" | "success" | "failed";

const TransferPage = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [selectedRecipient, setSelectedRecipient] = useState<typeof recentRecipients[0] | null>(null);

  const numericAmount = Number(amount) || 0;
  const fee = numericAmount > 0 ? (numericAmount <= 5000 ? 10 : numericAmount <= 50000 ? 25 : 50) : 0;
  const total = numericAmount + fee;
  const fmtAmt = (val: string) => { const n = Number(val); return n ? n.toLocaleString() : "0"; };

  const handleConfirm = () => {
    setStep("processing");
    // Simulate processing
    setTimeout(() => setStep("success"), 1800);
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <ProcessingState
          title="Processing transfer..."
          subtitle="Verifying and encrypting your transaction"
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

  // --- Confirmation Step ---
  if (step === "confirm" && selectedRecipient) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setStep("amount")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Review Transfer</h1>
          </div>
        </header>

        <div className="flex-1 px-5 py-5 space-y-4">
          {/* Amount hero */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">You're sending</p>
            <p className="text-[34px] font-extrabold text-foreground tabular-nums">${fmtAmt(amount)}</p>
          </motion.div>

          {/* Recipient with verification */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
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

            {/* Fee transparency */}
            <div className="px-5 py-3">
              <FeeTransparencyCard amount={numericAmount} fee={fee} total={total}>
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

          {/* Secure confirmation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <SecureConfirmation method="biometric" />
          </motion.div>
        </div>

        {/* Sticky confirm */}
        <div className="sticky bottom-0 px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
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

  // --- Success Step ---
  if (step === "success") {
    const receiptData: ReceiptData = {
      type: selectedRecipient?.bank?.includes("Zenith Pay") ? "wallet-transfer" : "bank-transfer",
      status: "success",
      amount: numericAmount,
      fee,
      total,
      reference: "TXN-2024-A8F3K9",
      date: new Date(),
      sender: { name: "Charlie Oliver", detail: "Personal · Zenith Pay", avatar: "CO" },
      recipient: selectedRecipient ? {
        name: selectedRecipient.name,
        detail: selectedRecipient.bank,
        avatar: selectedRecipient.avatar,
        verified: selectedRecipient.verified,
      } : undefined,
      note: note || undefined,
      source: "Personal · $1,245,800",
      channel: "Mobile App",
    };

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
        <ReceiptSuccessHeader title="Transfer Complete" subtitle="Your money is on its way" />
        <PremiumReceipt 
          data={receiptData}
          onDone={() => {}}
          onShare={() => {}}
        />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => { setStep("select"); setAmount(""); setNote(""); setSelectedRecipient(null); }}
          className="text-[12px] font-semibold text-primary mt-4"
        >
          Send another transfer
        </motion.button>
      </div>
    );
  }

  // --- Failed Step ---
  if (step === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <FailedState
          title="Transfer Failed"
          subtitle="Your money has not been debited. The recipient's bank is currently unavailable."
          onRetry={() => setStep("confirm")}
          secondaryAction={{ label: "Get Help", to: "/support" }}
        />
        <div className="mt-5 w-full max-w-xs space-y-3">
          <RecoveryMessage
            title="Your account is safe"
            subtitle="No money was deducted. You can retry or contact support."
            variant="safe"
          />
          <SupportShortcut context="Need help with this transfer?" />
        </div>
      </div>
    );
  }

  // --- Amount Step ---
  if (step === "amount" && selectedRecipient) {
    const insufficientBalance = numericAmount > 1245800;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setStep("select")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Enter Amount</h1>
          </div>
        </header>

        <div className="flex-1 px-5 py-5 flex flex-col">
          {/* Recipient chip */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 rounded-full bg-card shadow-card border border-border/15 pl-1 pr-3.5 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full balance-gradient text-[9px] font-bold text-white">
                {selectedRecipient.avatar}
              </div>
              <span className="text-[12px] font-semibold text-foreground">{selectedRecipient.name}</span>
              {selectedRecipient.verified && <CheckCircle2 className="h-3 w-3 text-success" strokeWidth={2} />}
            </div>
          </motion.div>

          {/* Amount input */}
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
              {insufficientBalance ? "Insufficient balance" : "Balance: $1,245,800.50"}
            </p>

            <div className="flex gap-2">
              {["1000", "5000", "10000", "50000"].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`amount-chip ${amount === val ? "active" : ""}`}
                >
                  ${Number(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Note + fee */}
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
                  <span className="text-caption">Fee: ${fee}</span>
                  <InlineTrustLabel icon="shield" label="No hidden fees" variant="muted" />
                </div>
                <span className="text-[11px] font-semibold text-foreground tabular-nums">Total: ${total.toLocaleString()}</span>
              </div>
            )}
          </motion.div>

          <button
            onClick={() => setStep("confirm")}
            disabled={!amount || numericAmount === 0 || insufficientBalance}
            className="btn-primary"
          >
            Review Transfer
          </button>
        </div>
      </div>
    );
  }

  // --- Select Recipient Step ---
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
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="input-search"
        >
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
            <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-muted/15 transition-colors">
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
              <button key={r.tag} onClick={() => { setSelectedRecipient(r); setStep("amount"); }}
                className="flex flex-col items-center gap-1.5 shrink-0 group">
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
              <button key={r.tag} onClick={() => { setSelectedRecipient(r); setStep("amount"); }}
                className={`flex items-center gap-3 px-4 py-3.5 w-full hover:bg-surface-secondary transition-colors ${
                  i < recentRecipients.length - 1 ? "border-b border-surface-border-subtle" : ""
                }`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tertiary text-[10px] font-bold text-foreground/60">
                  {r.avatar}
                </div>
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

function DetailRow({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={`text-[12px] tabular-nums ${bold ? "font-bold text-foreground text-[14px]" : "font-semibold text-foreground"} ${mono ? "font-mono text-[11px] text-muted-foreground" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default TransferPage;
