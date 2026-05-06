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
