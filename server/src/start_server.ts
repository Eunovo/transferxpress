import { createServer } from "http";
import sqlite3 from "sqlite3";
import Migrate from "./sqlite/schema.js";
import MakeApp from "./app.js";
import { InMemoryCache } from "./cache.js";
import { TBDexService } from "./features/tbdex.js";
import { AutoFunderDBImpl, TBDexDBImpl, UsersDbImpl } from "./sqlite/db_impl.js";
import { Users } from "./features/users.js";
import { AutoFunder } from "./features/autofund.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const db = new sqlite3.Database("db.sqlite");
Migrate(db);
const cache = new InMemoryCache();
const tbdex = new TBDexService(cache, new TBDexDBImpl(db));
const usersDb = new UsersDbImpl(db);
const users = new Users(usersDb, tbdex, cache);
const autoFunder = new AutoFunder(new AutoFunderDBImpl(db), usersDb, users, tbdex);
const { app } = MakeApp({ port: PORT }, users, tbdex, autoFunder);

createServer(app);
