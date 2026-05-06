import { Send, Download, QrCode, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { icon: Send, label: "Send", path: "/transfer", bg: "bg-primary/[0.06]", iconColor: "text-primary" },
  { icon: Download, label: "Receive", path: "/services/receive", bg: "bg-accent/[0.06]", iconColor: "text-accent" },
  { icon: QrCode, label: "Pay", path: "/scan", bg: "bg-success/[0.06]", iconColor: "text-success" },
  { icon: LayoutGrid, label: "Services", path: "/services", bg: "bg-secondary", iconColor: "text-muted-foreground" },
];

const QuickActions = () => {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.08s" }}>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${action.bg} border border-border/[0.04] transition-all duration-200 group-hover:scale-105 group-active:scale-[0.92]`}>
                <Icon className={`h-[20px] w-[20px] ${action.iconColor}`} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-foreground tracking-[-0.005em]">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
