import test from 'ava';
import http from 'node:http';
import listen from 'test-listen';
import axios from 'axios';
import MakeApp from '../src/app.js';
import { loadPfis } from '../src/load_pfis.js';
import { Users } from '../src/features/users.js';
import { TBDexService } from '../src/features/tbdex.js';
import { UsersDbImpl, TBDexDBImpl, AutoFunderDBImpl } from '../src/sqlite/db_impl.js';
import { InMemoryCache } from '../src/cache.js';
import sqlite3 from 'sqlite3';
import Migrate from '../src/sqlite/schema.js';
import { CreateTransferResponse, PayinUpdateResponse, SavingsPlan, TransactionStatus, TransferSummary } from '../src/types.js';
import { ErrorCode } from '../src/error_codes.js';
import { AutoFunder } from '../src/features/autofund.js';

test.serial("End-to-end test", async (t) => {
    t.timeout(300000);
    // Setup database and services
    const db = new sqlite3.Database(':memory:');
    Migrate(db);
    const usersDb = new UsersDbImpl(db);
    const tbdexDb = new TBDexDBImpl(db);
    const cache = new InMemoryCache();
    const tbdex = new TBDexService(cache, tbdexDb);
    const users = new Users(usersDb, tbdex, cache);
    const autoFunder = new AutoFunder(new AutoFunderDBImpl(db), usersDb, users, tbdex);

    // Load PFIs
    await loadPfis(db);

    // Register a user
    const email = 'test@example.com';
    const password = 'testPassword123!';

    // Start the server
    const { app } = MakeApp({ port: 0 }, users, tbdex, autoFunder);
    const server = http.createServer(app);
    const prefixUrl = await listen(server);
    const client = axios.create({ baseURL: prefixUrl });

    // Register the user
    await client.post('/register', { email, password, firstname: "Adam", lastname: "TheFirst", country: "Nigeria", phoneNumber: "+2349111111111" });

    // Authenticate the user
    const { data: { token } } = await client.post('/login', { email, password });
    client.defaults.headers.common['Authorization'] = token;

    // Get user's wallets
    const { data: wallets } = await client.get('/wallets');

    const waitUntilTransferComplete = (transferId: unknown) => new Promise<TransactionStatus>((resolve, reject) => {
        const interval = setInterval(() => {
            client.get<{ status: TransactionStatus }>(`/transfers/${transferId}/status`)
                .then(({ data: { status } }) => {
                    if (status !== TransactionStatus.PROCESSING) {
                        resolve(status);
                        clearInterval(interval);
                    }
                }).catch(err => reject(err));
        }, 5000);
    });

    // Define supported currency pairs
    const currencyPairs = [
        { from: 'GHS', to: 'USDC' },
        { from: 'NGN', to: 'KES' },
        { from: 'KES', to: 'USD' },
        { from: 'USD', to: 'KES' },
        { from: 'USD', to: 'EUR' },
        { from: 'EUR', to: 'USD' },
        { from: 'USD', to: 'GBP' },
        { from: 'USD', to: 'BTC' },
        { from: 'EUR', to: 'USDC' },
        { from: 'EUR', to: 'GBP' },
        { from: 'USD', to: 'AUD' },
        { from: 'USD', to: 'MXN' }
    ];

    // Perform transfers from bank accounts to user wallets
    for (const pair of currencyPairs) {
        const { from, to } = pair;
        t.log("Transfer from ", from, " bank account to ", to, " wallet");

        const toWallet = wallets.find(w => w.currencyCode === to);

        if (toWallet) {
            const amount = '100';
            const payinKind = ["BTC", "USDC"].includes(from) ? `${from}_WALLET_ADDRESS` : `${from}_BANK_TRANSFER`;
            const payoutKind = 'WALLET_ADDRESS';

            const { data } = await client.post<CreateTransferResponse>(`/transfers/start/${from}/${to}`, {});
            t.truthy(data.id);
            t.truthy(data.payinMethods.find((v) => v.kind == payinKind));

            const { data: payoutMethods } = await client.post<PayinUpdateResponse>(`/transfers/${data.id}/payin`, {
                kind: payinKind,
                accountNumber: "123456789",
                routingNumber: "123456789",
                bankCode: "123456",
                sortCode: "123456",
                BSB: "123456",
                IBAN: "123456789",
                CLABE: "12345",
                address: "0xabc123f"
            });
            t.truthy(payoutMethods.find((v) => v.kind == payoutKind));

            await client.post(`/transfers/${data.id}/payout`, {
                kind: payoutKind, walletId: toWallet.id
            });

            const { data: summary } = await client.post<TransferSummary>(`/transfers/${data.id}/amount`, { amount });
            t.is(summary.payout.currencyCode, toWallet.currencyCode);
            t.is(summary.payout.amount, amount);

            await client.post(`/transfers/${data.id}/confirm`, {});
            const status = await waitUntilTransferComplete(data.id);
            t.is(status, TransactionStatus.SUCCESS);
        }
    }

    // Perform transfers from user wallets to bank accounts
    for (const pair of currencyPairs) {
        const { from, to } = pair;
        t.log("Transfer from ", from, " wallet ", to, " bank account");

        const fromWallet = wallets.find(w => w.currencyCode === from);

        if (fromWallet) {
            const amount = '50';
            const payinKind = 'WALLET_ADDRESS';
            const payoutKind = ["BTC", "USDC"].includes(to) ? `${to}_WALLET_ADDRESS` : `${to}_BANK_TRANSFER`;

            try {
                const { data } = await client.post<CreateTransferResponse>(`/transfers/start/${from}/${to}`, {});
                t.truthy(data.id);
                t.truthy(data.payinMethods.find((v) => v.kind == payinKind));

                const { data: payoutMethods } = await client.post<PayinUpdateResponse>(`/transfers/${data.id}/payin`, {
                    kind: payinKind,
                    walletId: fromWallet.id
                });
                t.truthy(payoutMethods.find((v) => v.kind == payoutKind));

                await client.post(`/transfers/${data.id}/payout`, {
                    kind: payoutKind,
                    accountNumber: "987654321",
                    routingNumber: "987654321",
                    bankCode: "654321",
                    sortCode: "654321",
                    BSB: "654321",
                    IBAN: "987654321",
                    CLABE: "54321",
                    address: "0xdef456g"
                });

                const { data: summary } = await client.post<TransferSummary>(`/transfers/${data.id}/amount`, { amount });
                t.is(summary.payin.currencyCode, from);
                t.is(summary.payout.amount, amount);
                t.is(summary.payout.currencyCode, to);

                await client.post(`/transfers/${data.id}/confirm`, {});
                const status = await waitUntilTransferComplete(data.id);
                t.is(status, TransactionStatus.SUCCESS);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.code !== ErrorCode.WALLET_INSUFFICIENT_BALANCE) {
                    t.fail(`Expected ErrorCode.WALLET_INSUFFICIENT_BALANCE, but got ${err.response.data.code}`);
                    return;
                }
                t.log(`${from} Wallet has insufficent balance`);
            }
        }
    }

    // Create a BTC savings plan
    t.log("Creating a BTC savings plan");
    const createSavingsPlanResponse = await client.post<SavingsPlan>('/savings-plans', {
        name: 'BTC Savings',
        currencyCode: 'BTC',
        durationInMonths: 6
    });
    t.truthy(createSavingsPlanResponse.data.id);
    t.is(createSavingsPlanResponse.data.currencyCode, 'BTC');
    t.is(createSavingsPlanResponse.data.durationInMonths, 6);
    t.is(createSavingsPlanResponse.data.state, 'ACTIVE');

    const savingsPlanId = createSavingsPlanResponse.data.id;

    // Transfer 10 USD into the BTC savings plan
    t.log("Transferring 10 USD to BTC savings plan");
    const usdWallet = wallets.find(w => w.currencyCode === 'USD');
    
    if (usdWallet) {
        try {
            const { data: transferData } = await client.post<CreateTransferResponse>('/transfers/start/USD/BTC', {});
            t.truthy(transferData.id);

            await client.post(`/transfers/${transferData.id}/payin`, {
                kind: 'WALLET_ADDRESS',
                walletId: usdWallet.id
            });

            await client.post(`/transfers/${transferData.id}/payout`, {
                kind: 'WALLET_ADDRESS',
                walletId: savingsPlanId
            });

            const { data: summary } = await client.post<TransferSummary>(`/transfers/${transferData.id}/amount`, { amount: '0.00033' });
            t.is(summary.payin.currencyCode, 'USD');
            t.is(summary.payout.currencyCode, 'BTC');

            await client.post(`/transfers/${transferData.id}/confirm`, {});
            const status = await waitUntilTransferComplete(transferData.id);
            t.is(status, TransactionStatus.SUCCESS);

            // Verify the balance of the savings plan
            const { data: updatedSavingsPlan } = await client.get<SavingsPlan>(`/savings-plans/${savingsPlanId}`);
            t.truthy(updatedSavingsPlan.balance === 0.00033);

            // Enable auto-fund for the savings plan
            t.log("Enabling auto-fund for the savings plan");
            await client.post(`/savings-plans/${savingsPlanId}/auto-fund/enable`, {
                walletId: `${usdWallet.id}`,
                amount: '10'
            });

            // Verify auto-fund is enabled
            const { data: savingsPlanWithAutoFund } = await client.get<SavingsPlan>(`/savings-plans/${savingsPlanId}`);
            t.true(savingsPlanWithAutoFund.autoFund);

            // Trigger auto-fund
            t.log("Triggering auto-fund");
            await client.post('/auto-fund');

            // Wait for a short period to allow auto-fund to process
            await new Promise(resolve => setTimeout(resolve, 30000));

            // Verify the updated balance of the savings plan
            const { data: finalSavingsPlan } = await client.get<SavingsPlan>(`/savings-plans/${savingsPlanId}`);
            t.is(finalSavingsPlan.balance, 0.00066); // Initial balance + auto-funded amount (assuming same exchange rate)
        } catch (err) {
            console.log(err.response.data);
            if (err.response && err.response.data && err.response.data.code !== ErrorCode.WALLET_INSUFFICIENT_BALANCE) {
                t.fail(`Expected successful transfer or ErrorCode.WALLET_INSUFFICIENT_BALANCE, but got ${err.response.data.code}`);
            } else {
                t.log('USD Wallet has insufficient balance for transfer to savings plan');
            }
        }
    } else {
        t.fail('USD wallet not found');
    }

    // Clean up
    await new Promise(resolve => server.close(resolve));
    t.pass('Server closed successfully');
});
