import { ArrowLeft, ChevronRight, User, Shield, CreditCard, Building2, Bell, HelpCircle, LogOut, Smartphone, Globe, FileText, Briefcase, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Personal Information", sub: "Name, email, phone", bg: "bg-primary/10", color: "text-primary" },
      { icon: Shield, label: "Security", sub: "PIN, biometrics, password", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]" },
      { icon: FileText, label: "KYC Status", sub: "Fully Verified", badge: "Verified", bg: "bg-success/10", color: "text-success" },
      { icon: Building2, label: "Bank Accounts", sub: "2 accounts linked", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]" },
      { icon: CreditCard, label: "Cards", sub: "No cards added", bg: "bg-accent/12", color: "text-accent-foreground" },
    ],
  },
  {
    title: "Business",
    items: [
      { icon: Briefcase, label: "Switch to Business", sub: "Manage your merchant account", bg: "bg-[hsl(340_55%_92%)]", color: "text-[hsl(340_60%_42%)]" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Settings, label: "Settings", sub: "Theme, notifications, security", bg: "bg-primary/10", color: "text-primary", path: "/settings" },
      { icon: Bell, label: "Notifications", sub: "Push, email, SMS", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]" },
      { icon: Smartphone, label: "Device Management", sub: "1 active device", bg: "bg-secondary", color: "text-secondary-foreground" },
      { icon: Globe, label: "Language", sub: "English", bg: "bg-secondary", color: "text-secondary-foreground" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", sub: "FAQs, live chat, tickets", bg: "bg-secondary", color: "text-secondary-foreground" },
    ],
  },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-page-title">Profile</h1>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-5">
        {/* Profile card */}
        <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full balance-gradient text-lg font-extrabold text-white shadow-glow">
            CO
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[16px] font-extrabold text-foreground">Charlie Oliver</p>
              <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold text-success uppercase tracking-[0.04em]"
                style={{ backgroundColor: "hsl(var(--success) / 0.06)" }}>Tier 3</span>
            </div>
            <p className="text-[13px] font-semibold text-primary">@chioma_pay</p>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">chioma@email.com · IDV Verified</p>
          </div>
          <ChevronRight className="h-5 w-5 text-foreground/25" />
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={section.title} className="space-y-2 animate-slide-up" style={{ animationDelay: `${si * 0.05}s` }}>
            <h3 className="section-header">{section.title}</h3>
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
                  {section.items.map((item, i) => {
                    const Icon = item.icon;
                    const Wrapper = "path" in item && item.path ? Link : "button" as any;
                    const wrapperProps = "path" in item && item.path ? { to: item.path } : {};
                    return (
                      <Wrapper
                        key={item.label}
                        {...wrapperProps}
                        className={`flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/40 transition-colors ${
                          i < section.items.length - 1 ? "border-b border-border/50" : ""
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                          <Icon className={`h-[18px] w-[18px] ${item.color}`} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[13px] font-bold text-foreground">{item.label}</p>
                          <p className="text-[11px] font-medium text-muted-foreground">{item.sub}</p>
                        </div>
                        {"badge" in item && item.badge && (
                          <span className="rounded-full bg-fintech-chip-success-bg px-2.5 py-0.5 text-[10px] font-bold text-fintech-chip-success-text">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-foreground/20" />
                      </Wrapper>
                    );
                  })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 w-full shadow-card hover:bg-destructive/5 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <LogOut className="h-[18px] w-[18px] text-destructive" strokeWidth={1.8} />
          </div>
          <span className="text-[13px] font-bold text-destructive">Sign Out</span>
        </button>

        <p className="text-center text-[10px] font-semibold text-foreground/25 py-4 tracking-wide tabular-nums" style={{ fontFeatureSettings: '"tnum" 1' }}>PAYNAIJA v1.0.0 · LAGOS, NIGERIA · FINRA LICENSED</p>
      </div>
    </div>
  );
};

export default ProfilePage;
