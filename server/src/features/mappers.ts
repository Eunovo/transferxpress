import { assert } from "console";
import { Wallet } from "../models.js";
import { SavingsPlan } from "../types.js";

export function mapWalletToSavingsPlan(wallet: Wallet): SavingsPlan {
  assert(wallet.type === 'SAVINGS');
  const startDate = wallet.createdAt;
  const durationInMonths = wallet.planDurationInMonths ?? 0;
  const maturityDate = typeof wallet.maturityDate === 'string' ? new Date(parseFloat(wallet.maturityDate as any)) : wallet.maturityDate;
  const state = Date.now() < maturityDate.getTime() ? 'ACTIVE' : 'MATURED';

  return {
    id: wallet.id,
    balance: wallet.balance,
    name: wallet.name ?? "",
    currencyCode: wallet.currencyCode,
    durationInMonths,
    autoFund: wallet.autoFundWalletId !== null && wallet.autoFundAmount !== null,
    startDate,
    maturityDate,
    state,
    penalties: [
      { name: "PREMATURE_WITHDRAWAL", percentage: 5 }
    ],
    createdAt: wallet.createdAt,
    lastUpdatedAt: wallet.lastUpdatedAt
  }
}
