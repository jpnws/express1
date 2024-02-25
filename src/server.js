import { createApp } from "./app.js";
import { getConfig } from "./cfg.js";
import { getDbConnection } from "./db.js";

const conf = getConfig();
const db = getDbConnection(conf.db);
const app = createApp(db);

app.listen(conf.app.port, conf.app.host, () => {
  console.log(`Listening on port ${conf.app.host}:${conf.app.port}`);
});
