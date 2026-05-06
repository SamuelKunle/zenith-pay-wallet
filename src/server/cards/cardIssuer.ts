import type { WalletCardBrand, WalletCardColor } from "@/lib/api/types";

const COLORS: WalletCardColor[] = ["emerald", "navy", "slate"];

export function pickBrand(): WalletCardBrand {
  return Math.random() > 0.5 ? "Visa" : "Mastercard";
}

export function pickColor(index: number): WalletCardColor {
  return COLORS[index % COLORS.length]!;
}

/** Issuer test-range style PAN (prototype only — not for real authorization). */
export function generatePanDigits(brand: WalletCardBrand): string {
  const prefix = brand === "Visa" ? "4" : "51";
  let digits = prefix;
  while (digits.length < 16) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits.slice(0, 16);
}

export function formatPan(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function generateCvv(): string {
  return String(100 + Math.floor(Math.random() * 900));
}

/** MM/YY ~24 months ahead */
export function defaultExpiry(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 24);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}
