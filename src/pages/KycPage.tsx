import { ArrowLeft, Lock, Camera, FileText, CheckCircle2, Building2, Shield, ChevronRight, AlertCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { PendingState, StatusBanner } from "@/components/states/StateUI";

const steps = [
  { key: "bvn", icon: Lock, title: "IDV Verification", desc: "Link your Bank Verification Number", action: "Enter IDV", benefit: "Unlocks $200K daily limit" },
  { key: "selfie", icon: Camera, title: "Take a Selfie", desc: "Quick photo for face verification", action: "Take Photo", benefit: "Unlocks card access" },
  { key: "id", icon: FileText, title: "Upload ID", desc: "National ID, Voter's Card, or Passport", action: "Upload", benefit: "Unlocks $2M daily limit" },
  { key: "address", icon: Building2, title: "Proof of Address", desc: "Utility bill from last 3 months", action: "Upload", benefit: "Full account access" },
];

const tiers = [
  { level: "Basic", limit: "$50,000/day", steps: 0, color: "text-muted-foreground" },
  { level: "Standard", limit: "$200,000/day", steps: 1, color: "text-primary" },
  { level: "Premium", limit: "$2,000,000/day", steps: 3, color: "text-success" },
  { level: "Unlimited", limit: "$5,000,000/day", steps: 4, color: "text-accent" },
];

const KycPage = () => {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = (key: string) => {
    if (!completed.includes(key)) {
      setCompleted([...completed, key]);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const allDone = completed.length === steps.length;
  const currentTier = tiers.find(t => t.steps <= completed.length) || tiers[0];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Identity Verification</h1>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">{completed.length}/{steps.length}</span>
        </div>
        {/* Progress bar */}
        <div className="px-5 pb-2.5">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < completed.length ? "bg-primary" : i === currentStep ? "bg-primary/30" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 py-4 space-y-4">
        {!allDone ? (
          <>
            {/* Trust header */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-primary/[0.03] border border-primary/8 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <Shield className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-[13px] font-bold text-foreground mb-0.5">Why we verify your identity</h2>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Verification protects your account from fraud and unlocks higher transaction limits. Your data is encrypted and never shared.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Steps */}
            <div className="space-y-2">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isDone = completed.includes(step.key);
                const isCurrent = i === currentStep && !isDone;
                const isLocked = i > currentStep && !isDone;
                return (
                  <motion.button
                    key={step.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !isDone && !isLocked && handleComplete(step.key)}
                    disabled={isLocked}
                    className={`flex items-center gap-3 w-full rounded-2xl p-4 text-left transition-all ${
                      isDone
                        ? "bg-success/[0.04] border border-success/10"
                        : isCurrent
                        ? "bg-card shadow-card border border-primary/15"
                        : "bg-card border border-border/10 opacity-40"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isDone ? "bg-success/8" : isCurrent ? "bg-primary/8" : "bg-secondary"
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="h-[18px] w-[18px] text-success" strokeWidth={2} />
                      ) : (
                        <Icon className={`h-[18px] w-[18px] ${isCurrent ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.8} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold ${isDone ? "text-success" : "text-foreground"}`}>{step.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {isDone ? "Completed" : step.desc}
                      </p>
                    </div>
                    {isCurrent && (
                      <div className="flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1">
                        <span className="text-[10px] font-semibold text-primary">{step.action}</span>
                        <ChevronRight className="h-3 w-3 text-primary" strokeWidth={2} />
                      </div>
                    )}
                    {isDone && <CheckCircle2 className="h-4 w-4 text-success shrink-0" strokeWidth={2} />}
                  </motion.button>
                );
              })}
            </div>

            {/* Account tier progress */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card shadow-card p-4"
            >
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Account Tier Progress</h3>
              <div className="space-y-2">
                {tiers.map((tier, i) => {
                  const isActive = completed.length >= tier.steps;
                  return (
                    <div key={tier.level} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-primary" : "bg-border"}`} />
                      <span className={`text-[11px] font-semibold flex-1 ${isActive ? "text-foreground" : "text-muted-foreground/80"}`}>
                        {tier.level}
                      </span>
                      <span className={`text-[10px] font-medium ${isActive ? tier.color : "text-muted-foreground/60"}`}>
                        {tier.limit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Skip option */}
            <div className="text-center pt-2">
              <button onClick={() => navigate("/pin-setup")} className="text-[12px] font-semibold text-muted-foreground">
                Skip for now — verify later
              </button>
              <p className="text-[9px] text-muted-foreground/70 mt-1">Basic account: $50,000 daily limit</p>
            </div>
          </>
        ) : (
          <PendingState
            title="Verification Submitted"
            subtitle="We're reviewing your documents. This usually takes less than 5 minutes."
          >
            <div className="w-full mt-2">
              <button
                onClick={() => navigate("/pin-setup")}
                className="btn-primary"
              >
                Continue to PIN Setup
              </button>
            </div>
          </PendingState>
        )}
      </div>
    </div>
  );
};

export default KycPage;
