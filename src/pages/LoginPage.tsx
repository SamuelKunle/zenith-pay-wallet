import { ArrowLeft, Eye, EyeOff, Shield, Fingerprint, Lock, CheckCircle2, AlertCircle, Loader2, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

type AuthState = "idle" | "loading" | "error" | "locked";

const LoginPage = () => {
  const { signInWithCredentials } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setAuthState("error");
      setErrorMessage("Please enter your email and password");
      return;
    }
    setAuthState("loading");
    setTimeout(() => {
      setAuthState("idle");
      signInWithCredentials(email, password);
      getTelemetry().track(TelemetryEvents.LOGIN_SUCCESS, { method: "password" });
      navigate("/");
    }, 1600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden">
      {/* ─── Desktop Left Panel — Brand Trust ─── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden">
        <div className="absolute inset-0 balance-gradient" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, hsla(164, 50%, 40%, 0.15) 0%, transparent 60%)" }} />
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/[0.03]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/[0.02]" />
        <div className="absolute top-1/3 right-12 h-96 w-96 rounded-full bg-white/[0.015]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] backdrop-blur-sm">
              <Shield className="h-[17px] w-[17px] text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-white">Zenith Pay</span>
          </div>

          {/* Hero statement */}
          <div className="max-w-sm">
            <h2 className="text-[28px] xl:text-[32px] font-extrabold text-white leading-[1.15] tracking-[-0.02em] mb-4">
              Your finances,{"\n"}protected and{"\n"}always accessible
            </h2>
            <p className="text-[14px] font-medium text-white/60 leading-relaxed mb-8">
              Secure access to your accounts, transfers, cards, and savings — all in one place.
            </p>

            {/* Trust points */}
            <div className="space-y-3">
              {[
                "Bank-grade encryption on every session",
                "Biometric & 2FA protection",
                "FINRA licensed · FDIC insured",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.1]">
                    <CheckCircle2 className="h-3 w-3 text-white/70" strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-medium text-white/55">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust line */}
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-white/20" strokeWidth={2} />
            <span className="text-[10px] font-medium text-white/20 tracking-[0.06em]">
              Protected by advanced account security
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel — Auth Form ─── */}
      <div className="flex-1 flex flex-col lg:justify-center">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-5 py-3 lg:hidden">
          <Link to="/welcome" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex items-center gap-1.5">
            <Lock className="h-2.5 w-2.5 text-muted-foreground/60" strokeWidth={2.5} />
            <span className="text-[10px] font-semibold text-muted-foreground/70 tracking-[0.04em]">Secure login</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-8 lg:py-0 max-w-md lg:max-w-[420px] mx-auto w-full">
          {/* Brand mark — mobile */}
          <motion.div {...fadeInUp} className="mb-7 lg:mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl balance-gradient shadow-balance mb-5 lg:mb-6">
              <Shield className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <h1 className="text-[22px] lg:text-[26px] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-1">
              Welcome back
            </h1>
            <p className="text-[13px] lg:text-[14px] text-muted-foreground font-medium">
              Sign in to access your account
            </p>
          </motion.div>

          {/* Error state */}
          <AnimatePresence>
            {authState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25, ease }}
                className="mb-4"
              >
                <div className="flex items-start gap-2.5 rounded-xl p-3.5" style={{ backgroundColor: "hsl(var(--destructive) / 0.05)", border: "1px solid hsl(var(--destructive) / 0.1)" }}>
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[12px] font-semibold text-foreground mb-0.5">Unable to sign in</p>
                    <p className="text-[11px] text-muted-foreground">{errorMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Locked state */}
          <AnimatePresence>
            {authState === "locked" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="mb-4"
              >
                <div className="flex items-start gap-2.5 rounded-xl p-3.5" style={{ backgroundColor: "hsl(var(--warning) / 0.05)", border: "1px solid hsl(var(--warning) / 0.1)" }}>
                  <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[12px] font-semibold text-foreground mb-0.5">Too many attempts</p>
                    <p className="text-[11px] text-muted-foreground">Your account is temporarily locked. Please try again in 5 minutes or reset your password.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.div {...fadeInUp} transition={{ delay: 0.04 }} className="space-y-4 mb-5">
            <div className="space-y-1.5">
              <label className="form-label">Phone or Email</label>
              <input
                type="text"
                placeholder="08012345678 or chioma@email.com"
                className="input-premium"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setAuthState("idle"); }}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="form-label">Password</label>
                <button className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="input-composite">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthState("idle"); }}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 p-1 rounded-md hover:bg-surface-secondary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.8} />
                    : <Eye className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeInUp} transition={{ delay: 0.08 }}>
            <button
              onClick={handleLogin}
              disabled={authState === "loading"}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <AnimatePresence mode="wait" initial={false}>
                {authState === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Biometric */}
          <motion.div {...fadeInUp} transition={{ delay: 0.12 }} className="flex items-center justify-center mt-7">
            <button className="flex flex-col items-center gap-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                style={{ backgroundColor: "hsl(var(--primary) / 0.06)" }}
              >
                <Fingerprint className="h-7 w-7 text-primary" strokeWidth={1.3} />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">Use Biometrics</span>
            </button>
          </motion.div>

          {/* Divider + Signup */}
          <motion.div {...fadeInUp} transition={{ delay: 0.16 }} className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.08em]">Or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Link
              to="/signup"
              className="flex items-center justify-center w-full rounded-2xl border border-surface-border bg-card py-3.5 text-[13px] font-semibold text-foreground transition-all hover:bg-surface-secondary active:scale-[0.98]"
            >
              Create a Free Account
            </Link>
          </motion.div>

          {/* Footer trust */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="mt-8 flex flex-col items-center gap-3">
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/80 hover:text-muted-foreground transition-colors">
              <HelpCircle className="h-3 w-3" strokeWidth={2} />
              Need help accessing your account?
            </button>
            <div className="flex items-center gap-1.5">
              <Lock className="h-2.5 w-2.5 text-muted-foreground/80" strokeWidth={2.5} />
              <p className="text-[9px] text-muted-foreground/80 tracking-[0.08em]">
                256-BIT ENCRYPTED · FINRA LICENSED · FDIC INSURED
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
