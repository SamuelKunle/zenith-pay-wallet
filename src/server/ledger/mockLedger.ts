/**
 * In-process ledger for local development and integration testing.
 * Replace with Postgres + double-entry or your BaaS ledger in production.
 */

let availableCents = 124_580_050; // $1,245,800.50 — matches previous UI default

export function getAvailableCents(): number {
  return availableCents;
}

export function assertCanDebit(amountCents: number, feeCents: number): void {
  const total = amountCents + feeCents;
  if (total <= 0) throw new Error("invalid_amount");
  if (availableCents < total) throw new Error("insufficient_funds");
}

export function debit(amountCents: number, feeCents: number): { remainingCents: number } {
  assertCanDebit(amountCents, feeCents);
  const total = amountCents + feeCents;
  availableCents -= total;
  return { remainingCents: availableCents };
}

export function credit(amountCents: number): { remainingCents: number } {
  const n = Math.floor(Number(amountCents));
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("invalid_amount");
  }
  availableCents += n;
  return { remainingCents: availableCents };
}

/** Test / seed hooks — optional */
export function _resetLedgerSeed(cents: number): void {
  availableCents = cents;
}
