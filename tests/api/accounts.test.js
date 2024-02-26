import request from "supertest";

import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

import { spawnApp, dropDb } from "./helpers.js";

describe("Accounts API", () => {
  let server;
  let port;
  let pool;
  let cfg;

  beforeEach(async () => {
    const app = await spawnApp();
    server = app.server;
    port = app.port;
    pool = app.pool;
    cfg = app.cfg;
  });

  afterEach(async () => {
    await server.close();
    await pool.end();
    await dropDb(cfg.db);
  });

  it("creates a new account and returns a success message", async () => {
    // * ===============================
    // * Arrange
    // * ===============================
    const newAccount = {
      username: "tester",
      role: "admin",
    };
    // * ===============================
    // * Act
    // * ===============================
    const response = await request(`http://${cfg.app.host}:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);
    // * ===============================
    // * Assert
    // * ===============================
    expect(response.body).toEqual({ message: "Account created." });
  });

  it("inserts dummy accounts and returns a list of accounts", async () => {
    // * ===============================
    // * Arrange
    // * ===============================
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
      const response = await request(`http://${cfg.app.host}:${port}`)
        .post("/accounts")
        .send(account)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(response.body).toEqual({ message: "Account created." });
    }
    // * ===============================
    // * Act
    // * ===============================
    const response = await request(`http://${cfg.app.host}:${port}`)
      .get("/accounts")
      .expect("Content-Type", /json/)
      .expect(200);
    // * ===============================
    // * Assert
    // * ===============================
    const responseAccounts = response.body.rows;
    for (let i = 0; i < accounts.length; i++) {
      expect(responseAccounts[i].username).toEqual(accounts[i].username);
      expect(responseAccounts[i].role).toEqual(accounts[i].role);
    }
  });
});
