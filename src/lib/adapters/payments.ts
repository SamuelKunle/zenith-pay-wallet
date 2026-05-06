/**
 * Payments integration boundary: implement this port against your ACH/card processor,
 * treasury service, or internal ledger facade.
 */

export interface TransferQuote {
  amountCents: number;
  feeCents: number;
}

export interface PaymentsPort {
  quoteTransfer(amountCents: number): Promise<TransferQuote>;
}

/** Fallback implementation with plausible latency — replace with production adapter. */
export const mockPaymentsAdapter: PaymentsPort = {
  async quoteTransfer(amountCents) {
    await new Promise((r) => setTimeout(r, 280));
    const dollars = amountCents / 100;
    let feeUsd = 0.1;
    if (dollars > 500) feeUsd = 3.5;
    else if (dollars > 50) feeUsd = 1.5;
    else if (dollars > 5) feeUsd = 0.5;
    return { amountCents, feeCents: Math.round(feeUsd * 100) };
  },
};
