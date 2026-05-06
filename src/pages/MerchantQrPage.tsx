import { ArrowLeft, QrCode, Copy, Share2, Download, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MerchantQrPage = () => {
  const [mode, setMode] = useState<"static" | "dynamic">("static");
  const [amount, setAmount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3 px-5 py-3">
          <Link to="/merchant" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-base font-bold text-foreground">Receive Payment</h1>
        </div>
      </header>

      <div className="px-5 py-5 space-y-5">
        {/* Mode toggle */}
        <div className="flex p-1 rounded-xl bg-secondary animate-scale-in">
          <button
            onClick={() => { setMode("static"); setGenerated(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "static" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            Static QR
          </button>
          <button
            onClick={() => { setMode("dynamic"); setGenerated(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "dynamic" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            Dynamic QR
          </button>
        </div>

        {mode === "dynamic" && !generated && (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Amount to Receive</label>
              <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring transition-all">
                <span className="text-lg font-bold text-foreground">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="flex-1 bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/60"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Lunch order #24"
                className="w-full rounded-xl border-2 border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/80 transition-all"
              />
            </div>
            <button
              onClick={() => setGenerated(true)}
              disabled={!amount}
              className="w-full rounded-2xl balance-gradient py-4 text-base font-bold text-balance-card shadow-balance transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              Generate QR — ${amount ? Number(amount).toLocaleString() : "0"}
            </button>
          </div>
        )}

        {(mode === "static" || generated) && (
          <div className="animate-scale-in">
            {/* QR Card */}
            <div className="rounded-3xl bg-card border border-border shadow-elevated p-6 flex flex-col items-center">
              {/* Business info */}
              <div className="flex items-center gap-3 mb-5 w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl merchant-gradient text-sm font-bold text-balance-card">
                  CK
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">Chi's Kitchen</p>
                  <p className="text-xs text-muted-foreground">Merchant ID: MCH-8472</p>
                </div>
              </div>

              {mode === "dynamic" && amount && (
                <div className="w-full rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 text-center mb-5">
                  <p className="text-xs text-muted-foreground">Amount Due</p>
                  <p className="text-2xl font-bold text-primary">${Number(amount).toLocaleString()}</p>
                </div>
              )}

              {/* QR Code mock */}
              <div className="w-56 h-56 bg-foreground rounded-2xl flex items-center justify-center mb-4 relative">
                <div className="grid grid-cols-8 gap-0.5 p-4">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.35 ? "bg-card" : "bg-transparent"}`} />
                  ))}
                </div>
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center shadow-elevated">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-1">
                {mode === "static" ? "Scan to pay Chi's Kitchen" : "One-time payment QR"}
              </p>
              {mode === "dynamic" && (
                <span className="inline-flex rounded-full bg-fintech-chip-pending-bg px-2.5 py-0.5 text-[10px] font-semibold text-fintech-chip-pending-text">
                  Expires in 15 min
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3.5 shadow-card hover:bg-muted transition-colors active:scale-95"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Copy className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-[11px] font-medium text-muted-foreground">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3.5 shadow-card hover:bg-muted transition-colors active:scale-95">
                <Share2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">Share</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3.5 shadow-card hover:bg-muted transition-colors active:scale-95">
                <Download className="h-5 w-5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">Save</span>
              </button>
            </div>

            {/* Waiting state */}
            <div className="mt-5 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center gap-3 animate-pulse-soft">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-medium text-foreground">Waiting for payment…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantQrPage;
