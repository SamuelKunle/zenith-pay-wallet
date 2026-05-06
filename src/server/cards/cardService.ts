import type { WalletCardDto } from "@/lib/api/types";
import {
  appendCard,
  findCard,
  listCardsSnapshot,
  updateCard,
  type StoredWalletCard,
} from "@/server/cards/cardMemory";
import {
  defaultExpiry,
  formatPan,
  generateCvv,
  generatePanDigits,
  pickBrand,
  pickColor,
} from "@/server/cards/cardIssuer";
import { walletCardId } from "@/server/cards/cardIds";

const DEFAULT_HOLDER = "Charlie Oliver";

function toDto(c: StoredWalletCard): WalletCardDto {
  const hasPan = c.panDigits.length === 16;
  return {
    id: c.id,
    type: c.type,
    name: c.holderName,
    last4: c.last4,
    expiry: c.expiry,
    number: hasPan ? formatPan(c.panDigits) : "•••• •••• •••• ••••",
    cvv: hasPan ? c.cvv : null,
    brand: c.brand,
    color: c.color,
    status: c.status,
  };
}

export function cardsSnapshotForApi(): WalletCardDto[] {
  return listCardsSnapshot().map(toDto);
}

export function issueCard(type: "virtual" | "physical", holderName = DEFAULT_HOLDER): WalletCardDto {
  const index = listCardsSnapshot().length;
  const brand = pickBrand();
  const color = pickColor(index);

  if (type === "virtual") {
    const panDigits = generatePanDigits(brand);
    const last4 = panDigits.slice(-4);
    const stored: StoredWalletCard = {
      id: walletCardId(),
      type: "virtual",
      holderName,
      last4,
      expiry: defaultExpiry(),
      panDigits,
      cvv: generateCvv(),
      brand,
      color,
      status: "active",
    };
    appendCard(stored);
    return toDto(stored);
  }

  const last4 = String(1000 + Math.floor(Math.random() * 9000));
  const stored: StoredWalletCard = {
    id: walletCardId(),
    type: "physical",
    holderName,
    last4,
    expiry: "—/—",
    panDigits: "",
    cvv: "",
    brand,
    color,
    status: "pending",
  };
  appendCard(stored);
  return toDto(stored);
}

export function setFrozen(cardId: string, frozen: boolean): WalletCardDto | null {
  const existing = findCard(cardId);
  if (!existing) return null;
  if (existing.status === "pending") {
    const nextStatus = frozen ? "frozen" : "pending";
    const updated = updateCard(cardId, { status: nextStatus });
    return updated ? toDto(updated) : null;
  }
  const nextStatus = frozen ? "frozen" : "active";
  const updated = updateCard(cardId, { status: nextStatus });
  return updated ? toDto(updated) : null;
}
