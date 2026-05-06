import {
  Zap, Droplets, Wifi, Tv, Phone, Building2, GraduationCap, Star,
  Smartphone, Globe, CreditCard, Landmark, Shield, TrendingUp, PiggyBank, Banknote,
  Receipt, HeartPulse, Stethoscope, CalendarCheck, Bus, Plane, Hotel, ShoppingBag,
  Gamepad2, ArrowUpDown, Layers, Wallet, MapPin, ArrowDownToLine, CalendarClock, Link2, Scale,
  MonitorSmartphone, BellRing, type LucideIcon,
} from "lucide-react";

export interface ServiceItem {
  icon: LucideIcon;
  label: string;
  bg: string;
  color: string;
  path: string;
}

export interface ServiceCategory {
  title: string;
  subtitle: string;
  sectionIcon: LucideIcon;
  sectionColor: string;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Wallet tools",
    subtitle: "Funding, automation & account safety",
    sectionIcon: Wallet,
    sectionColor: "text-primary",
    items: [
      { icon: ArrowDownToLine, label: "Fund wallet", bg: "bg-primary/10", color: "text-primary", path: "/fund-wallet" },
      { icon: CalendarClock, label: "Scheduled pays", bg: "bg-accent/12", color: "text-accent-foreground", path: "/scheduled-payments" },
      { icon: Link2, label: "Request money", bg: "bg-success/10", color: "text-success", path: "/request-money" },
      { icon: Scale, label: "Disputes", bg: "bg-warning/12", color: "text-warning", path: "/disputes" },
      { icon: MonitorSmartphone, label: "Sessions", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/sessions" },
      { icon: BellRing, label: "Alert prefs", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]", path: "/notification-preferences" },
    ],
  },
  {
    title: "Transfer & Receive",
    subtitle: "Send, receive & split money",
    sectionIcon: ArrowUpDown,
    sectionColor: "text-primary",
    items: [
      { icon: Banknote, label: "Transfer", bg: "bg-primary/10", color: "text-primary", path: "/transfer" },
      { icon: Landmark, label: "Bank Transfer", bg: "bg-success/10", color: "text-success", path: "/transfer/bank" },
      { icon: Receipt, label: "Split Bill", bg: "bg-accent/12", color: "text-accent-foreground", path: "/services/split" },
      { icon: Globe, label: "Receive Link", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/services/receive" },
    ],
  },
  {
    title: "Bill Payment",
    subtitle: "Utilities, rent & subscriptions",
    sectionIcon: Layers,
    sectionColor: "text-warning",
    items: [
      { icon: Zap, label: "Electricity", bg: "bg-warning/12", color: "text-warning", path: "/services/electricity" },
      { icon: Droplets, label: "Water", bg: "bg-[hsl(200_55%_92%)]", color: "text-[hsl(200_60%_38%)]", path: "/services/water" },
      { icon: Wifi, label: "Internet", bg: "bg-primary/10", color: "text-primary", path: "/services/internet" },
      { icon: Tv, label: "Cable TV", bg: "bg-[hsl(340_55%_92%)]", color: "text-[hsl(340_60%_42%)]", path: "/services/tv" },
      { icon: Phone, label: "Postpaid", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]", path: "/services/postpaid" },
      { icon: Building2, label: "Rent", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/services/rent" },
      { icon: GraduationCap, label: "Tuition Fees", bg: "bg-accent/12", color: "text-accent-foreground", path: "/services/tuition" },
      { icon: Star, label: "Gov. Services", bg: "bg-success/10", color: "text-success", path: "/services/gov" },
    ],
  },
  {
    title: "Mobile Top-up",
    subtitle: "Airtime, data & bundles",
    sectionIcon: Smartphone,
    sectionColor: "text-[hsl(200_60%_38%)]",
    items: [
      { icon: Smartphone, label: "Airtime", bg: "bg-primary/10", color: "text-primary", path: "/services/airtime" },
      { icon: Wifi, label: "Data Top-up", bg: "bg-[hsl(200_55%_92%)]", color: "text-[hsl(200_60%_38%)]", path: "/services/data" },
      { icon: CreditCard, label: "Card Top-up", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]", path: "/services/card-topup" },
      { icon: ShoppingBag, label: "Combo Pack", bg: "bg-accent/12", color: "text-accent-foreground", path: "/services/combo" },
      { icon: Globe, label: "Roaming", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/services/roaming" },
      { icon: Gamepad2, label: "Gaming", bg: "bg-success/10", color: "text-success", path: "/services/gaming" },
    ],
  },
  {
    title: "Finance & Insurance",
    subtitle: "Loans, savings & investments",
    sectionIcon: Wallet,
    sectionColor: "text-[hsl(340_60%_42%)]",
    items: [
      { icon: Banknote, label: "Loan", bg: "bg-warning/12", color: "text-warning", path: "/services/loan" },
      { icon: Shield, label: "Insurance", bg: "bg-[hsl(200_55%_92%)]", color: "text-[hsl(200_60%_38%)]", path: "/services/insurance" },
      { icon: TrendingUp, label: "Investments", bg: "bg-success/10", color: "text-success", path: "/services/invest" },
      { icon: PiggyBank, label: "Savings", bg: "bg-[hsl(340_55%_92%)]", color: "text-[hsl(340_60%_42%)]", path: "/services/savings" },
      { icon: CreditCard, label: "Credit Card", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]", path: "/services/credit" },
      { icon: Landmark, label: "Open Account", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/services/account" },
      { icon: Receipt, label: "Expenses", bg: "bg-primary/10", color: "text-primary", path: "/services/expenses" },
      { icon: HeartPulse, label: "Health Plan", bg: "bg-accent/12", color: "text-accent-foreground", path: "/services/health-plan" },
    ],
  },
  {
    title: "Travel & Transport",
    subtitle: "Flights, buses & hotels",
    sectionIcon: MapPin,
    sectionColor: "text-[hsl(225_60%_42%)]",
    items: [
      { icon: Plane, label: "Flights", bg: "bg-[hsl(225_55%_92%)]", color: "text-[hsl(225_60%_42%)]", path: "/services/flights" },
      { icon: Bus, label: "Buses", bg: "bg-success/10", color: "text-success", path: "/services/buses" },
      { icon: Hotel, label: "Hotels", bg: "bg-warning/12", color: "text-warning", path: "/services/hotels" },
      { icon: Stethoscope, label: "Health", bg: "bg-[hsl(340_55%_92%)]", color: "text-[hsl(340_60%_42%)]", path: "/services/health" },
      { icon: CalendarCheck, label: "Booking", bg: "bg-[hsl(280_50%_92%)]", color: "text-[hsl(280_55%_42%)]", path: "/services/booking" },
    ],
  },
];

export const ALL_SERVICES: ServiceItem[] = serviceCategories.flatMap((cat) => cat.items);
