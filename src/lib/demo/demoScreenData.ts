import type { LucideIcon } from "lucide-react";
import { formatUsdLineFromCents } from "@/lib/format/money";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Gift,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Car,
  Home as HomeIcon,
  PiggyBank,
  ShoppingBag,
  Utensils,
} from "lucide-react";

export interface InsightCardModel {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
  actionLabel?: string;
  actionPath?: string;
}

export interface SpendingCatModel {
  icon: LucideIcon;
  label: string;
  amountCents: number;
  pct: number;
}

export interface InsightsDemoPayload {
  weeklyIncomeCents: number;
  weeklySpentCents: number;
  spendingCategories: SpendingCatModel[];
  insights: InsightCardModel[];
}

export const insightsDemoPayload: InsightsDemoPayload = {
  /** Intentionally large “premium demo” scale; all values are USD cents. */
  weeklyIncomeCents: 28_500_000,
  /** Equals sum of `spendingCategories` amounts below (weekly spend breakdown). */
  weeklySpentCents: 14_140_000,
  spendingCategories: [
    { icon: Utensils, label: "Food & Dining", amountCents: 4_520_000, pct: 32 },
    { icon: Car, label: "Transport", amountCents: 1_840_000, pct: 13 },
    { icon: ShoppingBag, label: "Shopping", amountCents: 6_200_000, pct: 44 },
    { icon: HomeIcon, label: "Bills & Utilities", amountCents: 1_580_000, pct: 11 },
  ],
  insights: [
    {
      id: "1",
      icon: TrendingUp,
      title: "Transport spending up 23%",
      desc: "You spent $18,400 on transport this week vs $15,000 last week.",
      color: "text-warning",
      bg: "bg-warning/8",
      actionLabel: "View breakdown",
      actionPath: "/history",
    },
    {
      id: "2",
      icon: Zap,
      title: "Utility bill likely due",
      desc: "Based on your history, your electric bill payment is usually around this time.",
      color: "text-primary",
      bg: "bg-primary/8",
      actionLabel: "Pay now",
      actionPath: "/services/electricity",
    },
    {
      id: "3",
      icon: PiggyBank,
      title: "Savings goal almost there",
      desc: "You're 80% towards your laptop fund. $1,000.00 more to reach your target.",
      color: "text-success",
      bg: "bg-success/8",
      actionLabel: "Top up",
      actionPath: "/savings",
    },
    {
      id: "4",
      icon: CreditCard,
      title: "Card unused this month",
      desc: "Your virtual card hasn't been used in 14 days. Consider freezing it for safety.",
      color: "text-muted-foreground",
      bg: "bg-secondary",
      actionLabel: "Manage card",
      actionPath: "/cards",
    },
    {
      id: "5",
      icon: TrendingDown,
      title: "Spending decreased",
      desc: "Your overall spending is down 12% this month. Strong financial discipline.",
      color: "text-success",
      bg: "bg-success/8",
    },
  ],
};

export interface DisputeCaseModel {
  id: string;
  title: string;
  amountCents: number;
  status: "investigating" | "resolved";
  opened: string;
  updates: string[];
}

export const disputesDemoCases: DisputeCaseModel[] = [
  {
    id: "DSP-9281",
    title: "Duplicate merchant charge · Coffee chain",
    amountCents: 1242,
    status: "investigating",
    opened: "Mar 06, 2026",
    updates: [
      "Mar 06 — Case opened automatically from transaction feed.",
      "Mar 07 — ARN requested from acquirer network.",
    ],
  },
  {
    id: "DSP-9174",
    title: "Failed bill payment reversal",
    amountCents: 89_00,
    status: "resolved",
    opened: "Feb 19, 2026",
    updates: [
      "Feb 19 — User submitted evidence screenshots.",
      "Feb 22 — Provisional credit posted.",
      "Mar 02 — Resolved in user's favor.",
    ],
  },
];

export interface NotifDemoRow {
  id: string;
  type: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  category: "money" | "security" | "rewards";
  actionLabel?: string;
  actionPath?: string;
}

export const notificationsDemoFeed: NotifDemoRow[] = [
  {
    id: "n1",
    type: "credit",
    icon: ArrowDownLeft,
    title: "Money received",
    desc: `${formatUsdLineFromCents(50_000)} from Emerson Obi`,
    time: "2 min ago",
    read: false,
    category: "money",
    actionLabel: "View",
    actionPath: "/history",
  },
  {
    id: "n2",
    type: "debit",
    icon: ArrowUpRight,
    title: "Transfer successful",
    desc: `${formatUsdLineFromCents(75_000)} to Avery Nwachukwu`,
    time: "1 hr ago",
    read: false,
    category: "money",
    actionLabel: "Receipt",
    actionPath: "/history",
  },
  {
    id: "n3",
    type: "security",
    icon: ShieldAlert,
    title: "New device login",
    desc: "Chrome on Windows · New York metro",
    time: "3 hrs ago",
    read: false,
    category: "security",
    actionLabel: "Review",
    actionPath: "/security",
  },
  {
    id: "n4",
    type: "reward",
    icon: Gift,
    title: "Cashback earned",
    desc: `${formatUsdLineFromCents(250_00)} on bill payment`,
    time: "5 hrs ago",
    read: false,
    category: "rewards",
    actionLabel: "View",
    actionPath: "/rewards",
  },
  {
    id: "n5",
    type: "savings",
    icon: Target,
    title: "Savings milestone",
    desc: "You've saved 50% of your laptop goal.",
    time: "8 hrs ago",
    read: true,
    category: "money",
    actionLabel: "View",
    actionPath: "/savings",
  },
  {
    id: "n6",
    type: "merchant",
    icon: CreditCard,
    title: "Payment received",
    desc: `${formatUsdLineFromCents(150_000)} via QR`,
    time: "1 day ago",
    read: true,
    category: "money",
  },
  {
    id: "n7",
    type: "referral",
    icon: Users,
    title: "Referral completed",
    desc: `Kendall signed up — ${formatUsdLineFromCents(500_00)} credited`,
    time: "1 day ago",
    read: true,
    category: "rewards",
    actionLabel: "Invite more",
    actionPath: "/rewards",
  },
  {
    id: "n8",
    type: "bill",
    icon: Zap,
    title: "Bill due reminder",
    desc: "Streaming subscription due in 3 days",
    time: "1 day ago",
    read: true,
    category: "money",
    actionLabel: "Pay now",
    actionPath: "/services/cable-tv",
  },
  {
    id: "n9",
    type: "system",
    icon: CheckCircle,
    title: "KYC verified",
    desc: "Your account is now fully verified.",
    time: "2 days ago",
    read: true,
    category: "security",
  },
  {
    id: "n10",
    type: "promo",
    icon: Star,
    title: "Fee-free transfers",
    desc: "Send money free this week.",
    time: "3 days ago",
    read: true,
    category: "rewards",
  },
];

export interface RewardHistoryRow {
  title: string;
  date: string;
  amountCents: number;
  status: "credited" | "pending";
}

export interface RewardsHubDemoPayload {
  totalEarnedCents: number;
  monthCents: number;
  pendingCents: number;
  history: RewardHistoryRow[];
}

export const rewardsDemoHubPayload: RewardsHubDemoPayload = {
  totalEarnedCents: 490_000,
  monthCents: 190_000,
  pendingCents: 100_000,
  history: [
    { title: "Bill payment cashback", date: "Today", amountCents: 25_000, status: "credited" },
    { title: "Referral bonus", date: "Yesterday", amountCents: 50_000, status: "credited" },
    { title: "Transfer milestone", date: "Mar 12", amountCents: 100_000, status: "pending" },
    { title: "Savings streak", date: "Mar 10", amountCents: 15_000, status: "credited" },
  ],
};

export interface ScheduledDemoRow {
  id: string;
  label: string;
  amountCents: number;
  cadence: "Weekly" | "Monthly";
  nextRun: string;
}

export const schedulesDemoSeed: ScheduledDemoRow[] = [
  { id: "1", label: "Rent autopay · landlord", amountCents: 180_000, cadence: "Monthly", nextRun: "Mar 29" },
  { id: "2", label: "Gym subscription", amountCents: 4_900, cadence: "Monthly", nextRun: "Mar 15" },
  { id: "3", label: "Allowance split · family", amountCents: 20_000, cadence: "Weekly", nextRun: "Mar 14" },
];
