import app from "./app.js";
import { getConfig } from "./cfg.js";

const conf = getConfig();
const port = conf.app.port || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});