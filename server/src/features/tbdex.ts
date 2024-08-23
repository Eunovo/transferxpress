import { DidDocument, DidJwk } from "@web5/dids";
import { Close, JsonSchema, Offering, Order, Quote, resolveDid, Rfq, TbdexHttpClient } from "@tbdex/http-client";
import { URLSearchParams } from "url";
import { Cache } from "../cache.js";
import { MarketData } from "../types.js";
import { TBDexDB } from "../db.js";
import { PFI, Transfer } from "../models.js";
import { logger } from "../logger.js";

export type CredentialRequest = {
  type: 'kcc',
  data: {
    name: string,
    country: string,
    did: string
  }
}

const ISSUER_URL = "https://mock-idv.tbddev.org/kcc";
const BLACKLIST_TTL_MS = 1000 * 60 * 5; // 5 mins 
const got = import("got").then((imp) => imp.default);

export const CacheKeys = {
  PORTABLE_DID: (email: string) => `tbd:did:email:${email}`,
  DID_DOC: (did: string) => `tbd:did:${did}`,
  CREDENTIAL: (req: CredentialRequest) => `tbd:credential:${req.type}?${new URLSearchParams(req.data).toString()}`,
  BLACKLIST: (did: string) => `tbd:blacklist:${did}`,
  OFFERINGS: 'tbd:offerings',
  WATCH_EXCHANGE: (exchangeId: string) => `tbd:watch:${exchangeId}`
}

const tbdexLogger = logger.child({ module: 'tbdex' });

type QuoteResult = { pfi: PFI, quote: Quote };

export class TBDexError extends Error { }

export class TBDexService {
  constructor(private cache: Cache, private db: TBDexDB) { }

  createDid(email: string) {
    const cacheKey = CacheKeys.PORTABLE_DID(email);
    return this.cache.get<string>(cacheKey)
      .then((did) => {
        if (did) return did;
        return DidJwk
          .create()
          .then(did => {
            this.cache.set(CacheKeys.DID_DOC(did.document.id), did.document);
            const result = JSON.stringify(did.export());
            this.cache.set(cacheKey, result);
            return result;
          });
      })
      .catch((err) => Promise.reject(new TBDexError(`Failed to create DID for ${email}: ${err.message}`)));
  }

  resolveDid(did: string): Promise<DidDocument> {
    const cacheKey = CacheKeys.DID_DOC(did);
    return this.cache.get<DidDocument>(cacheKey)
      .then(doc => {
        if (doc) return doc;
        return resolveDid(did)
          .then(doc => {
            this.cache.set(cacheKey, doc);
            return doc;
          });
      }).catch(err => Promise.reject(new TBDexError(`Failed to resolve DID: ${err.message}`)));
  }

  acquireCredential(req: CredentialRequest) {
    if (req.type !== 'kcc') {
      throw new Error('Unsupported credential type');
    }
    const query = new URLSearchParams({ name: req.data.name, country: req.data.country, did: req.data.did });
    const cacheKey = CacheKeys.CREDENTIAL(req);
    return this.cache.get<string>(cacheKey)
      .then(credential => {
        if (credential) return credential;
        return got.then(got => got.get(`${ISSUER_URL}/issue?${query.toString()}`))
          .then(res => {
            this.cache.set(cacheKey, res.body);
            return res.body;
          });
      }).catch(err => Promise.reject(new TBDexError(`Failed to acquire credential: ${err.message}`)));
  }

  /**
   * Temporarily blacklist this PFI
   * @param did 
   */
  blacklistPFI(did: string) {
    this.cache.set(CacheKeys.BLACKLIST(did), true, BLACKLIST_TTL_MS);
  }

  isBlacklistedPFI(did: string): Promise<boolean> {
    return this.cache.get(CacheKeys.BLACKLIST(did))
      .then(blacklisted => !!blacklisted);
  }

  filterOutBlacklistedPFIs(pfis: PFI[]): Promise<PFI[]> {
    return Promise.all(pfis.map(pfi => this.cache.get(CacheKeys.BLACKLIST(pfi.did))))
      .then(result => {
        return result.map((blacklisted, i) => blacklisted ? pfis[i] : null).filter((pfi => pfi !== null));
      });
  }

  /**
   * Returns the best exchange rate for all available currency pair
   */
  async getMarketData(): Promise<MarketData> {
    const marketData: MarketData = {};
    const offerings = await this.fetchOfferings();
    offerings.forEach(({ pfi, offerings }) => {
      offerings.forEach(offering => {
        const payinCurrency = offering.data.payin.currencyCode;
        const payoutCurrency = offering.data.payout.currencyCode;
        const exchangeRate = Number.parseFloat(offering.data.payoutUnitsPerPayinUnit);
        if (isNaN(exchangeRate)) return;

        const currentBestRate = marketData[payinCurrency]?.[payoutCurrency];
        if (currentBestRate === undefined) {
          marketData[payinCurrency] = { ...(marketData[payinCurrency] || {}), [payoutCurrency]: { pfiId: pfi.id, exchangeRate } };
        } else if (marketData[payinCurrency] && exchangeRate > currentBestRate.exchangeRate) {
          marketData[payinCurrency][payoutCurrency] = { pfiId: pfi.id, exchangeRate };
        }
      });
    });
    return marketData;
  }

  fetchOfferings(): Promise<{ pfi: PFI, offerings: Offering[] }[]> {
    return this.cache.get<{ pfi: PFI, offerings: Offering[] }[]>(CacheKeys.OFFERINGS)
      .then(offerings => {
        if (offerings) return offerings;
        return this.db.listPFIs()
          .then(pfis => this.filterOutBlacklistedPFIs(pfis))
          .then(pfis =>
            Promise.all(
              pfis.map(pfi => TbdexHttpClient.getOfferings({ pfiDid: pfi.did }).then(offerings => ({ pfi, offerings })))
            ).then(offerings => {
              this.cache.set(CacheKeys.OFFERINGS, offerings);
              return offerings;
            }).catch(err => Promise.reject(new TBDexError(`Failed to fetch offerings: ${err.message}`)))
          );
      });
  }

  private getPaymentDetails(transfer: Transfer, schema: JsonSchema, prefix: string) {
    if (typeof schema == "boolean") return {};
    if (!("properties" in schema)) return {};
    return Object.keys(schema.properties).reduce((acc: any, property) => {
      if (acc[property] != undefined) {
        tbdexLogger.warn({ transferId: transfer.id }, `[getPaymentDetails] Duplicate property ${property}`);
      }
      const key = `${prefix}${property.substring(0, 1).toUpperCase()}${property.substring(1)}`;
      if (key in transfer && transfer[key as keyof Transfer]) {
        acc[property] = transfer[key as keyof Transfer];
        return acc;
      }
      tbdexLogger.warn({ transferId: transfer.id, property, key }, `[getPaymentDetails] Missing property`);
      return acc;
    }, {})
  }

  async getQuotes(transfer: Transfer, userDid: string, credentials: string[]): Promise<QuoteResult[]> {
    const userBearerDid = await DidJwk.import({ portableDid: JSON.parse(userDid) });
    const offerings = await this.fetchOfferings();
    const quotes: Promise<QuoteResult | null>[] = [];

    offerings.forEach(({ pfi, offerings }) => {
      offerings.forEach((offering) => {
        if (offering.data.payin.currencyCode != transfer.payinCurrencyCode) return;
        if (offering.data.payout.currencyCode != transfer.payoutCurrencyCode) return;
        const payinMethod = offering.data.payin.methods.find((method) => method.kind == transfer.payinKind);
        const payoutMethod = offering.data.payout.methods.find((method) => method.kind == transfer.payoutKind);
        if (!payinMethod || !payoutMethod) return;

        const rfq = Rfq.create({
          metadata: {
            to: offering.metadata.from,
            from: userBearerDid.document.id,
            protocol: "1.0"
          },
          data: {
            offeringId: offering.metadata.id,
            payin: {
              kind: transfer.payinKind as string,
              amount: ((transfer.payoutAmount ?? 0) / parseFloat(offering.data.payoutUnitsPerPayinUnit)).toFixed(8),
              paymentDetails: payinMethod.requiredPaymentDetails
                ? this.getPaymentDetails(transfer, payinMethod.requiredPaymentDetails, "payin") : {}
            },
            payout: {
              kind: transfer.payoutKind as string,
              paymentDetails: payoutMethod.requiredPaymentDetails
                ? this.getPaymentDetails(transfer, payoutMethod.requiredPaymentDetails, "payout") : {}
            },
            claims: credentials
          }
        });

        quotes.push(
          rfq.verifyOfferingRequirements(offering).then(() => rfq.sign(userBearerDid))
            .then(() => TbdexHttpClient.createExchange(rfq))
            .then(() => new Promise<QuoteResult>((resolve, reject) => {
              const interval = setInterval(() => {
                TbdexHttpClient.getExchange({
                  pfiDid: rfq.metadata.to,
                  did: userBearerDid,
                  exchangeId: rfq.exchangeId
                }).then((exchange) => {
                  const quote = exchange.find(msg => msg instanceof Quote);
                  if (quote) {
                    clearInterval(interval);
                    resolve({ pfi, quote });
                  }
                }).catch(err => {
                  tbdexLogger.warn({ exchangeId: rfq.exchangeId, transferId: transfer.id, userDid: userBearerDid.uri, errors: err.details?.errors }, `[getQuotes] ${err.message}`);
                });
              }, 100);
              // Timeout after 10 seconds
              setTimeout(() => {
                clearInterval(interval); reject(new Error("Timeout"));
              }, 10000);
            }))
            .catch(err => {
              console.log(err);
              tbdexLogger.warn({ exchangeId: rfq.exchangeId, transferId: transfer.id, userDid: userBearerDid.uri, errors: err.details?.errors }, `[getQuotes] ${err.message}`);
              return null;
            })
        );
      });
    });

    if (quotes.length == 0) return [];
    return Promise.allSettled(quotes)
      .then(results => results.filter(result => result.status == "fulfilled")
        .map(result => result.value)
        .filter((value): value is QuoteResult => Boolean(value)));
  }

  async sendOrder(userDid: string, quote: Quote, callback: (msg: Close | null, error?: Error) => void) {
    const userBearerDid = await DidJwk.import({ portableDid: JSON.parse(userDid) });
    const order = Order.create({
      metadata: {
        from: userBearerDid.uri,
        to: quote.metadata.from,
        exchangeId: quote.exchangeId,
        protocol: "1.0"
      }
    });

    return order.sign(userBearerDid)
      .then(() => TbdexHttpClient.submitOrder(order))
      .then(() => {
        this.cache.set(CacheKeys.WATCH_EXCHANGE(order.exchangeId), true);
        const interval = setInterval(() => {
          TbdexHttpClient.getExchange({
            pfiDid: order.metadata.to,
            did: userBearerDid,
            exchangeId: order.exchangeId
          }).then((exchange) => {
            const close = exchange.find(msg => msg instanceof Close);
            if (close) {
              this.cache.set(CacheKeys.WATCH_EXCHANGE(order.exchangeId), close);
              clearInterval(interval);
              callback(close);
            }
          }).catch(err => tbdexLogger.warn({ exchangeId: order.exchangeId, userDid: userBearerDid.uri }, `[sendOrder] ${err.message}`));
        }, 100);
        // Timeout after 10 seconds
        setTimeout(() => {
          this.cache.del(CacheKeys.WATCH_EXCHANGE(order.exchangeId));
          clearInterval(interval); callback(null, new Error("Failed to close order after 10 seconds"));
        }, 10000);
      });
  }

  watchExchange(userDid: string, pfiDid: string, exchangeId: string, callback: (msg: Close | null, error?: Error) => void) {
    return Promise.all([
      DidJwk.import({ portableDid: JSON.parse(userDid) }),
      this.cache.get(CacheKeys.WATCH_EXCHANGE(exchangeId))
    ]).then(([userBearerDid, watching]) => {
      if (typeof watching === 'boolean') return false;
      if (typeof watching === 'object') {
        callback(watching as Close);
        return false;
      }

      this.cache.set(CacheKeys.WATCH_EXCHANGE(exchangeId), true);
      const interval = setInterval(() => {
        TbdexHttpClient.getExchange({
          pfiDid,
          did: userBearerDid,
          exchangeId
        }).then((exchange) => {
          const close = exchange.find(msg => msg instanceof Close);
          if (close) {
            this.cache.set(CacheKeys.WATCH_EXCHANGE(exchangeId), close);
            clearInterval(interval);
            callback(close);
          }
        }).catch(err => tbdexLogger.warn({ exchangeId, userDid: userBearerDid.uri }, `[watchExchange] ${err.message}`));
      }, 100);
      // Timeout after 10 seconds
      setTimeout(() => {
        this.cache.del(CacheKeys.WATCH_EXCHANGE(exchangeId));
        clearInterval(interval); callback(null, new Error("Failed to close order after 10 seconds"))
      }, 10000);

      return true;
    });
  }
}
