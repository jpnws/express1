import http from "http";

import pgPromise from "pg-promise";
import { v4 as uuidv4 } from "uuid";

import { getConfig } from "../../src/cfg.js";
import { createTables } from "../../util/create-tables.js";

import app from "../../src/app.js";

const pgp = pgPromise();

export const spawnApp = async () => {
  const c = getConfig();
  let cfg = {
    app: {
      ...c.app,
      port: 0,
    },
    db: {
      ...c.db,
      database: `${uuidv4()}`,
    },
  };

  const db = await spawnDb(cfg.db);

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(cfg.app.port, resolve);
  });

  const address = server.address();
  const port = typeof address === "string" ? address : address?.port;

  return { server, port, db, cfg };
};

const spawnDb = async (dbCfg) => {
  const cfgWithoutDb = {
    host: dbCfg.host,
    port: dbCfg.port,
    user: dbCfg.user,
    password: dbCfg.password,
  };

  const withoutDb = pgp(cfgWithoutDb);

  try {
    await withoutDb.none(`CREATE DATABASE "${dbCfg.database}";`);
  } catch (error) {
    console.error(`Failed to create a test database: ${dbCfg.database}`);
    throw error;
  }

  const withDb = pgp(dbCfg);

  try {
    await createTables(withDb);
  } catch (error) {
    console.error(`Failed to create a test database ${dbCfg.database}`);
    throw error;
  }

  return withDb;
};

export const closePgp = () => {
  pgp.end();
};

export const dropDb = async (cfg) => {
  const dropDbConfig = {
    host: cfg.db.host,
    port: cfg.db.port,
    database: "postgres",
    user: cfg.db.user,
    password: cfg.db.password,
  };
  const dropDb = pgp(dropDbConfig);
  await dropDb.none("DROP DATABASE $1~", cfg.db.database);
};
