import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useInsightsDemoQuery } from "@/lib/demo/screenQueries";
import { formatUsdLineFromCents, formatUsdPosLineFromCents } from "@/lib/format/money";
import { CardStackSkeleton, InlineQueryError, LoadingListHint } from "@/components/states/AsyncContent";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const InsightsPage = () => {
  const reduced = usePrefersReducedMotion();
  const query = useInsightsDemoQuery();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const payload = query.data;

  const activeInsights = useMemo(() => {
    if (!payload) return [];
    return payload.insights.filter((i) => !dismissed.includes(i.id));
  }, [payload, dismissed]);

  const pending = query.isPending;
  const failed = query.isError;

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
          <div className="flex items-center gap-1.5 flex-1">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} />
            <h1 className="text-[15px] font-bold text-foreground">Insights</h1>
          </div>
          <span className="text-[9px] font-medium text-muted-foreground">AI-assisted</span>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-4">
        {pending && (
          <div className="rounded-2xl bg-card shadow-card overflow-hidden border border-border/20">
            <LoadingListHint label="Fetching spending intelligence…" />
            <CardStackSkeleton cards={1} />
          </div>
        )}
        {failed && (
          <InlineQueryError
            message="We couldn’t refresh insights."
            onRetry={() => query.refetch()}
          />
        )}

        {!pending && !failed && payload && (
          <>
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className="rounded-2xl bg-card shadow-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
                <h3 className="text-[12px] font-semibold text-foreground">Weekly summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-muted/20 p-3">
                  <p className="text-[9px] text-muted-foreground">Income</p>
                  <p className="text-[16px] font-bold text-success tabular-nums">
                    {formatUsdPosLineFromCents(payload.weeklyIncomeCents)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/20 p-3">
                  <p className="text-[9px] text-muted-foreground">Spent</p>
                  <p className="text-[16px] font-bold text-foreground tabular-nums">
                    {formatUsdLineFromCents(payload.weeklySpentCents)}
                  </p>
                </div>
              </div>

              <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Where your money went
              </h4>
              <div className="space-y-2">
                {payload.spendingCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className="flex items-center gap-3">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.8} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium text-foreground">{cat.label}</span>
                          <span className="text-[10px] font-semibold text-foreground tabular-nums">
                            {formatUsdLineFromCents(cat.amountCents)}
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all motion-safe-transition"
                            style={{ width: `${cat.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Smart insights
              </h3>
              {activeInsights.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center surface-content rounded-2xl">
                    <Sparkles className="h-6 w-6 text-muted-foreground/80 mb-3" strokeWidth={1.5} />
                    <p className="text-[12px] font-semibold text-foreground mb-0.5">All caught up</p>
                    <p className="text-[10px] text-muted-foreground px-6 mb-4">
                      New insights will surface as patterns emerge.
                    </p>
                    <Link
                      to="/history"
                      className="btn-primary text-center max-w-xs interactive-focus rounded-2xl min-h-[44px] inline-flex items-center justify-center px-6"
                    >
                      Review activity
                    </Link>
                  </div>
                ) : (
                  activeInsights.map((insight, i) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.id}
                        initial={reduced ? undefined : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: reduced ? 0 : 0.22, delay: reduced ? 0 : i * 0.03 }}
                        className="rounded-2xl bg-card shadow-card p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${insight.bg}`}>
                            <Icon className={`h-[16px] w-[16px] ${insight.color}`} strokeWidth={1.8} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-foreground mb-0.5">{insight.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{insight.desc}</p>
                            {insight.actionLabel && insight.actionPath && (
                              <Link
                                to={insight.actionPath}
                                className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary rounded-md interactive-focus min-h-[44px] px-1 -ml-1"
                              >
                                {insight.actionLabel}
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                          <button
                            type="button"
                            aria-label={`Dismiss insight ${insight.title}`}
                            onClick={() => setDismissed((prev) => [...prev, insight.id])}
                            className="min-h-[44px] min-w-[44px] shrink-0 flex items-center justify-center rounded-lg hover:bg-muted/30 transition-colors interactive-focus"
                          >
                            <X className="h-3 w-3 text-muted-foreground/60" strokeWidth={2} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
            </div>

            <div className="rounded-xl bg-muted/20 border border-border/10 px-4 py-3">
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Insights reflect transaction patterns only. Not financial advice; decide based on your situation.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
