export function formatUsdPartsFromCents(cents: number): { dollars: string; centsPart: string } {
  const abs = Math.abs(Math.floor(cents));
  const dollars = Math.floor(abs / 100);
  const frac = abs % 100;
  return {
    dollars: dollars.toLocaleString("en-US"),
    centsPart: frac.toString().padStart(2, "0"),
  };
}

export function formatUsdLineFromCents(cents: number): string {
  const { dollars, centsPart } = formatUsdPartsFromCents(cents);
  return `$${dollars}.${centsPart}`;
}

/** Debit outflow label: `−$12.42` using Unicode minus; `en-US` grouping. */
export function formatUsdNegLineFromCents(cents: number): string {
  return `−${formatUsdLineFromCents(Math.abs(Math.floor(cents)))}`;
}

/** Credit label: `+$285.00` */
export function formatUsdPosLineFromCents(cents: number): string {
  return `+${formatUsdLineFromCents(Math.abs(Math.floor(cents)))}`;
}
