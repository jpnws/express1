import request from "supertest";

import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

import Helper from "./helpers.js";

describe("Accounts API", () => {
  let helper;
  let server;
  let host;
  let port;
  let prisma;

  beforeEach(async () => {
    helper = new Helper();
    const appData = await helper.spawnApp();
    server = appData.server;
    host = appData.host;
    port = appData.port;
    prisma = appData.prisma;
  });

  afterEach(async () => {
    await server.close();
    await prisma.$disconnect();
    await helper.dropDb();
  });

  it("creates a new account and checks the response against the expected", async () => {
    // Arrange
    const newAccount = {
      username: "tester",
      role: "admin",
    };
    // Act
    const account = await request(`http://${host}:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);
    // Assert
    // Compare the response body to the expected value
    expect(account.body.username).toEqual(newAccount.username);
    expect(account.body.role).toEqual(newAccount.role);
  });

  it("inserts accounts and returns a list of accounts", async () => {
    // Arrange
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
      await request(`http://${host}:${port}`)
        .post("/accounts")
        .send(account)
        .expect("Content-Type", /json/)
        .expect(201);
    }
    // Act
    const response = await request(`http://${host}:${port}`)
      .get("/accounts")
      .expect("Content-Type", /json/)
      .expect(200);
    // Assert
    const responseAccounts = response.body;
    for (let i = 0; i < accounts.length; i++) {
      expect(responseAccounts[i].username).toEqual(accounts[i].username);
      expect(responseAccounts[i].role).toEqual(accounts[i].role);
    }
  });

  it("creates an account and retrieves it by its ID", async () => {
    // Arrange
    const newAccount = {
      username: "tester",
      role: "admin",
    };
    // Act
    const response = await request(`http://${host}:${port}`)
      .post("/accounts")
      .send(newAccount)
      .expect("Content-Type", /json/)
      .expect(201);
    const accountId = response.body.id;
    const account = await request(`http://${host}:${port}`)
      .get(`/accounts/${accountId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    // Assert
    expect(account.body.username).toEqual(newAccount.username);
    expect(account.body.role).toEqual(newAccount.role);
  });
});
