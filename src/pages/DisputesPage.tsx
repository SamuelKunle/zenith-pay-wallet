import { ArrowLeft, ClipboardList, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { IntegrationReadinessBanner } from "@/components/integration/IntegrationReadinessBanner";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useDisputesDemoQuery } from "@/lib/demo/screenQueries";
import { formatUsdLineFromCents } from "@/lib/format/money";
import { InlineQueryError, ListRowSkeleton } from "@/components/states/AsyncContent";

const DisputesPage = () => {
  const query = useDisputesDemoQuery();

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link
            to="/services"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors interactive-focus min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-page-title truncate">Dispute center</h1>
            <p className="text-caption truncate">Chargebacks & transaction issues</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-5">
        <IntegrationReadinessBanner />

        <Button
          type="button"
          variant="secondary"
          className="w-full h-11 min-h-[44px] rounded-2xl text-[13px] font-bold gap-2 justify-center interactive-focus"
          onClick={() =>
            toast({
              title: "Opening dispute intake",
              description: "Attach transaction IDs and evidence from your dispute API when wired.",
            })
          }
        >
          <MessageCircle className="h-4 w-4" />
          Open dispute from activity
        </Button>

        {query.isPending && (
          <div className="surface-content overflow-hidden">
            <ListRowSkeleton rows={4} />
          </div>
        )}
        {query.isError && (
          <InlineQueryError
            message="Could not load disputes."
            onRetry={() => query.refetch()}
          />
        )}
        {!query.isPending &&
          !query.isError &&
          query.data?.map((c) => (
            <article key={c.id} className="surface-content p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <ClipboardList className="h-[17px] w-[17px] text-foreground/70" strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground leading-snug">{c.title}</p>
                  <p className="text-meta mt-1">
                    {c.id} · {formatUsdLineFromCents(c.amountCents)} · Opened {c.opened}
                  </p>
                  <span
                    className={`inline-flex mt-2 rounded-full px-2.5 py-0.5 text-status font-bold uppercase ${
                      c.status === "resolved" ? "chip-success" : "chip-pending"
                    }`}
                  >
                    {c.status === "resolved" ? "Resolved" : "Investigating"}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-muted/40 border border-border/40 p-3 space-y-2">
                {c.updates.map((u, i) => (
                  <p key={i} className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                    • {u}
                  </p>
                ))}
              </div>
            </article>
          ))}
      </div>
    </PageTransition>
  );
};

export default DisputesPage;
