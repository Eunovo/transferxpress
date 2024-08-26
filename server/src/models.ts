import { ID, PaymentKind, ReportReason, TransactionStatus } from "./types.js";

export interface BaseModel {
  id: ID;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface User extends BaseModel {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  country: string;
  phoneNumber: string;
  did?: string;
}

export interface UserCredential extends BaseModel {
  userId: ID;
  key: string;
  value: string;
}

export interface Wallet extends BaseModel {
  currencyCode: string;
  balance: number;
  userId: ID;
}

export interface WalletPaymentDetails extends BaseModel {
  walletId: ID;
  kind: PaymentKind;
  accountNumber?: string;
  routingNumber?: string;
  bankCode?: string;
  sortCode?: string;
  BSB?: string;
  IBAN?: string;
  CLABE?: string;
  address?: string;
}

export interface Transaction extends BaseModel {
  narration?: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  reference: string;
  transferId?: ID;
  walletId: ID;
  userId: ID;
}

export interface TransactionReport extends BaseModel {
  transactionId: ID;
  reason: ReportReason;
  other?: string;
}

export interface SavedCard extends BaseModel {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  userId: ID;
}

export interface Beneficiary extends BaseModel {
  userId: ID;
  kind: PaymentKind;
  accountNumber?: string;
  routingNumber?: string;
  bankCode?: string;
  sortCode?: string;
  BSB?: string;
  IBAN?: string;
  CLABE?: string;
  address?: string;
}

export interface Transfer extends BaseModel {
  userId: ID;
  payinCurrencyCode: string;
  payoutCurrencyCode: string;
  pfiId?: ID;
  pfi?: PFI;
  payinKind?: PaymentKind;
  payoutKind?: PaymentKind;
  /** Amount paid without fees */
  payinAmount?: number;
  payoutAmount?: number;
  narration?: string;
  fee?: number;
  payinWalletId?: ID;
  payoutWalletId?: ID;
  payinCardId?: ID;
  payinAccountNumber?: string;
  payinRoutingNumber?: string;
  payinBankCode?: string;
  payinSortCode?: string;
  payinBSB?: string;
  payinIBAN?: string;
  payinCLABE?: string;
  payinAddress?: string;
  payoutAccountNumber?: string;
  payoutRoutingNumber?: string;
  payoutBankCode?: string;
  payoutSortCode?: string;
  payoutBSB?: string;
  payoutIBAN?: string;
  payoutCLABE?: string;
  payoutAddress?: string;
  status: TransactionStatus;
  speedOfSettlementRating?: number;
  reference?: string;
}

export interface PFI extends BaseModel {
  did: string;
  name: string;
  blacklisted?: boolean;
  rating?: number;
}
