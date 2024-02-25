import request from "supertest";

import { spawnApp, closePgp, dropDb } from "./helpers.js";

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
    console.log(cfg);
  });

  afterEach(async () => {
    await server.close();
    closePgp();
    await dropDb(cfg.db);
  });

  it("creates a new account and returns a success message", async () => {
    // * ======================================================================
    // * Arrange
    // * ======================================================================
    const newAccount = {
      username: "tester",
      role: "admin",
    };
    // * ======================================================================
    // * Act
    // * ======================================================================
    const response = await request(`http://localhost:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);
    // * ======================================================================
    // * Assert
    // * ======================================================================
    expect(response.body).toEqual({ message: "Account created." });
  });

  it("inserts dummy accounts and returns a list of accounts", async () => {
    // * ======================================================================
    // * Arrange
    // * ======================================================================
    let accounts = [
      {
        username: "paulhal",
        role: "admin",
      },
      {
        username: "johndoe",
        role: "member",
      },
      {
        username: "sarahjane",
        role: "member",
      },
    ];
    for (const account of accounts) {
      await db.query(
        `
        INSERT INTO
          accounts (username, role)
        VALUES
          ($1, $2)
        `,
        [account.username, account.role]
      );
    }
    // * ======================================================================
    // * Act
    // * ======================================================================
    const response = await request(`http://localhost:${port}`)
      .get("/accounts")
      .expect("Content-Type", /json/)
      .expect(200);
    // * ======================================================================
    // * Assert
    // * ======================================================================
    const responseAccounts = response.body;
    for (let i = 0; i < accounts.length; i++) {
      expect(responseAccounts[i].username).toEqual(accounts[i].username);
      expect(responseAccounts[i].role).toEqual(accounts[i].role);
    }
  });
});
