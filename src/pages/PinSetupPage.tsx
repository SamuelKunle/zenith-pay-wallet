import {
  ArrowLeft,
  Lock,
  Fingerprint,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";
import { motion, MotionConfig } from "framer-motion";
import { fadeInUp } from "@/components/PageTransition";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PinDots = ({ length, total = 4 }: { length: number; total?: number }) => (
  <div className="flex gap-4">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        animate={i < length ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 0.15 }}
        className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
          i < length ? "bg-primary scale-100" : "bg-border"
        }`}
      />
    ))}
  </div>
);

const Numpad = ({
  onInput,
  onDelete,
}: {
  onInput: (v: string) => void;
  onDelete: () => void;
}) => (
  <div className="grid grid-cols-3 gap-2.5 max-w-[260px] w-full">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((key, i) => {
      if (key === null) return <div key={i} />;
      if (key === "del") {
        return (
          <button
            key={i}
            onClick={onDelete}
            className="flex h-14 items-center justify-center rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted/30 transition-colors active:scale-95"
          >
            ←
          </button>
        );
      }
      return (
        <button
          key={i}
          onClick={() => onInput(String(key))}
          className="flex h-14 items-center justify-center rounded-xl bg-card text-xl font-bold text-foreground shadow-card hover:bg-muted/20 transition-colors active:scale-95"
        >
          {key}
        </button>
      );
    })}
  </div>
);

const PinSetupPage = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const navigate = useNavigate();
  const [step, setStep] = useState<
    "create" | "confirm" | "biometric" | "success"
  >("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handlePinInput = (value: string) => {
    if (step === "create") {
      const newPin = pin + value;
      setPin(newPin);
      if (newPin.length === 4) setTimeout(() => setStep("confirm"), 300);
    } else if (step === "confirm") {
      const newConfirm = confirmPin + value;
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) setTimeout(() => setStep("biometric"), 300);
    }
  };

  const handleDelete = () => {
    if (step === "create") setPin(pin.slice(0, -1));
    else if (step === "confirm") setConfirmPin(confirmPin.slice(0, -1));
  };

  const currentLength = (step === "create" ? pin : confirmPin).length;

  useEffect(() => {
    if (step !== "success") return;
    getTelemetry().track(TelemetryEvents.PIN_SETUP_COMPLETE, {});
  }, [step]);

  if (step === "success") {
    return (
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "user"}>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-x-hidden">
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { delay: 0.15, type: "spring", stiffness: 200 }
              }
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success/8 mb-6"
            >
              <CheckCircle2
                className="h-9 w-9 text-success"
                strokeWidth={1.8}
              />
            </motion.div>
            <h1 className="text-[20px] font-bold text-foreground mb-1">
              You're all set!
            </h1>
            <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed mb-8">
              Your wallet is ready. Start sending, receiving, and managing your
              money.
            </p>
            <div className="w-full space-y-2.5 mb-8">
              {[
                { label: "Add money to your wallet", icon: Sparkles },
                { label: "Make your first transfer", icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="surface-interactive flex items-center gap-3 px-4 py-3.5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                      <Icon
                        className="h-4 w-4 text-primary"
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate("/")} className="btn-primary">
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </MotionConfig>
    );
  }

  if (step === "biometric") {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
        <header className="flex items-center gap-3 px-5 py-3">
          <button
            onClick={() => setStep("confirm")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60"
          >
            <ArrowLeft
              className="h-[17px] w-[17px] text-foreground"
              strokeWidth={2}
            />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div {...fadeInUp}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/8">
              <Fingerprint
                className="h-10 w-10 text-primary"
                strokeWidth={1.2}
              />
            </div>
            <h1 className="text-[20px] font-bold text-foreground mb-2">
              Enable Biometrics?
            </h1>
            <p className="text-[13px] text-muted-foreground max-w-xs mx-auto leading-relaxed mb-10">
              Use fingerprint or Face ID to unlock your wallet and approve
              transactions instantly.
            </p>
          </motion.div>
          <div className="w-full max-w-xs space-y-3">
            <button onClick={() => setStep("success")} className="btn-primary">
              Enable Biometrics
            </button>
            <button
              onClick={() => setStep("success")}
              className="btn-secondary"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="flex items-center gap-3 px-5 py-3">
        <button
          onClick={() => {
            if (step === "confirm") {
              setStep("create");
              setConfirmPin("");
            } else navigate(-1);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60"
        >
          <ArrowLeft
            className="h-[17px] w-[17px] text-foreground"
            strokeWidth={2}
          />
        </button>
        <div className="flex-1">
          <div className="flex gap-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div
              className={`h-1 flex-1 rounded-full ${step === "confirm" ? "bg-primary/40" : "bg-primary/40"}`}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div key={step} {...fadeInUp} className="text-center mb-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8">
            <Lock className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-[20px] font-bold text-foreground mb-1.5">
            {step === "create" ? "Create your PIN" : "Confirm your PIN"}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {step === "create"
              ? "This 4-digit PIN secures all your transactions"
              : "Re-enter your PIN to confirm"}
          </p>
        </motion.div>

        <div className="mb-14">
          <PinDots length={currentLength} />
        </div>

        <Numpad onInput={handlePinInput} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default PinSetupPage;
