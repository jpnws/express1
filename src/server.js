import dotenv from "dotenv";

import { createApp } from "./app.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const appHost = process.env.APP_HOST;
const appPort = process.env.APP_PORT;

const prisma = new PrismaClient();

const app = createApp(prisma);

app.listen(appPort, appHost, () => {
  console.log(`Listening on ${appHost}:${appPort}`);
});
