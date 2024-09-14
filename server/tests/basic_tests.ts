import http from 'node:http';
import test from 'ava';
import listen from 'test-listen';
import sqlite3 from 'sqlite3';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import MakeApp from '../src/app.js';
import Migrate from '../src/sqlite/schema.js';
import { CacheKeys as UsersCacheKeys, Users } from '../src/features/users.js';
import { AutoFunderDBImpl, TBDexDBImpl, UsersDbImpl } from '../src/sqlite/db_impl.js';
import { CacheKeys as TBDCacheKeys, TBDexService } from '../src/features/tbdex.js';
import { CreateTransferResponse, PayinUpdateResponse, PaymentKind, ReportReason, TransactionStatus } from '../src/types.js';
import { Cache, InMemoryCache } from '../src/cache.js';
import { DIDs, CREDENTIALS, PARSED_DIDs, PFIs, OFFERINGs, PFI_OFFERINGs, TRANSFERs, TRANSACTIONS, CLOSEs } from './data.js';
import { AutoFunder } from '../src/features/autofund.js';

test.before(async (t: any) => {
	const now = new Date();

	const db = new sqlite3.Database(":memory:");
	Migrate(db);
	await new Promise<void>((resolve, reject) => {
		db.run(
			`INSERT INTO PFIs (id, name, did, rating, createdAt, lastUpdatedAt) VALUES ${Array(PFIs.length).fill("(?, ?, ?, ?, ?, ?)").join(", ")}`,
			PFIs.map(value => [value.id, value.name, value.did, value.rating, now.toISOString(), now.toISOString()]).flat(),
			function (err) {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			}
		);
	});

	const usersdb = new UsersDbImpl(db);
	const tbddb = new TBDexDBImpl(db);

	const cache: Cache = new InMemoryCache();
	const tbdex = new TBDexService(cache, tbddb);
	const users = new Users(usersdb, tbdex, cache);
	const autoFunder = new AutoFunder(new AutoFunderDBImpl(db), usersdb, users, tbdex);
	const { app } = MakeApp({ port: 0 }, users, tbdex, autoFunder);

	t.context.db = db;
	t.context.cache = cache;
	t.context.tbdex = tbdex;
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
	t.context.user = await new Promise((resolve, reject) => {
		const user = {
			email: "dummy@test.com",
			password: "password",
			firstname: "Dummy",
			lastname: "User",
			country: "Nigeria",
			did: DIDs[0],
			createdAt: now,
			lastUpdatedAt: now
		};
		db.serialize(function () {
			db.run(
				`INSERT INTO Users (email, password, firstname, lastname, country, did, createdAt, lastUpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[user.email, user.password, user.firstname, user.lastname, user.country, user.did, user.createdAt.toISOString(), user.lastUpdatedAt.toISOString()], function (err) {
					if (err) return reject(err);
				});
			db.run(
				`INSERT INTO UserCredentials (userId, key, value, createdAt, lastUpdatedAt) VALUES (?, ?, ?, ?, ?)`,
				[1, "kcc", CREDENTIALS[0], now.toISOString(), now.toISOString()], function (err) {
					if (err) return reject(err);
				});
			db.run(
				`INSERT INTO Wallets (currencyCode, balance, userId, type, createdAt, lastUpdatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
				["BTC", 0, 1, 'STANDARD', now.toISOString(), now.toISOString()], function (err) {
					if (err) return reject(err);
				}
			);
			db.run(
				`INSERT INTO Transfers (id, userId, pfiId, payinCurrencyCode, payoutCurrencyCode, payinKind, payoutKind, payinAmount, payoutAmount, narration, payinWalletId, payoutWalletId, payoutAccountNumber, status, reference, createdAt, lastUpdatedAt)
				VALUES ${TRANSFERs.map(_ => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
				`, TRANSFERs.reduce((acc, value) => acc.concat([
					value.id, value.userId, value.pfiId, value.payinCurrencyCode, value.payoutCurrencyCode, value.payinKind, value.payoutKind,
					value.payinAmount, value.payoutAmount, value.narration, value.payinWalletId, value.payoutWalletId, value.payoutAccountNumber,
					value.status, value.reference, user.createdAt.toISOString(), user.lastUpdatedAt.toISOString()]), []),
				function (err) {
					if (err) return reject(err);
				}
			);
			db.run(
				`INSERT INTO Transactions (id, transferId, narration, type, walletId, reference, currencyCode, amount, userId, createdAt, lastUpdatedAt)
				VALUES ${TRANSACTIONS.map(_ => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
				`, TRANSACTIONS.reduce((acc, value) => acc.concat([
					value.id, value.transferId, value.narration, value.type, value.walletId, value.reference,
					value.currencyCode, value.amount, value.userId, value.createdAt.toISOString(), value.lastUpdatedAt.toISOString()
				]), []),
				function (err) {
					if (err) return reject(err);
					resolve({ id: 1, ...user, walletIds: [1] });
				}
			);
		});
	});
	t.context.auth = `${t.context.user.id.toString()}`;
});

test.after.always((t: any) => {
	return new Promise<void>((resolve, reject) => {
		t.context.server.close((err?: Error) => {
			if (err) {
				console.error(err);
				reject(err);
			}
			t.context.db.close((err?: Error) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}
				resolve();
			});
		});
	});
});

test.serial("Email is available before registration", (t: any) => {
	const { prefixUrl } = t.context;
	return axios.post(`${prefixUrl}/email-status`, { email: 'available@test.com' })
		.then(({ data }) => t.is(data.status, 'AVAILABLE'))
		.catch(err => t.fail(err.message));
});

test.serial("Registration with unavailable email should fail with 'DUPLICATE_EMAIL'", (t: any) => {
	const { prefixUrl, user, cache } = t.context;
	cache.set(TBDCacheKeys.PORTABLE_DID(user.email), DIDs[0]);
	cache.set(TBDCacheKeys.CREDENTIAL({
		type: 'kcc',
		data: {
			name: `${user.firstname} ${user.lastname}`,
			country: user.country,
			did: PARSED_DIDs[0].uri
		}
	}), "credential");
	return axios.post(`${prefixUrl}/register`, {
		email: user.email,
		password: 'newpassword',
		firstname: 'Test',
		lastname: 'User',
		country: 'Country',
		phoneNumber: '1234567890'
	})
		.then((res) => t.fail('Registration should have failed'))
		.catch(error => {
			t.is(error.response.status, 400);
			t.is(error.response.data.code, 'DUPLICATE_EMAIL');
		});
});

test.serial("Register a new user", (t: any) => {
	const { prefixUrl, cache } = t.context;
	const email = 'new-user@test.com';
	cache.set(TBDCacheKeys.PORTABLE_DID(email), DIDs[0]);
	cache.set(TBDCacheKeys.CREDENTIAL({
		type: 'kcc',
		data: {
			name: "New User",
			country: "Country",
			did: PARSED_DIDs[0].uri
		}
	}), "credential");
	return axios.post(`${prefixUrl}/register`, {
		email,
		password: 'password',
		firstname: 'New',
		lastname: 'User',
		country: 'Country',
		phoneNumber: '1234567890'
	}).then(_ => axios.post(`${prefixUrl}/email-status`, { email }))
		.then(({ data }) => t.is(data.status, 'NOT_AVAILABLE'))
		.catch(err => t.fail(err.message));
});

test.serial("Login with valid credentials", (t: any) => {
	const { prefixUrl, user } = t.context;
	return axios.post(`${prefixUrl}/login`, { email: user.email, password: user.password })
		.then(({ data }) => t.truthy(data.token))
		.catch(err => t.fail(err.message));
});

test.serial("Get Market Data", (t: any) => {
	const { prefixUrl, auth, cache } = t.context;
	cache.set(TBDCacheKeys.OFFERINGS, [{ pfi: PFIs[0], offerings: [OFFERINGs[0]] }])
	return axios.get(`${prefixUrl}/market-data`, { headers: { Authorization: auth } })
		.then(({ data }) => t.is(data["GHS"]?.["USDC"]?.exchangeRate, 0.10))
		.catch(err => t.fail(err.message));
});

test.serial("Transfer by bank transfer", (t: any) => {
	const { prefixUrl, auth, cache } = t.context;
	cache.set(TBDCacheKeys.OFFERINGS, [{ pfi: PFIs[0], offerings: [OFFERINGs[0], OFFERINGs[1]] }]);
	let transferId;
	return axios.post(`${prefixUrl}/transfers/start/NGN/KES`, {}, { headers: { Authorization: auth } })
		.then(({ data }: AxiosResponse<CreateTransferResponse>) => {
			t.truthy(data.id);
			t.deepEqual(data, {
				id: data.id,
				payinMethods: [
					{ kind: PaymentKind.NGN_BANK_TRANSFER, fields: [] }
				]
			});
			transferId = data.id;
			return axios.post(`${prefixUrl}/transfers/${data.id}/payin`, { kind: PaymentKind.NGN_BANK_TRANSFER }, { headers: { Authorization: auth } });
		})
		.then(({ data }: AxiosResponse<PayinUpdateResponse>) => {
			t.deepEqual(data, [
				{ kind: PaymentKind.WALLET_ADDRESS, fields: ["walletId"] },
				{ kind: PaymentKind.KES_BANK_TRANSFER, fields: ["accountNumber"] }
			]);
			return axios.post(`${prefixUrl}/transfers/${transferId}/payout`, { kind: PaymentKind.KES_BANK_TRANSFER, accountNumber: "0123456789" }, { headers: { Authorization: auth } });
		})
		.catch((err: AxiosError) => {
			// console.log(err.request);
			t.fail(`${err.message}: ${JSON.stringify(err.response?.data)}`);
		});
});

test.serial("Transfer to wallet", (t: any) => {
	const { prefixUrl, auth, cache, user } = t.context;
	cache.set(TBDCacheKeys.OFFERINGS, [PFI_OFFERINGs[1]]);
	let transferId;
	return axios.post(`${prefixUrl}/transfers/start/USD/BTC`, {}, { headers: { Authorization: auth } })
		.then(({ data }: AxiosResponse<CreateTransferResponse>) => {
			t.truthy(data.id);
			t.deepEqual(data, {
				id: data.id,
				payinMethods: [
					{ kind: PaymentKind.USD_BANK_TRANSFER, fields: ["accountNumber", "routingNumber"] }
				]
			});

			transferId = data.id;
			return axios.post(`${prefixUrl}/transfers/${data.id}/payin`, { kind: PaymentKind.USD_BANK_TRANSFER, accountNumber: "0123456789", routingNumber: "0123456" }, { headers: { Authorization: auth } });
		})
		.then(({ data }: AxiosResponse<PayinUpdateResponse>) => {
			t.deepEqual(data, [
				{ kind: PaymentKind.WALLET_ADDRESS, fields: ["walletId"] },
				{ kind: PaymentKind.BTC_WALLET_ADDRESS, fields: ["address"] }
			]);

			return axios.post(`${prefixUrl}/transfers/${transferId}/payout`, { kind: PaymentKind.WALLET_ADDRESS, walletId: user.walletIds[0] }, { headers: { Authorization: auth } });
		})
		.catch((err) => {
			t.fail(err.message);
		});
});

test.serial("Transfer from wallet", (t: any) => {
	const { prefixUrl, auth, cache, user } = t.context;
	cache.set(TBDCacheKeys.OFFERINGS, [{ pfi: PFIs[0], offerings: [OFFERINGs[8], OFFERINGs[8]] }]);
	let transferId;
	return axios.post(`${prefixUrl}/transfers/start/BTC/USD`, {}, { headers: { Authorization: auth } })
		.then(({ data }: AxiosResponse<CreateTransferResponse>) => {
			t.truthy(data.id);
			t.deepEqual(data, {
				id: data.id,
				payinMethods: [
					{ kind: PaymentKind.WALLET_ADDRESS, fields: ["walletId"] },
					{ kind: PaymentKind.BTC_WALLET_ADDRESS, fields: ["address"] }
				]
			});

			transferId = data.id;
			return axios.post(`${prefixUrl}/transfers/${data.id}/payin`, { kind: PaymentKind.WALLET_ADDRESS, walletId: user.walletIds[0] }, { headers: { Authorization: auth } });
		})
		.then(({ data }: AxiosResponse<PayinUpdateResponse>) => {
			t.deepEqual(data, [
				{ kind: PaymentKind.WALLET_ADDRESS, fields: ["walletId"] },
				{ kind: PaymentKind.USD_BANK_TRANSFER, fields: ["accountNumber", "routingNumber"] }
			]);

			return axios.post(`${prefixUrl}/transfers/${transferId}/payout`, { kind: PaymentKind.USD_BANK_TRANSFER, accountNumber: "9876543210", routingNumber: "654321" }, { headers: { Authorization: auth } });
		})
		.catch((err) => {
			t.fail(err.message);
		});
});

test.serial("Transfer to wallet completed successfully", (t: any) => {
	const { prefixUrl, auth, cache } = t.context;
	cache.set(TBDCacheKeys.WATCH_EXCHANGE("reference"), CLOSEs[0]);
	return axios.get(`${prefixUrl}/transfers/1/status`, { headers: { Authorization: auth } })
		.then(({ data }) => {
			t.is(data.status, TransactionStatus.SUCCESS);
			return axios.get(`${prefixUrl}/wallets`, { headers: { Authorization: auth } });
		})
		.then(({ data }) => {
			t.is(data[0].currencyCode, "BTC");
			t.is(data[0].balance, 0.000033);
		})
		.catch(err => t.fail(err.message));
});

test.serial("Transfer to wallet completed unsuccessfully", (t: any) => {
	const { prefixUrl, auth, cache } = t.context;
	cache.set(TBDCacheKeys.WATCH_EXCHANGE("reference"), CLOSEs[1]);
	return axios.get(`${prefixUrl}/transfers/3/status`, { headers: { Authorization: auth } })
		.then(({ data }) => {
			t.is(data.status, TransactionStatus.FAILED);
			return axios.get(`${prefixUrl}/wallets`, { headers: { Authorization: auth } });
		})
		.then(({ data }) => {
			t.is(data[0].currencyCode, "BTC");
			t.is(data[0].balance, 0.000033);
		})
		.catch(err => t.fail(err.message));
});

test.serial("Transfer from wallet completed successfully", (t: any) => {
	const { prefixUrl, auth, cache } = t.context;
	cache.set(TBDCacheKeys.WATCH_EXCHANGE("reference"), CLOSEs[0]);
	return axios.get(`${prefixUrl}/transfers/2/status`, { headers: { Authorization: auth } })
		.then(({ data }) => {
			t.is(data.status, TransactionStatus.SUCCESS);
			return axios.get(`${prefixUrl}/wallets`, { headers: { Authorization: auth } });
		})
		.then(({ data }) => {
			t.is(data[0].currencyCode, "BTC");
			t.is(data[0].balance, 0.000033);
		})
		.catch(err => t.fail(err.message));
});

test.serial("Transfer from wallet completed unsuccessfully", (t: any) => {
	const { prefixUrl, auth, cache, db } = t.context;
	cache.set(TBDCacheKeys.WATCH_EXCHANGE("reference"), CLOSEs[1]);
	return axios.get(`${prefixUrl}/transfers/4/status`, { headers: { Authorization: auth } })
		.then(({ data }) => {
			t.is(data.status, TransactionStatus.FAILED);
			return axios.get(`${prefixUrl}/wallets`, { headers: { Authorization: auth } });
		})
		.then(({ data }) => {
			t.is(data[0].currencyCode, "BTC");
			t.is(data[0].balance, 0.000066); // 0.000033 BTC refunded
		})
		.catch(err => t.fail(err.message));
});

test.serial("Create a savings plan", async (t: any) => {
	const { prefixUrl, auth } = t.context;
	
	// Create a new savings plan
	const createPlanResponse = await axios.post(`${prefixUrl}/savings-plans`, {
		name: "Test Savings Plan",
		currencyCode: "USD",
		durationInMonths: 12
	}, { headers: { Authorization: auth } });
	
	t.is(createPlanResponse.status, 200);

	// Get all savings plans to find the ID of the newly created plan
	const getPlansResponse = await axios.get(`${prefixUrl}/savings-plans`, { headers: { Authorization: auth } });
	t.is(getPlansResponse.status, 200);
	
	const newPlan = getPlansResponse.data.find((plan: any) => plan.name === "Test Savings Plan");
	t.truthy(newPlan);
	// Check that the maturity date of the plan is correct
	const expectedMaturityDate = new Date();
	expectedMaturityDate.setMonth(expectedMaturityDate.getMonth() + 12); // Add 12 months
	
	const maturityDateDiff = Math.abs(new Date(newPlan.maturityDate).getTime() - expectedMaturityDate.getTime());
	const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
	
	// Allow for a difference of up to one day to account for time zone differences
	t.true(maturityDateDiff < oneDay, `Maturity date should be approximately ${expectedMaturityDate.toISOString()}, but was ${newPlan.maturityDate}`);

	// Enable auto-fund for the new savings plan
	const enableAutoFundResponse = await axios.post(`${prefixUrl}/savings-plans/${newPlan.id}/auto-fund/enable`, {
		walletId: "1", // Assuming wallet with ID 1 exists
		amount: "100.00"
	}, { headers: { Authorization: auth } });

	t.is(enableAutoFundResponse.status, 200);
	t.is(enableAutoFundResponse.data, 'OK');
});

test.serial("Savings plan rollover", async (t: any) => {
	const { prefixUrl, auth, db } = t.context;
	
	// Create a new savings plan
	const createPlanResponse = await axios.post(`${prefixUrl}/savings-plans`, {
		name: "Rollover Test Plan",
		currencyCode: "USD",
		durationInMonths: 1
	}, { headers: { Authorization: auth } });
	
	t.is(createPlanResponse.status, 200);

	// Get all savings plans to find the ID of the newly created plan
	const getPlansResponse = await axios.get(`${prefixUrl}/savings-plans`, { headers: { Authorization: auth } });
	t.is(getPlansResponse.status, 200);
	
	const newPlan = getPlansResponse.data.find((plan: any) => plan.name === "Rollover Test Plan");
	t.truthy(newPlan);

	// Check that the plan's status is 'ACTIVE'
	t.is(newPlan.state, 'ACTIVE');

	// Update the maturityDate in the database to make the plan mature
	await new Promise<void>((resolve, reject) => {
		const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
		db.run(
			`UPDATE Wallets SET maturityDate = ? WHERE id = ?`,
			[pastDate, newPlan.id],
			(err) => {
				if (err) reject(err);
				else resolve();
			}
		);
	});

	// Fetch the plan again and check that its status is now 'MATURED'
	const getUpdatedPlanResponse = await axios.get(`${prefixUrl}/savings-plans/${newPlan.id}`, { headers: { Authorization: auth } });
	t.is(getUpdatedPlanResponse.status, 200);
	t.is(getUpdatedPlanResponse.data.state, 'MATURED');

	// Use the rollover API to rollover the savings plan
	const rolloverResponse = await axios.post(`${prefixUrl}/savings-plans/${newPlan.id}/rollover`, {}, { headers: { Authorization: auth } });
	t.is(rolloverResponse.status, 200);
	t.is(rolloverResponse.data, 'OK');

	// Fetch the plan one last time and check that its status is back to 'ACTIVE'
	const getFinalPlanResponse = await axios.get(`${prefixUrl}/savings-plans/${newPlan.id}`, { headers: { Authorization: auth } });
	t.is(getFinalPlanResponse.status, 200);
	t.is(getFinalPlanResponse.data.state, 'ACTIVE');
});

test.serial("Report transaction", async (t: any) => {
	const { prefixUrl, auth, cache, tbdex } = t.context;
	const doReport = (id: number) => axios.post(
		`${prefixUrl}/transactions/${id}/report`,
		{ reason: ReportReason.COMPLETED_WITHOUT_SETTLEMENT },
		{ headers: { Authorization: auth } }
	);
	const key = UsersCacheKeys.PFI_METRICS(1);
	let offenceTally = await (cache as Cache).get<number>(key);
	t.truthy(!offenceTally);
	// Report the same tranx twice
	const transaction = TRANSACTIONS[0];
	await doReport(transaction.id);
	await doReport(transaction.id);
	offenceTally = await (cache as Cache).get<number>(key);
	t.is(offenceTally, 1); // offence is counted once per transfer
	t.is(await tbdex.isBlacklistedPFI(PFIs[0].did), false); // Not temporarily blacklisted yet

	cache.set(TBDCacheKeys.WATCH_EXCHANGE("reference"), CLOSEs[0]);
	await axios.get(`${prefixUrl}/transfers/5/status`, { headers: { Authorization: auth } });

	await doReport(TRANSACTIONS[2].id);
	offenceTally = await (cache as Cache).get<number>(key);
	t.is(offenceTally, null); // offence count for PFI is reset
	t.is(await tbdex.isBlacklistedPFI(PFIs[0].did), true); // PFI is temporarily blacklisted
});
