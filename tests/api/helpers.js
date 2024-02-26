import http from "http";

import { v4 as uuidv4 } from "uuid";
import pg from "pg";

import {
  getConfig,
  getConfigWithDb,
  getConfigWithoutDb,
} from "../../src/cfg.js";

import { createTables } from "../../util/create-tables.js";

import { createApp } from "../../src/app.js";

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

  const pool = await spawnDb(cfg.db);

  const app = createApp(pool);

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(cfg.app.port, cfg.app.host, resolve);
  });

  const address = server.address();

  const port = typeof address === "string" ? address : address?.port;

  return { server, port, pool, cfg };
};

const spawnDb = async (dbConfig) => {
  // * ===============================
  // * Create a test database.
  // * ===============================
  const configWithoutDb = getConfigWithoutDb(dbConfig);
  const connectionWithoutDb = new pg.Client(configWithoutDb);
  await connectionWithoutDb.connect();
  try {
    await connectionWithoutDb.query(`CREATE DATABASE "${dbConfig.database}";`);
    console.log("Database created.");
  } catch (error) {
    console.error(`Failed to create a test database: ${dbConfig.database}`);
    console.error(error);
    throw error;
  } finally {
    await connectionWithoutDb.end();
  }
  // * ===============================
  // * Create tables in the test database.
  // * ===============================
  const configWithDb = getConfigWithDb(dbConfig);
  const connectionWithDb = new pg.Pool(configWithDb);
  try {
    await createTables(connectionWithDb);
  } catch (error) {
    console.error(`Failed to create tables for database: ${dbConfig.database}`);
    console.error(error);
    throw error;
  }
  return connectionWithDb;
};

export const dropDb = async (dbConfig) => {
  const dropDbConfig = {
    ...dbConfig,
    database: "postgres",
  };
  const client = new pg.Client(dropDbConfig);
  await client.connect();
  try {
    await client.query(`DROP DATABASE "${dbConfig.database}"`);
    console.log("Data base dropped.");
  } catch (error) {
    console.error(`Failed to drop database: ${dbConfig.database}`);
    console.error(error);
  } finally {
    await client.end();
  }
};
