import { ledgerEventId, paymentReference } from "@/server/ids";
import { credit, getAvailableCents } from "@/server/ledger/mockLedger";
import { prependTransaction } from "@/server/ledger/transactionMemory";

export type SimulatedFundingChannel = "ach" | "debit" | "payroll";

const LABELS: Record<SimulatedFundingChannel, string> = {
  ach: "Bank transfer (ACH)",
  debit: "Debit card authorization",
  payroll: "Payroll / direct deposit",
};

/** Cap for a single simulated top-up ($500k). */
const MAX_CENTS_PER_REQUEST = 50_000_000;

export interface SimulatedFundInput {
  amountCents: number;
  channel: SimulatedFundingChannel;
}

export interface SimulatedFundResult {
  id: string;
  reference: string;
  amountCents: number;
  availableCents: number;
  channel: SimulatedFundingChannel;
}

export function simulatedFund(input: SimulatedFundInput): SimulatedFundResult {
  const amountCents = Math.floor(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("invalid_amount");
  }
  if (amountCents > MAX_CENTS_PER_REQUEST) {
    throw new Error("limit_exceeded");
  }

  credit(amountCents);

  const id = ledgerEventId("fd");
  const reference = paymentReference("FUND");

  prependTransaction({
    id,
    occurredAt: new Date().toISOString(),
    direction: "credit",
    category: "received",
    status: "success",
    amountCents,
    feeCents: 0,
    title: `Funding · ${LABELS[input.channel]}`,
    subtitle: "Simulated — swap for PSP/settlement reconciliation",
    reference,
  });

  return {
    id,
    reference,
    amountCents,
    availableCents: getAvailableCents(),
    channel: input.channel,
  };
}
