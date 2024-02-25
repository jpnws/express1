import pgPromise from "pg-promise";
import { getConfig } from "./cfg.js";

const conf = getConfig();
const dbConfig = conf.db;

const pgp = pgPromise();
const db = pgp(dbConfig);

export default db;
