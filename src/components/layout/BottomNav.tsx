import { Home, ArrowUpDown, ScanLine, CreditCard, User, Send, QrCode, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionConfig } from "@/components/PageTransition";

const ease = motionConfig.ease;

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ArrowUpDown, label: "Payments", path: "/transfer" },
  { icon: ScanLine, label: "Pay", path: "/scan", isCenter: true },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: User, label: "Profile", path: "/profile" },
];

function pathMatchesNav(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/" || pathname === "";
  return pathname === path || pathname.startsWith(`${path}/`);
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const scanActive = location.pathname === "/scan" || location.pathname.startsWith("/scan/");

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-0 z-40 bg-background/30 backdrop-blur-[3px] lg:hidden"
          />
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-bottom">
        {/* Separator line */}
        <div className="h-px bg-border/40 dark:bg-border/60" />
        
        <div className="bg-card dark:bg-card">
          <div className="flex items-center justify-around px-2 h-[56px]">
            {navItems.map((item) => {
              const isActive = item.isCenter ? false : pathMatchesNav(location.pathname, item.path);
              const Icon = item.icon;

              if (item.isCenter) {
                return (
                  <div key={item.path} className="relative flex flex-col items-center justify-center -mt-5" ref={menuRef}>
                    {/* Arc menu */}
                    <AnimatePresence>
                      {isOpen && (
                        <>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.4, y: 16, x: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: -50 }}
                            exit={{ opacity: 0, scale: 0.4, y: 16, x: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
                            onClick={() => { setIsOpen(false); navigate("/transfer"); }}
                            className="absolute flex flex-col items-center gap-1"
                            style={{ bottom: "calc(100% + 10px)" }}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-glow">
                              <Send className="h-[15px] w-[15px] text-primary-foreground" strokeWidth={2} />
                            </div>
                            <span className="text-[9px] font-bold text-foreground tracking-wide">Send</span>
                          </motion.button>

                          <motion.button
                            initial={{ opacity: 0, scale: 0.4, y: 16, x: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 50 }}
                            exit={{ opacity: 0, scale: 0.4, y: 16, x: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5, delay: 0.03 }}
                            onClick={() => { setIsOpen(false); navigate("/scan"); }}
                            className="absolute flex flex-col items-center gap-1"
                            style={{ bottom: "calc(100% + 10px)" }}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                              <QrCode className="h-[15px] w-[15px] text-foreground" strokeWidth={2} />
                            </div>
                            <span className="text-[9px] font-bold text-foreground tracking-wide">Scan</span>
                          </motion.button>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Center button */}
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.08 }}
                      onClick={() => setIsOpen((v) => !v)}
                      className={`flex h-[48px] w-[48px] items-center justify-center rounded-2xl ring-[3px] ring-background transition-all duration-200 ease-premium interactive-focus ${
                        isOpen
                          ? "bg-secondary shadow-card"
                          : scanActive && !isOpen
                            ? "ring-primary/40 balance-gradient shadow-balance"
                            : "balance-gradient shadow-balance"
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={isOpen ? "close" : "scan"}
                          initial={{ rotate: -60, opacity: 0, scale: 0.8 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: 60, opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15, ease }}
                        >
                          {isOpen ? (
                            <X className="h-[18px] w-[18px] text-foreground" strokeWidth={2} />
                          ) : (
                            <ScanLine className="h-[18px] w-[18px] text-balance-card" strokeWidth={2} />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                    <span
                      className={`mt-0.5 text-[9px] font-semibold transition-colors duration-150 ease-premium ${
                        isOpen ? "text-muted-foreground" : "text-primary"
                      }`}
                    >
                      Pay
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] w-[56px] interactive-focus rounded-xl"
                >
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    transition={{ duration: 0.08 }}
                    className="relative"
                  >
                    <Icon
                      className={`h-[20px] w-[20px] transition-colors duration-150 ease-premium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.7}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] transition-colors duration-150 ease-premium ${
                      isActive ? "font-bold text-primary" : "font-semibold text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator — subtle bar */}
                  <motion.div
                    className="absolute -top-px left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-primary"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scaleX: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.2, ease }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
