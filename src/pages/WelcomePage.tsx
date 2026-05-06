import { Shield, ArrowRight, Lock, TrendingUp, Sparkles, CreditCard, PiggyBank, Fingerprint, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

const slides = [
  {
    icon: Shield,
    title: "Your money, protected",
    desc: "Bank-grade encryption and biometric security on every transaction.",
    trust: "FINRA Licensed · FDIC Insured",
  },
  {
    icon: TrendingUp,
    title: "Send money in seconds",
    desc: "Instant transfers to any bank or wallet. Zero delays, transparent fees.",
    trust: "2M+ transfers daily",
  },
  {
    icon: Sparkles,
    title: "Everything in one place",
    desc: "Bills, savings, cards, and payments — your entire financial life managed.",
    trust: "Trusted by 5M+ users globally",
  },
];

const journeySteps = [
  { icon: Shield, label: "Create account", desc: "Basic details, under 2 minutes" },
  { icon: Fingerprint, label: "Verify identity", desc: "Quick IDV & selfie check" },
  { icon: Lock, label: "Secure access", desc: "Set your PIN & biometrics" },
  { icon: CreditCard, label: "Start banking", desc: "Send, save & pay instantly" },
];

const WelcomePage = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden">
      {/* ─── Desktop: Full brand hero ─── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0 balance-gradient" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, hsla(164, 50%, 40%, 0.12) 0%, transparent 50%)" }} />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/[0.025]" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-white/[0.02]" />
        <div className="absolute top-1/2 right-16 h-[500px] w-[500px] rounded-full bg-white/[0.01] -translate-y-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] backdrop-blur-sm">
              <Shield className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-white">Zenith Pay</span>
          </div>

          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
              >
                <h2 className="text-[36px] xl:text-[42px] font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-4">
                  {slides[current].title}
                </h2>
                <p className="text-[15px] font-medium text-white/55 leading-relaxed max-w-[360px] mb-6">
                  {slides[current].desc}
                </p>
                <div className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 w-fit">
                  <CheckCircle2 className="h-3 w-3 text-white/50" strokeWidth={2} />
                  <span className="text-[11px] font-semibold text-white/50">{slides[current].trust}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    i === current ? "w-8 bg-white/60" : "w-1.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-white/15" strokeWidth={2} />
            <span className="text-[10px] font-medium text-white/15 tracking-[0.06em]">
              Protected by advanced account security
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right / Mobile Panel ─── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top brand */}
        <div className="flex items-center justify-between px-5 pt-8 pb-2 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl balance-gradient shadow-balance">
              <Shield className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-foreground">Zenith Pay</span>
          </div>
          <Link to="/login" className="text-[12px] font-semibold text-primary">
            Sign in
          </Link>
        </div>

        {/* Mobile slide content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease }}
              className="flex flex-col items-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}
              >
                {(() => {
                  const Icon = slides[current].icon;
                  return <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />;
                })()}
              </div>
              <h1 className="text-[22px] font-extrabold text-foreground leading-tight tracking-[-0.02em] mb-2">
                {slides[current].title}
              </h1>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto mb-4">
                {slides[current].desc}
              </p>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}
              >
                <Lock className="h-2.5 w-2.5 text-success" strokeWidth={2.5} />
                <span className="text-[10px] font-semibold text-success">{slides[current].trust}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-7 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ─── Journey Preview (mobile) ─── */}
        <div className="px-6 pb-4 lg:hidden">
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.08em] uppercase mb-3">
              How it works
            </p>
            <div className="grid grid-cols-2 gap-3">
              {journeySteps.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "hsl(var(--primary) / 0.07)" }}
                  >
                    <s.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-foreground leading-tight">{s.label}</p>
                    <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: centered auth entry */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12 xl:px-20">
          <div className="max-w-[400px] w-full">
            <h2 className="text-[26px] font-extrabold text-foreground tracking-[-0.02em] mb-2">
              Start your financial journey
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
              Open your account in minutes. No paperwork, no branch visits — just a secure, modern banking experience.
            </p>

            {/* Journey steps (desktop) */}
            <div className="mb-8 space-y-3">
              {journeySteps.map((s, i) => (
                <div key={i} className="flex items-center gap-3.5 rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors hover:bg-surface-secondary/50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "hsl(var(--primary) / 0.07)" }}
                  >
                    <s.icon className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-muted-foreground/60">0{i + 1}</span>
                </div>
              ))}
            </div>

            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance transition-all hover:opacity-95 active:scale-[0.98] mb-3"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center w-full rounded-2xl border border-surface-border bg-card py-3.5 text-[14px] font-semibold text-foreground transition-all hover:bg-surface-secondary active:scale-[0.98]"
            >
              I already have an account
            </Link>

            <div className="flex items-center justify-center gap-1.5 mt-8">
              <Lock className="h-2.5 w-2.5 text-muted-foreground/80" strokeWidth={2.5} />
              <p className="text-[9px] text-muted-foreground/80 tracking-[0.08em]">
                256-BIT ENCRYPTED · FINRA LICENSED · FDIC INSURED
              </p>
            </div>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="px-6 pb-8 space-y-3 lg:hidden">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 w-full rounded-2xl balance-gradient py-4 text-[15px] font-bold text-white shadow-balance transition-all hover:opacity-95 active:scale-[0.98]"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center w-full rounded-2xl border border-surface-border bg-card py-3.5 text-[14px] font-semibold text-foreground transition-all hover:bg-surface-secondary active:scale-[0.98]"
          >
            I already have an account
          </Link>
          <div className="flex flex-col items-center gap-1 pt-2">
            <p className="text-center text-[10px] text-muted-foreground/80 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="font-semibold text-primary/70">Terms</Link> and{" "}
              <Link to="/terms" className="font-semibold text-primary/70">Privacy Policy</Link>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Lock className="h-2 w-2 text-muted-foreground/80" strokeWidth={2.5} />
              <p className="text-[8px] text-muted-foreground/80 tracking-[0.08em]">
                256-BIT ENCRYPTED · FINRA LICENSED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
