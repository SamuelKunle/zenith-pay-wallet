import { Eye, EyeOff, Copy, Check, Wallet, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

const BalanceCard = () => {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease }}
      className="balance-gradient shimmer relative overflow-hidden rounded-[28px] p-7 pb-6 shadow-balance"
    >
      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/[0.02]" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/[0.015]" />
      <div className="absolute right-8 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/[0.01]" />

      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="balance-surface-chip flex items-center gap-2 rounded-full py-1.5 pl-3 pr-3 opacity-95 transition-opacity duration-200 ease-premium hover:opacity-100"
            >
              <Wallet className="balance-text-soft h-3.5 w-3.5" strokeWidth={2} />
              <span className="balance-text-strong text-[11px] font-semibold tracking-[0.03em]">Personal</span>
              <ChevronDown className="balance-text-muted h-3 w-3" strokeWidth={2.3} />
            </motion.button>
            <span className="balance-text-muted text-[10px] font-bold uppercase tracking-[0.08em]">USD</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
            onClick={() => setVisible(!visible)}
            className="balance-surface-chip flex h-9 w-9 items-center justify-center rounded-full opacity-95 transition-opacity duration-200 ease-premium hover:opacity-100"
            aria-label={visible ? "Hide balance" : "Show balance"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={visible ? "eye" : "eye-off"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, ease }}
              >
                {visible ? (
                  <Eye className="balance-text-strong h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <EyeOff className="balance-text-strong h-3.5 w-3.5" strokeWidth={2} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="mb-2">
          <p className="balance-text-soft mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]">
            Available Balance
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={visible ? "show" : "hide"}
              initial={{ opacity: 0, filter: "blur(8px)", y: 4 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -4 }}
              transition={{ duration: 0.3, ease }}
            >
              {visible ? (
                <p className="text-balance text-balance-card">
                  $1,245,800
                  <span className="balance-text-soft ml-0.5 text-[18px]">.50</span>
                </p>
              ) : (
                <p className="text-balance balance-text-strong tracking-[0.18em]">
                  $ ••••••
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="mt-8 flex items-center justify-between pt-5"
          style={{ borderTop: "1px solid hsl(var(--balance-card-text) / 0.12)" }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={handleCopy}
            className="balance-surface-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[-0.01em] opacity-95 transition-opacity duration-200 ease-premium hover:opacity-100"
          >
            <span className="balance-text-soft">@chioma_pay</span>
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="balance-text-strong h-2.5 w-2.5" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15, ease }}
                >
                  <Copy className="balance-text-soft h-2.5 w-2.5" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {visible && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25, ease }}
                className="balance-text-muted text-[11px] font-medium"
              >
                +$120K this week
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
