import { createApp } from "./app.js";
import { getConfig } from "./cfg.js";

import pg from "pg";

const conf = getConfig();
const pool = new pg.Pool(conf.db);
const app = createApp(pool);

app.listen(conf.app.port, conf.app.host, () => {
  console.log(`Listening on port ${conf.app.host}:${conf.app.port}`);
});
