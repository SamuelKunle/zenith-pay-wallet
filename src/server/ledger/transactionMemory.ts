/**
 * In-memory ledger activity log (prototype). Mirrors the shape persisted in Postgres
 * (see `/sql`). Prepend outbound API transfers; synthetic seed rows illustrate categories.
 */

export type StoredTxCategory = "transfer" | "merchant" | "airtime" | "bills" | "received";
export type StoredTxDirection = "debit" | "credit";
export type StoredTxStatus = "success" | "pending" | "failed";

export interface StoredTransaction {
  id: string;
  occurredAt: string;
  direction: StoredTxDirection;
  category: StoredTxCategory;
  status: StoredTxStatus;
  amountCents: number;
  feeCents: number;
  title: string;
  subtitle: string;
  reference: string;
}

function todayAt(h: number, m: number): string {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function yesterdayAt(h: number, m: number): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/** Seed rows (synthetic); sorted to newest-first for the API on init. */
function buildSeed(): StoredTransaction[] {
  return [
    {
      id: "seed-7",
      occurredAt: yesterdayAt(13, 0),
      direction: "debit",
      category: "merchant",
      status: "success",
      amountCents: 480_000,
      feeCents: 0,
      title: "Chicken Republic",
      subtitle: "QR payment",
      reference: "TXN-2026-T3U7V0",
    },
    {
      id: "seed-8",
      occurredAt: yesterdayAt(15, 30),
      direction: "debit",
      category: "transfer",
      status: "success",
      amountCents: 3_500_000,
      feeCents: 2_500,
      title: "To Fatima Yusuf",
      subtitle: "Bank transfer",
      reference: "TXN-2026-Q1R5S8",
    },
    {
      id: "seed-9",
      occurredAt: yesterdayAt(18, 0),
      direction: "credit",
      category: "received",
      status: "success",
      amountCents: 12_000_000,
      feeCents: 0,
      title: "From Taylor Bakare",
      subtitle: "Transfer",
      reference: "TXN-2026-M9N4P6",
    },
    {
      id: "seed-6",
      occurredAt: todayAt(9, 30),
      direction: "debit",
      category: "bills",
      status: "failed",
      amountCents: 2_100_000,
      feeCents: 0,
      title: "Streaming TV subscription",
      subtitle: "Bills payment",
      reference: "TXN-2026-H7J2L5",
    },
    {
      id: "seed-5",
      occurredAt: todayAt(10, 0),
      direction: "credit",
      category: "received",
      status: "success",
      amountCents: 1_500_000,
      feeCents: 0,
      title: "From Kendall Adrian",
      subtitle: "Payment request",
      reference: "TXN-2026-E4F8G3",
    },
    {
      id: "seed-4",
      occurredAt: todayAt(11, 20),
      direction: "debit",
      category: "airtime",
      status: "success",
      amountCents: 200_000,
      feeCents: 150,
      title: "Carrier airtime",
      subtitle: "(555) 123-4578",
      reference: "TXN-2026-A1C6D8",
    },
    {
      id: "seed-3",
      occurredAt: todayAt(12, 45),
      direction: "debit",
      category: "transfer",
      status: "pending",
      amountCents: 7_500_000,
      feeCents: 500,
      title: "To Avery Nwachukwu",
      subtitle: "Bank transfer",
      reference: "TXN-2026-B5N9W2",
    },
    {
      id: "seed-2",
      occurredAt: todayAt(13, 15),
      direction: "debit",
      category: "merchant",
      status: "success",
      amountCents: 1_244_999,
      feeCents: 299,
      title: "Shoprite Soho",
      subtitle: "QR payment",
      reference: "TXN-2026-P3Q7R4",
    },
    {
      id: "seed-1",
      occurredAt: todayAt(14, 30),
      direction: "credit",
      category: "received",
      status: "success",
      amountCents: 5_000_000,
      feeCents: 0,
      title: "From Emerson Obi",
      subtitle: "Transfer",
      reference: "TXN-2026-K8F2M1",
    },
  ];
}

let memory: StoredTransaction[] = [...buildSeed()].sort(
  (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
);

export function listStoredTransactions(limit: number): StoredTransaction[] {
  const capped = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 100;
  return memory.slice(0, capped);
}

export function prependTransaction(tx: StoredTransaction): void {
  memory = [tx, ...memory];
}

/** Tests only — re-seed and reset ordering. */
export function _resetTransactionMemory(): void {
  memory = [...buildSeed()].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}
