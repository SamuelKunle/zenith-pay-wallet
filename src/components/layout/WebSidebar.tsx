import { Home, ArrowUpDown, ScanLine, User, HelpCircle, Shield, CreditCard, PiggyBank, Zap, PanelLeftClose, PanelLeft, Settings, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useSidebarState } from "@/contexts/SidebarContext";
import { useTheme } from "next-themes";

const mainNav = [
  { icon: Home, label: "Overview", path: "/" },
  { icon: ArrowUpDown, label: "Payments", path: "/transfer" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: Zap, label: "Services", path: "/services" },
  { icon: ScanLine, label: "Scan & Pay", path: "/scan" },
];

const bottomNav = [
  { icon: Shield, label: "Security", path: "/security" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Support", path: "/support" },
  { icon: User, label: "Account", path: "/profile" },
];

const WebSidebar = () => {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebarState();
  const { theme, setTheme } = useTheme();

  const renderLink = (item: typeof mainNav[0]) => {
    const isActive = item.path === "/"
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);
    const Icon = item.icon;

    const link = (
      <Link
        to={item.path}
        className={`interactive-focus group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-premium ${
          collapsed ? "justify-center" : ""
        } ${
          isActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
        }`}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
        )}
        <Icon className={`h-[17px] w-[17px] shrink-0 transition-colors duration-150 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`} strokeWidth={isActive ? 2 : 1.5} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-[12px] font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.path}>{link}</div>;
  };

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-card z-40 transition-all duration-250 ease-premium ${
          collapsed ? "lg:w-[64px]" : "lg:w-[252px]"
        }`}
        style={{ borderRight: "1px solid hsl(var(--surface-border-subtle))" }}
      >
        {/* Logo + collapse */}
        <div className={`flex h-[56px] items-center ${collapsed ? "justify-center px-2" : "justify-between px-4"}`} style={{ borderBottom: "1px solid hsl(var(--surface-border-subtle))" }}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg balance-gradient">
              <Shield className="h-[13px] w-[13px] text-balance-card" strokeWidth={2.2} />
            </div>
            {!collapsed && (
              <span className="text-[14px] font-bold tracking-tight text-foreground">Zenith Pay</span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/80 hover:text-foreground hover:bg-muted/30 transition-all duration-150"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-muted/30 transition-all duration-150"
                  aria-label="Expand sidebar"
                >
                  <PanelLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[12px] font-medium">Expand</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto hide-scrollbar">
          {!collapsed && (
            <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.08em] px-3 mb-1.5 block">Menu</span>
          )}
          {mainNav.map((item) => renderLink(item))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-3 space-y-0.5" style={{ borderTop: "1px solid hsl(var(--surface-border-subtle))" }}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="group relative flex w-full items-center justify-center rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-150 ease-premium"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-[17px] w-[17px] shrink-0 dark:hidden" strokeWidth={1.8} />
                  <Moon className="hidden h-[17px] w-[17px] shrink-0 dark:block" strokeWidth={1.8} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[12px] font-medium">
                Toggle theme
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-150 ease-premium"
              aria-label="Toggle theme"
            >
              <Sun className="h-[17px] w-[17px] shrink-0 dark:hidden" strokeWidth={1.8} />
              <Moon className="hidden h-[17px] w-[17px] shrink-0 dark:block" strokeWidth={1.8} />
              <span className="truncate">Toggle Theme</span>
            </button>
          )}
          {bottomNav.map((item) => renderLink(item))}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default WebSidebar;
