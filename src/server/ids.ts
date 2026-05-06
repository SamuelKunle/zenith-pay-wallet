/** Human-visible transfer / funding references shared by ledger writers. */

export function paymentReference(publicPrefix = "TXN"): string {
  const part = Date.now().toString(36).toUpperCase().slice(-6);
  return `${publicPrefix}-${new Date().getFullYear()}-${part}`;
}

export function ledgerEventId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
