import type { WalletCardBrand, WalletCardManualDetails } from "@/lib/api/types";
import type { StoredWalletCard } from "@/server/cards/cardMemory";
import { walletCardId } from "@/server/cards/cardIds";

export class CardValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CardValidationError";
  }
}

/** Luhn check — optional for UI hints; server storage does not reject on Luhn failure (prototype wallet). */
export function isValidPanLuhn(digits: string): boolean {
  if (!/^\d+$/.test(digits) || digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function normalizeExpiry(raw: string): string {
  const t = raw.trim();
  const m = t.match(/^(\d{1,2})\s*[/\-]\s*(\d{2}|\d{4})$/);
  if (!m) throw new CardValidationError("Use expiry format MM/YY (e.g. 09/27).");
  const mm = parseInt(m[1]!, 10);
  const yyPart = m[2]!;
  let yyFull: number;
  let yyDisplay: string;
  if (yyPart.length === 4) {
    yyFull = parseInt(yyPart, 10);
    yyDisplay = yyPart.slice(-2);
  } else {
    const yy = parseInt(yyPart, 10);
    yyFull = 2000 + yy;
    yyDisplay = String(yy).padStart(2, "0");
  }
  if (mm < 1 || mm > 12) throw new CardValidationError("Expiry month must be between 01 and 12.");
  const expEnd = new Date(yyFull, mm, 0, 23, 59, 59);
  if (expEnd < new Date()) throw new CardValidationError("This card appears expired.");
  return `${String(mm).padStart(2, "0")}/${yyDisplay}`;
}

/** Detect Visa / Mastercard from BIN for consistency checks (prototype — extend for Amex/Discover in prod). */
export function inferBrandFromPan(panDigits: string): WalletCardBrand | null {
  if (panDigits[0] === "4") return "Visa";
  const prefix6 = parseInt(panDigits.slice(0, 6), 10);
  if (/^5[1-5]/.test(panDigits.slice(0, 2))) return "Mastercard";
  if (prefix6 >= 222100 && prefix6 <= 272099) return "Mastercard";
  return null;
}

function resolveBrandChoice(selected: WalletCardManualDetails["brand"], panDigits: string): WalletCardBrand {
  const inferred = inferBrandFromPan(panDigits);
  if (inferred !== null && inferred !== selected) {
    throw new CardValidationError(
      `This number matches ${inferred}. Select "${inferred}" as brand or correct the digits.`,
    );
  }
  return inferred ?? selected;
}

/** Builds stored card from user input — called only after validation. */
export function buildStoredVirtualFromDetails(d: WalletCardManualDetails): StoredWalletCard {
  const panDigits = d.pan.replace(/\D/g, "");
  if (panDigits.length !== 16) {
    throw new CardValidationError("Enter all 16 digits of your card number.");
  }
  /** Prototype / wallet-only store — we do not enforce Luhn here (many harmless demo PANs fail it).
   * Before real charges, run Luhn + PCI tokenization via your PSP. See `isValidPanLuhn`. */
  const brand = resolveBrandChoice(d.brand, panDigits);

  const expiry = normalizeExpiry(d.expiry);

  const cvvRaw = d.cvv.replace(/\D/g, "");
  if (cvvRaw.length < 3 || cvvRaw.length > 4) {
    throw new CardValidationError("CVV must be 3 or 4 digits.");
  }

  const holderName = d.holderName.trim();
  if (holderName.length < 2) {
    throw new CardValidationError("Enter the name as it appears on the card.");
  }

  return {
    id: walletCardId(),
    type: "virtual",
    holderName,
    last4: panDigits.slice(-4),
    expiry,
    panDigits,
    cvv: cvvRaw,
    brand,
    color: d.color,
    status: "active",
  };
}
