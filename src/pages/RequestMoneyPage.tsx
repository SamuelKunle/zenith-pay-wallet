import { ArrowLeft, Copy, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const RequestMoneyPage = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [link, setLink] = useState<string | null>(null);

  const generate = () => {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) {
      toast({ title: "Enter amount", description: "Use a positive USD amount.", variant: "destructive" });
      return;
    }
    const token = `zp_req_${Math.random().toString(36).slice(2, 10)}`;
    const href = `https://pay.zenithpay.demo/${token}`;
    setLink(href);
    toast({
      title: "Request link ready (demo)",
      description: "In production this would be a signed, expiring URL with webhook callbacks.",
    });
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Copied", description: "Share link pasted to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Select and copy manually.", variant: "destructive" });
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-2xl border-b border-surface-border-subtle">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/services" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-page-title truncate">Request money</h1>
            <p className="text-caption truncate">Payment requests & split invites</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-5">
        <DemoBanner />

        <div className="surface-content p-5 space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Link2 className="h-[20px] w-[20px] text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-foreground">Create a request link</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Payers would open this link on web or inside the Zenith Pay app. Webhooks notify you when funds settle.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="form-label pb-1.5">Amount (USD)</p>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-11 rounded-xl text-[13px] font-semibold tabular-nums"
              />
            </div>
            <div>
              <p className="form-label pb-1.5">Note</p>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Consulting invoice #1042" className="h-11 rounded-xl text-[13px] font-semibold" />
            </div>
          </div>
          <Button type="button" onClick={generate} className="w-full h-12 rounded-2xl text-[14px] font-bold">
            Generate demo link
          </Button>

          {link && (
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sharable URL</p>
              <p className="text-[12px] font-semibold text-foreground break-all">{link}</p>
              <p className="text-[11px] text-muted-foreground">Memo: {note || "None"} · Amount: ${parseFloat(amount || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <Button type="button" variant="outline" size="sm" className="w-full rounded-xl gap-2" onClick={copy}>
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default RequestMoneyPage;
