import { Bell, Search, Lock, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActions from "@/components/dashboard/QuickActions";
import TransactionList from "@/components/dashboard/TransactionList";
import { useFavourites } from "@/contexts/FavouritesContext";
import { ProtectionSummary } from "@/components/security/SecurityUI";
import { ProtectionBanner } from "@/components/trust/TrustCopy";
import MobileDrawer, { MobileDrawerTrigger } from "@/components/layout/MobileDrawer";

const Index = () => {
  const { favouriteServices } = useFavourites();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <MobileDrawerTrigger onClick={() => setDrawerOpen(true)} />
            <div>
              <p className="text-meta">Good morning</p>
              <p className="text-[15px] font-bold text-foreground leading-tight tracking-[-0.01em]">Charlie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-primary border border-surface-border-subtle transition-colors hover:bg-surface-secondary">
              <Bell className="h-[16px] w-[16px] text-muted-foreground" strokeWidth={1.8} />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background" />
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-surface-border-subtle">
        <div>
          <h1 className="text-page-title">Welcome back, Charlie</h1>
          <p className="text-caption mt-0.5">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-2xl bg-surface-primary border border-surface-border-subtle px-4 py-2.5 hover:bg-surface-secondary transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-caption">Search transactions...</span>
          </button>
          <Link to="/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-primary border border-surface-border-subtle transition-colors hover:bg-surface-secondary">
            <Bell className="h-[17px] w-[17px] text-muted-foreground" strokeWidth={1.8} />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-5 md:px-8 md:py-8">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Main column */}
          <div>
            {/* Hero — balance card */}
            <BalanceCard />

            {/* Core actions — 4 max, no secondary row */}
            <div className="mt-7">
              <QuickActions />
            </div>

            {/* Send again — high-frequency shortcut */}
            <div className="mt-8 animate-slide-up" style={{ animationDelay: "0.12s" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-header">Send again</h3>
                <Link to="/transfer" className="section-link">See all</Link>
              </div>
              <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-1">
                {[
                  { name: "Emerson", initials: "EO" },
                  { name: "Kendall", initials: "KA" },
                  { name: "Nora", initials: "NI" },
                  { name: "Taylor", initials: "TB" },
                  { name: "Aisha", initials: "AM" },
                ].map((person) => (
                  <Link to="/transfer" key={person.name} className="flex flex-col items-center gap-2 shrink-0 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-tertiary transition-transform group-active:scale-90">
                      <span className="text-[11px] font-bold text-foreground/50">{person.initials}</span>
                    </div>
                    <span className="text-meta font-medium">{person.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="mt-8">
              <TransactionList />
            </div>
          </div>

          {/* Desktop sidebar — curated, layered */}
          <div className="hidden lg:block space-y-4 mt-1">
            {/* Insight — single contextual nudge */}
            <Link to="/insights" className="surface-interactive block p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span className="text-card-label">Insight</span>
              </div>
              <p className="text-caption">Transport spending up 23% this week — $18,400 vs $15,000 last week</p>
            </Link>

            {/* Quick services — only if user has favourites */}
            {favouriteServices.length > 0 && (
              <div className="surface-content p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-label">Your Services</h3>
                  <Link to="/services" className="section-link">All services</Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {favouriteServices.slice(0, 3).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.label} to={item.path} className="flex flex-col items-center gap-2 group">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} transition-all group-hover:scale-105 group-active:scale-[0.92]`}>
                          <Icon className={`h-[17px] w-[17px] ${item.color}`} strokeWidth={1.8} />
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground text-center truncate w-full">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Security */}
            <ProtectionSummary
              score={92}
              features={[
                { label: "Biometric", enabled: true },
                { label: "2FA", enabled: true },
                { label: "Login alerts", enabled: true },
                { label: "Tx alerts", enabled: true },
              ]}
            />
          </div>
        </div>

        {/* Mobile bottom — minimal, curated */}
        <div className="lg:hidden mt-8 space-y-3">
          {/* Single contextual insight */}
          <div className="animate-slide-up" style={{ animationDelay: "0.16s" }}>
            <Link to="/insights" className="surface-utility flex items-center gap-3.5 px-4 py-3.5 hover:bg-surface-tertiary transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl surface-inset">
                <Sparkles className="h-[15px] w-[15px] text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-card-label mb-0.5">Transport spending up 23%</p>
                <p className="text-meta">$18,400 this week vs $15,000 last week</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/15 shrink-0" />
            </Link>
          </div>

          {/* Security — compact */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/security" className="surface-utility flex items-center gap-3 px-4 py-3.5 hover:bg-surface-tertiary transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}>
                <Lock className="h-3.5 w-3.5 text-success" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <span className="text-card-label block">Account Protected</span>
                <span className="text-meta">All security features active</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/15 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Trust footer */}
        <div className="space-y-3 pt-8 pb-4">
          <ProtectionBanner />
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-3 w-3 text-muted-foreground/15" strokeWidth={2} />
            <p className="text-legal tracking-[0.12em]">
              Secured by Zenith Pay · FINRA Licensed · FDIC Insured
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
