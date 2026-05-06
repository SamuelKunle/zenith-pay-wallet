import { ArrowLeft, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/states/StateUI";
import { useNotificationsDemoQuery } from "@/lib/demo/screenQueries";
import { InlineQueryError, ListRowSkeleton } from "@/components/states/AsyncContent";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type NotifCategory = "all" | "money" | "security" | "rewards";

const iconStyles: Record<string, { bg: string; color: string }> = {
  credit: { bg: "bg-success/8", color: "text-success" },
  debit: { bg: "bg-primary/8", color: "text-primary" },
  security: { bg: "bg-destructive/8", color: "text-destructive" },
  reward: { bg: "bg-warning/8", color: "text-warning" },
  savings: { bg: "bg-success/8", color: "text-success" },
  merchant: { bg: "bg-success/8", color: "text-success" },
  referral: { bg: "bg-primary/8", color: "text-primary" },
  bill: { bg: "bg-warning/8", color: "text-warning" },
  system: { bg: "bg-success/8", color: "text-success" },
  promo: { bg: "bg-accent/8", color: "text-accent" },
};

const NotificationsPage = () => {
  const reduced = usePrefersReducedMotion();
  const [category, setCategory] = useState<NotifCategory>("all");
  const [readOverride, setReadOverride] = useState<Record<string, boolean>>({});
  const query = useNotificationsDemoQuery();

  const rows = query.data ?? [];
  const augmented = rows.map((n) => ({
    ...n,
    read: readOverride[n.id] ?? n.read,
  }));

  const filtered = useMemo(() => {
    if (category === "all") return augmented;
    return augmented.filter((n) => n.category === category);
  }, [category, augmented]);

  const unreadCount = augmented.filter((n) => !n.read).length;

  const markAllRead = () => {
    const next: Record<string, boolean> = { ...readOverride };
    augmented.forEach((n) => {
      next[n.id] = true;
    });
    setReadOverride(next);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden interactive-focus min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-[10px] font-semibold text-primary px-2 py-2 rounded-lg min-h-[44px] interactive-focus"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="flex gap-2 px-5 pb-2.5 overflow-x-auto hide-scrollbar">
          {(["all", "money", "security", "rewards"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-2 min-h-[40px] text-[10px] font-semibold capitalize transition-all interactive-focus ${
                category === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
              {cat === "all" && unreadCount > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-3 md:px-8">
        {query.isPending && (
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <ListRowSkeleton rows={6} />
          </div>
        )}
        {query.isError && (
          <InlineQueryError message="Could not load alerts." onRetry={() => query.refetch()} />
        )}
        {!query.isPending &&
          !query.isError &&
          (filtered.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-7 w-7 text-muted-foreground/60" strokeWidth={1.5} />}
              title="No notifications here"
              subtitle="Try another filter or check again after wallet activity lands."
              action={{ label: "Go to inbox home", to: "/" }}
            />
          ) : (
            <div className="rounded-2xl bg-card shadow-card overflow-hidden">
              {filtered.map((n, i) => {
                const Icon = n.icon;
                const style = iconStyles[n.type] || iconStyles.system;
                return (
                  <motion.div
                    key={n.id}
                    initial={reduced ? undefined : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : i * 0.02 }}
                    className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/20 ${
                      i < filtered.length - 1 ? "border-b border-border/15" : ""
                    } ${!n.read ? "bg-primary/[0.02]" : ""}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                      <Icon className={`h-[17px] w-[17px] ${style.color}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-semibold text-foreground">{n.title}</p>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.desc}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-[9px] text-muted-foreground/80">{n.time}</p>
                        {n.actionLabel && n.actionPath && (
                          <Link
                            to={n.actionPath}
                            className="text-[9px] font-semibold text-primary py-2 min-h-[40px] inline-flex items-center interactive-focus rounded-md px-1"
                          >
                            {n.actionLabel}
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}

        <Link
          to="/notification-preferences"
          className="flex items-center justify-between mt-4 rounded-2xl bg-card shadow-card px-4 py-3.5 min-h-[52px] hover:bg-muted/15 transition-colors interactive-focus"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold text-foreground">Notification preferences</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
