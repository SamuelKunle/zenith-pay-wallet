import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import {
  ArrowLeft, Zap, Droplets, Wifi, Tv, Phone, Building2, GraduationCap, Star,
  Smartphone, Globe, CreditCard, Landmark, Shield, TrendingUp, PiggyBank, Banknote,
  Receipt, HeartPulse, Stethoscope, CalendarCheck, Bus, Plane, Hotel, ShoppingBag,
  Gamepad2, ChevronRight, CheckCircle2, Send, ShieldCheck, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

/* ─── Service type definitions ────────────────────────── */
type ServiceType = "bill" | "topup" | "finance" | "travel" | "transfer";

interface ServiceConfig {
  label: string;
  icon: LucideIcon;
  type: ServiceType;
  bg: string;
  color: string;
  providers?: string[];
  plans?: { label: string; price: string }[];
  fields?: { key: string; label: string; placeholder: string; type?: string }[];
  description?: string;
}

/* ─── All service configurations ──────────────────────── */
const services: Record<string, ServiceConfig> = {
  /* Transfer & Receive */
  split: {
    label: "Split Bill",
    icon: Receipt,
    type: "transfer",
    bg: "bg-accent/12",
    color: "text-accent-foreground",
    description: "Split expenses easily among friends and family",
    fields: [
      { key: "amount", label: "Total Amount", placeholder: "$0.00", type: "number" },
      { key: "people", label: "Number of People", placeholder: "2", type: "number" },
      { key: "note", label: "Note (optional)", placeholder: "e.g. Dinner at Bukka" },
    ],
  },
  receive: {
    label: "Receive Link",
    icon: Globe,
    type: "transfer",
    bg: "bg-[hsl(225_55%_92%)]",
    color: "text-[hsl(225_60%_42%)]",
    description: "Generate a payment link to receive money",
    fields: [
      { key: "amount", label: "Amount to Receive", placeholder: "$0.00", type: "number" },
      { key: "name", label: "Your Name", placeholder: "Enter your name" },
      { key: "note", label: "Description", placeholder: "e.g. Payment for design work" },
    ],
  },

  /* Bill Payment */
  electricity: {
    label: "Electricity",
    icon: Zap,
    type: "bill",
    bg: "bg-warning/12",
    color: "text-warning",
    providers: ["IKEDC", "EKEDC", "AEDC", "PHEDC", "KEDCO", "IBEDC", "BEDC", "JED"],
    fields: [
      { key: "meter", label: "Meter Number", placeholder: "Enter meter number" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  water: {
    label: "Water Bill",
    icon: Droplets,
    type: "bill",
    bg: "bg-[hsl(200_55%_92%)]",
    color: "text-[hsl(200_60%_38%)]",
    providers: ["London Water Corp", "FCT Water Board", "Ogun State Water", "Rivers Water"],
    fields: [
      { key: "account", label: "Account Number", placeholder: "Enter account number" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  internet: {
    label: "Internet",
    icon: Wifi,
    type: "bill",
    bg: "bg-primary/10",
    color: "text-primary",
    providers: ["Spectranet", "Smile", "Swift", "iPNX", "Tizeti", "Fiberone"],
    fields: [
      { key: "account", label: "Account / Username", placeholder: "Enter account ID" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  tv: {
    label: "Cable TV",
    icon: Tv,
    type: "bill",
    bg: "bg-[hsl(340_55%_92%)]",
    color: "text-[hsl(340_60%_42%)]",
    providers: ["streaming TV", "cable TV", "StarTimes", "ShowMax"],
    plans: [
      { label: "Basic", price: "$2,500" },
      { label: "Standard", price: "$5,500" },
      { label: "Premium", price: "$15,700" },
      { label: "Max", price: "$21,000" },
    ],
    fields: [
      { key: "smartcard", label: "Smartcard Number", placeholder: "Enter smartcard number" },
    ],
  },
  postpaid: {
    label: "Postpaid",
    icon: Phone,
    type: "bill",
    bg: "bg-[hsl(280_50%_92%)]",
    color: "text-[hsl(280_55%_42%)]",
    providers: ["Carrier Postpaid", "Airtel Postpaid", "Glo Postpaid", "9mobile Postpaid"],
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "080x xxx xxxx" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  rent: {
    label: "Rent Payment",
    icon: Building2,
    type: "bill",
    bg: "bg-[hsl(225_55%_92%)]",
    color: "text-[hsl(225_60%_42%)]",
    fields: [
      { key: "landlord", label: "Landlord / Agent Name", placeholder: "Enter name" },
      { key: "address", label: "Property Address", placeholder: "Enter address" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  tuition: {
    label: "Tuition Fees",
    icon: GraduationCap,
    type: "bill",
    bg: "bg-accent/12",
    color: "text-accent-foreground",
    providers: ["UNILAG", "UI", "OAU", "UNN", "ABU", "LASU", "FUTA", "Other"],
    fields: [
      { key: "matric", label: "Matric Number", placeholder: "Enter matric number" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  gov: {
    label: "Gov. Services",
    icon: Star,
    type: "bill",
    bg: "bg-success/10",
    color: "text-success",
    providers: ["National ID Registration", "Passport Renewal", "Drivers License", "Tax Payment", "CAC Registration"],
    fields: [
      { key: "ref", label: "Reference Number", placeholder: "Enter reference" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },

  /* Mobile Top-up */
  airtime: {
    label: "Airtime",
    icon: Smartphone,
    type: "topup",
    bg: "bg-primary/10",
    color: "text-primary",
    providers: ["Carrier", "Airtel", "Glo", "9mobile"],
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "080x xxx xxxx" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  data: {
    label: "Data Top-up",
    icon: Wifi,
    type: "topup",
    bg: "bg-[hsl(200_55%_92%)]",
    color: "text-[hsl(200_60%_38%)]",
    providers: ["Carrier", "Airtel", "Glo", "9mobile"],
    plans: [
      { label: "1GB – 30 days", price: "$500" },
      { label: "2GB – 30 days", price: "$1,000" },
      { label: "5GB – 30 days", price: "$2,000" },
      { label: "10GB – 30 days", price: "$3,500" },
    ],
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "080x xxx xxxx" },
    ],
  },
  "card-topup": {
    label: "Card Top-up",
    icon: CreditCard,
    type: "topup",
    bg: "bg-[hsl(280_50%_92%)]",
    color: "text-[hsl(280_55%_42%)]",
    fields: [
      { key: "card", label: "Card Number", placeholder: "xxxx xxxx xxxx xxxx" },
      { key: "amount", label: "Top-up Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  combo: {
    label: "Combo Pack",
    icon: ShoppingBag,
    type: "topup",
    bg: "bg-accent/12",
    color: "text-accent-foreground",
    providers: ["Carrier", "Airtel", "Glo", "9mobile"],
    plans: [
      { label: "500MB + 20min", price: "$500" },
      { label: "1.5GB + 40min", price: "$1,000" },
      { label: "3GB + 75min", price: "$2,000" },
      { label: "7GB + 150min", price: "$5,000" },
    ],
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "080x xxx xxxx" },
    ],
  },
  roaming: {
    label: "Roaming",
    icon: Globe,
    type: "topup",
    bg: "bg-[hsl(225_55%_92%)]",
    color: "text-[hsl(225_60%_42%)]",
    providers: ["Carrier", "Airtel", "Glo"],
    plans: [
      { label: "1GB Roaming – 7 days", price: "$3,000" },
      { label: "3GB Roaming – 14 days", price: "$7,500" },
      { label: "5GB Roaming – 30 days", price: "$12,000" },
    ],
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "080x xxx xxxx" },
    ],
  },
  gaming: {
    label: "Gaming",
    icon: Gamepad2,
    type: "topup",
    bg: "bg-success/10",
    color: "text-success",
    providers: ["Steam", "PlayStation", "Xbox", "Nintendo", "PUBG Mobile", "Free Fire"],
    fields: [
      { key: "id", label: "Gamer ID / Username", placeholder: "Enter ID" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
    ],
  },

  /* Finance & Insurance */
  loan: {
    label: "Loan",
    icon: Banknote,
    type: "finance",
    bg: "bg-warning/12",
    color: "text-warning",
    description: "Quick access to personal and business loans",
    plans: [
      { label: "$50,000 – 3 months", price: "$2,500/mo" },
      { label: "$100,000 – 6 months", price: "$4,200/mo" },
      { label: "$250,000 – 12 months", price: "$8,500/mo" },
    ],
    fields: [
      { key: "purpose", label: "Loan Purpose", placeholder: "e.g. Business expansion" },
    ],
  },
  insurance: {
    label: "Insurance",
    icon: Shield,
    type: "finance",
    bg: "bg-[hsl(200_55%_92%)]",
    color: "text-[hsl(200_60%_38%)]",
    providers: ["Leadway", "AXA Mansard", "Custodian", "AIICO", "Cornerstone"],
    plans: [
      { label: "Auto Insurance", price: "from $15,000/yr" },
      { label: "Health Insurance", price: "from $25,000/yr" },
      { label: "Life Insurance", price: "from $10,000/yr" },
      { label: "Travel Insurance", price: "from $5,000" },
    ],
  },
  invest: {
    label: "Investments",
    icon: TrendingUp,
    type: "finance",
    bg: "bg-success/10",
    color: "text-success",
    description: "Grow your money with smart investment options",
    plans: [
      { label: "Money Market Fund", price: "12% p.a." },
      { label: "Fixed Income", price: "15% p.a." },
      { label: "Dollar Fund", price: "8% p.a." },
      { label: "Real Estate", price: "18% p.a." },
    ],
    fields: [
      { key: "amount", label: "Investment Amount", placeholder: "$0.00", type: "number" },
    ],
  },
  savings: {
    label: "Savings",
    icon: PiggyBank,
    type: "finance",
    bg: "bg-[hsl(340_55%_92%)]",
    color: "text-[hsl(340_60%_42%)]",
    description: "Save towards your goals with flexible plans",
    plans: [
      { label: "Flex Savings", price: "8% p.a." },
      { label: "Fixed Deposit", price: "14% p.a." },
      { label: "Target Savings", price: "10% p.a." },
    ],
    fields: [
      { key: "amount", label: "Amount to Save", placeholder: "$0.00", type: "number" },
      { key: "target", label: "Savings Goal (optional)", placeholder: "e.g. New laptop" },
    ],
  },
  credit: {
    label: "Credit Card",
    icon: CreditCard,
    type: "finance",
    bg: "bg-[hsl(280_50%_92%)]",
    color: "text-[hsl(280_55%_42%)]",
    description: "Apply for a virtual or physical credit card",
    plans: [
      { label: "Basic Card", price: "$0 annual fee" },
      { label: "Gold Card", price: "$5,000/yr" },
      { label: "Platinum Card", price: "$15,000/yr" },
    ],
  },
  account: {
    label: "Open Account",
    icon: Landmark,
    type: "finance",
    bg: "bg-[hsl(225_55%_92%)]",
    color: "text-[hsl(225_60%_42%)]",
    description: "Open a new savings or current account",
    fields: [
      { key: "name", label: "Full Name", placeholder: "Enter your full name" },
      { key: "bvn", label: "IDV", placeholder: "Enter your IDV" },
      { key: "type", label: "Account Type", placeholder: "Savings or Current" },
    ],
  },
  expenses: {
    label: "Expenses",
    icon: Receipt,
    type: "finance",
    bg: "bg-primary/10",
    color: "text-primary",
    description: "Track and manage your expenses by category",
    fields: [
      { key: "category", label: "Category", placeholder: "e.g. Food, Transport" },
      { key: "amount", label: "Amount", placeholder: "$0.00", type: "number" },
      { key: "note", label: "Note", placeholder: "What was this for?" },
    ],
  },
  "health-plan": {
    label: "Health Plan",
    icon: HeartPulse,
    type: "finance",
    bg: "bg-accent/12",
    color: "text-accent-foreground",
    providers: ["Hygeia", "Leadway Health", "Reliance HMO", "AXA Mansard Health"],
    plans: [
      { label: "Basic Plan", price: "$25,000/yr" },
      { label: "Standard Plan", price: "$60,000/yr" },
      { label: "Premium Plan", price: "$120,000/yr" },
    ],
  },

  /* Travel & Transport */
  flights: {
    label: "Flights",
    icon: Plane,
    type: "travel",
    bg: "bg-[hsl(225_55%_92%)]",
    color: "text-[hsl(225_60%_42%)]",
    description: "Search and book domestic & international flights",
    fields: [
      { key: "from", label: "From", placeholder: "e.g. London (LOS)" },
      { key: "to", label: "To", placeholder: "e.g. New York (ABV)" },
      { key: "date", label: "Travel Date", placeholder: "DD/MM/YYYY" },
      { key: "passengers", label: "Passengers", placeholder: "1", type: "number" },
    ],
  },
  buses: {
    label: "Buses",
    icon: Bus,
    type: "travel",
    bg: "bg-success/10",
    color: "text-success",
    providers: ["GIG Motors", "ABC Transport", "Peace Mass", "Chisco", "God is Good"],
    fields: [
      { key: "from", label: "From", placeholder: "e.g. London" },
      { key: "to", label: "To", placeholder: "e.g. Benin" },
      { key: "date", label: "Travel Date", placeholder: "DD/MM/YYYY" },
    ],
  },
  hotels: {
    label: "Hotels",
    icon: Hotel,
    type: "travel",
    bg: "bg-warning/12",
    color: "text-warning",
    description: "Find and book hotels at the best rates",
    fields: [
      { key: "location", label: "Location", placeholder: "e.g. London Island" },
      { key: "checkin", label: "Check-in Date", placeholder: "DD/MM/YYYY" },
      { key: "checkout", label: "Check-out Date", placeholder: "DD/MM/YYYY" },
      { key: "guests", label: "Guests", placeholder: "1", type: "number" },
    ],
  },
  health: {
    label: "Health",
    icon: Stethoscope,
    type: "travel",
    bg: "bg-[hsl(340_55%_92%)]",
    color: "text-[hsl(340_60%_42%)]",
    providers: ["Telemedicine", "Lab Tests", "Pharmacy", "Hospital Finder"],
    description: "Access healthcare services on the go",
    fields: [
      { key: "service", label: "Service Type", placeholder: "Select a service" },
    ],
  },
  booking: {
    label: "Booking",
    icon: CalendarCheck,
    type: "travel",
    bg: "bg-[hsl(280_50%_92%)]",
    color: "text-[hsl(280_55%_42%)]",
    description: "Book events, appointments and experiences",
    fields: [
      { key: "event", label: "Event / Service", placeholder: "What are you booking?" },
      { key: "date", label: "Preferred Date", placeholder: "DD/MM/YYYY" },
      { key: "people", label: "Number of People", placeholder: "1", type: "number" },
    ],
  },
};

/* ─── Component ───────────────────────────────────────── */
const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const config = serviceId ? services[serviceId] : null;

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-foreground">Service not found</p>
          <Link to="/services" className="text-primary font-semibold text-sm">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  const handleSubmit = () => {
    setSubmitted(true);
    toast({
      title: "Request Submitted",
      description: `Your ${config.label} request has been submitted successfully.`,
    });
  };

  const updateField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  /* CTA label by type */
  const ctaLabels: Record<ServiceType, { label: string; icon: typeof Send }> = {
    bill: { label: "Pay Now", icon: Send },
    topup: { label: "Top Up Now", icon: Send },
    finance: { label: "Submit Application", icon: ShieldCheck },
    travel: { label: "Search & Book", icon: Send },
    transfer: { label: "Send Now", icon: Send },
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-scale-in max-w-xs mx-auto">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-success/10 animate-pulse-soft" />
            <div className="absolute inset-2 rounded-full bg-success/5 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.6} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Success!</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Your <span className="font-bold text-foreground">{config.label}</span> request has been submitted and is being processed.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border/50 p-4 shadow-elevated text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-extrabold text-foreground">{config.label}</p>
                <p className="text-[11px] text-muted-foreground">Transaction pending</p>
              </div>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Status</span>
              <span className="text-[11px] font-bold text-warning bg-warning/10 px-2.5 py-1 rounded-full">Processing</span>
            </div>
            {formValues.amount && (
              <>
                <div className="h-px bg-border/40" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Amount</span>
                  <span className="text-[14px] font-extrabold text-foreground">${Number(formValues.amount).toLocaleString()}</span>
                </div>
              </>
            )}
            {selectedProvider && (
              <>
                <div className="h-px bg-border/40" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Provider</span>
                  <span className="text-[12px] font-bold text-foreground">{selectedProvider}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-1">
            <Button onClick={() => { setSubmitted(false); setSelectedProvider(null); setSelectedPlan(null); setFormValues({}); }} className="w-full rounded-2xl h-[52px] font-extrabold text-[15px] balance-gradient text-white shadow-balance border-0">
              Make Another Request
            </Button>
            <Link
              to="/services"
              className="text-[13px] font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const typeLabels: Record<ServiceType, string> = {
    bill: "Bill Payment",
    topup: "Mobile Top-up",
    finance: "Finance",
    travel: "Travel & Transport",
    transfer: "Transfer",
  };

  const CtaIcon = ctaLabels[config.type].icon;

  return (
    <PageTransition className="min-h-screen bg-background pb-52">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-2xl border-b border-border/30">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/services" className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary transition-colors active:scale-95">
            <ArrowLeft className="h-5 w-5 text-foreground" strokeWidth={2} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-extrabold text-foreground tracking-tight truncate">{config.label}</h1>
            <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">{typeLabels[config.type]}</p>
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.bg}`}>
            <Icon className={`h-[18px] w-[18px] ${config.color}`} strokeWidth={1.8} />
          </div>
        </div>
      </header>

      <div className="px-5 mt-5 space-y-5 animate-slide-up">
        {/* Premium hero banner */}
        <div className="relative overflow-hidden rounded-2xl balance-gradient p-5 shadow-balance">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/[0.04] translate-y-1/2 -translate-x-1/4" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Icon className="h-7 w-7 text-white" strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-extrabold text-white tracking-tight">{config.label}</h2>
              {config.description ? (
                <p className="text-[12px] text-white/70 mt-0.5 leading-relaxed">{config.description}</p>
              ) : (
                <p className="text-[12px] text-white/70 mt-0.5 leading-relaxed">
                  Quick, secure {config.label.toLowerCase()} in seconds.
                </p>
              )}
            </div>
          </div>
          {/* Security badge */}
          <div className="relative flex items-center gap-1.5 mt-4 pt-3 border-t border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-white/50" strokeWidth={2} />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">256-bit encrypted • Instant processing</span>
          </div>
        </div>

        {/* Provider selection */}
        {config.providers && config.providers.length > 0 && (
          <div className="rounded-2xl bg-card border border-border/40 shadow-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h3 className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                Select Provider
              </h3>
              <span className="ml-auto text-[10px] font-bold text-muted-foreground/80 bg-secondary px-2 py-0.5 rounded-full">{config.providers.length} available</span>
            </div>
            <div className="px-4 pb-5">
              <div className="grid grid-cols-2 gap-2.5">
                {config.providers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedProvider(p)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.97] ${
                      selectedProvider === p
                        ? "border-primary bg-primary/[0.06] shadow-glow"
                        : "border-border/30 bg-secondary/40 hover:border-primary/20 hover:bg-secondary/60"
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-[12px] font-extrabold ${config.bg} ${config.color}`}>
                      {p.charAt(0)}
                    </div>
                    <span className="text-[12px] font-bold text-foreground truncate flex-1">{p}</span>
                    {selectedProvider === p && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" strokeWidth={2.2} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans selection */}
        {config.plans && config.plans.length > 0 && (
          <div className="rounded-2xl bg-card border border-border/40 shadow-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h3 className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                Select Plan
              </h3>
            </div>
            <div className="px-4 pb-5 space-y-2">
              {config.plans.map((plan) => (
                <button
                  key={plan.label}
                  onClick={() => setSelectedPlan(plan.label)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                    selectedPlan === plan.label
                      ? "border-primary bg-primary/[0.06] shadow-glow"
                      : "border-border/30 bg-secondary/40 hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedPlan === plan.label ? (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20" />
                    )}
                    <span className="text-[13px] font-bold text-foreground">{plan.label}</span>
                  </div>
                  <span className={`text-[13px] font-extrabold ${selectedPlan === plan.label ? "text-primary" : "text-muted-foreground"}`}>
                    {plan.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form fields */}
        {config.fields && config.fields.length > 0 && (
          <div className="rounded-2xl bg-card border border-border/40 shadow-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h3 className="text-[12px] font-extrabold text-foreground uppercase tracking-widest">
                Enter Details
              </h3>
            </div>
            <div className="px-5 pb-5 space-y-4">
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide pl-0.5">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formValues[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full h-[52px] px-4 rounded-xl bg-secondary/50 border-2 border-border/30 text-[14px] font-semibold text-foreground placeholder:text-muted-foreground/35 focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-card transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA — positioned above bottom nav */}
      <div className="fixed bottom-[100px] left-0 right-0 z-40 md:bottom-4 px-5">
        <Button
          onClick={handleSubmit}
          className="w-full h-[52px] rounded-2xl text-[15px] font-extrabold tracking-tight balance-gradient text-white border-0 shadow-balance hover:opacity-95 active:scale-[0.98] transition-all duration-200"
          size="lg"
        >
          <CtaIcon className="h-5 w-5 mr-2" strokeWidth={2} />
          {ctaLabels[config.type].label}
        </Button>
      </div>
    </PageTransition>
  );
};

export default ServiceDetailPage;
