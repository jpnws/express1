import http from "http";

import pgPromise from "pg-promise";
import { v4 as uuidv4 } from "uuid";

import { getConfig, withDb, withoutDb } from "../../src/cfg.js";
import { createTables } from "../../util/create-tables.js";

import { createApp } from "../../src/app.js";

const pgp = pgPromise();

export const spawnApp = async () => {
  const conf = getConfig();

  let cfg = {
    app: {
      ...conf.app,
      port: 0,
    },
    db: {
      ...conf.db,
      database: `${uuidv4()}`,
    },
  };

  const db = await spawnDb(cfg.db);

  const app = createApp(db);

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(cfg.app.port, cfg.app.host, resolve);
  });

  const address = server.address();

  const port = typeof address === "string" ? address : address?.port;

  return { server, port, db, cfg };
};

const spawnDb = async (dbConfig) => {
  // Create a test database.
  const connectionOptionsWithoutDb = withoutDb(dbConfig);

  console.log(connectionOptionsWithoutDb);

  const dbConnectionWithoutDb = pgp(connectionOptionsWithoutDb);

  try {
    await dbConnectionWithoutDb.none(`CREATE DATABASE "${dbConfig.database}";`);
    console.log("Database created.");
  } catch (error) {
    console.error(`Failed to create a test database: ${dbConfig.database}`);
    throw error;
  }

  // Create tables in the test database.
  const connectionOptionsWithDb = withDb(dbConfig);
  const dbConnectionWithDb = pgp(connectionOptionsWithDb);

  try {
    await createTables(dbConnectionWithDb);
  } catch (error) {
    console.error(`Failed to create tables for database: ${dbConfig.database}`);
    throw error;
  }

  return dbConnectionWithDb;
};

export const closePgp = () => {
  pgp.end();
};

export const dropDb = async (dbConfig) => {
  const dropDbConfig = {
    ...dbConfig,
    database: "postgres",
  };
  const dropDb = pgp(dropDbConfig);
  await dropDb.none("DROP DATABASE $1~", dbConfig.database);
};
