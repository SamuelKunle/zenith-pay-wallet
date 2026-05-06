import { ArrowLeft, Eye, EyeOff, Shield, Lock, CheckCircle2, Loader2, Fingerprint, User, Mail, Phone, HelpCircle, X, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

const passwordChecks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Upper & lowercase letters", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
];

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);
  const navigate = useNavigate();

  const allPasswordChecksPassed = passwordChecks.every((c) => c.test(password));

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      getTelemetry().track(TelemetryEvents.SIGNUP_OTP_COMPLETE, { step: "otp" });
      navigate("/kyc");
    }, 1400);
  };

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1200);
  };

  /* ─── OTP Step ─── */
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden">
        <DesktopBrandPanel step={2} />

        <div className="flex-1 flex flex-col lg:justify-center">
          {/* Mobile header */}
          <header className="flex items-center gap-3 px-5 py-3 lg:hidden">
            <button onClick={() => setStep("form")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary active:scale-95 transition-transform">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <div className="flex-1">
              <StepIndicator current={2} total={3} />
            </div>
          </header>

          <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-8 lg:py-0 max-w-md lg:max-w-[420px] mx-auto w-full">
            {/* Desktop step indicator */}
            <div className="hidden lg:block mb-8">
              <StepIndicator current={2} total={3} />
            </div>

            <motion.div {...fadeInUp} className="mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4 lg:hidden"
                style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}
              >
                <Phone className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <h1 className="text-[22px] font-extrabold text-foreground tracking-[-0.02em] mb-1.5">Verify your phone</h1>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <span className="font-bold text-foreground">+234 801 234 5678</span>
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.04 }} className="flex justify-center gap-2.5 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`otp-input ${digit ? "filled" : ""}`}
                />
              ))}
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.06 }} className="text-center mb-8">
              <p className="text-[11px] text-muted-foreground">
                Didn't receive a code?{" "}
                <button className="font-bold text-primary hover:underline">Resend in 45s</button>
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.08 }}>
              <button
                onClick={handleVerify}
                disabled={isLoading || otp.some((d) => !d)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </motion.div>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Verify & Continue
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* Trust footer */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ backgroundColor: "hsl(var(--primary) / 0.04)" }}
              >
                <Shield className="h-3 w-3 text-primary/60" strokeWidth={2} />
                <span className="text-[10px] font-semibold text-primary/60">Code expires in 10 minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-2.5 w-2.5 text-muted-foreground/80" strokeWidth={2.5} />
                <p className="text-[9px] text-muted-foreground/80 tracking-[0.08em]">END-TO-END ENCRYPTED VERIFICATION</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Form Step ─── */
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden">
      <DesktopBrandPanel step={1} />

      <div className="flex-1 flex flex-col lg:justify-center">
        {/* Mobile header */}
        <header className="flex items-center gap-3 px-5 py-3 lg:hidden">
          <Link to="/welcome" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary active:scale-95 transition-transform">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <StepIndicator current={1} total={3} />
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-6 lg:py-0 max-w-md lg:max-w-[420px] mx-auto w-full">
          {/* Desktop step indicator */}
          <div className="hidden lg:block mb-8">
            <StepIndicator current={1} total={3} />
          </div>

          {/* Heading */}
          <motion.div {...fadeInUp} className="mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl balance-gradient shadow-balance mb-4 lg:hidden">
              <User className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-[22px] lg:text-[26px] font-extrabold text-foreground tracking-[-0.02em] mb-1">
              Create your account
            </h1>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Takes less than 2 minutes. No paperwork needed.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeInUp} transition={{ delay: 0.04 }} className="space-y-4 mb-5">
            <div className="space-y-1.5">
              <label className="form-label">Full Name</label>
              <input type="text" placeholder="Charlie Oliver" className="input-premium" autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <label className="form-label">Phone Number</label>
              <div className="input-composite">
                <span className="text-[13px] font-bold text-foreground shrink-0">🇳🇬 +234</span>
                <div className="w-px h-5" style={{ backgroundColor: "hsl(var(--border) / 0.3)" }} />
                <input type="tel" placeholder="801 234 5678" autoComplete="tel" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="form-label">Email</label>
              <input type="email" placeholder="chioma@email.com" className="input-premium" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <label className="form-label">Password</label>
              <div className="input-composite">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-surface-secondary transition-colors"
                  type="button"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.8} />
                    : <Eye className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.8} />
                  }
                </button>
              </div>

              {/* Password strength */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease }}
                    className="space-y-1.5 pt-1.5 overflow-hidden"
                  >
                    {passwordChecks.map((check) => {
                      const passed = check.test(password);
                      return (
                        <div key={check.label} className="flex items-center gap-2">
                          <CheckCircle2
                            className={`h-3 w-3 transition-colors duration-200 ${passed ? "text-success" : "text-muted-foreground/80"}`}
                            strokeWidth={2}
                          />
                          <span className={`text-[10px] transition-colors duration-200 ${passed ? "text-success font-semibold" : "text-muted-foreground/80"}`}>
                            {check.label}
                          </span>
                        </div>
                      );
                    })}
                    {allPasswordChecksPassed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-1"
                        style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
                      >
                        <Shield className="h-3 w-3 text-success" strokeWidth={2} />
                        <span className="text-[10px] font-semibold text-success">Strong password — your account is well protected</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div {...fadeInUp} transition={{ delay: 0.08 }} className="mb-5">
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              By creating an account, you agree to our{" "}
              <button type="button" onClick={() => setLegalModal("terms")} className="font-semibold text-primary/80 hover:text-primary underline-offset-2 hover:underline">Terms of Service</button> and{" "}
              <button type="button" onClick={() => setLegalModal("privacy")} className="font-semibold text-primary/80 hover:text-primary underline-offset-2 hover:underline">Privacy Policy</button>
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating account...</span>
                  </motion.div>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Continue
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div {...fadeInUp} transition={{ delay: 0.14 }} className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[12px] text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
            <div className="flex items-center gap-4 text-muted-foreground/60">
              <Link to="/support" className="flex items-center gap-1 text-[10px] font-medium hover:text-muted-foreground transition-colors">
                <HelpCircle className="h-3 w-3" strokeWidth={2} />
                Need help?
              </Link>
              <div className="flex items-center gap-1.5">
                <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                <p className="text-[9px] tracking-[0.08em]">256-BIT ENCRYPTED</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] bg-card rounded-2xl sm:rounded-2xl shadow-elevated overflow-hidden flex flex-col"
              style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
                <div className="flex items-center gap-2.5">
                  {legalModal === "terms" ? (
                    <FileText className="h-4 w-4 text-primary" strokeWidth={2} />
                  ) : (
                    <Shield className="h-4 w-4 text-success" strokeWidth={2} />
                  )}
                  <h2 className="text-[15px] font-bold text-foreground">
                    {legalModal === "terms" ? "Terms of Service" : "Privacy Policy"}
                  </h2>
                </div>
                <button onClick={() => setLegalModal(null)} className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-surface-secondary transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {legalModal === "terms" ? (
                  <div className="space-y-3 text-[12px] text-muted-foreground leading-relaxed">
                    <p className="text-[10px] text-muted-foreground/60">Last updated: March 1, 2026</p>
                    <p>By creating an account with Zenith Pay, you agree to these terms governing the use of our digital banking services including transfers, card issuance, savings products, bill payments, and merchant services.</p>
                    <h3 className="text-[12px] font-bold text-foreground">1. Account Eligibility</h3>
                    <p>You must be at least 18 years old with a valid global phone number and government-issued identification to open a fully verified account.</p>
                    <h3 className="text-[12px] font-bold text-foreground">2. Account Security</h3>
                    <p>You are responsible for maintaining the confidentiality of your login credentials, PIN, and biometric data. Zenith Pay will never ask for your PIN via phone, email, or SMS.</p>
                    <h3 className="text-[12px] font-bold text-foreground">3. Transactions</h3>
                    <p>All transfers are subject to applicable limits and verification requirements. Transfer fees are disclosed before confirmation and are non-refundable once completed.</p>
                    <h3 className="text-[12px] font-bold text-foreground">4. Dispute Resolution</h3>
                    <p>Transaction disputes must be reported within 30 days. Zenith Pay will investigate and respond within 5 business days.</p>
                    <h3 className="text-[12px] font-bold text-foreground">5. Account Closure</h3>
                    <p>You may close your account at any time. Outstanding balances will be transferred to a designated account.</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-[12px] text-muted-foreground leading-relaxed">
                    <p className="text-[10px] text-muted-foreground/60">Last updated: March 1, 2026</p>
                    <h3 className="text-[12px] font-bold text-foreground">What We Collect</h3>
                    <p>We collect personal information necessary to provide banking services: name, phone number, email, government ID, address, transaction data, device information, and biometric data (with your consent).</p>
                    <h3 className="text-[12px] font-bold text-foreground">How We Use Your Data</h3>
                    <p>Your data is used to process transactions, verify identity, prevent fraud, improve services, comply with regulations, and provide customer support. We do not sell your personal information.</p>
                    <h3 className="text-[12px] font-bold text-foreground">Data Security</h3>
                    <p>All data is encrypted in transit and at rest using AES-256 encryption. Biometric data is stored locally on your device and never transmitted to our servers.</p>
                    <h3 className="text-[12px] font-bold text-foreground">Your Rights</h3>
                    <p>You can request access to, correction of, or deletion of your personal data at any time through the app or by contacting support.</p>
                    <div className="flex items-center gap-2 rounded-xl bg-success/[0.04] border border-success/10 px-4 py-3 mt-2">
                      <Lock className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={2} />
                      <p className="text-[11px] text-muted-foreground">Protected under global Data Protection Regulation (GDPR).</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 shrink-0" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))" }}>
                <button onClick={() => setLegalModal(null)} className="btn-primary text-[13px]">
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Desktop Brand Panel ─── */
function DesktopBrandPanel({ step }: { step: number }) {
  const stepLabels = ["Account details", "Phone verification", "Identity & security"];

  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden">
      <div className="absolute inset-0 balance-gradient" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, hsla(164, 50%, 40%, 0.15) 0%, transparent 60%)" }} />
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/[0.03]" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/[0.02]" />

      <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] backdrop-blur-sm">
            <Shield className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-white">Zenith Pay</span>
        </div>

        <div className="max-w-sm">
          <h2 className="text-[28px] xl:text-[32px] font-extrabold text-white leading-[1.15] tracking-[-0.02em] mb-4">
            Your premium{"\n"}banking journey{"\n"}starts here
          </h2>
          <p className="text-[14px] font-medium text-white/55 leading-relaxed mb-8">
            Join millions who trust Zenith Pay for secure, modern everyday banking.
          </p>

          {/* Journey progress */}
          <div className="space-y-3">
            {stepLabels.map((label, i) => {
              const isActive = i + 1 === step;
              const isDone = i + 1 < step;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-all ${
                    isDone ? "bg-white/20 text-white" : isActive ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-white/[0.06] text-white/30"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> : `0${i + 1}`}
                  </div>
                  <span className={`text-[13px] font-medium transition-colors ${
                    isDone || isActive ? "text-white/80" : "text-white/25"
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lock className="h-3 w-3 text-white/20" strokeWidth={2} />
          <span className="text-[10px] font-medium text-white/20 tracking-[0.06em]">
            Protected by advanced account security
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Details", "Verify", "Secure"];
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 transition-all duration-300 ${
            i + 1 < current
              ? "bg-primary/10"
              : i + 1 === current
              ? "bg-primary/10"
              : "bg-transparent"
          }`}>
            {i + 1 < current ? (
              <CheckCircle2 className="h-3 w-3 text-primary" strokeWidth={2.5} />
            ) : (
              <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i + 1 === current ? "bg-primary" : "bg-border"
              }`} />
            )}
            <span className={`text-[10px] font-semibold transition-colors ${
              i + 1 <= current ? "text-primary" : "text-muted-foreground/60"
            }`}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`h-px w-3 transition-colors ${i + 1 < current ? "bg-primary/30" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default SignupPage;
