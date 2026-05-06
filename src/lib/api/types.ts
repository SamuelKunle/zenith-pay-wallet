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
