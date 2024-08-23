import { createServer } from "http";
import sqlite3 from "sqlite3";
import Migrate from "./sqlite/schema.js";
import MakeApp from "./app.js";
import { InMemoryCache } from "./cache.js";
import { TBDexService } from "./features/tbdex.js";
import { TBDexDBImpl, UsersDbImpl } from "./sqlite/db_impl.js";
import { Users } from "./features/users.js";

const PORT = 4000;

const db = new sqlite3.Database("db.sqlite");
Migrate(db);
const cache = new InMemoryCache();
const tbdex = new TBDexService(cache, new TBDexDBImpl(db));
const users = new Users(new UsersDbImpl(db), tbdex, cache);
const { app } = MakeApp({ port: PORT }, users, tbdex);

createServer(app);
