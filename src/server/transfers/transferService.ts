import { mockPaymentsAdapter } from "@/lib/adapters/payments";
import { ledgerEventId, paymentReference } from "@/server/ids";
import { debit, getAvailableCents } from "@/server/ledger/mockLedger";
import { listStoredTransactions, prependTransaction } from "@/server/ledger/transactionMemory";

export interface CreateTransferInput {
  amountCents: number;
  recipientTag?: string;
}

export interface CreateTransferResult {
  id: string;
  reference: string;
  amountCents: number;
  feeCents: number;
  totalCents: number;
  status: "completed";
}

export async function quoteTransfer(amountCents: number) {
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("invalid_amount");
  }
  return mockPaymentsAdapter.quoteTransfer(Math.floor(amountCents));
}

function recipientLine(recipientTag?: string): string {
  const raw = recipientTag?.trim();
  if (!raw) return "To recipient";
  const tag = raw.startsWith("@") ? raw : `@${raw}`;
  return `To ${tag}`;
}

export async function createTransfer(input: CreateTransferInput): Promise<CreateTransferResult> {
  const amountCents = Math.floor(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("invalid_amount");
  }

  const { feeCents } = await quoteTransfer(amountCents);
  debit(amountCents, feeCents);

  const id = ledgerEventId("tr");
  const reference = paymentReference("TXN");

  prependTransaction({
    id,
    occurredAt: new Date().toISOString(),
    direction: "debit",
    category: "transfer",
    status: "success",
    amountCents,
    feeCents,
    title: recipientLine(input.recipientTag),
    subtitle: "Zenith Pay transfer",
    reference,
  });

  return {
    id,
    reference,
    amountCents,
    feeCents,
    totalCents: amountCents + feeCents,
    status: "completed",
  };
}

export function walletSnapshotForApi() {
  return {
    availableCents: getAvailableCents(),
    currency: "USD",
    walletTag: "chioma_pay",
    weekCreditSummary: "+$120K this week",
  };
}

export function transactionsSnapshotForApi(limit?: number) {
  return listStoredTransactions(limit ?? 100);
}
