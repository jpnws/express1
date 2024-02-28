import pg from "pg";
import dotenv from "dotenv";

import { createApp } from "./app.js";

dotenv.config();

const appHost = process.env.APP_HOST;
const appPort = process.env.APP_PORT;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === "true" || process.env.NODE_ENV === "production",
};

const pool = new pg.Pool(dbConfig);
const app = createApp(pool);

app.listen(appPort, appHost, () => {
  console.log(`Listening on ${appHost}:${appPort}`);
});
