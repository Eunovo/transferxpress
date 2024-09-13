import assert from "assert";
import { AutoFunderDB, UsersDb } from "../db.js";
import { logger } from "../logger.js";
import { Wallet } from "../models.js";
import { Users } from "./users.js";
import { PaymentKind } from "../types.js";
import { TBDexService } from "./tbdex.js";

const autoFundLogger = logger.child({ module: 'autofunder' });

export class AutoFunder {
  constructor(
    private db: AutoFunderDB,
    private usersDb: UsersDb,
    private users: Users,
    private tbdex: TBDexService
  ) {}

  async run() {
    const iter = await this.db.listWalletsForFunding();
    const rates = await this.tbdex.getMarketData();

    let next = iter.next();
    let wallets: Wallet[] = [];
    while (!next.done) {
      wallets = await next.value;
      for (let wallet of wallets) {
        autoFundLogger.info(`Loaded wallet ${wallet.id}`);
        assert(wallet.type == 'SAVINGS');
        assert(wallet.autoFundWalletId);
        const amount = wallet.autoFundAmount ?? 0;
        assert(!isNaN(amount));
        assert(amount > 0);

        let transferId;
        let funder;
        let user;

        Promise.all([
          this.usersDb.findOneById(wallet.userId),
          this.usersDb.findWallet(wallet.userId, wallet.autoFundWalletId, 'STANDARD')
        ])
          .then((result) => {
            [user, funder] = result;
            if (funder == null) throw new Error(`Could not find funding wallet with id ${wallet.autoFundWalletId}`);
            assert(funder.type == 'STANDARD');
            return this.users.startTransfer(wallet.userId, funder.currencyCode, wallet.currencyCode);
          }).then((res) => {
            transferId = res.id;
            return this.users.saveTransferPayinData(wallet.userId, transferId, { kind: PaymentKind.WALLET_ADDRESS, walletId: wallet.autoFundWalletId });
          }).then((res) => {
            return this.users.saveTransferPayoutData(wallet.userId, transferId, { kind: PaymentKind.WALLET_ADDRESS, walletId: wallet.id });
          }).then((res) => {
            const rate = rates[funder.currencyCode][wallet.currencyCode]?.exchangeRate;
            if (rate === undefined) throw new Error(`Could not get exchange rate`);
            return this.users.saveTransferAmount(user, transferId, { amount: (amount * rate).toString(), narration: "Auto fund" });
          }).then((res) => {
            return this.users.confirmTransfer(user, transferId);
          }).catch(err => autoFundLogger.error({ wallet, funder, user }, err.message));
      }
      next = iter.next();
    }
  }

}
