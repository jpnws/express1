import http from "http";
import pg from "pg";
import { v4 as uuidv4 } from "uuid";

import { createTables } from "../../util/create-tables.js";
import { createApp } from "../../src/app.js";

export default class Helper {
  /**
   * Create a new Helper object.
   * dbName: string - The name of the test database.
   * configWithoutDb: pg.ClientConfig - The configuration object for the PostgreSQL client without the database name.
   * configWithDb: pg.ClientConfig - The configuration object for the PostgreSQL client with the database name.
   * @returns {Helper} The new Helper object.
   */
  constructor() {
    this.dbName = uuidv4();
    this.configWithoutDb = {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      ssl: process.env.DB_SSL === "true" ? true : false,
    };
    this.configWithDb = {
      ...this.configWithoutDb,
      database: this.dbName,
    };
  }

  /**
   * Create a new test database and tables, and start the app server.
   * @returns {Promise<{ server: http.Server, host: string, port: number, pool: pg.Pool }>}
   * The server object, host, port, and pool object.
   * The server object is the HTTP server.
   * The host is the host name or IP address.
   * The port is the port number.
   * The pool object is the PostgreSQL connection pool.
   */
  async spawnApp() {
    // Create a test database.
    const connectionWithoutDb = new pg.Client(this.configWithoutDb);
    await connectionWithoutDb.connect();
    try {
      await connectionWithoutDb.query(`CREATE DATABASE "${this.dbName}";`);
      console.log("Database created.");
    } catch (error) {
      console.error(`Failed to create a test database: ${this.dbName}`);
      console.error(error);
      throw error;
    } finally {
      await connectionWithoutDb.end();
    }

    // Create tables in the test database.
    const pool = new pg.Pool(this.configWithDb);
    try {
      await createTables(pool);
    } catch (error) {
      console.error(`Failed to create tables for database: ${this.dbName}`);
      console.error(error);
      throw error;
    }

    // Create an instance of the Express app.
    const app = createApp(pool);

    // Create the HTTP server with the app.
    const server = http.createServer(app);

    // Get the app's host environment value.
    const host = process.env.APP_HOST;

    // Start listening on the host and a dynamically chosen port.
    await new Promise((resolve) => {
      server.listen(0, host, resolve);
    });

    // Retrieve the server's address object.
    const address = server.address();

    // Get the dynamically chosen port number.
    const port = address.port;

    return { server, host, port, pool };
  }

  /**
   * Drop the test database.
   */
  async dropDb() {
    const client = new pg.Client(this.configWithoutDb);
    await client.connect();
    try {
      await client.query(`DROP DATABASE "${this.dbName}"`);
      console.log("Data base dropped.");
    } catch (error) {
      console.error(`Failed to drop database: ${this.dbName}`);
      console.error(error);
    } finally {
      await client.end();
    }
  }
}
