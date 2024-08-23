import sqlite3 from "sqlite3";
import Migrate from "./sqlite/schema.js";
import { resolveDid } from "@tbdex/http-client";
import pino from "pino";

// @ts-ignore
const logger = pino();

const db = new sqlite3.Database("db.sqlite");
Migrate(db);

/**
🏦 AquaFinance Capital

DID: did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y

Offerings:

GHS to USDC

NGN to KES

KES to USD

USD to KES

🏦 Flowback Financial

DID: did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy

Offerings:

USD to EUR

EUR to USD

USD to GBP

USD to BTC

🏦 Vertex Liquid Assets

DID: did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y

Offerings:

EUR to USD

EUR to USDC

USD to EUR

EUR to GB

🏦 Titanium Trust

DID: did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o

Offerings:

USD to AUD

USD to GBP

USD to KES

USD to MXN
 */

const PFIs = [
  { name: "AquaFinance Capital", did: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y" },
  { name: "Flowback Financial", did: "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy" },
  { name: "Vertex Liquid Assets", did: "did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y" },
  { name: "Titanium Trust", did: "did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o" }
]

const now = new Date().toISOString();
Promise.allSettled(
  PFIs.map(pfi => resolveDid(pfi.did).then((_) => new Promise<void>((resolve, reject) => {
    db.run(`INSERT INTO PFIs (did, name, blacklisted, rating, createdAt, lastUpdatedAt) VALUES (?, ?, ?, ?, ?, ?)`, [pfi.did, pfi.name, false, 5, now, now], (err) => {
      if (err) {
        reject(err);
      } else {
        logger.info(`Loaded PFI ${pfi.name}`);
        resolve();
      }
    })
  })).catch((err) => logger.error(err, `Error while loading PFI ${pfi.name}`))
  )
);
