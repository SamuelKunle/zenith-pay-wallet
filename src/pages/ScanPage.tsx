import {
  ArrowLeft,
  ScanLine,
  ImageIcon,
  Flashlight,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Copy,
  Check,
  X,
  ChevronRight,
  QrCode,
  Fingerprint,
  Lock,
  HelpCircle,
  Wallet,
  ArrowRight,
  RefreshCw,
  User,
  Clock,
  Smartphone,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  motionConfig,
  fadeInUp,
  successPop,
} from "@/components/PageTransition";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";

const ease = motionConfig.ease;

type FlowState =
  | "hub"
  | "scan"
  | "myqr"
  | "recipient"
  | "amount"
  | "review"
  | "pin"
  | "processing"
  | "success"
  | "failed"
  | "invalid-qr"
  | "insufficient";

const mockRecipient = {
  name: "Avery Nwachukwu",
  handle: "@adaobi_n",
  initials: "AN",
  verified: true,
};

const ScanPage = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<FlowState>("hub");
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  /** Demo “torch”: brightens the viewfinder; real devices would attach to camera torch APIs. */
  const [torchOn, setTorchOn] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stable QR pattern
  const qrPattern = useMemo(
    () => [
      1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0,
      1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1,
    ],
    [],
  );

  // Stable transaction reference
  const txRef = useMemo(
    () => "QR-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    [],
  );
  const txDate = useMemo(() => {
    const now = new Date();
    return (
      now.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const formatAmount = (val: string) => {
    const num = parseInt(val.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString();
  };

  const rawAmount = parseInt(amount.replace(/,/g, "")) || 0;

  useEffect(() => {
    if (state !== "success") return;
    getTelemetry().track(TelemetryEvents.SCAN_PAYMENT_SUCCESS, {
      amountCents: Math.round(rawAmount * 100),
    });
  }, [state, rawAmount]);

  useEffect(() => {
    if (state !== "scan") setTorchOn(false);
  }, [state]);

  const advanceScanToRecipient = () => setState("recipient");

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 3) pinRefs.current[index + 1]?.focus();
    if (newPin.every((d) => d !== "")) {
      setTimeout(() => {
        setState("processing");
        setTimeout(() => setState("success"), 1800);
      }, 300);
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const resetFlow = () => {
    setState("hub");
    setAmount("");
    setNote("");
    setPin(["", "", "", ""]);
  };

  // ─── SCREEN WRAPPER ───
  const Screen = ({
    children,
    dark = false,
  }: {
    children: React.ReactNode;
    dark?: boolean;
  }) => (
    <div
      className={`min-h-screen flex flex-col overflow-x-hidden ${dark ? "bg-[hsl(220_25%_6%)]" : "bg-background"}`}
    >
      {children}
    </div>
  );

  const BackHeader = ({
    title,
    onBack,
    dark = false,
  }: {
    title: string;
    onBack: () => void;
    dark?: boolean;
  }) => (
    <header className="flex items-center gap-3 px-5 py-3 z-10 shrink-0">
      <button
        onClick={onBack}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${dark ? "bg-white/10 hover:bg-white/15" : "bg-secondary/60 hover:bg-secondary"}`}
      >
        <ArrowLeft
          className={`h-[17px] w-[17px] ${dark ? "text-white" : "text-foreground"}`}
          strokeWidth={2}
        />
      </button>
      <h1
        className={`text-[15px] font-bold ${dark ? "text-white" : "text-foreground"}`}
      >
        {title}
      </h1>
    </header>
  );

  // ═══════════════════════════════════════════
  //  QR HUB — Entry Point
  // ═══════════════════════════════════════════
  if (state === "hub") {
    return (
      <Screen>
        <BackHeader title="QR Payments" onBack={() => {}} />
        <div className="flex-1 px-5 py-4 space-y-4">
          {/* Hero actions */}
          <motion.div {...fadeInUp} className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setState("scan")}
              className="relative rounded-2xl p-5 text-left overflow-hidden group active:scale-[0.97] transition-transform"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85))",
              }}
            >
              <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/[0.06]" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 mb-3">
                <ScanLine className="h-5 w-5 text-white" strokeWidth={1.8} />
              </div>
              <p className="text-[14px] font-bold text-white mb-0.5">
                Scan to Pay
              </p>
              <p className="text-[10px] text-white/50">
                Scan a QR code to send money
              </p>
            </button>

            <button
              onClick={() => setState("myqr")}
              className="relative rounded-2xl p-5 text-left overflow-hidden group active:scale-[0.97] transition-transform bg-card shadow-card"
              style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-primary/[0.03]" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 mb-3">
                <QrCode className="h-5 w-5 text-primary" strokeWidth={1.8} />
              </div>
              <p className="text-[14px] font-bold text-foreground mb-0.5">
                My QR Code
              </p>
              <p className="text-[10px] text-muted-foreground">
                Show to receive money
              </p>
            </button>
          </motion.div>

          {/* Recent QR payments */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4, ease }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-foreground">
                Recent QR Payments
              </h3>
            </div>
            <div
              className="rounded-2xl bg-card shadow-card overflow-hidden"
              style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              {[
                {
                  name: "Avery Nwachukwu",
                  amount: "-$15,000",
                  time: "Today, 2:34 PM",
                  type: "sent",
                },
                {
                  name: "Emerson Obi",
                  amount: "+$8,000",
                  time: "Yesterday",
                  type: "received",
                },
                {
                  name: "Kendall Reese",
                  amount: "-$3,500",
                  time: "Mar 18",
                  type: "sent",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i < 2 ? "border-b" : ""}`}
                  style={{ borderColor: "hsl(var(--surface-border-subtle))" }}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tx.type === "received" ? "bg-success/8" : "bg-primary/8"}`}
                  >
                    <QrCode
                      className={`h-[17px] w-[17px] ${tx.type === "received" ? "text-success" : "text-primary"}`}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground">
                      {tx.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      QR {tx.type === "sent" ? "Payment" : "Received"} ·{" "}
                      {tx.time}
                    </p>
                  </div>
                  <span
                    className={`text-[12px] font-bold tabular-nums ${tx.type === "received" ? "text-success" : "text-foreground"}`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center justify-center gap-4 pt-2"
          >
            {[
              { icon: Shield, text: "Protected transfers" },
              { icon: Lock, text: "End-to-end encrypted" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-1.5">
                  <Icon
                    className="h-3 w-3 text-muted-foreground/60"
                    strokeWidth={2}
                  />
                  <span className="text-[9px] font-medium text-muted-foreground/70">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="px-5 pb-8">
          <Link
            to="/"
            className="block text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-3"
          >
            Back to Home
          </Link>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  SCANNER — Premium Financial Scan
  // ═══════════════════════════════════════════
  if (state === "scan") {
    return (
      <Screen dark>
        {/* Full dark immersive scanner */}
        <div className="absolute inset-0 bg-[hsl(220_25%_4%)]" />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-[11] transition-opacity duration-300 ${
            torchOn ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.16) 0%, transparent 58%)",
          }}
        />

        {/* Header — floating over content */}
        <header className="relative z-20 flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-2">
          <button
            onClick={() => setState("hub")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.12] active:scale-[0.95] transition-all"
          >
            <ArrowLeft
              className="h-[17px] w-[17px] text-white/90"
              strokeWidth={2}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-semibold text-white/50 tracking-wide">
              Ready to scan
            </span>
          </div>
          <button
            onClick={() => setState("myqr")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.12] active:scale-[0.95] transition-all"
          >
            <QrCode
              className="h-[17px] w-[17px] text-white/90"
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* Scanner body */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          {/* Viewfinder area — with vignette */}
          <div className="relative mb-8">
            {/* Ambient glow behind frame */}
            <div
              className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)",
              }}
            />

            <motion.button
              type="button"
              onClick={advanceScanToRecipient}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="relative w-[272px] h-[272px]"
            >
              {/* Subtle inner field */}
              <div className="absolute inset-0 rounded-[28px] bg-white/[0.02]" />

              {/* Corner brackets — refined thickness */}
              {[
                "top-0 left-0 border-t-[2.5px] border-l-[2.5px] rounded-tl-[28px]",
                "top-0 right-0 border-t-[2.5px] border-r-[2.5px] rounded-tr-[28px]",
                "bottom-0 left-0 border-b-[2.5px] border-l-[2.5px] rounded-bl-[28px]",
                "bottom-0 right-0 border-b-[2.5px] border-r-[2.5px] rounded-br-[28px]",
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease }}
                  className={`absolute w-14 h-14 border-primary ${pos}`}
                />
              ))}

              {/* Scanning line — subtle sweep */}
              <motion.div
                animate={{ y: [8, 240, 8] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute left-6 right-6 h-[1.5px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)",
                }}
              />

              {/* Center crosshair dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="h-2 w-2 rounded-full bg-primary/30"
                />
              </div>
            </motion.button>
          </div>

          {/* Guidance text */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease }}
            className="text-center mb-8"
          >
            <p className="text-[14px] font-semibold text-white/80 mb-1">
              Point at a Zenith Pay QR code
            </p>
            <p className="text-[11px] text-white/25">
              Payment will be verified securely before confirmation
            </p>
          </motion.div>

          {/* Controls row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35, ease }}
            className="flex items-center gap-5"
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) advanceScanToRecipient();
              }}
            />
            <button
              type="button"
              aria-label={torchOn ? "Turn off light" : "Turn on light"}
              aria-pressed={torchOn}
              onClick={() => setTorchOn((v) => !v)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl backdrop-blur-sm group-active:scale-[0.93] transition-all ${
                  torchOn
                    ? "bg-primary/25 ring-1 ring-primary/40"
                    : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                }`}
              >
                <Flashlight
                  className={`h-[19px] w-[19px] transition-colors ${torchOn ? "text-primary" : "text-white/50"}`}
                  strokeWidth={1.6}
                />
              </div>
              <span className="text-[9px] font-semibold text-white/25 tracking-wide">
                Light
              </span>
            </button>
            <button
              type="button"
              aria-label="Choose QR image from gallery"
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white/[0.06] backdrop-blur-sm group-hover:bg-white/[0.1] group-active:scale-[0.93] transition-all">
                <ImageIcon
                  className="h-[19px] w-[19px] text-white/50"
                  strokeWidth={1.6}
                />
              </div>
              <span className="text-[9px] font-semibold text-white/25 tracking-wide">
                Gallery
              </span>
            </button>
          </motion.div>
        </div>

        {/* Bottom trust bar */}
        <div className="relative z-10 px-5 pb-[max(env(safe-area-inset-bottom,20px),20px)] flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-2">
            <Lock className="h-2.5 w-2.5 text-white/20" strokeWidth={2.5} />
            <p className="text-[9px] text-white/20 tracking-[0.08em] font-semibold">
              SECURE SCAN · END-TO-END ENCRYPTED
            </p>
          </div>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  MY QR CODE — Premium Payment Identity
  // ═══════════════════════════════════════════
  if (state === "myqr") {
    return (
      <Screen dark>
        {/* Ambient background depth */}
        <div className="absolute inset-0 bg-[hsl(220_25%_4%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-2">
          <button
            onClick={() => setState("hub")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.12] active:scale-[0.95] transition-all"
          >
            <ArrowLeft
              className="h-[17px] w-[17px] text-white/90"
              strokeWidth={2}
            />
          </button>
          <span className="text-[13px] font-bold text-white/80">
            Receive Money
          </span>
          <button
            onClick={() => setState("scan")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.12] active:scale-[0.95] transition-all"
          >
            <ScanLine
              className="h-[17px] w-[17px] text-white/90"
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="w-full max-w-[320px]"
          >
            {/* The QR Pass Card */}
            <div className="rounded-[28px] bg-white overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
              {/* Identity section */}
              <div className="px-7 pt-7 pb-5 text-center">
                {/* Avatar with ring */}
                <div className="relative inline-flex mb-3">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full balance-gradient text-[17px] font-bold text-white shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.4)]">
                    CO
                  </div>
                  {/* Verified tick */}
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(142_60%_42%)]">
                      <Check
                        className="h-2.5 w-2.5 text-white"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[17px] font-bold text-[hsl(220_35%_10%)] tracking-[-0.01em]">
                  Charlie Oliver
                </p>
                <p className="text-[12px] font-semibold text-primary mt-0.5">
                  @chioma_pay
                </p>
                <p className="text-[10px] text-[hsl(220_10%_55%)] mt-1">
                  Personal Wallet
                </p>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-[hsl(220_15%_92%)]" />

              {/* QR section */}
              <div className="px-7 py-6 flex flex-col items-center">
                <div className="w-[200px] h-[200px] bg-[hsl(220_25%_6%)] rounded-[20px] flex items-center justify-center relative p-5">
                  {/* QR grid */}
                  <div className="grid grid-cols-7 gap-[3px] w-full h-full">
                    {qrPattern.map((filled, i) => (
                      <div
                        key={i}
                        className={`rounded-[2px] ${filled ? "bg-white" : "bg-white/[0.08]"}`}
                      />
                    ))}
                  </div>
                  {/* Center logo badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                      <div className="h-8 w-8 rounded-lg balance-gradient flex items-center justify-center">
                        <Shield
                          className="h-4 w-4 text-white"
                          strokeWidth={2.2}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-medium text-[hsl(220_10%_55%)] mt-4">
                  Scan to send me money
                </p>
              </div>

              {/* Bottom trust strip inside card */}
              <div className="px-6 py-3 bg-[hsl(220_20%_97%)] flex items-center justify-center gap-1.5">
                <Lock
                  className="h-2.5 w-2.5 text-[hsl(220_10%_65%)]"
                  strokeWidth={2.5}
                />
                <p className="text-[8px] font-bold text-[hsl(220_10%_65%)] tracking-[0.1em] uppercase">
                  Zenith Pay Verified · Internal Transfer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease }}
            className="flex gap-3 mt-6"
          >
            {[
              { icon: Share2, label: "Share", action: () => {} },
              {
                icon: Copy,
                label: copied ? "Copied!" : "Copy ID",
                action: handleCopy,
                success: copied,
              },
              { icon: Download, label: "Save", action: () => {} },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] backdrop-blur-sm group-hover:bg-white/[0.1] group-active:scale-[0.93] transition-all">
                    {"success" in btn && btn.success ? (
                      <Check
                        className="h-[18px] w-[18px] text-success"
                        strokeWidth={2}
                      />
                    ) : (
                      <Icon
                        className="h-[18px] w-[18px] text-white/50"
                        strokeWidth={1.7}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-semibold tracking-wide ${"success" in btn && btn.success ? "text-success" : "text-white/30"}`}
                  >
                    {btn.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom safe area */}
        <div className="relative z-10 px-5 pb-[max(env(safe-area-inset-bottom,20px),20px)] flex items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-2">
            <Shield className="h-2.5 w-2.5 text-white/15" strokeWidth={2.5} />
            <p className="text-[9px] text-white/15 tracking-[0.08em] font-semibold">
              PROTECTED ACCOUNT · ENCRYPTED
            </p>
          </div>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  RECIPIENT RESOLVED
  // ═══════════════════════════════════════════
  if (state === "recipient") {
    return (
      <Screen>
        <BackHeader title="" onBack={() => setState("scan")} />
        <div className="flex-1 flex flex-col px-5">
          {/* Resolved header badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease }}
            className="flex items-center justify-center mb-6"
          >
            <div
              className="flex items-center gap-1.5 rounded-full bg-success/[0.06] px-3 py-1.5"
              style={{ border: "1px solid hsl(var(--success) / 0.1)" }}
            >
              <CheckCircle2
                className="h-3 w-3 text-success"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-success tracking-[0.02em]">
                Recipient verified
              </span>
            </div>
          </motion.div>

          {/* Identity card */}
          <motion.div
            {...fadeInUp}
            className="rounded-2xl bg-card shadow-card overflow-hidden mb-4"
            style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
          >
            <div className="flex flex-col items-center text-center px-6 py-7">
              {/* Avatar with verified ring */}
              <motion.div
                {...successPop}
                transition={{ ...successPop.transition, delay: 0.1 }}
                className="relative mb-4"
              >
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full balance-gradient text-[20px] font-bold text-white shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.35)]">
                  {mockRecipient.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
              <h2 className="text-[18px] font-bold text-foreground mb-0.5">
                {mockRecipient.name}
              </h2>
              <p className="text-[12px] font-semibold text-primary mb-1">
                {mockRecipient.handle}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Personal Wallet · Zenith Pay User
              </p>
            </div>

            {/* Trust details */}
            <div
              className="px-5 py-4 space-y-3"
              style={{
                borderTop: "1px solid hsl(var(--surface-border-subtle))",
              }}
            >
              {[
                {
                  icon: Shield,
                  text: "Verified Zenith Pay account",
                  color: "text-success",
                },
                {
                  icon: Wallet,
                  text: "Internal wallet transfer · No fees",
                  color: "text-primary",
                },
                {
                  icon: Lock,
                  text: "Review before money moves",
                  color: "text-muted-foreground",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-card"
                      style={{
                        border: "1px solid hsl(var(--surface-border-subtle))",
                      }}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${item.color}`}
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-foreground">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-[max(env(safe-area-inset-bottom,24px),24px)] space-y-3">
          <button
            onClick={() => setState("amount")}
            className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
          >
            Send Money
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setState("scan")}
            className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Not the right person? Scan again
          </button>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  AMOUNT ENTRY
  // ═══════════════════════════════════════════
  if (state === "amount") {
    return (
      <Screen>
        <BackHeader title="" onBack={() => setState("recipient")} />
        <div className="flex-1 flex flex-col px-5">
          {/* Compact recipient strip */}
          <motion.div
            {...fadeInUp}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 mb-6"
            style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full balance-gradient text-[10px] font-bold text-white">
              {mockRecipient.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-foreground">
                  {mockRecipient.name}
                </p>
                <Shield className="h-3 w-3 text-success" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {mockRecipient.handle}
              </p>
            </div>
          </motion.div>

          {/* Amount hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.35 }}
            className="flex-1 flex flex-col items-center justify-center -mt-4"
          >
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.15em] mb-4">
              Enter amount
            </p>
            <div className="flex items-baseline justify-center mb-3">
              <span className="text-[24px] font-bold text-muted-foreground/80 mr-1">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) =>
                  setAmount(formatAmount(e.target.value.replace(/[^0-9]/g, "")))
                }
                placeholder="0"
                className="text-[52px] font-extrabold text-foreground tabular-nums tracking-[-0.03em] bg-transparent outline-none text-center max-w-[280px] placeholder:text-muted-foreground/10 caret-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
                autoFocus
              />
            </div>
            <div className="flex items-center gap-1.5 mb-6">
              <Wallet
                className="h-3 w-3 text-muted-foreground/60"
                strokeWidth={2}
              />
              <p className="text-[11px] text-muted-foreground">
                Balance:{" "}
                <span className="font-semibold text-foreground">
                  $2,450,800
                </span>
              </p>
            </div>

            {/* Quick amount chips */}
            <div className="flex gap-2">
              {["1,000", "5,000", "10,000", "50,000"].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all active:scale-[0.93] ${
                    amount === val
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  }`}
                  style={
                    amount === val
                      ? { border: "1px solid hsl(var(--primary) / 0.2)" }
                      : { border: "1px solid transparent" }
                  }
                >
                  ${val}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Note field */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease }}
          >
            <div
              className="rounded-xl bg-card px-4 py-3.5 mb-4 flex items-center gap-3"
              style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for? (optional)"
                className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/35"
              />
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
          <button
            onClick={() => (rawAmount > 0 ? setState("review") : null)}
            disabled={rawAmount === 0}
            className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-all disabled:opacity-30 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {rawAmount > 0 ? `Continue · $${amount}` : "Enter an amount"}
            {rawAmount > 0 && (
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  REVIEW TRANSFER
  // ═══════════════════════════════════════════
  if (state === "review") {
    return (
      <Screen>
        <BackHeader title="Review" onBack={() => setState("amount")} />
        <div className="flex-1 px-5 py-2 space-y-4 overflow-y-auto">
          {/* Amount hero */}
          <motion.div {...fadeInUp} className="text-center py-5">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">
              Sending
            </p>
            <p
              className="text-[40px] font-extrabold text-foreground tabular-nums tracking-[-0.03em] leading-none"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ${amount}
            </p>
          </motion.div>

          {/* Transfer details card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.4, ease }}
            className="rounded-2xl bg-card shadow-card overflow-hidden"
            style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
          >
            {/* To */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{
                borderBottom: "1px solid hsl(var(--surface-border-subtle))",
              }}
            >
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full balance-gradient text-[12px] font-bold text-white">
                  {mockRecipient.initials}
                </div>
                <div className="absolute -bottom-px -right-px flex h-4 w-4 items-center justify-center rounded-full bg-card">
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success">
                    <Check className="h-2 w-2 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                  To
                </p>
                <p className="text-[13px] font-bold text-foreground">
                  {mockRecipient.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {mockRecipient.handle}
                </p>
              </div>
            </div>

            {/* Details rows */}
            <div className="px-5 py-4 space-y-3.5">
              {[
                { label: "Transfer type", value: "Internal wallet" },
                { label: "From", value: "Main Wallet" },
                { label: "Fee", value: "Free", isAccent: true },
                ...(note
                  ? [{ label: "Note", value: note, isAccent: false }]
                  : []),
                { label: "Reference", value: txRef, isAccent: false },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {row.label}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${"isAccent" in row && row.isAccent ? "text-success" : "text-foreground"} ${row.label === "Reference" ? "tabular-nums font-mono text-[10px]" : ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Total row */}
            <div
              className="px-5 py-4"
              style={{
                borderTop: "1px solid hsl(var(--surface-border-subtle))",
                background: "hsl(var(--muted) / 0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-foreground">
                  Total deduction
                </span>
                <span
                  className="text-[16px] font-extrabold text-foreground tabular-nums"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  ${amount}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Security assurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl px-4 py-3.5 bg-success/[0.03]"
            style={{ border: "1px solid hsl(var(--success) / 0.06)" }}
          >
            <Shield
              className="h-4 w-4 text-success shrink-0 mt-0.5"
              strokeWidth={1.8}
            />
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-0.5">
                Protected transfer
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Funds move instantly within Zenith Pay. You'll receive a
                confirmation receipt.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="px-5 pb-[max(env(safe-area-inset-bottom,24px),24px)] space-y-2.5 pt-2">
          <button
            onClick={() => setState("pin")}
            className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" strokeWidth={2} />
            Confirm & Send
          </button>
          <button
            onClick={() => setState("amount")}
            className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Edit details
          </button>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  PIN CONFIRMATION
  // ═══════════════════════════════════════════
  if (state === "pin") {
    return (
      <Screen>
        <BackHeader title="" onBack={() => setState("review")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div {...fadeInUp} className="text-center w-full max-w-xs">
            {/* Lock icon */}
            <div className="relative mx-auto mb-6">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-primary/[0.06] mx-auto">
                <Fingerprint
                  className="h-8 w-8 text-primary"
                  strokeWidth={1.3}
                />
              </div>
            </div>

            <h2 className="text-[18px] font-bold text-foreground mb-1">
              Confirm payment
            </h2>
            <p className="text-[12px] text-muted-foreground mb-1">
              <span className="font-bold text-foreground">${amount}</span> to{" "}
              {mockRecipient.name}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mb-8">
              Enter your 4-digit transaction PIN
            </p>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-10">
              {pin.map((digit, i) => (
                <div key={i} className="relative">
                  <input
                    ref={(el) => {
                      pinRefs.current[i] = el;
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    className="h-[56px] w-[56px] rounded-2xl bg-card text-center text-[24px] font-bold text-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:bg-primary/[0.02]"
                    style={{
                      border: `1.5px solid ${digit ? "hsl(var(--primary) / 0.3)" : "hsl(var(--surface-border-subtle))"}`,
                    }}
                  />
                  {/* Filled indicator dot */}
                  {digit && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="h-3 w-3 rounded-full bg-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Biometric option */}
            <button className="flex items-center gap-2.5 mx-auto rounded-xl bg-secondary/60 px-5 py-3 text-[12px] font-semibold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
              <Fingerprint className="h-4 w-4 text-primary" strokeWidth={1.8} />
              Use biometric instead
            </button>
          </motion.div>
        </div>

        <div className="px-5 pb-[max(env(safe-area-inset-bottom,24px),24px)] flex items-center justify-center gap-1.5">
          <Lock
            className="h-2.5 w-2.5 text-muted-foreground/15"
            strokeWidth={2.5}
          />
          <p className="text-[9px] text-muted-foreground/80 tracking-[0.08em] font-semibold">
            SECURE AUTHENTICATION · ENCRYPTED
          </p>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  PROCESSING
  // ═══════════════════════════════════════════
  if (state === "processing") {
    return (
      <Screen>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className="text-center"
          >
            {/* Animated ring */}
            <div className="relative mx-auto mb-7 h-24 w-24">
              <motion.svg
                className="h-24 w-24 -rotate-90"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray="264"
                  strokeDashoffset="200"
                  strokeLinecap="round"
                />
              </motion.svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-[18px] font-bold text-foreground mb-1">
              Sending payment
            </h2>
            <p className="text-[12px] text-muted-foreground mb-6">
              ${amount} to {mockRecipient.name}
            </p>

            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-success/[0.06] px-3.5 py-1.5"
              style={{ border: "1px solid hsl(var(--success) / 0.08)" }}
            >
              <Shield className="h-3 w-3 text-success" strokeWidth={2} />
              <span className="text-[9px] font-bold text-success tracking-[0.04em]">
                ENCRYPTED · PROTECTED
              </span>
            </motion.div>
          </motion.div>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  SUCCESS
  // ═══════════════════════════════════════════
  if (state === "success") {
    return (
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "user"}>
        <Screen>
          <div className="flex-1 flex flex-col px-5 pt-12 pb-4 overflow-y-auto">
            {/* Success hero */}
            <div className="text-center mb-6">
              <motion.div
                {...successPop}
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success/8 mx-auto mb-5"
              >
                <CheckCircle2
                  className="h-9 w-9 text-success"
                  strokeWidth={1.5}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
              >
                <p className="text-[12px] font-semibold text-success mb-1">
                  Payment successful
                </p>
                <p
                  className="text-[36px] font-extrabold text-foreground tabular-nums tracking-[-0.03em] leading-none mb-1"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  ${amount}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  to {mockRecipient.name}
                </p>
              </motion.div>
            </div>

            {/* Premium receipt card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease }}
              className="rounded-2xl bg-card shadow-card overflow-hidden mb-5"
              style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              {/* Recipient row */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderBottom: "1px solid hsl(var(--surface-border-subtle))",
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full balance-gradient text-[11px] font-bold text-white">
                  {mockRecipient.initials}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-foreground">
                    {mockRecipient.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {mockRecipient.handle}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 rounded-full bg-success/8 px-2 py-1">
                  <CheckCircle2
                    className="h-2.5 w-2.5 text-success"
                    strokeWidth={2.5}
                  />
                  <span className="text-[8px] font-bold text-success">
                    Sent
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: "Amount", value: `$${amount}` },
                  { label: "Type", value: "Internal QR Transfer" },
                  { label: "From", value: "Main Wallet" },
                  { label: "Fee", value: "Free", accent: true },
                  ...(note ? [{ label: "Note", value: note }] : []),
                  { label: "Reference", value: txRef, mono: true },
                  { label: "Date", value: txDate },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {row.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${"accent" in row ? "text-success" : "text-foreground"} ${"mono" in row ? "font-mono tabular-nums" : ""}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Scalloped divider */}
              <div className="relative h-4 overflow-hidden">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-background" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-background" />
                <div
                  className="absolute inset-x-4 top-1/2 border-t border-dashed"
                  style={{ borderColor: "hsl(var(--surface-border-subtle))" }}
                />
              </div>

              {/* Receipt footer */}
              <div className="px-5 py-3 flex items-center justify-center gap-1.5">
                <Shield
                  className="h-3 w-3 text-muted-foreground/80"
                  strokeWidth={2}
                />
                <p className="text-[8px] text-muted-foreground/60 tracking-[0.1em] uppercase font-semibold">
                  Zenith Pay · Secured Transaction
                </p>
              </div>
            </motion.div>

            {/* Share actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="grid grid-cols-3 gap-2.5 mb-4"
            >
              {[
                { icon: Share2, label: "Share" },
                {
                  icon: Copy,
                  label: copied ? "Copied!" : "Copy Ref",
                  action: handleCopy,
                  success: copied,
                },
                { icon: Download, label: "Receipt" },
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.label}
                    onClick={"action" in btn ? btn.action : undefined}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary/60 py-3 text-[11px] font-semibold text-foreground hover:bg-secondary active:scale-[0.95] transition-all"
                  >
                    {"success" in btn && btn.success ? (
                      <Check
                        className="h-3.5 w-3.5 text-success"
                        strokeWidth={2}
                      />
                    ) : (
                      <Icon
                        className="h-3.5 w-3.5 text-muted-foreground"
                        strokeWidth={1.8}
                      />
                    )}
                    {btn.label}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <div className="px-5 pb-[max(env(safe-area-inset-bottom,24px),24px)] space-y-2.5">
            <button
              onClick={resetFlow}
              className="w-full rounded-2xl balance-gradient py-4 text-[14px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform"
            >
              Make Another Payment
            </button>
            <Link
              to="/"
              className="block w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Back to Home
            </Link>
          </div>
        </Screen>
      </MotionConfig>
    );
  }

  // ═══════════════════════════════════════════
  //  FAILED
  // ═══════════════════════════════════════════
  if (state === "failed") {
    return (
      <Screen>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            {...successPop}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-destructive/8 mb-5"
          >
            <AlertTriangle
              className="h-9 w-9 text-destructive"
              strokeWidth={1.5}
            />
          </motion.div>
          <h2 className="text-[18px] font-bold text-foreground mb-1.5">
            Transfer could not be completed
          </h2>
          <p className="text-[12px] text-muted-foreground max-w-[280px] mb-2">
            The payment was not processed. No money has been deducted from your
            account.
          </p>

          <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-2.5 mb-8">
            <Shield
              className="h-3.5 w-3.5 text-muted-foreground/70"
              strokeWidth={1.8}
            />
            <p className="text-[10px] text-muted-foreground">
              Your account balance is unchanged
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => setState("review")}
              className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2} /> Try Again
            </button>
            <Link
              to="/support"
              className="block w-full rounded-2xl bg-secondary/60 py-3.5 text-center text-[12px] font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Contact Support
            </Link>
            <button
              onClick={resetFlow}
              className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  INVALID QR
  // ═══════════════════════════════════════════
  if (state === "invalid-qr") {
    return (
      <Screen>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-warning/8 mb-5">
            <QrCode className="h-9 w-9 text-warning" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold text-foreground mb-1.5">
            QR code not recognized
          </h2>
          <p className="text-[12px] text-muted-foreground max-w-[280px] mb-8">
            This is not a valid Zenith Pay payment code. Ask the recipient to
            show their Zenith Pay QR code.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => setState("scan")}
              className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform"
            >
              Scan Again
            </button>
            <button
              onClick={resetFlow}
              className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  // ═══════════════════════════════════════════
  //  INSUFFICIENT BALANCE
  // ═══════════════════════════════════════════
  if (state === "insufficient") {
    return (
      <Screen>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-warning/8 mb-5">
            <Wallet className="h-9 w-9 text-warning" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold text-foreground mb-1.5">
            Insufficient balance
          </h2>
          <p className="text-[12px] text-muted-foreground max-w-[280px] mb-2">
            You don't have enough funds to complete this transfer.
          </p>

          <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-2.5 mb-8">
            <Wallet
              className="h-3.5 w-3.5 text-muted-foreground/70"
              strokeWidth={1.8}
            />
            <p className="text-[10px] text-muted-foreground">
              Available balance:{" "}
              <span className="font-semibold text-foreground">$2,450,800</span>
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => setState("amount")}
              className="w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance active:scale-[0.97] transition-transform"
            >
              Change Amount
            </button>
            <button
              onClick={resetFlow}
              className="w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  return null;
};

export default ScanPage;
