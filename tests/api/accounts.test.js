import request from "supertest";
import pgPromise from "pg-promise";

import { spawnApp, closePgp, dropDb } from "./helpers.js";

const pgp = pgPromise();

describe("Accounts API", () => {
  let app;
  let server;
  let port;
  let db;
  let cfg;

  beforeEach(async () => {
    const spawn = await spawnApp();
    app = spawn.app;
    server = spawn.server;
    port = spawn.port;
    db = spawn.db;
    cfg = spawn.cfg;
  });

  afterEach(async () => {
    await server.close();
    closePgp();
    await dropDb(cfg);
  });

  it("creates a new account and returns a success message", async () => {
    const newAccount = {
      username: "tester",
      role: "admin",
    };

    const response = await request(`http://localhost:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({ message: "Account created." });
  });
});