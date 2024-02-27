import request from "supertest";

import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

import Helper from "./helpers.js";

describe("Accounts API", () => {
  let helper;
  let server;
  let host;
  let port;
  let pool;

  beforeEach(async () => {
    helper = new Helper();
    const appData = await helper.spawnApp();
    server = appData.server;
    host = appData.host;
    port = appData.port;
    pool = appData.pool;
  });

  afterEach(async () => {
    await server.close();
    await pool.end();
    await helper.dropDb();
  });

  it("creates a new account and returns a success message", async () => {
    // * ==========================================
    // * Arrange
    // * ==========================================
    const newAccount = {
      username: "tester",
      role: "admin",
    };
    // * ==========================================
    // * Act
    // * ==========================================
    const response = await request(`http://${host}:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);
    // * ==========================================
    // * Assert
    // * ==========================================
    expect(response.body).toEqual({ message: "Account created." });
  });

  it("inserts dummy accounts and returns a list of accounts", async () => {
    // * ==========================================
    // * Arrange
    // * ==========================================
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
      const response = await request(`http://${host}:${port}`)
        .post("/accounts")
        .send(account)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(response.body).toEqual({ message: "Account created." });
    }
    // * ==========================================
    // * Act
    // * ==========================================
    const response = await request(`http://${host}:${port}`)
      .get("/accounts")
      .expect("Content-Type", /json/)
      .expect(200);
    // * ==========================================
    // * Assert
    // * ==========================================
    const responseAccounts = response.body;
    for (let i = 0; i < accounts.length; i++) {
      expect(responseAccounts[i].username).toEqual(accounts[i].username);
      expect(responseAccounts[i].role).toEqual(accounts[i].role);
    }
  });
});
