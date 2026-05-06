import { useState } from "react";
import { ArrowLeft, Search, ChevronRight, HelpCircle, MessageSquare, Phone, AlertTriangle, Clock, CheckCircle2, FileText, Send, Shield, CreditCard, ArrowUpDown, User, Smartphone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SuccessState, EmptyState } from "@/components/states/StateUI";
import { StatusTimeline, SupportShortcut, InlineTrustLabel } from "@/components/trust/TrustCopy";

const faqCategories = [
  { icon: ArrowUpDown, label: "Transfers", count: 12 },
  { icon: CreditCard, label: "Cards", count: 8 },
  { icon: Shield, label: "Security", count: 6 },
  { icon: User, label: "Account", count: 10 },
  { icon: Smartphone, label: "App & Login", count: 5 },
];

const popularFaqs = [
  { q: "How long do bank transfers take?", a: "Transfers to global banks typically arrive within seconds to 5 minutes. In rare cases, processing may take up to 24 hours." },
  { q: "How do I reset my transaction PIN?", a: "Go to Security Center → Change PIN. You'll need to verify your identity through biometrics before setting a new PIN." },
  { q: "What are the transfer fees?", a: "Transfers under $5,000 cost $10. Under $50,000 cost $25. Above $50,000 cost $50. Wallet-to-wallet transfers are free." },
  { q: "How do I freeze my account?", a: "Open the Security Center and toggle 'Freeze Account'. All transactions will be immediately blocked. You can unfreeze at any time." },
];

const mockTickets = [
  { id: "TK-2024-001", subject: "Transfer not received", status: "under_review" as const, date: "Mar 15, 2026", lastUpdate: "Investigating with recipient bank" },
  { id: "TK-2024-002", subject: "Duplicate charge on card", status: "resolved" as const, date: "Mar 12, 2026", lastUpdate: "Refund of $12,450 processed" },
];

const ticketStatuses = {
  submitted: { label: "Submitted", color: "text-muted-foreground", bg: "bg-secondary" },
  under_review: { label: "Under Review", color: "text-warning", bg: "bg-warning/8" },
  action_needed: { label: "Action Needed", color: "text-accent", bg: "bg-accent/8" },
  resolved: { label: "Resolved", color: "text-success", bg: "bg-success/8" },
};

type SupportTab = "help" | "tickets" | "contact";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<SupportTab>("help");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [disputeStep, setDisputeStep] = useState<"none" | "type" | "details" | "submitted">("none");

  const tabs = [
    { id: "help" as const, label: "Help Center" },
    { id: "tickets" as const, label: "My Tickets" },
    { id: "contact" as const, label: "Contact" },
  ];

  // --- Dispute submission flow ---
  if (disputeStep === "submitted") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <SuccessState
          title="Issue Submitted"
          subtitle="We'll investigate and get back to you within 24 hours."
          action={{ label: "Done", onClick: () => setDisputeStep("none") }}
        >
          <div className="surface-content p-4 w-full space-y-2 text-left">
            <DetailRow label="Ticket ID" value="TK-2024-003" />
            <DetailRow label="Status" value="Submitted" />
            <DetailRow label="Expected response" value="Within 24 hours" />
          </div>
          <div className="w-full mt-3">
            <StatusTimeline steps={[
              { label: "Issue submitted", detail: "We've received your report", status: "complete", time: "Just now" },
              { label: "Under review", detail: "Our team will investigate", status: "active" },
              { label: "Resolution", detail: "You'll be notified when resolved", status: "pending" },
            ]} />
          </div>
          <InlineTrustLabel icon="shield" label="Your issue is being handled securely" variant="success" className="mt-2" />
        </SuccessState>
      </div>
    );
  }

  if (disputeStep === "details") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setDisputeStep("type")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">Describe the Issue</h1>
          </div>
        </header>
        <div className="px-5 py-5 form-section">
          <div className="form-group">
            <label className="form-label">Transaction reference (optional)</label>
            <input type="text" placeholder="e.g., TXN-2024-A8F3K9" className="input-premium" />
          </div>
          <div className="form-group">
            <label className="form-label">Describe what happened</label>
            <textarea rows={4} placeholder="Tell us what went wrong..."
              className="input-premium resize-none" />
          </div>
          <div className="form-group">
            <label className="form-label">Attach evidence (optional)</label>
            <button className="w-full rounded-xl border border-dashed border-border/30 bg-card py-6 text-[12px] text-muted-foreground hover:bg-muted/10 transition-colors">
              Tap to upload screenshot or document
            </button>
          </div>
          <button onClick={() => setDisputeStep("submitted")} className="btn-primary mt-2">
            Submit Issue
          </button>
        </div>
      </div>
    );
  }

  if (disputeStep === "type") {
    const issueTypes = [
      { label: "Transfer not received", icon: ArrowUpDown },
      { label: "Wrong amount charged", icon: CreditCard },
      { label: "Unauthorized transaction", icon: AlertTriangle },
      { label: "Failed but money deducted", icon: Clock },
      { label: "Card dispute", icon: CreditCard },
      { label: "Other issue", icon: HelpCircle },
    ];
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button onClick={() => setDisputeStep("none")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60">
              <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
            </button>
            <h1 className="text-[15px] font-bold text-foreground">What went wrong?</h1>
          </div>
        </header>
        <div className="px-5 py-4 space-y-2">
          <p className="text-[12px] text-muted-foreground mb-2">Select the type of issue you're experiencing</p>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            {issueTypes.map((type, i) => {
              const Icon = type.icon;
              return (
                <button key={type.label} onClick={() => setDisputeStep("details")}
                  className={`flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/15 transition-colors ${
                    i < issueTypes.length - 1 ? "border-b border-border/15" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13px] font-semibold text-foreground flex-1 text-left">{type.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-[15px] font-bold text-foreground">Help & Support</h1>
        </div>
        <div className="flex gap-1 px-5 pb-2.5">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                activeTab === tab.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-4 md:px-8 space-y-4">
        {activeTab === "help" && (
          <>
            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="input-search"
            >
              <Search className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
              <input type="text" placeholder="Search for help..." />
            </motion.div>

            {/* Dispute shortcut */}
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
              onClick={() => setDisputeStep("type")}
              className="w-full rounded-2xl bg-destructive/[0.04] border border-destructive/10 p-4 flex items-center gap-3 hover:bg-destructive/[0.06] transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/8">
                <AlertTriangle className="h-[18px] w-[18px] text-destructive" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">Report an issue</p>
                <p className="text-[11px] text-muted-foreground">Dispute a transaction or report fraud</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </motion.button>

            {/* Categories */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Browse by Topic</h3>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.label} className="flex items-center gap-2 shrink-0 rounded-xl bg-card shadow-card border border-border/10 px-3.5 py-2.5 hover:bg-muted/15 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                      <span className="text-[12px] font-semibold text-foreground">{cat.label}</span>
                      <span className="text-[10px] text-muted-foreground">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Popular FAQs */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Common Questions</h3>
              <div className="rounded-2xl bg-card shadow-card overflow-hidden">
                {popularFaqs.map((faq, i) => (
                  <div key={i} className={i < popularFaqs.length - 1 ? "border-b border-border/15" : ""}>
                    <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/10 transition-colors text-left"
                    >
                      <span className="text-[13px] font-semibold text-foreground flex-1">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground/70 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        className="px-4 pb-3.5"
                      >
                        <p className="text-[12px] text-muted-foreground leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-3">
            {mockTickets.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-7 w-7 text-muted-foreground/80" strokeWidth={1.5} />}
                title="No tickets yet"
                subtitle="When you report an issue, it will appear here"
              />
            ) : (
              mockTickets.map((ticket, i) => {
                const status = ticketStatuses[ticket.status];
                return (
                  <motion.div key={ticket.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="rounded-2xl bg-card shadow-card p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{ticket.subject}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.id} · {ticket.date}</p>
                      </div>
                      <span className={`rounded-full ${status.bg} px-2 py-0.5 text-[10px] font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted/30 px-3 py-2 mb-2">
                      <p className="text-[11px] text-muted-foreground">{ticket.lastUpdate}</p>
                    </div>
                    <InlineTrustLabel
                      icon={ticket.status === "resolved" ? "check" : "clock"}
                      label={ticket.status === "resolved" ? "Issue resolved" : "Being investigated"}
                      variant={ticket.status === "resolved" ? "success" : "neutral"}
                    />
                  </motion.div>
                );
              })
            )}
            <button onClick={() => setDisputeStep("type")}
              className="w-full rounded-2xl border border-border/20 bg-card py-3.5 text-[13px] font-semibold text-primary hover:bg-muted/15 transition-colors">
              Report a New Issue
            </button>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-3">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card shadow-card overflow-hidden"
            >
              <button className="flex items-center gap-3 px-4 py-4 w-full hover:bg-muted/15 transition-colors border-b border-border/15">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                  <MessageSquare className="h-[18px] w-[18px] text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-foreground">Live Chat</p>
                  <p className="text-[11px] text-muted-foreground">Typically replies within 5 minutes</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
              </button>
              <button className="flex items-center gap-3 px-4 py-4 w-full hover:bg-muted/15 transition-colors border-b border-border/15">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(225_50%_95%)]">
                  <Phone className="h-[18px] w-[18px] text-[hsl(225_55%_45%)]" strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-foreground">Call Support</p>
                  <p className="text-[11px] text-muted-foreground">Mon–Fri, 8AM–8PM WAT</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
              </button>
              <button className="flex items-center gap-3 px-4 py-4 w-full hover:bg-muted/15 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Send className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-foreground">Email Support</p>
                  <p className="text-[11px] text-muted-foreground">support@zenith-pay.com</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
              </button>
            </motion.div>

            {/* Emergency */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
              className="rounded-2xl bg-destructive/[0.04] border border-destructive/10 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" strokeWidth={2} />
                <h3 className="text-[13px] font-bold text-foreground">Emergency?</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">
                If you suspect fraud or unauthorized access, freeze your account immediately.
              </p>
              <Link to="/security" className="block w-full rounded-xl bg-destructive py-3 text-center text-[13px] font-bold text-destructive-foreground hover:opacity-95 transition-opacity">
                Go to Security Center
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default SupportPage;
