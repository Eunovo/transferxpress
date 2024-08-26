import {
  User,
  UserCredential,
  Wallet,
  WalletPaymentDetails,
  Transaction,
  TransactionReport,
  SavedCard,
  Beneficiary,
  Transfer,
  PFI
} from './models.js';
import { ID, TransactionStatus } from './types.js';
import { InsertData } from './utils.js';

export interface UsersDb {
  findOneByEmail(email: string): Promise<User | null>;
  findOneById(id: ID): Promise<User | null>;
  insert(
    data: InsertData<User>,
    credentials?: Omit<UserCredential, 'id' | 'userId' | 'createdAt' | 'lastUpdatedAt'>[],
    wallets?: Omit<Wallet, 'id' | 'userId' | 'createdAt' | 'lastUpdatedAt'>[]
  ): Promise<User>;
  findCredentialsForUserId(userId: ID): Promise<UserCredential[]>;
  insertCredentials(data: InsertData<UserCredential>[]): Promise<void>;
  findWalletsByUserId(userId: ID): Promise<Wallet[]>;
  insertWalletPaymentDetails(walletId: ID, data: InsertData<WalletPaymentDetails>): Promise<void>;
  findTransactionById(id: ID): Promise<Transaction | null>;
  findTransactionsByUserId(userId: ID): Promise<Transaction[]>;
  findTransactionByTransferId(transferId: ID): Promise<Transaction | null>;
  insertTransactionReport(data: InsertData<TransactionReport>, pfi: Pick<PFI, "id" | "blacklisted" | "rating">): Promise<TransactionReport>;
  insertSavedCard(data: InsertData<SavedCard>): Promise<SavedCard>;
  findSavedCardsByUserId(userId: ID): Promise<SavedCard[]>;
  findBeneficiariesByUserId(userId: ID): Promise<Beneficiary[]>;
  insertBeneficiary(data: InsertData<Beneficiary>): Promise<Beneficiary>;
  insertTransfer(data: InsertData<Transfer>): Promise<Transfer>;
  findTransfersByUserIdAndStatus(userId: ID, statuses?: TransactionStatus[]): Promise<Transfer[]>;
  findTransferByIdAndUserId(id: ID, userId: ID): Promise<Transfer>;
  updateTransferById(id: ID, data: InsertData<Transfer>, transactions?: Omit<Transaction, 'id' | 'transferId'>[]): Promise<void>;
}

export interface TBDexDB {
  /**
   * List non-blacklisted PFIs
   */
  listPFIs(): Promise<PFI[]>;
}
