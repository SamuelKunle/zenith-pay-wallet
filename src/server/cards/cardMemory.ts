import type { WalletCardBrand, WalletCardColor, WalletCardStatus } from "@/lib/api/types";

/** Internal shape persisted in memory (swap for DB rows). */
export interface StoredWalletCard {
  id: string;
  type: "virtual" | "physical";
  holderName: string;
  last4: string;
  expiry: string;
  panDigits: string;
  cvv: string;
  brand: WalletCardBrand;
  color: WalletCardColor;
  status: WalletCardStatus;
}

let cards: StoredWalletCard[] = buildSeed();

function buildSeed(): StoredWalletCard[] {
  return [
    {
      id: "seed-virtual-1",
      type: "virtual",
      holderName: "Charlie Oliver",
      last4: "4829",
      expiry: "09/27",
      panDigits: "5412753482914829",
      cvv: "482",
      brand: "Visa",
      color: "emerald",
      status: "active",
    },
    {
      id: "seed-physical-1",
      type: "physical",
      holderName: "Charlie Oliver",
      last4: "7361",
      expiry: "03/28",
      panDigits: "4532891023457361",
      cvv: "713",
      brand: "Mastercard",
      color: "navy",
      status: "active",
    },
  ];
}

export function listCardsSnapshot(): StoredWalletCard[] {
  return cards.map((c) => ({ ...c }));
}

export function findCard(id: string): StoredWalletCard | undefined {
  return cards.find((c) => c.id === id);
}

export function appendCard(card: StoredWalletCard): void {
  cards = [...cards, card];
}

export function updateCard(id: string, patch: Partial<StoredWalletCard>): StoredWalletCard | undefined {
  const i = cards.findIndex((c) => c.id === id);
  if (i < 0) return undefined;
  const next = { ...cards[i]!, ...patch };
  cards = cards.slice(0, i).concat([next], cards.slice(i + 1));
  return next;
}

/** Test helper */
export function resetCardsForTests(seed = true) {
  cards = seed ? buildSeed() : [];
}
