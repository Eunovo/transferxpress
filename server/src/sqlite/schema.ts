import { Database } from "sqlite3";

export default function(db: Database) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        country TEXT NOT NULL,
        did TEXT,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS UserCredentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currencyCode TEXT NOT NULL,
        balance REAL NOT NULL,
        type TEXT NOT NULL,
        name TEXT,
        planDurationInMonths INTEGER,
        autoFundWalletId INTEGER,
        autoFundAmount REAL,
        userId INTEGER NOT NULL,
        maturityDate TEXT,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id)
        FOREIGN KEY (autoFundWalletId) REFERENCES Wallets(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS WalletPaymentDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        walletId INTEGER NOT NULL,
        kind TEXT NOT NULL,
        accountNumber TEXT,
        routingNumber TEXT,
        bankCode TEXT,
        sortCode TEXT,
        BSB TEXT,
        IBAN TEXT,
        CLABE TEXT,
        address TEXT,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (walletId) REFERENCES Wallets(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS SavedCards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cardNumber TEXT NOT NULL,
        cardHolderName TEXT NOT NULL,
        expiryMonth INTEGER NOT NULL,
        expiryYear INTEGER NOT NULL,
        cvv TEXT NOT NULL,
        userId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Beneficiaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        kind TEXT NOT NULL,
        accountNumber TEXT,
        routingNumber TEXT,
        bankCode TEXT,
        sortCode TEXT,
        BSB TEXT,
        IBAN TEXT,
        CLABE TEXT,
        address TEXT,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS PFIs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        did TEXT NOT NULL,
        name TEXT NOT NULL,
        blacklisted BOOLEAN,
        rating REAL,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Transfers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        payinCurrencyCode TEXT NOT NULL,
        payoutCurrencyCode TEXT NOT NULL,
        pfiId INTEGER,
        payinKind TEXT,
        payoutKind TEXT,
        payinAmount REAL,
        payoutAmount REAL,
        narration TEXT,
        fee REAL,
        payinWalletId INTEGER,
        payoutWalletId INTEGER,
        payinCardId INTEGER,
        payinAccountNumber TEXT,
        payinRoutingNumber TEXT,
        payinBankCode TEXT,
        payinSortCode TEXT,
        payinBSB TEXT,
        payinIBAN TEXT,
        payinCLABE TEXT,
        payinAddress TEXT,
        payoutAccountNumber TEXT,
        payoutRoutingNumber TEXT,
        payoutBankCode TEXT,
        payoutSortCode TEXT,
        payoutBSB TEXT,
        payoutIBAN TEXT,
        payoutCLABE TEXT,
        payoutAddress TEXT,
        status TEXT NOT NULL,
        reference TEXT,
        speedOfSettlementRating REAL,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (pfiId) REFERENCES PFIs(id),
        FOREIGN KEY (payinWalletId) REFERENCES Wallets(id),
        FOREIGN KEY (payoutWalletId) REFERENCES Wallets(id),
        FOREIGN KEY (payinCardId) REFERENCES SavedCards(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        narration TEXT,
        type TEXT NOT NULL,
        currencyCode TEXT NOT NULL,
        amount REAL NOT NULL,
        reference TEXT NOT NULL,
        transferId INTEGER,
        walletId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (transferId) REFERENCES Transfers(id)
        FOREIGN KEY (walletId) REFERENCES Wallet(id) 
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS TransactionReports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transactionId INTEGER NOT NULL,
        reason TEXT NOT NULL,
        other TEXT,
        createdAt TEXT NOT NULL,
        lastUpdatedAt TEXT NOT NULL,
        FOREIGN KEY (transactionId) REFERENCES Transactions(id)
      )
    `);
  });
}
