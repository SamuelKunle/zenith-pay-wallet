import type { TransactionCategory, TransactionDto } from "@/lib/api/types";
import { formatUsdLineFromCents } from "@/lib/format/money";

export function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Group headers for `/history` (matches prior UX strings). */
export function dateGroupLabel(iso: string): string {
  const txDay = startOfDay(new Date(iso));
  const today = startOfDay(new Date());
  const diffDays = Math.round((today - txDay) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTxAmountSigned(d: TransactionDto): string {
  const sign = d.direction === "credit" ? "+" : "-";
  const line = formatUsdLineFromCents(d.amountCents);
  return `${sign}${line}`;
}

export function formatTxTimeShort(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** Inline meta for dashboard rows (`2:30 PM · Transfer`). */
export function formatTxMetaTimeSubtitle(iso: string, subtitle: string): string {
  return `${formatTxTimeShort(iso)} · ${subtitle}`;
}

/** Card-feed style: “Today, 2:30 PM” vs dated lines. */
export function formatTxCalendarWithTime(iso: string): string {
  const g = dateGroupLabel(iso);
  const tm = formatTxTimeShort(iso);
  if (g === "Today" || g === "Yesterday") return `${g}, ${tm}`;
  return `${g} · ${tm}`;
}

export function prettyCategory(cat: TransactionCategory): string {
  const map: Record<TransactionCategory, string> = {
    transfer: "Transfer",
    merchant: "Merchant",
    airtime: "Airtime",
    bills: "Bills",
    received: "Received",
  };
  return map[cat];
}
