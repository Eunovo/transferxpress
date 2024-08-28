import { Offering, Quote } from "@tbdex/http-client";
import { UsersDb } from "../db.js";
import {
  EmailAvailabilityResponse,
  EmailAvailabilityStatus,
  ID,
  RegisterRequestBody,
  Wallet,
  Transaction,
  ReportTransactionRequestBody,
  ReportReason,
  CreateTransferResponse,
  PaymentKind,
  PayinRequestBody,
  PayoutRequestBody,
  TransferAmountUpdateRequestBody,
  TransferSummary,
  TransactionStatus,
  PayinUpdateResponse,
  Transfer,
  PaymentDetails,
} from "../types.js";
import { TBDexService } from "./tbdex.js";
import { Beneficiary, PFI, User, UserCredential, Transaction as TransactionModel } from "../models.js";
import { ServerError } from "../error.js";
import { ErrorCode } from "../error_codes.js";
import { extractRequiredPaymentDetails, isPaymentKind, softAssert } from "../utils.js";
import { Cache } from "../cache.js";
import { logger } from "../logger.js";

const CacheKeys = {
  TRANSFER_QUOTE: (transferId: ID) => `transfer:quote:${transferId}`
}

const usersLogger = logger.child({ module: 'users' });

export class Users {
  constructor(
    private db: UsersDb,
    private tbdex: TBDexService,
    private cache: Cache
  ) { }

  getEmailStatus(email: string): Promise<EmailAvailabilityResponse> {
    return this.db.findOneByEmail(email)
      .then(result => {
        if (result) return { status: EmailAvailabilityStatus.NOT_AVAILABLE };
        return { status: EmailAvailabilityStatus.AVAILABLE };
      });
  }

  register(data: RegisterRequestBody): Promise<void> {
    const did = this.tbdex.createDid(data.email);
    const credential = did.then(res => {
      const portableDid = JSON.parse(res);
      if (!portableDid.uri) throw new Error(`Invalid did: ${res}`);
      return this.tbdex.acquireCredential({ type: 'kcc', data: { name: `${data.firstname} ${data.lastname}`, country: data.country, did: portableDid.uri } })
    });
    return Promise.all([
      did,
      credential,
      this.getEmailStatus(data.email)
    ]).then(([did, credential, emailStatus]) => {
      if (emailStatus.status !== EmailAvailabilityStatus.AVAILABLE)
        throw new ServerError({ code: ErrorCode.DUPLICATE_EMAIL });

      const now = new Date();
      return this.db.insert(
        { ...data, did, createdAt: now, lastUpdatedAt: now },
        [{ key: 'kcc', value: credential }],
        [
          { currencyCode: 'BTC', balance: 0 },
          { currencyCode: 'USDC', balance: 0 },
          { currencyCode: 'NGN', balance: 0 },
          { currencyCode: 'USD', balance: 0 },
          { currencyCode: 'KES', balance: 0 },
          { currencyCode: 'EUR', balance: 0 },
          { currencyCode: 'GBP', balance: 0 },
          { currencyCode: 'MXN', balance: 0 },
          { currencyCode: 'AUD', balance: 0 },
          { currencyCode: 'GHS', balance: 0 }
        ]
      ).then(() => { }); // return void
    });
  }

  login(email: string, password: string): Promise<string | null> {
    return this.db.findOneByEmail(email)
      .then(user => {
        if (!user) return null;
        if (user.password !== password) return null;
        return user.id.toString();
      });
  }

  authenticate(token: string): Promise<User | null> {
    const id = parseInt(token);
    if (isNaN(id)) return Promise.resolve(null);
    return this.db.findOneById(id);
  }

  getWallets(userId: ID): Promise<Wallet[]> {
    return this.db.findWalletsByUserId(userId);
  }

  getTransactions(userId: ID): Promise<Transaction[]> {
    return this.db.findTransactionsByUserId(userId);
  }

  reportTransaction(userId: ID, transactionId: ID, data: ReportTransactionRequestBody): Promise<void> {
    return this.db.findTransactionById(transactionId)
      .then((transaction) => {
        if (transaction === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        if (transaction.userId !== userId) throw new ServerError({ code: ErrorCode.FORBIDDEN });
        return this.db.findTransferByIdAndUserId(transaction.transferId, userId);
      }).then((transfer) => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        let pfi = transfer.pfi;
        if (data.reason === ReportReason.COMPLETED_WITHOUT_SETTLEMENT || data.reason === ReportReason.AMOUNT_MISMATCH) {
          // permanently blacklist pfi
          pfi.blacklisted = true;
        } else if (data.reason === ReportReason.TRANSACTION_DELAYED) {
          // temporarily blacklist pfi
          this.tbdex.blacklistPFI(pfi.did);
          // adjust pfi overall rating
          pfi.rating -= 1;
        }
        return this.db.insertTransactionReport({
          ...data,
          transactionId,
          createdAt: new Date(),
          lastUpdatedAt: new Date()
        }, pfi);
      }).then(() => { }); // return void
  }

  getSavedCards(userId: ID) {
    return this.db.findSavedCardsByUserId(userId);
  }

  getBeneficiaries(userId: ID) {
    return this.db.findBeneficiariesByUserId(userId);
  }

  startTransfer(userId: ID, payinCurrencyCode: string, payoutCurrencyCode: string): Promise<CreateTransferResponse> {
    const now = new Date();
    const wallets = this.db.findWalletsByUserId(userId);

    return this.tbdex.fetchOfferings()
      .then(offerings => {
        let payinMethods: CreateTransferResponse['payinMethods'] = [];
        this.searchOfferings(offerings, payinCurrencyCode, payoutCurrencyCode, offering => {
          offering.data.payin.methods.forEach(method => {
            if (isPaymentKind(method.kind)) {
              payinMethods.push({ kind: method.kind, fields: extractRequiredPaymentDetails(method.requiredPaymentDetails) });
              return;
            }
            usersLogger.warn(
              `[startTransfer] Unknown payment kind: ${method.kind}`,
              { userId, payinCurrencyCode, payoutCurrencyCode, pfiDid: offering.metadata.from, offeringId: offering.id }
            );
          });
        });

        if (payinMethods.length === 0) throw new ServerError({ code: ErrorCode.ROUTE_NOT_FOUND });
        const insert = this.db.insertTransfer({
          userId,
          payinCurrencyCode,
          payoutCurrencyCode,
          status: TransactionStatus.CREATED,
          createdAt: now,
          lastUpdatedAt: now
        });

        return wallets.then(wallets => {
          wallets = wallets.filter(wallet => wallet.currencyCode === payinCurrencyCode)
          if (wallets.length > 0) {
            payinMethods = [{ kind: PaymentKind.WALLET_ADDRESS, fields: ['walletId'] }, ...payinMethods];
          }
          // TODO Add Saved card option if credit card exists among methods
          return insert.then((transfer) => ({ id: transfer.id, payinMethods }));
        });
      });
  }

  private searchOfferings(offerings: { offerings: Offering[] }[], payinCurrencyCode: string, payoutCurrencyCode: string, callback: (offering: Offering) => void) {
    offerings.forEach(({ offerings }) => {
      offerings.forEach(offering => {
        if (offering.data.payin.currencyCode != payinCurrencyCode) return;
        if (offering.data.payout.currencyCode != payoutCurrencyCode) return;
        callback(offering);
      });
    });
  }

  getTransfers(userId: ID): Promise<Transfer[]> {
    return this.db.findTransfersByUserIdAndStatus(userId, [TransactionStatus.PROCESSING, TransactionStatus.SUCCESS, TransactionStatus.CANCELLED, TransactionStatus.FAILED])
      .then((transfers) => transfers.map(transfer => ({
        id: transfer.id,
        payinCurrencyCode: transfer.payinCurrencyCode,
        payoutCurrencyCode: transfer.payoutCurrencyCode,
        payinAmount: transfer.payinAmount,
        payoutAmount: transfer.payoutAmount,
        fee: transfer.fee,
        payinKind: transfer.payinKind,
        payoutKind: transfer.payoutKind,
        narration: transfer.narration,
        status: transfer.status,
        createdAt: transfer.createdAt,
        lastUpdatedAt: transfer.lastUpdatedAt
      })));
  }

  getTransfer(id: ID, userId: ID): Promise<Transfer> {
  return this.db.findTransferByIdAndUserId(id, userId)
    .then(transfer => {
      if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
      return {
        id: transfer.id,
        payinCurrencyCode: transfer.payinCurrencyCode,
        payoutCurrencyCode: transfer.payoutCurrencyCode,
        payinAmount: transfer.payinAmount,
        payoutAmount: transfer.payoutAmount,
        fee: transfer.fee,
        payinKind: transfer.payinKind,
        payoutKind: transfer.payoutKind,
        narration: transfer.narration,
        status: transfer.status,
        createdAt: transfer.createdAt,
        lastUpdatedAt: transfer.lastUpdatedAt
      };
    });
  }

  saveTransferPayinData(userId: ID, transferId: ID, data: PayinRequestBody): Promise<PayinUpdateResponse> {
    const now = new Date();
    const wallets = this.db.findWalletsByUserId(userId);
    const offerings = this.tbdex.fetchOfferings();

    return this.db.findTransferByIdAndUserId(transferId, userId)
      .then(transfer => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        return offerings.then(offerings => {
          const payoutMethods: PayinUpdateResponse = [{ kind: PaymentKind.WALLET_ADDRESS, fields: ['walletId'] }];

          this.searchOfferings(offerings, transfer.payinCurrencyCode, transfer.payoutCurrencyCode, offering => {
            // Payout Methods is narrowed by selected Payin Method
            if (!offering.data.payin.methods.find(method => data.kind == PaymentKind.WALLET_ADDRESS || method.kind == data.kind)) return;

            offering.data.payout.methods.forEach(method => {
              if (isPaymentKind(method.kind)) {
                payoutMethods.push({ kind: method.kind, fields: extractRequiredPaymentDetails(method.requiredPaymentDetails) });
                return;
              }
              usersLogger.warn(
                `[saveTransferPayinData] Unknown payment kind: ${method.kind}`,
                { userId, payinCurrencyCode: transfer.payinCurrencyCode, payoutCurrencyCode: transfer.payoutCurrencyCode, pfiDid: offering.metadata.from, offeringId: offering.id }
              );
            });
          });

          // If no payout methods was found, the payin method was not returned from create transfer request
          // There's a chance that the payin method was among returned list but no payout methods were found but we don't care about that
          if (payoutMethods.length === 0) throw new ServerError({ code: ErrorCode.UNSUPPORTED_METHOD });

          return wallets.then(wallets => {
            const selectedWallet = wallets.find((wallet) => wallet.id == data.walletId);
            if (data.kind == PaymentKind.WALLET_ADDRESS && !selectedWallet)
              throw new ServerError({ code: ErrorCode.FORBIDDEN });
            if (data.kind == PaymentKind.WALLET_ADDRESS && selectedWallet.currencyCode != transfer.payinCurrencyCode)
              throw new ServerError({ code: ErrorCode.WALLET_CURRENCY_MISMATCH });

            return this.db.updateTransferById(transferId, {
              ...transfer,
              payinKind: data.kind,
              payinWalletId: data.walletId, // TODO add card support
              payinAccountNumber: data.accountNumber,
              payinRoutingNumber: data.routingNumber,
              payinSortCode: data.sortCode,
              payinBSB: data.BSB,
              payinIBAN: data.IBAN,
              payinCLABE: data.CLABE,
              payinAddress: data.address,
              lastUpdatedAt: now
            }).then(() => payoutMethods);
          });
        });
      });
  }

  saveTransferPayoutData(userId: ID, transferId: ID, data: PayoutRequestBody): Promise<void> {
    const now = new Date();
    const selectedWallet = this.db.findWalletsByUserId(userId)
      .then(wallets => wallets.find((wallet) => wallet.id == data.walletId));

    return this.db.findTransferByIdAndUserId(transferId, userId)
      .then(transfer => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        return selectedWallet.then(selectedWallet => {
          if (data.kind == PaymentKind.WALLET_ADDRESS && !selectedWallet)
            throw new ServerError({ code: ErrorCode.FORBIDDEN });
          if (data.kind == PaymentKind.WALLET_ADDRESS && selectedWallet.currencyCode != transfer.payoutCurrencyCode)
            throw new ServerError({ code: ErrorCode.WALLET_CURRENCY_MISMATCH });

          return this.db.updateTransferById(transferId, {
            ...transfer,
            payoutKind: data.kind,
            payoutWalletId: data.walletId,
            payoutAccountNumber: data.accountNumber,
            payoutRoutingNumber: data.routingNumber,
            payoutSortCode: data.sortCode,
            payoutBSB: data.BSB,
            payoutIBAN: data.IBAN,
            payoutCLABE: data.CLABE,
            payoutAddress: data.address,
            lastUpdatedAt: now
          }).then(() => { });
        })
      });
  }

  getNewPaymentDetails(wallet: Wallet): Promise<Partial<Omit<PaymentDetails, 'walletId'>>> {
    let kind: PaymentKind = null;
    let bankTransferKind = `${wallet.currencyCode}_BANK_TRANSFER`;
    let addressKind = `${wallet.currencyCode}_WALLET_ADDRESS`;
    if (isPaymentKind(bankTransferKind)) kind = bankTransferKind;
    else if (isPaymentKind(addressKind)) kind = addressKind;
    else throw new Error(`Cannot determine Payment Kind for ${wallet.currencyCode}`);

    const newPaymentDetails: { kind: PaymentKind } & Partial<Omit<PaymentDetails, 'walletId'>> = { kind };

    const fieldsToGenerate: Array<keyof PaymentDetails> = {
      [PaymentKind.BTC_WALLET_ADDRESS]: ['address'],
      [PaymentKind.AUD_BANK_TRANSFER]: ['accountNumber', 'BSB'],
      [PaymentKind.USDC_WALLET_ADDRESS]: ['address'],
      [PaymentKind.NGN_BANK_TRANSFER]: ['accountNumber', 'bankCode'],
      [PaymentKind.USD_BANK_TRANSFER]: ['accountNumber', 'routingNumber'],
      [PaymentKind.KES_BANK_TRANSFER]: ['accountNumber'],
      [PaymentKind.EUR_BANK_TRANSFER]: ['accountNumber', 'IBAN'],
      [PaymentKind.GBP_BANK_TRANSFER]: ['accountNumber', 'sortCode'],
      [PaymentKind.MXN_BANK_TRANSFER]: ['accountNumber', 'CLABE'],
      [PaymentKind.GHS_BANK_TRANSFER]: ['accountNumber'],
    }[kind] ?? [];

    if (fieldsToGenerate.length === 0) {
      // If no additional fields are required, resolve with the basic details
      return Promise.resolve(newPaymentDetails);
    }

    // Generate random values for the required fields
    fieldsToGenerate.forEach(field => {
      if (field === 'accountNumber' || field === 'routingNumber') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      } else if (field === 'bankCode') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      } else if (field === 'sortCode') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      } else if (field === 'BSB') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      } else if (field === 'IBAN') {
        newPaymentDetails[field] = 'GB' + Math.floor(Math.random() * 100000000000000000000).toString().padStart(22, '0');
      } else if (field === 'CLABE') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000000000000000).toString().padStart(18, '0');
      } else if (field === 'address') {
        newPaymentDetails[field] = '0x' + Math.floor(Math.random() * 1000);
      }
    });

    // Save the new payment details to the database
    return this.db.insertWalletPaymentDetails(wallet.id, {
      ...newPaymentDetails,
      walletId: wallet.id,
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    })
      .then(() => newPaymentDetails);
  }

  generatePayinPaymentDetailsFor(wallet: Wallet): Partial<Omit<PaymentDetails, 'walletId'>> {
    let kind: PaymentKind = null;
    let bankTransferKind = `${wallet.currencyCode}_BANK_TRANSFER`;
    let addressKind = `${wallet.currencyCode}_WALLET_ADDRESS`;
    if (isPaymentKind(bankTransferKind)) kind = bankTransferKind;
    else if (isPaymentKind(addressKind)) kind = addressKind;
    else throw new Error(`Cannot determine Payment Kind for ${wallet.currencyCode}`);

    const newPaymentDetails: { kind: PaymentKind } & Partial<Omit<PaymentDetails, 'walletId'>> = { kind };

    const fieldsToGenerate: Array<keyof PaymentDetails> = {
      [PaymentKind.BTC_WALLET_ADDRESS]: ['address'],
      [PaymentKind.AUD_BANK_TRANSFER]: ['accountNumber', 'BSB'],
      [PaymentKind.USDC_WALLET_ADDRESS]: ['address'],
      [PaymentKind.NGN_BANK_TRANSFER]: ['accountNumber', 'bankCode'],
      [PaymentKind.USD_BANK_TRANSFER]: ['accountNumber', 'routingNumber'],
      [PaymentKind.KES_BANK_TRANSFER]: ['accountNumber'],
      [PaymentKind.EUR_BANK_TRANSFER]: ['accountNumber', 'IBAN'],
      [PaymentKind.GBP_BANK_TRANSFER]: ['accountNumber', 'sortCode'],
      [PaymentKind.MXN_BANK_TRANSFER]: ['accountNumber', 'CLABE'],
      [PaymentKind.GHS_BANK_TRANSFER]: ['accountNumber'],
    }[kind] ?? [];

    if (fieldsToGenerate.length === 0) {
      // If no additional fields are required, resolve with the basic details
      return newPaymentDetails;
    }

    // Generate random values for the required fields
    fieldsToGenerate.forEach(field => {
      if (field === 'accountNumber' || field === 'routingNumber') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      } else if (field === 'bankCode') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      } else if (field === 'sortCode') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      } else if (field === 'BSB') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      } else if (field === 'IBAN') {
        newPaymentDetails[field] = 'GB' + Math.floor(Math.random() * 100000000000000000000).toString().padStart(22, '0');
      } else if (field === 'CLABE') {
        newPaymentDetails[field] = Math.floor(Math.random() * 1000000000000000000).toString().padStart(18, '0');
      } else if (field === 'address') {
        newPaymentDetails[field] = '0x' + Math.floor(Math.random() * 1000);
      }
    });

    return newPaymentDetails;
  }

  saveTransferAmount(user: User, transferId: ID, data: TransferAmountUpdateRequestBody): Promise<TransferSummary> {
    const now = new Date();

    return Promise.all([
      this.db.findTransferByIdAndUserId(transferId, user.id),
      this.db.findWalletsByUserId(user.id),
      this.db.findCredentialsForUserId(user.id)
    ]).then(async ([transfer, wallets, credentials]) => {
      if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
      const payinWallet: Wallet | undefined = wallets.find((wallet: Wallet) => wallet.id == transfer.payinWalletId);
      const payoutWallet: Wallet | undefined = wallets.find((wallet: Wallet) => wallet.id == transfer.payoutWalletId);

      if (transfer.payinKind === PaymentKind.WALLET_ADDRESS && !payinWallet)
        throw new ServerError({ code: ErrorCode.NOT_FOUND, data: `Payin Wallet with id ${transfer.payinWalletId} not found for transfer ${transferId}` });
      if (transfer.payoutKind === PaymentKind.WALLET_ADDRESS && !payoutWallet)
        throw new ServerError({ code: ErrorCode.NOT_FOUND, data: `Payout Wallet with id ${transfer.payoutWalletId} not found for transfer ${transferId}` });

      const transferQuoteReq = { ...transfer, payoutAmount: parseFloat(data.amount) };
      if (transfer.payinKind === PaymentKind.WALLET_ADDRESS) {
        const paymentDetails = this.generatePayinPaymentDetailsFor(payinWallet);
        transferQuoteReq.payinKind = paymentDetails.kind;
        transferQuoteReq.payinAccountNumber = paymentDetails.accountNumber;
        transferQuoteReq.payinRoutingNumber = paymentDetails.routingNumber;
        transferQuoteReq.payinBankCode = paymentDetails.bankCode;
        transferQuoteReq.payinSortCode = paymentDetails.sortCode;
        transferQuoteReq.payinBSB = paymentDetails.BSB;
        transferQuoteReq.payinIBAN = paymentDetails.IBAN;
        transferQuoteReq.payinCLABE = paymentDetails.CLABE;
        transferQuoteReq.payinAddress = paymentDetails.address;
      }
      if (transfer.payoutKind === PaymentKind.WALLET_ADDRESS) {
        const paymentDetails = await this.getNewPaymentDetails(payoutWallet);
        transferQuoteReq.payoutKind = paymentDetails.kind;
        transferQuoteReq.payoutAccountNumber = paymentDetails.accountNumber;
        transferQuoteReq.payoutRoutingNumber = paymentDetails.routingNumber;
        transferQuoteReq.payoutBankCode = paymentDetails.bankCode;
        transferQuoteReq.payoutSortCode = paymentDetails.sortCode;
        transferQuoteReq.payoutBSB = paymentDetails.BSB;
        transferQuoteReq.payoutIBAN = paymentDetails.IBAN;
        transferQuoteReq.payoutCLABE = paymentDetails.CLABE;
        transferQuoteReq.payoutAddress = paymentDetails.address;
      }

      softAssert(usersLogger, !user.did, `[saveTransferAmount] User ${user.id} has no DID`);
      const quotes = await this.tbdex.getQuotes(
        transferQuoteReq,
        user.did ?? "",
        credentials.map((cred: UserCredential) => cred.value)
      );

      // Select the Best Quote
      // The best quote is the quote where the user pays the least
      // @ts-ignore
      const bestQuote: { totalPayIn: number, pfi: PFI, quote: Quote } = quotes.reduce((best: { totalPayIn: number, pfi: PFI, quote: Quote }, { pfi, quote }) => {
        const totalPayIn = quote.data.payin.amount;
        if (best.totalPayIn > parseFloat(totalPayIn)) return { totalPayIn: parseFloat(totalPayIn), quote, pfi };
        return best;
      }, { totalPayIn: Infinity, quote: null, pfi: null });

      if (bestQuote.quote === null || bestQuote.pfi === null) throw new ServerError({ code: ErrorCode.UNEXPECTED_ERROR, data: `Could not get quote for ${transferId}` });

      const payinTotal = bestQuote.totalPayIn;
      const payinSubTotal = parseFloat(bestQuote.quote.data.payin.amount);
      const payinFee = parseFloat(bestQuote.quote.data.payin.fee ?? "0");

      if (payinWallet && payinWallet.balance < payinTotal) throw new ServerError({ code: ErrorCode.WALLET_INSUFFICIENT_BALANCE });

      this.cache.set(CacheKeys.TRANSFER_QUOTE(transferId), bestQuote, (new Date(bestQuote.quote.data.expiresAt).getTime() - Date.now())); // Cache quote until it expires
      await this.db.updateTransferById(
        transferId,
        {
          ...transfer,
          pfiId: bestQuote.pfi.id,
          fee: payinFee,
          payinAmount: payinSubTotal,
          payoutAmount: parseFloat(data.amount),
          narration: data.narration,
          lastUpdatedAt: now
        }
      );

      return {
        payin: {
          currencyCode: transfer.payinCurrencyCode,
          amount: payinSubTotal.toString(),
          fee: payinFee.toString(),
          paymentInstructions: "Demo Instructions"
        },
        payout: {
          currencyCode: transfer.payoutCurrencyCode,
          amount: data.amount,
          kind: transfer.payoutKind,
          walletId: transfer.payoutWalletId,
          accountNumber: transfer.payoutAccountNumber,
          routingNumber: transfer.payoutRoutingNumber,
          sortCode: transfer.payoutSortCode,
          BSB: transfer.payoutBSB,
          IBAN: transfer.payoutIBAN,
          CLABE: transfer.payoutCLABE,
          address: transfer.payoutAddress
        }
      };
    });
  }

  confirmTransfer(user: User, transferId: ID): Promise<void> {
    const now = new Date();
    return Promise.all([
      this.db.findTransferByIdAndUserId(transferId, user.id),
      this.cache.get<{ pfi: PFI, quote: Quote }>(CacheKeys.TRANSFER_QUOTE(transferId))
    ]).then(async ([transfer, quote]) => {
      if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
      if (quote === null) throw new ServerError({ code: ErrorCode.OFFER_EXPIRED });
      softAssert(usersLogger, !user.did, `[confirmTransfer] User ${user.id} has no DID`);
      await this.tbdex.sendOrder(user.did ?? "", quote.quote, (msg, err) => {
        if (err) {
          usersLogger.error(`[confirmTransfer] ${err.message}`, { transferId, userId: user.id });
          return;
        }
        if (msg === null) return;
        this.handleTransferComplete(transferId, user.id, msg.data.success);
      });
      const reference = quote.quote.exchangeId;
      const transactions: Omit<TransactionModel, 'id' | 'transferId'>[] = [];
      if (transfer.payinWalletId) {
        transactions.push({
          narration: transfer.narration,
          type: 'DEBIT',
          walletId: transfer.payinWalletId,
          reference,
          currencyCode: transfer.payinCurrencyCode,
          amount: transfer.payinAmount + transfer.fee,
          userId: user.id,
          createdAt: now,
          lastUpdatedAt: now
        })
      }
      // TODO Add processing fee
      await this.db.updateTransferById(
        transferId,
        { ...transfer, reference, status: TransactionStatus.PROCESSING, lastUpdatedAt: now },
        transactions
      );
    });
  }

  private handleTransferComplete(transferId: ID, userId: ID, success: boolean = false): Promise<void> {
    const status = success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
    return this.db.findTransferByIdAndUserId(transferId, userId)
      .then(transfer => {
        if (transfer.status === TransactionStatus.CANCELLED) return;
        const transactions: Omit<TransactionModel, 'id' | 'transferId'>[] = [];
        if (transfer.payoutWalletId && success) {
          transactions.push({
            narration: transfer.narration,
            walletId: transfer.payoutWalletId,
            reference: transfer.reference,
            currencyCode: transfer.payoutCurrencyCode,
            amount: transfer.payoutAmount,
            userId: userId,
            type: 'CREDIT',
            createdAt: new Date(),
            lastUpdatedAt: new Date()
          });
        }
        if (transfer.payinWalletId && !success) {
          // Refund user
          transactions.push({
            narration: "Reversal",
            walletId: transfer.payinWalletId,
            reference: transfer.reference,
            currencyCode: transfer.payinCurrencyCode,
            amount: transfer.payinAmount + transfer.fee,
            userId: userId,
            type: 'CREDIT',
            createdAt: new Date(),
            lastUpdatedAt: new Date()
          });
        }

        return this.db.updateTransferById(transferId, { ...transfer, status, lastUpdatedAt: new Date() }, transactions).then(() => { });
      })
      .catch(err => { usersLogger.error(`[handleTransferComplete] ${err.message}`, { transferId, userId, success }) });
  }

  cancelTransfer(userId: ID, transferId: ID): Promise<void> {
    const now = new Date();
    return this.db.findTransferByIdAndUserId(transferId, userId)
      .then(async (transfer) => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        if (transfer.status !== TransactionStatus.PROCESSING) throw new ServerError({ code: ErrorCode.INVALID_STATE, data: { validStates: [TransactionStatus.PROCESSING], currentState: transfer.status } });

        await this.db.updateTransferById(
          transferId,
          { ...transfer, status: TransactionStatus.CANCELLED, lastUpdatedAt: now },
          []
        );
      });
  }

  getTransferStatus(user: User, transferId: ID): Promise<{ status: TransactionStatus }> {
    return new Promise((resolve, reject) => {
      this.db.findTransferByIdAndUserId(transferId, user.id)
        .then((transfer) => {
          if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
          if (transfer.status == TransactionStatus.PROCESSING) {
            softAssert(usersLogger, !user.did, `[getTransferStatus] User ${user.id} has no DID`);
            return this.tbdex.watchExchange(user.did ?? "", transfer.pfi.did, transfer.reference, (msg, err) => {
              if (err) {
                usersLogger.error(`[getTransferStatus] ${err.message}`, { transferId, userId: user.id });
                return;
              }
              if (msg === null) return;
              this.handleTransferComplete(transferId, user.id, msg.data.success)
                .then(() => this.db.findTransferByIdAndUserId(transferId, user.id))
                .then((transfer) => resolve({ status: transfer.status }))
                .catch(err => reject(err));
            }).then((watching) => {
              if (watching) return { status: transfer.status };
            });
          }
          resolve({ status: transfer.status });
        })
        .catch(err => { reject(err) });
    });
  }

  saveBeneficiary(userId: ID, transferId: ID): Promise<void> {
    const now = new Date();
    return Promise.all([
      this.db.findTransferByIdAndUserId(transferId, userId),
      this.getBeneficiaries(userId)
    ])
      .then(([transfer, beneficiaries]) => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });

        // Check for duplicate beneficiary
        const duplicate = beneficiaries.find((beneficiary: Beneficiary) => {
          if (beneficiary.kind !== transfer.payoutKind) return false;
          if (beneficiary.accountNumber !== transfer.payoutAccountNumber) return false;
          if (beneficiary.routingNumber !== transfer.payoutRoutingNumber) return false;
          if (beneficiary.sortCode !== transfer.payoutSortCode) return false;
          if (beneficiary.BSB !== transfer.payoutBSB) return false;
          if (beneficiary.IBAN !== transfer.payoutIBAN) return false;
          if (beneficiary.CLABE !== transfer.payoutCLABE) return false;
          if (beneficiary.address !== transfer.payoutAddress) return false;
          return true;
        });
        if (duplicate) throw new ServerError({ code: ErrorCode.DUPLICATE_BENEFICIARY });

        return this.db.insertBeneficiary({
          userId,
          kind: transfer.payoutKind,
          accountNumber: transfer.payoutAccountNumber,
          routingNumber: transfer.payoutRoutingNumber,
          sortCode: transfer.payoutSortCode,
          BSB: transfer.payoutBSB,
          IBAN: transfer.payoutIBAN,
          CLABE: transfer.payoutCLABE,
          address: transfer.payoutAddress,
          createdAt: now,
          lastUpdatedAt: now
        }).then(() => { });
      });
  }

  saveTransferFeedback(userId: ID, transferId: ID, speedOfSettlementRating: number): Promise<void> {
    return this.db.findTransferByIdAndUserId(transferId, userId)
      .then((transfer) => {
        if (transfer === null) throw new ServerError({ code: ErrorCode.NOT_FOUND });
        const validStates = [TransactionStatus.FAILED, TransactionStatus.SUCCESS];
        if (!validStates.includes(transfer.status))
          throw new ServerError({ code: ErrorCode.INVALID_STATE, data: { validStates, currentState: transfer.status } });
        // TODO rate pfi
        return;
      });
  }
}
