import { ErrorCode } from "./error_codes.js";

export type ApiError = { code: ErrorCode, data?: string }
 | { code: ErrorCode.VALIDATION_ERROR, data: { type: string, field: string, message: string }[] }
 | { code: ErrorCode.WALLET_CURRENCY_MISMATCH, data: { expectedCurrencyCode: string, suppliedCurrencyCode: string } }
 | { code: ErrorCode.INVALID_STATE, data: { validStates: string[], currentState: string } }


export type ID = number;

export enum EmailAvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE"
}

export interface EmailAvailabilityResponse {
  status: EmailAvailabilityStatus;
}

export type RegisterRequestBody = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  country: string;
  phoneNumber: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export interface Wallet {
  id: ID;
  currencyCode: string;
  balance: number;
}

export enum TransactionStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export interface Transaction {
  id: ID;
  walletId: ID;
  narration?: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  reference: string;
  createdAt: Date;
  completedAt?: Date;
}

export enum ReportReason {
  AMOUNT_MISMATCH = "AMOUNT_MISMATCH",
  TRANSACTION_DELAYED = "TRANSACTION_DELAYED",
  COMPLETED_WITHOUT_SETTLEMENT = "COMPLETED_WITHOUT_SETTLEMENT",
  OTHER = "OTHER"
}

export type ReportTransactionRequestBody = {
  reason: ReportReason;
  other: string;
};

export type MarketData = {
  [x: string]: { [y: string]: { pfiId: ID, exchangeRate: number } | undefined } | undefined
}

export interface SavedCard {
  id: ID;
  /** Only the last four digits */
  cardNumber: string;
}

export interface CreateTransferResponse {
  id: ID;
  payinMethods: { kind: PaymentKind, fields: Array<keyof PaymentDetails> }[];
}

/** Represents the kind of payment */
export enum PaymentKind {
  /** Requires walletId */
  WALLET_ADDRESS = "WALLET_ADDRESS",
  /** Requires cardId */
  SAVED_CARD = "SAVED_CARD",
  /** Requires address */
  BTC_WALLET_ADDRESS = "BTC_WALLET_ADDRESS",
  /** Requires address */
  USDC_WALLET_ADDRESS = "USDC_WALLET_ADDRESS",
  /** Requires accountNumber, bankCode */
  NGN_BANK_TRANSFER = "NGN_BANK_TRANSFER",
  /** Requires accountNumber, routingNumber */
  USD_BANK_TRANSFER = "USD_BANK_TRANSFER",
  /** Requires accountNumber */
  KES_BANK_TRANSFER = "KES_BANK_TRANSFER",
  /** Requires accountNumber, IBAN */
  EUR_BANK_TRANSFER = "EUR_BANK_TRANSFER",
  /** Requires accountNumber, sortCode */
  GBP_BANK_TRANSFER = "GBP_BANK_TRANSFER",
  /** Requires accountNumber, CLABE */
  MXN_BANK_TRANSFER = "MXN_BANK_TRANSFER",
  /** Requires accountNumber, BSB */
  AUD_BANK_TRANSFER = "AUD_BANK_TRANSFER",
  /** Requires accountNumber */
  GHS_BANK_TRANSFER = "GHS_BANK_TRANSFER"
}

export type PaymentDetails = {
  kind: PaymentKind,
  walletId: ID;
  accountNumber: string,
  routingNumber: string,
  bankCode: string,
  sortCode: string,
  BSB: string,
  IBAN: string,
  CLABE: string,
  address: string
};

export type CardDetails = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;  
};

export type PayinRequestBody = Partial<CardDetails> & Partial<PaymentDetails> & {
  saveCard?: boolean;
};

export type PayoutRequestBody = Partial<PaymentDetails> & {};

export type PayinUpdateResponse = { kind: PaymentKind, fields: Array<keyof PaymentDetails> }[];

export type TransferAmountUpdateRequestBody = {
  /** Amount in receiving currency */
  amount: string;
  narration: string;
};

export interface TransferSummary {
  payin: {
    currencyCode: string;
    amount: string;
    fee: string;
    paymentInstructions?: string;
  };
  payout: {
    currencyCode: string;
    amount: string;
  } & PayoutRequestBody;
};

export interface Transfer {
  id: ID;
  payinCurrencyCode: string;
  payoutCurrencyCode: string;
  payinKind: PaymentKind;
  payoutKind: PaymentKind;
  payinAmount: number;
  payoutAmount: number;
  narration: string;
  fee: number;
  status: TransactionStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
}
