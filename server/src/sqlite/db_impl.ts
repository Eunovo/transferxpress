import { Database } from "sqlite3";
import { UsersDb, TBDexDB, AutoFunderDB } from "../db.js";
import {
  Beneficiary,
  User,
  UserCredential,
  Wallet,
  Transaction,
  TransactionReport,
  Transfer,
  SavedCard,
  PFI,
  WalletPaymentDetails,
  TransferFee
} from "../models.js";
import { InsertData } from "../utils.js";
import { ID, TransactionStatus } from "../types.js";

export class UsersDbImpl implements UsersDb {
  constructor(
    private db: Database
  ) { }

  findOneByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row as User);
      });
    });
  }

  findOneById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM Users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row as User);
      });
    });
  }

  insert(
    data: InsertData<User>,
    credentials: Omit<UserCredential, 'id' | 'userId' | 'createdAt' | 'lastUpdatedAt'>[] = [],
    wallets: Omit<Wallet, 'id' | 'userId' | 'createdAt' | 'lastUpdatedAt'>[] = []
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");
        const db = this.db;
        this.db.run(`
          INSERT INTO Users (email, password, firstname, lastname, country, did, createdAt, lastUpdatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [data.email, data.password, data.firstname, data.lastname, data.country, data.did, data.createdAt, data.lastUpdatedAt], function (err) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }
          const userId = this.lastID;

          db.run(`
            INSERT INTO UserCredentials (userId, key, value, createdAt, lastUpdatedAt)
            VALUES ${credentials.map(() => "(?, ?, ?, ?, ?)").join(", ")}
          `, credentials.reduce((acc: any, c: any) => acc.concat([userId, c.key, c.value, data.createdAt, data.lastUpdatedAt]), []), function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });

          db.run(`
            INSERT INTO Wallets (userId, currencyCode, balance, type, createdAt, lastUpdatedAt)
            VALUES ${wallets.map(() => "(?, ?, ?, ?, ?, ?)").join(", ")}
          `, wallets.reduce((acc: any, w: any) => acc.concat([userId, w.currencyCode, w.balance, w.type, data.createdAt, data.lastUpdatedAt]), []), function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });

          db.run("COMMIT");
          resolve({ ...data, id: userId });
        });
      });
    });
  }

  findCredentialsForUserId(userId: number): Promise<UserCredential[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM UserCredentials WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as UserCredential[]);
      });
    });
  }

  insertCredentials(data: InsertData<UserCredential>[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");
        const db = this.db;
        db.run(`
          INSERT INTO UserCredentials (userId, key, value, createdAt, lastUpdatedAt)
          VALUES ${data.map(() => "(?, ?, ?, ?, ?)").join(", ")}
        `, data.reduce((acc: any, c: any) => acc.concat([c.userId, c.key, c.value, c.createdAt, c.lastUpdatedAt]), []), function (err) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }
          db.run("COMMIT");
          resolve();
        });
      });
    });
  }

  findWalletsByUserId(userId: number, type?: Wallet['type']): Promise<Wallet[]> {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM Wallets WHERE userId = ?`;
      const params: any[] = [userId];

      if (type) {
        query += ` AND type = ?`;
        params.push(type);
      }

      this.db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Wallet[]);
      });
    });
  }

  findWallet(userId: ID, walletId: ID, type: Wallet["type"]): Promise<Wallet | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM Wallets WHERE id = ? AND userId = ? AND type = ?`,
        [walletId, userId, type],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          resolve(row as Wallet);
        }
      );
    });
  }

  createWallet(data: InsertData<Wallet>): Promise<ID> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO Wallets (userId, type, currencyCode, balance, name, planDurationInMonths, autoFundWalletId, autoFundAmount, maturityDate, createdAt, lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.userId,
        data.type,
        data.currencyCode,
        data.balance,
        data.name,
        data.planDurationInMonths,
        data.autoFundWalletId,
        data.autoFundAmount,
        data.maturityDate,
        data.createdAt,
        data.lastUpdatedAt
      ], function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  updateWallet(walletId: ID, data: Partial<Pick<Wallet, "autoFundWalletId" | "autoFundAmount" | "maturityDate">>): Promise<void> {
    return new Promise((resolve, reject) => {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (data.autoFundWalletId !== undefined) {
        updateFields.push('autoFundWalletId = ?');
        updateValues.push(data.autoFundWalletId);
      }

      if (data.autoFundAmount !== undefined) {
        updateFields.push('autoFundAmount = ?');
        updateValues.push(data.autoFundAmount);
      }

      if (data.maturityDate !== undefined) {
        updateFields.push('maturityDate = ?');
        updateValues.push(data.maturityDate);
      }

      if (updateFields.length === 0) {
        return resolve();
      }

      updateFields.push('lastUpdatedAt = ?');
      updateValues.push(new Date().toISOString());

      const query = `UPDATE Wallets SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(walletId);

      this.db.run(query, updateValues, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  insertWalletPaymentDetails(walletId: ID, data: InsertData<WalletPaymentDetails>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO WalletPaymentDetails (walletId, kind, accountNumber, routingNumber, bankCode, sortCode, BSB, IBAN, CLABE, address, createdAt, lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        walletId,
        data.kind,
        data.accountNumber,
        data.routingNumber,
        data.bankCode,
        data.sortCode,
        data.BSB,
        data.IBAN,
        data.CLABE,
        data.address,
        data.createdAt,
        data.lastUpdatedAt
      ], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  findTransactionById(id: ID): Promise<Transaction | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM Transactions WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row as Transaction);
      });
    });
  }

  findTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM Transactions WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Transaction[]);
      });
    });
  }

  findTransactionsByTransferId(transferId: number): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM Transactions WHERE transferId = ?`, [transferId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Transaction[]);
      });
    });
  }

  insertTransactionReport(data: InsertData<TransactionReport>, pfi: Pick<PFI, "id" | "blacklisted" | "rating">): Promise<TransactionReport> {
    return new Promise((resolve, reject) => {
      this.db.run("BEGIN TRANSACTION");
      const db = this.db;
      this.db.run(`
        INSERT INTO TransactionReports (transactionId, reason, other, createdAt, lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?)
      `, [data.transactionId, data.reason, data.other, data.createdAt, data.lastUpdatedAt], function (err) {
        if (err) {
          db.run("ROLLBACK");
          return reject(err);
        }
        const reportId = this.lastID;
        db.run(`UPDATE PFIs SET blacklisted = ?, rating = ? WHERE id = ?`, [pfi.blacklisted, pfi.rating, pfi.id], function (err) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }
          db.run("COMMIT");
          resolve({ ...data, id: reportId });
        });
      });
    });
  }

  insertSavedCard(data: InsertData<SavedCard>): Promise<SavedCard> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO SavedCards (cardNumber, cardHolderName, expiryMonth, expiryYear, cvv, userId, createdAt, lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [data.cardNumber, data.cardHolderName, data.expiryMonth, data.expiryYear, data.cvv, data.userId, data.createdAt, data.lastUpdatedAt], function (err) {
        if (err) return reject(err);
        resolve({ ...data, id: this.lastID });
      });
    });
  }

  findSavedCardsByUserId(userId: number): Promise<SavedCard[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM SavedCards WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as SavedCard[]);
      });
    });
  }

  findBeneficiariesByUserId(userId: number): Promise<Beneficiary[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM Beneficiaries WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Beneficiary[]);
      });
    });
  }

  insertBeneficiary(data: InsertData<Beneficiary>): Promise<Beneficiary> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO Beneficiaries (userId, kind, accountNumber, routingNumber, bankCode, sortCode, BSB, IBAN, CLABE, address, createdAt, lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          data.userId,
          data.kind,
          data.accountNumber,
          data.routingNumber,
          data.bankCode,
          data.sortCode,
          data.BSB,
          data.IBAN,
          data.CLABE,
          data.address,
          data.createdAt,
          data.lastUpdatedAt
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ ...data, id: this.lastID });
        });
    });
  }

  insertTransfer(data: InsertData<Transfer>): Promise<Transfer> {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO Transfers (
        userId,
        payinCurrencyCode,
        payoutCurrencyCode,
        pfiId,
        payinKind,
        payoutKind,
        payinAmount,
        payoutAmount,
        narration,
        payinWalletId,
        payoutWalletId,
        payinCardId,
        payinAccountNumber,
        payinRoutingNumber,
        payinBankCode,
        payinSortCode,
        payinBSB,
        payinIBAN,
        payinCLABE,
        payinAddress,
        payoutAccountNumber,
        payoutRoutingNumber,
        payoutBankCode,
        payoutSortCode,
        payoutBSB,
        payoutIBAN,
        payoutCLABE,
        payoutAddress,
        status,
        reference,
        createdAt,
        lastUpdatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          data.userId,
          data.payinCurrencyCode,
          data.payoutCurrencyCode,
          data.pfiId,
          data.payinKind,
          data.payoutKind,
          data.payinAmount,
          data.payoutAmount,
          data.narration,
          data.payinWalletId,
          data.payoutWalletId,
          data.payinCardId,
          data.payinAccountNumber,
          data.payinRoutingNumber,
          data.payinBankCode,
          data.payinSortCode,
          data.payinBSB,
          data.payinIBAN,
          data.payinCLABE,
          data.payinAddress,
          data.payoutAccountNumber,
          data.payoutRoutingNumber,
          data.payoutBankCode,
          data.payoutSortCode,
          data.payoutBSB,
          data.payoutIBAN,
          data.payoutCLABE,
          data.payoutAddress,
          data.status,
          data.reference,
          data.createdAt,
          data.lastUpdatedAt
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ ...data, id: this.lastID });
        });
    });
  }

  findTransfersByUserIdAndStatus(userId: number, statuses: TransactionStatus[] = []): Promise<Transfer[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT Transfers.*
        FROM Transfers
        WHERE Transfers.userId = ? ${statuses.length > 0 ? `AND Transfers.status IN (${statuses.map(() => "?").join(", ")})` : ""}
      `, [userId, ...statuses], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Transfer[]);
      });
    });
  }

  findTransferByIdAndUserId(id: number, userId: number): Promise<Transfer> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT Transfers.*, did, name
        FROM Transfers
        LEFT JOIN PFIs ON Transfers.pfiId = PFIs.id
        WHERE Transfers.id = ? AND Transfers.userId = ?
      `, [id, userId], (err, row) => {
        if (err) return reject(err);

        this.db.all(`SELECT * FROM TransferFees WHERE transferId = ?`, [id], (err, rows: TransferFee[]) => {
          if (err) return reject(err);

          const transfer = row as Transfer;
          transfer.pfi = {
            // @ts-ignore
            id: row.pfiId,
            // @ts-ignore
            did: row.did,
            // @ts-ignore
            name: row.name,
            createdAt: null,
            lastUpdatedAt: null
          };
          transfer.fees = rows;
          resolve(transfer);
        });
      });
    });
  }

  updateTransferById(
    id: number,
    data: InsertData<Transfer>,
    transactions: Omit<Transaction, 'id' | 'transferId'>[] = [],
    fees: Omit<TransferFee, 'id' | 'transferId'>[] = []
  ): Promise<void> {
    const walletUpdates: Map<ID, number> = transactions.reduce((acc, transaction) => {
      if (!transaction.walletId) return acc;
      const current = acc.get(transaction.walletId) || 0;
      if (transaction.type === "CREDIT") {
        acc.set(transaction.walletId, current + transaction.amount);
      } else {
        acc.set(transaction.walletId, current - transaction.amount);
      }
      return acc;
    }, new Map());

    return new Promise<void>((resolve, reject) => {
      this.db.serialize(() => {
        const db = this.db;
        this.db.run("BEGIN TRANSACTION");
        this.db.run(`
        UPDATE Transfers
        SET payinCurrencyCode = ?, payoutCurrencyCode = ?, pfiId = ?, payinKind = ?, payoutKind = ?, payinAmount = ?, payoutAmount = ?, narration = ?, payinWalletId = ?, payoutWalletId = ?, payinCardId = ?,
        payinAccountNumber = ?, payinRoutingNumber = ?, payinBankCode = ?, payinSortCode = ?, payinBSB = ?, payinIBAN = ?, payinCLABE = ?, payinAddress = ?,
        payoutAccountNumber = ?, payoutRoutingNumber = ?, payoutBankCode = ?, payoutSortCode = ?, payoutBSB = ?, payoutIBAN = ?, payoutCLABE = ?, payoutAddress = ?,
        status = ?, reference = ?, lastUpdatedAt = ?
        WHERE id = ?
      `,
          [
            data.payinCurrencyCode,
            data.payoutCurrencyCode,
            data.pfiId,
            data.payinKind,
            data.payoutKind,
            data.payinAmount,
            data.payoutAmount,
            data.narration,
            data.payinWalletId,
            data.payoutWalletId,
            data.payinCardId,
            data.payinAccountNumber,
            data.payinRoutingNumber,
            data.payinBankCode,
            data.payinSortCode,
            data.payinBSB,
            data.payinIBAN,
            data.payinCLABE,
            data.payinAddress,
            data.payoutAccountNumber,
            data.payoutRoutingNumber,
            data.payoutBankCode,
            data.payoutSortCode,
            data.payoutBSB,
            data.payoutIBAN,
            data.payoutCLABE,
            data.payoutAddress,
            data.status,
            data.reference,
            data.lastUpdatedAt,
            id
          ],
          function (err) {
            if (err) return db.run("ROLLBACK", () => reject(err));
            if (transactions.length === 0 && fees.length === 0) return db.run("COMMIT", () => resolve());
          });

        if (transactions.length > 0) {
          db.run(
            `
              INSERT INTO Transactions (transferId, userId, walletId, narration, type, currencyCode, amount, reference, createdAt, lastUpdatedAt)
              VALUES ${transactions.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
              `,
            transactions.reduce((acc: any, t: any) => acc.concat([id, t.userId, t.walletId, t.narration, t.type, t.currencyCode, t.amount, t.reference, t.createdAt, t.lastUpdatedAt]), []),
            function (err) { if (err) return db.run("ROLLBACK", () => reject(err)); });

          const iter = walletUpdates.entries();
          let entry = iter.next();
          let nextEntry;
          while (!entry.done) {
            nextEntry = iter.next();
            db.run(`UPDATE Wallets SET balance = balance + ? WHERE id = ?`, [entry.value[1], entry.value[0]], function (err) {
              if (err) db.run("ROLLBACK", () => reject(err));
              if (nextEntry.done && fees.length === 0) db.run("COMMIT", () => resolve());
            });
            entry = nextEntry;
          }
        }

        if (fees.length > 0) {
          db.run(
            `
              INSERT INTO TransferFees (transferId, name, amount, currencyCode, createdAt, lastUpdatedAt)
              VALUES ${fees.map(() => "(?, ?, ?, ?, ?, ?)")}
            `,
            fees.reduce((acc: any, f: any) => acc.concat([id, f.name, f.amount, f.currencyCode, f.createdAt, f.lastUpdatedAt]), []),
            function (err) {
              if (err) return db.run("ROLLBACK", () => reject(err));
              db.run("COMMIT", () => resolve());
            }
          );
        }
      });
    });
  }
}


export class TBDexDBImpl implements TBDexDB {
  constructor(
    private db: Database
  ) { }

  listPFIs(): Promise<PFI[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM PFIs WHERE NOT (blacklisted = 'true')`, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as PFI[]);
      });
    });
  }
}

export class AutoFunderDBImpl implements AutoFunderDB {
  constructor(
    private db: Database
  ) { }

  async listWalletsForFunding(): Promise<Iterator<Promise<Wallet[]>, null>> {
    let nextIndex = 0;
    let batchSize = 1000;
    let maxIndex = await new Promise<number>((resolve, reject) => this.db.get(
      `SELECT MAX(id) AS max_id from wallets
          WHERE type = 'SAVINGS'
          AND autoFundWalletId IS NOT NULL
          AND autoFundAmount IS NOT NULL`, [],
      (err, row: { max_id: number }) => {
        if (err) reject(err);
        resolve(row.max_id);
      }));

    return {
      next: () => {
        if (nextIndex >= maxIndex) return { value: null, done: true };

        let result = new Promise<Wallet[]>((resolve, reject) => this.db.all(`
          SELECT * FROM wallets
          WHERE type = 'SAVINGS'
          AND autoFundWalletId IS NOT NULL
          AND autoFundAmount IS NOT NULL
          AND id > ? AND id <= ?`,
          [nextIndex, nextIndex + batchSize], (err, rows: Wallet[]) => {
            if (err) return reject(err);
            resolve(rows);
          })
        );
        nextIndex = nextIndex + batchSize;
        return { value: result, done: false }
      }
    }
  }
}
