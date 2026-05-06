import type { WalletCardCreateBody, WalletCardDto } from "@/lib/api/types";
import {
  appendCard,
  findCard,
  listCardsSnapshot,
  updateCard,
  type StoredWalletCard,
} from "@/server/cards/cardMemory";
import { formatPan, pickBrand, pickColor } from "@/server/cards/cardIssuer";
import { walletCardId } from "@/server/cards/cardIds";
import { CardValidationError, buildStoredVirtualFromDetails } from "@/server/cards/cardValidation";

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

/** Primary entry — virtual cards require `details`; physical uses optional holder name + pending placeholder. */
export function createWalletCard(body: WalletCardCreateBody): WalletCardDto {
  if (body.type === "virtual") {
    if (!body.details) {
      throw new CardValidationError(
        "Virtual cards require your card number, expiry, CVV, name on card, brand, and card style.",
      );
    }
    const stored = buildStoredVirtualFromDetails(body.details);
    appendCard(stored);
    return toDto(stored);
  }

  const holderName = (body.holderName ?? "").trim() || DEFAULT_HOLDER;
  const index = listCardsSnapshot().length;
  const brand = pickBrand();
  const color = pickColor(index);
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
