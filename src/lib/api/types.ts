export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export interface WalletBalanceResponse {
  availableCents: number;
  currency: string;
  walletTag: string;
  weekCreditSummary: string;
}

export interface PaymentQuoteResponse {
  amountCents: number;
  feeCents: number;
}

export interface TransferCreateResponse {
  id: string;
  reference: string;
  amountCents: number;
  feeCents: number;
  totalCents: number;
  status: "completed";
}

export type TransactionCategory =
  | "transfer"
  | "merchant"
  | "airtime"
  | "bills"
  | "received";

export type TransactionDirection = "debit" | "credit";

export type TransactionStatus = "success" | "pending" | "failed";

export interface TransactionDto {
  id: string;
  occurredAt: string;
  direction: TransactionDirection;
  category: TransactionCategory;
  status: TransactionStatus;
  amountCents: number;
  feeCents: number;
  title: string;
  subtitle: string;
  reference: string;
}

export interface TransactionsListResponse {
  transactions: TransactionDto[];
}

export type SimulatedFundingChannel = "ach" | "debit" | "payroll";

export interface SimulatedFundResponse {
  id: string;
  reference: string;
  amountCents: number;
  availableCents: number;
  channel: SimulatedFundingChannel;
}

export type WalletCardBrand = "Visa" | "Mastercard";

export type WalletCardColor = "emerald" | "navy" | "slate";

/** Issued card lifecycle — physical starts `pending` until fulfillment (prototype keeps pending or you add activation later). */
export type WalletCardStatus = "active" | "frozen" | "pending";

export interface WalletCardDto {
  id: string;
  type: "virtual" | "physical";
  name: string;
  last4: string;
  expiry: string;
  /** Masked or full PAN (spaces every 4 digits). Full values only when issued (`active`/`frozen`). */
  number: string;
  cvv: string | null;
  brand: WalletCardBrand;
  color: WalletCardColor;
  status: WalletCardStatus;
}

export interface WalletCardsListResponse {
  cards: WalletCardDto[];
}

/** User-supplied card — virtual cards must include full details (no server-side generation). */
export interface WalletCardManualDetails {
  pan: string;
  expiry: string;
  cvv: string;
  holderName: string;
  brand: WalletCardBrand;
  color: WalletCardColor;
}

export interface WalletCardCreateBody {
  type: "virtual" | "physical";
  /** Required when `type` is `virtual`. */
  details?: WalletCardManualDetails;
  /** Physical card: name shown on / shipped with card (optional). */
  holderName?: string;
}

export interface WalletCardPatchBody {
  frozen?: boolean;
}
