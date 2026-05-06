import { Menu, X, Home, ArrowUpDown, CreditCard, PiggyBank, Zap, ScanLine, Shield, HelpCircle, User, Settings, TrendingUp, Gift, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionConfig } from "@/components/PageTransition";
import { useTheme } from "next-themes";

const ease = motionConfig.ease;

const mainNav = [
  { icon: Home, label: "Overview", path: "/" },
  { icon: ArrowUpDown, label: "Payments", path: "/transfer" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: Zap, label: "Services", path: "/services" },
  { icon: ScanLine, label: "Scan & Pay", path: "/scan" },
  { icon: TrendingUp, label: "Insights", path: "/insights" },
  { icon: Gift, label: "Rewards", path: "/rewards" },
];

const bottomNav = [
  { icon: Shield, label: "Security", path: "/security" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Support", path: "/support" },
  { icon: User, label: "Account", path: "/profile" },
];

export const MobileDrawerTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-primary border border-surface-border-subtle transition-colors hover:bg-surface-secondary lg:hidden"
    aria-label="Open menu"
  >
    <Menu className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={1.8} />
  </button>
);

const MobileDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => { onClose(); }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-0 z-[60] bg-background/40 backdrop-blur-[4px] lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 36, mass: 0.8 }}
            className="fixed inset-y-0 left-0 z-[61] w-[280px] bg-card shadow-xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex h-[56px] items-center justify-between px-5 border-b border-surface-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg balance-gradient">
                  <Shield className="h-[13px] w-[13px] text-balance-card" strokeWidth={2.2} />
                </div>
                <span className="text-[14px] font-bold tracking-tight text-foreground">Zenith Pay</span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Profile */}
            <div className="px-5 py-4 border-b border-surface-border-subtle">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full balance-gradient text-[11px] font-bold text-balance-card">
                  CO
                </div>
                <div>
                  <p className="text-[13px] font-bold text-foreground">Charlie Oliver</p>
                  <p className="text-[11px] font-medium text-muted-foreground">@chioma_pay</p>
                </div>
              </div>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-[0.08em] px-3 mb-1.5 block">Menu</span>
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                      active
                        ? "text-primary font-semibold bg-primary/[0.06]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                    )}
                    <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? "text-primary" : "text-muted-foreground/60"}`} strokeWidth={active ? 2 : 1.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Nav */}
            <div className="px-3 py-3 space-y-0.5 border-t border-surface-border-subtle">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-150"
                aria-label="Toggle theme"
              >
                <Sun className="h-[17px] w-[17px] shrink-0 dark:hidden" strokeWidth={1.8} />
                <Moon className="hidden h-[17px] w-[17px] shrink-0 dark:block" strokeWidth={1.8} />
                <span>Toggle Theme</span>
              </button>
              {bottomNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                      active
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? "text-primary" : "text-muted-foreground/60"}`} strokeWidth={active ? 2 : 1.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
