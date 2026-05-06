import { Shield, ArrowRight, Send, CreditCard, PiggyBank, QrCode, Zap, Lock, CheckCircle2, Star, TrendingUp, Users, Smartphone, BarChart3, Globe, Fingerprint, Eye, ChevronRight, Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import { motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

const trustStats = [
  { value: "5M+", label: "Active users" },
  { value: "$2.8T", label: "Processed monthly" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "<2s", label: "Transfer speed" },
];

const testimonials = [
  { name: "Avery N.", role: "Freelancer · London", text: "Zenith Pay made receiving payments from clients effortless. The transfer speed is unmatched.", rating: 5 },
  { name: "Taylor B.", role: "Business Owner · New York", text: "The merchant QR and POS tools helped me go cashless at my store. Settlements are fast and reliable.", rating: 5 },
  { name: "Kendall A.", role: "Student · Singapore", text: "I love the savings goals feature. It keeps me disciplined and the interest rates are actually good.", rating: 5 },
];

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl" style={{ borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 md:px-8 h-[56px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg balance-gradient shadow-glow">
              <Shield className="h-[14px] w-[14px] text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-foreground">Zenith Pay</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Security", "Business", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 transition-colors"
            >
              <Sun className="h-4 w-4 text-foreground dark:hidden" strokeWidth={1.8} />
              <Moon className="h-4 w-4 text-foreground hidden dark:block" strokeWidth={1.8} />
            </button>
            <Link to="/login" className="text-[13px] font-semibold text-foreground hover:text-primary transition-colors duration-150">Sign In</Link>
            <Link to="/signup" className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors duration-150 active:scale-[0.97]">
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary"
            >
              <Sun className="h-4 w-4 text-foreground dark:hidden" strokeWidth={1.8} />
              <Moon className="h-4 w-4 text-foreground hidden dark:block" strokeWidth={1.8} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary">
              {mobileMenuOpen ? <X className="h-4 w-4 text-foreground" strokeWidth={2} /> : <Menu className="h-4 w-4 text-foreground" strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease }}
              className="md:hidden overflow-hidden bg-card"
              style={{ borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}
            >
              <div className="px-5 py-4 space-y-1">
                {["Features", "Security", "Business", "FAQ"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 text-[14px] font-medium text-foreground"
                  >{item}</a>
                ))}
                <div className="flex gap-3 pt-3">
                  <Link to="/login" className="flex-1 rounded-xl border border-surface-border bg-card py-2.5 text-center text-[13px] font-semibold text-foreground">Sign In</Link>
                  <Link to="/signup" className="flex-1 rounded-xl bg-primary py-2.5 text-center text-[13px] font-bold text-primary-foreground">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle ambient gradient */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 60%)" }} />

        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 pb-12 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 relative z-10">
          <div className="max-w-[640px] mx-auto text-center lg:text-left lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-[1fr_440px] lg:gap-16 lg:items-center">
            {/* Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                {/* Trust chip */}
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-6" style={{ backgroundColor: "hsl(var(--success) / 0.06)", border: "1px solid hsl(var(--success) / 0.08)" }}>
                  <Lock className="h-2.5 w-2.5 text-success" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-success tracking-[0.02em]">FINRA Licensed · FDIC Insured</span>
                </div>

                <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-extrabold text-foreground leading-[1.08] tracking-[-0.03em] mb-5">
                  The premium way{" "}
                  <br className="hidden md:block" />
                  to move money
                </h1>

                <p className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed max-w-[480px] mx-auto lg:mx-0 mb-8">
                  Faster transfers. Smarter cards. Secure savings. Everything you need to manage your money with confidence — in one elegant experience.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-10">
                  <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl balance-gradient px-8 py-4 text-[15px] font-bold text-white shadow-balance hover:opacity-95 active:scale-[0.98] transition-all">
                    Open Free Account
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-surface-border bg-card px-8 py-4 text-[14px] font-semibold text-foreground hover:bg-surface-secondary active:scale-[0.98] transition-all">
                    Sign In
                  </Link>
                </div>

                {/* Micro-trust row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
                  {[
                    { icon: Shield, text: "Bank-grade security" },
                    { icon: Zap, text: "Instant transfers" },
                    { icon: Fingerprint, text: "Biometric login" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-1.5">
                        <Icon className="h-3 w-3 text-muted-foreground/70" strokeWidth={2} />
                        <span className="text-[11px] font-medium text-muted-foreground/60">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Product preview — phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Phone frame */}
                <div className="rounded-[2.5rem] bg-card shadow-premium p-3 mx-auto max-w-[280px]" style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}>
                  {/* Screen */}
                  <div className="rounded-[2rem] overflow-hidden" style={{ backgroundColor: "hsl(var(--background))" }}>
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 pt-3 pb-1">
                      <span className="text-[10px] font-semibold text-foreground/40">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 rounded-sm bg-foreground/20" />
                        <div className="w-2.5 h-2 rounded-sm bg-foreground/20" />
                      </div>
                    </div>

                    {/* Mini dashboard preview */}
                    <div className="px-4 pb-5 pt-3">
                      {/* Balance card mini */}
                      <div className="balance-gradient rounded-2xl p-4 mb-4 relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-white/[0.03]" />
                        <p className="text-[8px] font-medium text-white/40 uppercase tracking-wider mb-1">Available Balance</p>
                        <p className="text-[20px] font-extrabold text-white tabular-nums mb-3">$1,245,800<span className="text-[10px] opacity-40">.50</span></p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 rounded-full bg-white/[0.08] px-2 py-1">
                            <Send className="h-2 w-2 text-white/60" strokeWidth={2} />
                            <span className="text-[7px] font-semibold text-white/60">Send</span>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-white/[0.08] px-2 py-1">
                            <QrCode className="h-2 w-2 text-white/60" strokeWidth={2} />
                            <span className="text-[7px] font-semibold text-white/60">Pay</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent transactions mini */}
                      <p className="text-[8px] font-bold text-foreground/40 uppercase tracking-wider mb-2">Recent</p>
                      {[
                        { name: "Emerson Obi", amount: "+$50,000", color: "text-success" },
                        { name: "Shoprite Soho", amount: "-$12,450", color: "text-foreground" },
                        { name: "Carrier Airtime", amount: "-$2,000", color: "text-foreground" },
                      ].map((tx) => (
                        <div key={tx.name} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--surface-border-subtle) / 0.5)" }}>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg bg-surface-tertiary" />
                            <span className="text-[9px] font-semibold text-foreground/70">{tx.name}</span>
                          </div>
                          <span className={`text-[9px] font-bold tabular-nums ${tx.color}`}>{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease }}
                  className="absolute -left-12 top-24 rounded-xl bg-card shadow-elevated px-3.5 py-2.5"
                  style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "hsl(var(--success) / 0.08)" }}>
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-foreground">Transfer Complete</p>
                      <p className="text-[8px] text-muted-foreground">$50,000 to Emerson</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65, duration: 0.5, ease }}
                  className="absolute -right-8 bottom-32 rounded-xl bg-card shadow-elevated px-3.5 py-2.5"
                  style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}>
                      <Shield className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-foreground">92% Protected</p>
                      <p className="text-[8px] text-muted-foreground">All features active</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Trust Stats ─── */}
      <section style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))", borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {trustStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease }}
                className="text-center"
              >
                <p className="text-[28px] md:text-[34px] font-extrabold text-foreground tabular-nums tracking-[-0.02em]">{stat.value}</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature 1: Transfers ─── */}
      <section id="features" className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <FeatureLabel text="Transfers" />
            <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
              Send money in under two seconds
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
              Instant transfers to any bank or wallet worldwide. Transparent fees before you send. No hidden charges, no delays.
            </p>
            <div className="space-y-3">
              {[
                "Instant bank-to-bank transfers",
                "Wallet-to-wallet with tag or phone",
                "Fee transparency before confirmation",
                "Verified recipient display",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease }}
            className="mt-12 lg:mt-0"
          >
            <PhoneMockup>
              <div className="px-4 pt-4 pb-6">
                <div className="text-center py-4 mb-4">
                  <p className="text-[8px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-1">You're sending</p>
                  <p className="text-[26px] font-extrabold text-foreground tabular-nums">$75,000</p>
                </div>
                <div className="rounded-xl bg-card p-3 mb-3" style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="h-8 w-8 rounded-full balance-gradient flex items-center justify-center text-[8px] font-bold text-white">AN</div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground">Avery Nwachukwu</p>
                      <p className="text-[8px] text-muted-foreground">Global Bank · Verified ✓</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[8px] pt-2" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))" }}>
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-semibold text-foreground">$25</span>
                  </div>
                </div>
                <div className="rounded-xl balance-gradient py-2.5 text-center">
                  <span className="text-[10px] font-bold text-white">Confirm & Send</span>
                </div>
              </div>
            </PhoneMockup>
          </motion.div>
        </div>
      </section>

      {/* ─── Feature 2: Cards ─── */}
      <section className="bg-card/50" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))", borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Card preview — left on desktop */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="order-2 lg:order-1 mt-12 lg:mt-0"
            >
              <div className="max-w-[320px] mx-auto">
                {/* Card face */}
                <div className="rounded-2xl bg-gradient-to-br from-[hsl(162_72%_22%)] via-[hsl(170_60%_26%)] to-[hsl(180_50%_18%)] p-5 shadow-elevated aspect-[1.6/1] relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/[0.04]" />
                  <div className="flex items-start justify-between mb-auto">
                    <div>
                      <p className="text-[8px] font-medium text-white/35 uppercase tracking-wider">Virtual Card</p>
                      <p className="text-[10px] font-semibold text-white/70 mt-0.5">Zenith Pay</p>
                    </div>
                    <p className="text-[11px] font-bold text-white/60">Visa</p>
                  </div>
                  <div className="mt-8">
                    <p className="text-[13px] font-semibold text-white/80 tracking-[0.15em] tabular-nums">••••  ••••  ••••  4829</p>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-[7px] text-white/30 uppercase tracking-wider">Card Holder</p>
                      <p className="text-[9px] font-semibold text-white/65">Charlie Oliver</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] text-white/30 uppercase tracking-wider">Expires</p>
                      <p className="text-[9px] font-semibold text-white/65 tabular-nums">09/27</p>
                    </div>
                  </div>
                </div>

                {/* Controls preview */}
                <div className="flex justify-center gap-4 mt-5">
                  {[
                    { icon: Eye, label: "Show" },
                    { icon: Lock, label: "Freeze" },
                    { icon: Globe, label: "Intl" },
                  ].map((ctrl) => {
                    const Icon = ctrl.icon;
                    return (
                      <div key={ctrl.label} className="flex flex-col items-center gap-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary">
                          <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground">{ctrl.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Text — right on desktop */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="order-1 lg:order-2"
            >
              <FeatureLabel text="Cards" />
              <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
                Cards built for real control
              </h2>
              <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
                Virtual and physical cards with real-time spending controls. Freeze instantly, set limits by category, and monitor every transaction as it happens.
              </p>
              <div className="space-y-3">
                {[
                  "Instant virtual card creation",
                  "Freeze and unfreeze in one tap",
                  "Daily and international spending limits",
                  "Real-time transaction alerts",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                    <span className="text-[13px] font-medium text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Feature 3: Savings + Bills (compact grid) ─── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
              Everything you need, nothing you don't
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-lg mx-auto">
              A complete financial platform designed for speed, security, and daily convenience.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: PiggyBank, title: "Savings & Goals", desc: "Flexible, locked, and goal-based savings with competitive rates up to 14% p.a.", color: "text-success", bgColor: "hsl(var(--success) / 0.06)" },
            { icon: Zap, title: "Bills & Utilities", desc: "Pay electricity, airtime, data, cable TV and more — fast, reliable, with instant confirmation.", color: "text-warning", bgColor: "hsl(var(--warning) / 0.06)" },
            { icon: QrCode, title: "QR Payments", desc: "Scan to pay at any merchant. Accept payments with your branded business QR code.", color: "text-accent", bgColor: "hsl(var(--accent) / 0.06)" },
            { icon: BarChart3, title: "Spending Insights", desc: "Track where your money goes with smart categorisation, weekly reports, and budget alerts.", color: "text-info", bgColor: "hsl(var(--info) / 0.06)" },
            { icon: Users, title: "Business Tools", desc: "Merchant dashboard, sales tracking, staff access controls, and instant settlements.", color: "text-primary", bgColor: "hsl(var(--primary) / 0.06)" },
            { icon: Smartphone, title: "Multi-Device", desc: "Access your account from any device with trusted device management and login alerts.", color: "text-foreground", bgColor: "hsl(var(--muted) / 0.6)" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease }}
                className="surface-interactive p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: f.bgColor }}>
                  <Icon className={`h-5 w-5 ${f.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-[14px] font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Security ─── */}
      <section id="security" className="bg-card/50" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))", borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
              <FeatureLabel text="Security" />
              <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
                Security you can see, not just trust
              </h2>
              <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
                Every layer of Zenith Pay is built to protect your money. From biometric login to real-time fraud monitoring, your safety is always visible.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, text: "Bank-grade encryption" },
                  { icon: Fingerprint, text: "Biometric authentication" },
                  { icon: Smartphone, text: "Device management" },
                  { icon: Eye, text: "Real-time monitoring" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2.5 rounded-xl bg-card p-3" style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}>
                      <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.8} />
                      <span className="text-[11px] font-semibold text-foreground">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Security score card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease }}
              className="mt-12 lg:mt-0 flex justify-center"
            >
              <div className="surface-elevated p-8 max-w-xs w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[13px] font-bold text-foreground">Protection Score</h3>
                  <span className="chip-success">Active</span>
                </div>
                <div className="flex items-center justify-center mb-5">
                  <div className="relative h-28 w-28">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--success))" strokeWidth="5" strokeDasharray="264" strokeDashoffset="21" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[26px] font-extrabold text-foreground tabular-nums">92</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[11px] text-muted-foreground mb-4">Your account has maximum protection</p>
                <div className="flex gap-1.5">
                  {["Biometric", "2FA", "Alerts", "Monitoring"].map((f) => (
                    <div key={f} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full h-1 rounded-full" style={{ backgroundColor: "hsl(var(--success) / 0.3)" }} />
                      <span className="text-[7px] font-semibold text-muted-foreground uppercase tracking-wider">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Business ─── */}
      <section id="business" className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <FeatureLabel text="Business" />
            <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] leading-tight mb-4">
              Built for businesses that move fast
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
              Accept payments, track revenue, manage settlements, and grow your business — all from one premium dashboard.
            </p>
            <div className="space-y-3">
              {[
                "Branded QR codes for in-store payments",
                "Real-time sales and settlement tracking",
                "Staff accounts with role-based access",
                "Instant settlement to your bank account",
                "Detailed transaction reports and exports",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-[13px] font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all">
                Open Business Account
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease }}
            className="mt-12 lg:mt-0"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: QrCode, title: "QR Payments", value: "$2.4M", sub: "Collected this month", color: "text-primary", bgColor: "hsl(var(--primary) / 0.06)" },
                { icon: TrendingUp, title: "Revenue", value: "+23%", sub: "vs last month", color: "text-success", bgColor: "hsl(var(--success) / 0.06)" },
                { icon: Users, title: "Customers", value: "1,847", sub: "Unique this month", color: "text-info", bgColor: "hsl(var(--info) / 0.06)" },
                { icon: Zap, title: "Settlements", value: "<1hr", sub: "Average payout time", color: "text-warning", bgColor: "hsl(var(--warning) / 0.06)" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="surface-content p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: card.bgColor }}>
                      <Icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.8} />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">{card.title}</p>
                    <p className="text-[20px] font-extrabold text-foreground tabular-nums tracking-[-0.02em]">{card.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="bg-card/50" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))", borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <FeatureLabel text="FAQ" />
              <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
                Common questions, clear answers
              </h2>
              <p className="text-[14px] text-muted-foreground max-w-lg mx-auto">
                Everything you need to know about getting started and staying secure.
              </p>
            </motion.div>
          </div>

          <div className="max-w-[700px] mx-auto space-y-3">
            {[
              { q: "Is my money safe with Zenith Pay?", a: "Absolutely. All deposits are FDIC-insured up to $5 million. We use bank-grade 256-bit encryption, biometric authentication, and real-time fraud monitoring to protect every account." },
              { q: "How fast are transfers?", a: "Most transfers arrive in under 2 seconds. We process through real-time payment rails for instant bank-to-bank transfers, 24/7 including weekends and holidays." },
              { q: "Are there any hidden fees?", a: "None. We show you the exact fee before you confirm any transaction. Transfers under $5,000 are completely free. All other charges follow standard RTP rates with no markups." },
              { q: "How do I open an account?", a: "It takes about 3 minutes. Download the app, enter your details, verify your identity with a valid ID and selfie, set up your PIN, and you're ready to go." },
              { q: "Can I use Zenith Pay for my business?", a: "Yes. Business accounts include merchant QR codes, real-time sales tracking, staff sub-accounts with role-based access, and instant settlement to your bank account." },
              { q: "What happens if I lose my phone?", a: "Your account remains secure. Biometric login means no one else can access it. You can also freeze your account instantly from any browser, and our support team is available 24/7 to help." },
              { q: "What types of bills can I pay?", a: "Electricity (all utility providers), airtime and data (all networks), cable TV (streaming TV, cable TV, digital TV), internet subscriptions, education fees, and government payments — all with instant confirmation." },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35, ease }}
                className="group rounded-2xl bg-card p-0 overflow-hidden"
                style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[14px] font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90" strokeWidth={2} />
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-[12px] text-muted-foreground">
              Still have questions?{" "}
              <Link to="/support" className="text-primary hover:underline font-semibold">Contact our support team →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-[24px] md:text-[32px] font-extrabold text-foreground tracking-[-0.02em] mb-3">
              Trusted by millions
            </h2>
            <p className="text-[14px] text-muted-foreground">Real people, real financial confidence.</p>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
              className="surface-content p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 text-warning fill-warning" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[13px] text-foreground leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <p className="text-[12px] font-bold text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 pb-20 md:pb-28">
        <div className="rounded-3xl balance-gradient p-8 md:p-14 lg:p-16 text-center relative overflow-hidden shadow-balance">
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/[0.025]" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/[0.02]" />
          <div className="absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-white/[0.01] -translate-y-1/2" />

          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-[24px] md:text-[34px] font-extrabold text-white tracking-[-0.02em] leading-tight mb-4">
              A premium way{" "}
              <br className="hidden md:block" />
              to bank every day
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed mb-8">
              Join millions of users managing their money with confidence, clarity, and complete control.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-foreground shadow-elevated hover:bg-white/95 active:scale-[0.98] transition-all">
                Open Free Account
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/15 px-8 py-4 text-[14px] font-semibold text-white hover:bg-white/[0.06] active:scale-[0.98] transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg balance-gradient">
                  <Shield className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-[13px] font-bold text-foreground">Zenith Pay</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
                A premium digital banking experience for modern users worldwide.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Transfers", "Cards", "Savings", "Bill Payments", "QR Payments", "Insights"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
              { title: "Support", links: ["Help Center", "Contact Us", "Status", "Community"] },
              { title: "Legal", links: [
                { label: "Terms of Service", to: "/terms" },
                { label: "Privacy Policy", to: "/terms" },
                { label: "Fee Schedule", to: "/terms" },
                { label: "Acceptable Use", to: "/terms" },
              ]},
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-[0.06em] mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {section.links.map((link) => {
                    const label = typeof link === "string" ? link : link.label;
                    const to = typeof link === "string" ? "#" : link.to;
                    return typeof link === "string" ? (
                      <p key={label} className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-150">{label}</p>
                    ) : (
                      <Link key={label} to={to} className="block text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150">{label}</Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))" }}>
            <p className="text-[10px] text-muted-foreground/70">
              © {new Date().getFullYear()} Zenith Pay Technologies Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-muted-foreground/80" strokeWidth={2} />
              <p className="text-[9px] text-muted-foreground/60 tracking-[0.06em]">
                FINRA LICENSED · FDIC INSURED · PCI DSS COMPLIANT
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ─── Shared Components ─── */

function FeatureLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4" style={{ backgroundColor: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.08)" }}>
      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.06em]">{text}</span>
    </div>
  );
}

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[260px] mx-auto">
      <div className="rounded-[2.5rem] bg-card shadow-premium p-2.5" style={{ border: "1px solid hsl(var(--surface-border-subtle))" }}>
        <div className="rounded-[2rem] overflow-hidden" style={{ backgroundColor: "hsl(var(--background))" }}>
          {/* Notch */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-20 h-4 rounded-full bg-foreground/5" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
